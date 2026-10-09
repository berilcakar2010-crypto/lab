import { Celebrate, CountUp } from "./Effects";
import { useEffect, useState } from "react";
import type { LabDB, TopicGrade } from "../../domain/types";
import { fmtDate, L } from "../../i18n";
import { domainLabel, type KnowledgeGraph } from "../../knowledge/schema";
import { adaptiveReviewTopic, prioritizedDueTopics } from "../../adaptive/retention";
import { dayKey, LADDER_DAYS, startOfDay, streak, studyLog, TOPIC_GRADE_LABELS, upcomingTopics, type StudyKind } from "../../study/topics";
import { cardStats } from "../../study/flashcards";
import { navigate, store, toast } from "../state";
import { notificationPermission, refreshReminders, type PermissionState } from "../reminders";
import { isNative } from "../native";
import { DOMAIN_COLOR } from "./GraphMap";

const DAY = 86_400_000;
const inDays = (d: number) => (d === 1 ? L("tomorrow", "yarın") : L(`in ${d} days`, `${d} gün sonra`));

function nextDays(stage: number, grade: TopicGrade): number {
  const s = grade === 0 ? 0 : grade === 2 ? Math.min(stage + 1, LADDER_DAYS.length - 1) : grade === 3 ? Math.min(stage + 2, LADDER_DAYS.length - 1) : stage;
  return grade === 1 ? Math.max(1, Math.round(LADDER_DAYS[s] * 0.6)) : LADDER_DAYS[s];
}

/** Review whole topics: recall first, then check against the graph, then rate how well it came back. */
export function TopicReviewSession({ db, g, onDone }: { db: LabDB; g: KnowledgeGraph; onDone?: () => void }) {
  // Most important first (adaptive retention); intervals adapt to the topic too.
  const [queue, setQueue] = useState(() => prioritizedDueTopics(db, g).map((r) => r.id).filter((id) => g.objects[id]));
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(0);
  const id = queue[0];
  if (!id) {
    return (
      <div className="card stack" style={{ alignItems: "flex-start" }}>
        {done > 0 && <Celebrate />}
        <strong>{done ? L(`Done — ${done} topics reviewed.`, `Bitti — ${done} konu tekrar edildi.`) : L("No topic is due for review.", "Tekrarı gelen konu yok.")}</strong>
        <span className="small muted">{L("Topics come back on an expanding schedule: 1, 3, 7, 14, 30, 60, 120 days.", "Konular giderek uzayan aralıklarla geri gelir: 1, 3, 7, 14, 30, 60, 120 gün.")}</span>
        {onDone && <button className="btn small" onClick={onDone}>{L("Close", "Kapat")}</button>}
      </div>
    );
  }
  const o = g.objects[id];
  const r = db.topicReviews[id];
  const cards = cardStats(db, Date.now(), id);
  const labels = TOPIC_GRADE_LABELS();
  const grade = (gr: TopicGrade) => {
    store.transact((d) => adaptiveReviewTopic(d, g, id, gr));
    setDone((n) => n + 1);
    setShown(false);
    setQueue((q) => q.slice(1));
  };
  return (
    <div className="stack topic-review">
      <div className="row between small muted"><span>{L(`${queue.length} left`, `${queue.length} kaldı`)}</span>
        <span>{L("Studied", "Çalışıldı")} {fmtDate(r.firstStudied, { day: "numeric", month: "short" })} · {L("last", "son")} {fmtDate(r.lastStudied, { day: "numeric", month: "short" })}</span></div>
      <div className="card accent stack" style={{ gap: 8 }}>
        <span className="eyebrow" style={{ color: DOMAIN_COLOR[o.domain] }}>{domainLabel(o.domain)} · {o.unit}</span>
        <h2 style={{ margin: 0 }}>{o.title}</h2>
        <p className="small text-2" style={{ margin: 0 }}>{L("Before looking: say the core idea, why it matters, one example and one common mistake — out loud or on paper.", "Bakmadan önce: ana fikri, neden önemli olduğunu, bir örneği ve sık yapılan bir hatayı söyle — sesli ya da kâğıda.")}</p>
        {o.entryQuestions[0] && <p className="serif" style={{ margin: 0 }}>{o.entryQuestions[0]}</p>}
      </div>
      {!shown ? (
        <button className="btn primary" onClick={() => setShown(true)}>{L("Check against the graph", "Grafikle karşılaştır")}</button>
      ) : (
        <>
          <div className="card stack" style={{ gap: 6 }}>
            <span className="eyebrow">{L("Core idea", "Ana fikir")}</span><p className="small" style={{ margin: 0 }}>{o.description}</p>
            <span className="eyebrow">{L("Why it matters", "Neden önemli")}</span><p className="small" style={{ margin: 0 }}>{o.whyItMatters}</p>
            <span className="eyebrow">{L("You can", "Yapabilirsin")}</span><ul className="small tight">{o.learningObjectives.slice(0, 3).map((x) => <li key={x}>{x}</li>)}</ul>
            {o.commonMisconceptions[0] && <><span className="eyebrow">{L("Watch out", "Dikkat")}</span><p className="small" style={{ margin: 0 }}>{o.commonMisconceptions[0]}</p></>}
          </div>
          <span className="small muted">{L("How well did it come back?", "Ne kadar iyi hatırladın?")}</span>
          <div className="grade-row">
            {([0, 1, 2, 3] as TopicGrade[]).map((gr) => (
              <button key={gr} className={`btn ${gr === 2 ? "primary" : ""}`} onClick={() => grade(gr)}>
                <span>{labels[gr]}</span><span className="tiny muted">{inDays(nextDays(r.stage, gr))}</span>
              </button>
            ))}
          </div>
          <div className="row">
            {cards.due > 0 && <button className="btn small ghost" onClick={() => navigate(`/graph?lo=${encodeURIComponent(id)}`)}>{L(`${cards.due} cards for this topic`, `Bu konu için ${cards.due} kart`)}</button>}
            <button className="btn small ghost" onClick={() => navigate(`/graph?lo=${encodeURIComponent(id)}`)}>{L("Open the topic", "Konuyu aç")}</button>
          </div>
        </>
      )}
    </div>
  );
}

const KIND_LABEL = (): Record<StudyKind, string> => ({
  practice: L("practice", "pratik"), mastery: L("mastered", "ustalık"), explain: L("explained", "anlatım"),
  ask: L("asked AI", "YZ sorusu"), cards: L("cards", "kart"), review: L("topic review", "konu tekrarı"),
});

/** The study log by date: a 5-week strip, streak, upcoming reviews and the topics of each day. */
export function StudyCalendar({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const log = studyLog(db);
  const byDay = new Map(log.map((d) => [d.day, d]));
  const today = startOfDay(Date.now());
  const weeks = 5;
  const first = today - (weeks * 7 - 1) * DAY;
  const cells = Array.from({ length: weeks * 7 }, (_, i) => first + i * DAY);
  const max = Math.max(1, ...log.map((d) => d.actions));
  const [sel, setSel] = useState<string | null>(null);
  const upcoming = upcomingTopics(db, Date.now(), 7).filter((r) => g.objects[r.id]);
  const kinds = KIND_LABEL();
  const days = sel ? log.filter((d) => d.day === sel) : log.slice(0, 14);
  return (
    <div className="stack">
      <div className="grid-3">
        <div className="card stat"><span className="eyebrow">{L("Streak", "Seri")}</span><span className="serif stat-n"><CountUp value={streak(log)} /></span><span className="tiny muted">{L("days", "gün")}</span></div>
        <div className="card stat"><span className="eyebrow">{L("Topics studied", "Çalışılan konu")}</span><span className="serif stat-n"><CountUp value={Object.keys(db.topicReviews).length} /></span></div>
        <div className="card stat"><span className="eyebrow">{L("Study days (35)", "Çalışılan gün (35)")}</span><span className="serif stat-n">{cells.filter((c) => byDay.has(dayKey(c))).length}</span></div>
      </div>
      <div className="study-cal" role="grid" aria-label={L("Study calendar", "Çalışma takvimi")}>
        {cells.map((c) => {
          const k = dayKey(c);
          const d = byDay.get(k);
          const lvl = d ? Math.ceil((d.actions / max) * 4) : 0;
          return (
            <button key={k} className={`cal-cell l${lvl} ${sel === k ? "sel" : ""} ${c === today ? "today" : ""}`} onClick={() => setSel(sel === k ? null : k)}
              aria-label={`${fmtDate(c, { day: "numeric", month: "long" })}: ${d ? L(`${d.topics.length} topics`, `${d.topics.length} konu`) : L("no study", "çalışma yok")}`}>
              {new Date(c).getDate()}
            </button>
          );
        })}
      </div>
      {upcoming.length > 0 && !sel && (
        <div className="card stack" style={{ gap: 6 }}>
          <span className="eyebrow">{L("Coming up for review", "Yaklaşan tekrarlar")}</span>
          {upcoming.slice(0, 8).map((r) => (
            <button key={r.id} className="list-item lo-row" onClick={() => navigate(`/graph?lo=${encodeURIComponent(r.id)}`)}>
              <span className="lo-dot" style={{ background: DOMAIN_COLOR[g.objects[r.id].domain] }} aria-hidden />
              <span className="grow truncate" style={{ textAlign: "left" }}>{g.objects[r.id].title}</span>
              <span className="tiny muted">{fmtDate(r.due, { weekday: "short", day: "numeric" })}</span>
            </button>
          ))}
        </div>
      )}
      {!log.length && <p className="small muted">{L("Your study log fills in as you practise, explain topics, ask the AI or review cards.", "Pratik yaptıkça, konuları anlattıkça, YZ'ye sordukça ya da kart tekrar ettikçe çalışma günlüğün dolar.")}</p>}
      {days.map((d) => (
        <section key={d.day} className="card stack" style={{ gap: 6 }}>
          <div className="row between"><strong>{fmtDate(d.start, { weekday: "long", day: "numeric", month: "long" })}</strong><span className="tiny muted">{L(`${d.topics.length} topics`, `${d.topics.length} konu`)}</span></div>
          {d.topics.filter((t) => g.objects[t.loId]).map((t) => (
            <button key={t.loId} className="list-item lo-row" onClick={() => navigate(`/graph?lo=${encodeURIComponent(t.loId)}`)}>
              <span className="lo-dot" style={{ background: DOMAIN_COLOR[g.objects[t.loId].domain] }} aria-hidden />
              <span className="grow stack" style={{ gap: 2, minWidth: 0, textAlign: "left" }}>
                <span className="truncate">{g.objects[t.loId].title}</span>
                <span className="tiny muted">{t.kinds.map((k) => kinds[k]).join(" · ")}</span>
              </span>
              {db.topicReviews[t.loId] && <span className="tiny muted">{L("next", "sonraki")} {fmtDate(db.topicReviews[t.loId].due, { day: "numeric", month: "short" })}</span>}
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}

/** Daily reminder: on/off, time, permission status. */
export function ReminderSettings({ db }: { db: LabDB }) {
  const r = db.preferences.reminders;
  const [perm, setPerm] = useState<PermissionState>("prompt");
  const [planned, setPlanned] = useState<number | null>(null);
  useEffect(() => { void notificationPermission().then(setPerm).catch(() => setPerm("unsupported")); }, []);
  const save = async (next: Partial<LabDB["preferences"]["reminders"]>) => {
    let enabled = next.enabled ?? r.enabled;
    let exams = next.exams ?? r.exams;
    if (next.enabled || next.exams) {
      const p = await notificationPermission(true).catch(() => "unsupported" as PermissionState);
      setPerm(p);
      if (p !== "granted") {
        toast(p === "unsupported" ? L("Notifications are not available here.", "Burada bildirim kullanılamıyor.") : L("Notifications are not allowed. Allow them in the system settings.", "Bildirimlere izin verilmedi. Sistem ayarlarından izin ver."), "error");
        if (next.enabled) enabled = false;
        if (next.exams) exams = false;
      }
    }
    store.transact((d) => { d.preferences.reminders = { ...d.preferences.reminders, ...next, enabled, exams }; });
    const n = await refreshReminders(store.state).catch(() => 0);
    setPlanned(n);
    if (next.enabled) toast(isNative() ? L(`Reminders on — ${n} planned for the next two weeks.`, `Hatırlatmalar açık — önümüzdeki iki hafta için ${n} tane planlandı.`) : L("Reminders on — you'll be notified when you open Lab and something is due.", "Hatırlatmalar açık — Lab'i açtığında tekrar edilecek bir şey varsa bildirim gelir."));
  };
  const time = `${String(r.hour).padStart(2, "0")}:${String(r.minute).padStart(2, "0")}`;
  return (
    <div className="stack" style={{ gap: 8 }}>
      <label className="row nowrap" style={{ gap: 10 }}>
        <input type="checkbox" checked={r.enabled} onChange={(e) => void save({ enabled: e.target.checked })} />
        <span>{L("Daily review reminder", "Günlük tekrar hatırlatması")}</span>
      </label>
      <label className="row nowrap" style={{ gap: 10 }}>
        <input type="checkbox" checked={r.exams} onChange={(e) => void save({ exams: e.target.checked })} />
        <span>{L("Exam reminders (on the days you choose for each exam)", "Sınav hatırlatmaları (her sınav için seçtiğin günlerde)")}</span>
      </label>
      <label className="row nowrap small" style={{ gap: 10 }}>
        <span>{L("Time", "Saat")}</span>
        <input type="time" className="input" style={{ width: 130 }} value={time} onChange={(e) => {
          const [h, m] = e.target.value.split(":").map(Number);
          if (Number.isFinite(h) && Number.isFinite(m)) void save({ hour: h, minute: m });
        }} aria-label={L("Reminder time", "Hatırlatma saati")} />
      </label>
      <p className="tiny muted">
        {isNative()
          ? L("Lab plans a notification for each of the next 14 days on which topics or cards will be due, and re-plans whenever you leave the app.", "Lab, önümüzdeki 14 günün konu ya da kart tekrarı olan her günü için bir bildirim planlar ve uygulamadan her çıktığında planı günceller.")
          : L("In a browser Lab can only notify you when you open it; the Android app sends reminders at the chosen time.", "Tarayıcıda Lab yalnızca açıldığında bildirim gösterebilir; Android uygulaması seçtiğin saatte hatırlatır.")}
        {perm === "denied" ? L(" Notifications are blocked in the system settings.", " Bildirimler sistem ayarlarında engellenmiş.") : ""}
        {planned !== null && isNative() && (r.enabled || r.exams) ? L(` ${planned} reminders planned.`, ` ${planned} hatırlatma planlandı.`) : ""}
      </p>
    </div>
  );
}
