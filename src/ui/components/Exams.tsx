import { useMemo, useState } from "react";
import type { Exam, ExamKind, LabDB } from "../../domain/types";
import { fmtDate, L } from "../../i18n";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { personalGraph } from "../../knowledge/state";
import {
  addExam, daysUntil, DEFAULT_REMIND_DAYS, EXAM_KIND_LABEL, examPlan, examReadiness, examsICS, paceNote, pastExams,
  PLAN_ACTION_LABEL, REMIND_CHOICES, suggestTopics, todaySuggestions, upcomingExams, updateExam, type TopicStatus,
} from "../../study/exams";
import { addAutoCards } from "../../study/flashcards";
import { navigate, store, toast } from "../state";
import { saveTextFile } from "../native";
import { notificationPermission, refreshReminders } from "../reminders";
import { Bar, Icon, Sheet } from "./common";
import { DOMAIN_COLOR } from "./GraphMap";
import { CountUp } from "./Effects";

const KINDS: ExamKind[] = ["EXAM", "QUIZ", "ASSIGNMENT", "PRESENTATION"];
const STATUS_CHIP: Record<TopicStatus, string> = { new: "", weak: "s-NEEDS_REVIEW", ok: "s-ATTEMPTED", strong: "s-MASTERED" };
export const STATUS_LABEL = (s: TopicStatus) => ({ new: L("New", "Yeni"), weak: L("Weak", "Zayıf"), ok: L("Fair", "Orta"), strong: L("Strong", "Güçlü") })[s];
const remindLabel = (d: number) => (d === 0 ? L("Morning of", "Sınav sabahı") : d === 1 ? L("1 day", "1 gün") : d === 7 ? L("1 week", "1 hafta") : d === 14 ? L("2 weeks", "2 hafta") : L(`${d} days`, `${d} gün`));
const openLO = (id: string) => navigate(`/graph?lo=${encodeURIComponent(id)}`);

export function countdown(left: number): string {
  if (left < 0) return L("past", "geçti");
  if (left === 0) return L("today", "bugün");
  if (left === 1) return L("tomorrow", "yarın");
  return L(`${left} days`, `${left} gün`);
}

const pad = (n: number) => String(n).padStart(2, "0");
const dateInput = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const timeInput = (ms: number) => { const d = new Date(ms); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };

async function replanReminders() {
  if (!store.state.preferences.reminders.exams) return;
  const p = await notificationPermission(true).catch(() => "unsupported" as const);
  if (p === "granted") await refreshReminders(store.state).catch(() => 0);
}

/** Create or edit an exam: what, when, which topics, when to be reminded. */
export function ExamEditor({ g, exam, onClose }: { g: KnowledgeGraph; exam?: Exam; onClose: () => void }) {
  const week = Date.now() + 7 * 86_400_000;
  const [title, setTitle] = useState(exam?.title ?? "");
  const [subject, setSubject] = useState(exam?.subject ?? "");
  const [kind, setKind] = useState<ExamKind>(exam?.kind ?? "EXAM");
  const [date, setDate] = useState(dateInput(exam?.date ?? week));
  const [time, setTime] = useState(exam ? timeInput(exam.date) : "09:00");
  const [loIds, setLoIds] = useState<string[]>(exam?.loIds ?? []);
  const [remind, setRemind] = useState<number[]>(exam?.remindDays ?? DEFAULT_REMIND_DAYS);
  const [notes, setNotes] = useState(exam?.notes ?? "");
  const [q, setQ] = useState("");
  const suggested = useMemo(() => suggestTopics(g, `${subject} ${title}`, 10).filter((id) => !loIds.includes(id)), [g, subject, title, loIds]);
  const found = useMemo(() => (q.trim().length > 1 ? suggestTopics(g, q, 12).filter((id) => !loIds.includes(id)) : []), [g, q, loIds]);
  const at = new Date(`${date}T${time || "09:00"}`).getTime();
  const valid = title.trim() && Number.isFinite(at);

  const save = () => {
    const data = { title: title.trim(), subject: subject.trim(), kind, date: at, loIds, notes: notes.trim(), remindDays: remind };
    store.transact((d) => (exam ? updateExam(d, exam.id, data) : addExam(d, data)));
    toast(exam ? L("Exam updated.", "Sınav güncellendi.") : L("Exam added — your plan is ready.", "Sınav eklendi — planın hazır."));
    void replanReminders();
    onClose();
  };

  const row = (id: string, add: boolean) => (
    <button key={id} className="list-item lo-row" onClick={() => setLoIds((l) => (add ? [...l, id] : l.filter((x) => x !== id)))}>
      <span className="lo-dot" style={{ background: DOMAIN_COLOR[g.objects[id].domain] }} aria-hidden />
      <span className="grow stack" style={{ gap: 0, minWidth: 0, textAlign: "left" }}>
        <span className="truncate">{g.objects[id].title}</span>
        <span className="tiny muted truncate">{g.objects[id].unit}</span>
      </span>
      <span className="muted" aria-hidden>{add ? "+" : "×"}</span>
    </button>
  );

  return (
    <Sheet title={exam ? L("Edit exam", "Sınavı düzenle") : L("New exam", "Yeni sınav")} onClose={onClose}>
      <div className="stack">
        <div className="chip-scroll" role="radiogroup" aria-label={L("Type", "Tür")}>
          {KINDS.map((k) => <button key={k} role="radio" aria-checked={kind === k} className={`btn small ${kind === k ? "primary" : ""}`} onClick={() => setKind(k)}>{EXAM_KIND_LABEL(k)}</button>)}
        </div>
        <label className="stack" style={{ gap: 4 }}>
          <span className="small text-2">{L("Subject", "Ders")}</span>
          <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={L("e.g. Physics", "ör. Fizik")} />
        </label>
        <label className="stack" style={{ gap: 4 }}>
          <span className="small text-2">{L("Title", "Başlık")}</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("e.g. 1st term exam — forces and motion", "ör. 1. dönem 1. yazılı — kuvvet ve hareket")} />
        </label>
        <div className="row nowrap">
          <label className="stack grow" style={{ gap: 4 }}>
            <span className="small text-2">{L("Date", "Tarih")}</span>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="stack" style={{ gap: 4, width: 120 }}>
            <span className="small text-2">{L("Time", "Saat")}</span>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        <div className="stack" style={{ gap: 6 }}>
          <span className="small text-2">{L(`Topics it covers (${loIds.length})`, `Kapsadığı konular (${loIds.length})`)}</span>
          {loIds.length > 0 && <div className="card list">{loIds.filter((id) => g.objects[id]).map((id) => row(id, false))}</div>}
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("Search topics in the graph…", "Grafikte konu ara…")} aria-label={L("Search topics", "Konu ara")} />
          {found.length > 0 && <div className="card list">{found.map((id) => row(id, true))}</div>}
          {!q.trim() && suggested.length > 0 && (
            <>
              <span className="tiny muted">{L("Suggested from the subject and title", "Ders ve başlıktan önerilenler")}</span>
              <div className="card list">{suggested.map((id) => row(id, true))}</div>
            </>
          )}
        </div>

        <div className="stack" style={{ gap: 6 }}>
          <span className="small text-2">{L("Remind me", "Hatırlat")}</span>
          <div className="row">
            {REMIND_CHOICES.map((d) => (
              <button key={d} className={`btn small ${remind.includes(d) ? "primary" : ""}`} aria-pressed={remind.includes(d)} onClick={() => setRemind((r) => (r.includes(d) ? r.filter((x) => x !== d) : [...r, d]))}>{remindLabel(d)}</button>
            ))}
          </div>
        </div>
        <textarea className="textarea" style={{ minHeight: 60 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={L("Notes — pages, the teacher's hints, what to bring…", "Notlar — sayfalar, öğretmenin ipuçları, yanına alacakların…")} aria-label={L("Notes", "Notlar")} />
        <div className="stack sheet-actions">
          <button className="btn primary block" disabled={!valid} onClick={save}>{exam ? L("Save", "Kaydet") : L("Add exam", "Sınavı ekle")}</button>
        </div>
      </div>
    </Sheet>
  );
}

/** One exam: readiness per topic, pace, the day-by-day plan and actions. */
export function ExamDetail({ db, g, exam, onClose }: { db: LabDB; g: KnowledgeGraph; exam: Exam; onClose: () => void }) {
  const [editing, setEditing] = useState(false);
  const [score, setScore] = useState("");
  const [outOf, setOutOf] = useState("100");
  const ready = examReadiness(db, g, exam);
  const plan = examPlan(db, g, exam, Date.now(), ready);
  const left = daysUntil(exam);
  const pace = paceNote(ready, left);
  if (editing) return <ExamEditor g={g} exam={exam} onClose={() => setEditing(false)} />;

  const cards = () => {
    const ids = ready.topics.filter((t) => t.status !== "strong").map((t) => t.loId);
    const n = store.transact((d) => ids.reduce((s, id) => s + addAutoCards(d, g, id), 0));
    toast(n ? L(`${n} cards added — review them in Study.`, `${n} kart eklendi — Çalış'ta tekrar et.`) : L("Those cards already exist.", "Bu kartlar zaten var."));
  };
  const remove = () => {
    if (!confirm(L("Delete this exam?", "Bu sınav silinsin mi?"))) return;
    store.transact((d) => { delete d.exams[exam.id]; });
    void replanReminders();
    onClose();
  };
  const saveResult = () => {
    const s = Number(score.replace(",", "."));
    const o = Number(outOf.replace(",", "."));
    store.transact((d) => { d.exams[exam.id].result = { score: Number.isFinite(s) ? s : undefined, outOf: Number.isFinite(o) && o > 0 ? o : undefined, at: Date.now() }; });
    toast(L("Result saved.", "Sonuç kaydedildi."));
    void replanReminders();
  };

  return (
    <Sheet title={`${exam.subject ? `${exam.subject} · ` : ""}${exam.title}`} onClose={onClose}>
      <div className="stack">
        <div className="row small text-2">
          <span className="chip">{EXAM_KIND_LABEL(exam.kind)}</span>
          <span>{fmtDate(exam.date, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span>
          <span className="chip s-ACTIVE">{countdown(left)}</span>
        </div>

        <div className="grid-3">
          <div className="card stat"><span className="eyebrow">{L("Ready", "Hazırlık")}</span><span className="serif stat-n"><CountUp value={Math.round(ready.score * 100)} />%</span></div>
          <div className="card stat"><span className="eyebrow">{L("To learn", "Öğrenilecek")}</span><span className="serif stat-n"><CountUp value={ready.counts.new + ready.counts.weak} /></span></div>
          <div className="card stat"><span className="eyebrow">{L("Gaps", "Eksik önkoşul")}</span><span className="serif stat-n"><CountUp value={ready.prereqs.length} /></span></div>
        </div>
        <div className={`banner ${pace.tone === "ok" ? "" : "warn"}`}>{pace.text}</div>

        {!exam.result && left >= 0 && (
          <section className="stack" style={{ gap: 8 }}>
            <h3>{L("Study plan", "Çalışma planı")}</h3>
            <div className="exam-plan">
              {plan.filter((d) => d.items.length).map((d, i) => (
                <div key={d.day} className={`plan-day ${i === 0 && d.start <= Date.now() ? "today" : ""}`}>
                  <div className="plan-date">
                    <strong>{d.left === left ? L("Today", "Bugün") : fmtDate(d.start, { weekday: "short", day: "numeric", month: "short" })}</strong>
                    <span className="tiny muted">{d.left === 0 ? L("exam", "sınav") : L(`${d.left} d left`, `${d.left} gün kala`)}</span>
                  </div>
                  <div className="stack" style={{ gap: 2, minWidth: 0 }}>
                    {d.items.map((it) => (
                      <button key={it.loId} className="plan-item" onClick={() => openLO(it.loId)}>
                        <span className={`plan-act a-${it.action}`}>{PLAN_ACTION_LABEL(it.action)}</span>
                        <span className="truncate">{g.objects[it.loId]?.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!plan.some((d) => d.items.length) && <p className="small muted">{L("Add topics to this exam to get a plan.", "Plan için bu sınava konu ekle.")}</p>}
            </div>
          </section>
        )}

        {ready.topics.length > 0 && (
          <details className="card" open={!!exam.result || left < 0}>
            <summary className="small" style={{ cursor: "pointer" }}>{L(`Topics (${ready.topics.length})`, `Konular (${ready.topics.length})`)}{ready.prereqs.length ? L(` · ${ready.prereqs.length} gaps`, ` · ${ready.prereqs.length} eksik`) : ""}</summary>
            <div className="list" style={{ marginTop: 6 }}>
              {[...ready.topics].sort((a, b) => a.score - b.score).map((t) => (
                <button key={t.loId} className="list-item lo-row" onClick={() => openLO(t.loId)}>
                  <span className="lo-dot" style={{ background: DOMAIN_COLOR[g.objects[t.loId].domain] }} aria-hidden />
                  <span className="grow truncate" style={{ textAlign: "left" }}>{g.objects[t.loId].title}</span>
                  <span className={`chip ${STATUS_CHIP[t.status]}`}>{STATUS_LABEL(t.status)}</span>
                </button>
              ))}
              {ready.prereqs.map((id) => (
                <button key={id} className="list-item lo-row" onClick={() => openLO(id)}>
                  <span className="lo-dot" style={{ background: DOMAIN_COLOR[g.objects[id].domain] }} aria-hidden />
                  <span className="grow truncate" style={{ textAlign: "left" }}>{g.objects[id].title}</span>
                  <span className="chip s-NEEDS_REVIEW">{L("Prerequisite", "Önkoşul")}</span>
                </button>
              ))}
            </div>
          </details>
        )}

        {exam.notes && <p className="small text-2" style={{ whiteSpace: "pre-wrap" }}>{exam.notes}</p>}

        {(left < 0 || exam.result) && (
          <div className="card stack" style={{ gap: 8 }}>
            <strong>{L("How did it go?", "Nasıl geçti?")}</strong>
            {exam.result?.score !== undefined && <span className="serif" style={{ fontSize: "1.4rem" }}>{exam.result.score}{exam.result.outOf ? ` / ${exam.result.outOf}` : ""}</span>}
            <div className="row nowrap">
              <input className="input" inputMode="decimal" style={{ width: 100 }} value={score} onChange={(e) => setScore(e.target.value)} placeholder={L("Score", "Puan")} aria-label={L("Score", "Puan")} />
              <span className="muted">/</span>
              <input className="input" inputMode="decimal" style={{ width: 90 }} value={outOf} onChange={(e) => setOutOf(e.target.value)} aria-label={L("Out of", "Üzerinden")} />
              <button className="btn small" onClick={saveResult}>{L("Save", "Kaydet")}</button>
            </div>
            <span className="tiny muted">{L("The topics stay in your review schedule, so what you studied for the exam is not forgotten after it.", "Konular tekrar programında kalır; sınav için çalıştıkların sınavdan sonra da unutulmaz.")}</span>
          </div>
        )}

        <div className="row">
          {ready.topics.length > 0 && <button className="btn small" onClick={cards}>{L("Make cards for weak topics", "Zayıf konular için kart yap")}</button>}
          <button className="btn small" onClick={() => void saveTextFile(`lab-exam-${exam.id}.ics`, examsICS([exam], g), "text/calendar")}>{L("Add to calendar (.ics)", "Takvime ekle (.ics)")}</button>
          <button className="btn small ghost" onClick={() => setEditing(true)}><Icon.edit /> {L("Edit", "Düzenle")}</button>
          <button className="btn small ghost" onClick={remove}>{L("Delete", "Sil")}</button>
        </div>
      </div>
    </Sheet>
  );
}

/** Today's study across the exams coming up — used on Home and in Study. */
export function TodayForExams({ db, g, compact }: { db: LabDB; g: KnowledgeGraph; compact?: boolean }) {
  const today = todaySuggestions(db, g).filter((s) => s.items.length);
  if (!today.length) return null;
  const items = today.flatMap((s) => s.items.map((it) => ({ ...it, s })));
  const shown = compact ? items.slice(0, 4) : items;
  return (
    <section className="card stack today-exams" style={{ gap: 6 }}>
      <div className="row between nowrap">
        <span className="eyebrow">{L("Today, for your exams", "Bugün, sınavların için")}</span>
        {compact && <button className="btn small ghost" onClick={() => navigate("/study?tab=exams")}>{L("Plan", "Plan")} <Icon.arrow /></button>}
      </div>
      {shown.map((it) => (
        <button key={`${it.examId}:${it.loId}`} className="plan-item" onClick={() => openLO(it.loId)}>
          <span className={`plan-act a-${it.action}`}>{PLAN_ACTION_LABEL(it.action)}</span>
          <span className="grow truncate" style={{ textAlign: "left" }}>{g.objects[it.loId]?.title}</span>
          <span className="tiny muted nowrap">{it.s.exam.subject || it.s.exam.title} · {countdown(it.s.left)}</span>
        </button>
      ))}
      {compact && items.length > shown.length && <span className="tiny muted">{L(`+${items.length - shown.length} more in the plan`, `planda ${items.length - shown.length} tane daha`)}</span>}
    </section>
  );
}

/** Exams tab: upcoming exams with countdowns, today's plan, past results. */
export function ExamsPanel({ db, g, initial }: { db: LabDB; g: KnowledgeGraph; initial?: string }) {
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<string | null>(initial && db.exams[initial] ? initial : null);
  const now = Date.now();
  const upcoming = upcomingExams(db, now);
  const past = pastExams(db, now);
  const pg = useMemo(() => personalGraph(db, g), [db, g]);
  const exam = open ? db.exams[open] : undefined;
  return (
    <div className="stack">
      <button className="btn primary block" onClick={() => setAdding(true)}><Icon.plus /> {L("Add an exam or deadline", "Sınav ya da teslim ekle")}</button>
      <TodayForExams db={db} g={g} />
      {!upcoming.length && (
        <p className="small text-2">{L("Add your school exams, quizzes and deadlines with the topics they cover. Lab shows how ready you are, plans each day up to the exam (gaps first, then new and weak topics, spaced reviews and a self-test the day before) and reminds you on the days you choose.", "Okul sınavlarını, quizleri ve teslimleri kapsadıkları konularla ekle. Lab ne kadar hazır olduğunu gösterir, sınava kadar her günü planlar (önce eksikler, sonra yeni ve zayıf konular, aralıklı tekrarlar ve bir gün önce kendini sınama) ve seçtiğin günlerde hatırlatır.")}</p>
      )}
      <div className="stack" style={{ gap: 8 }}>
        {upcoming.map((e) => {
          const r = examReadiness(db, g, e, now, pg);
          const left = daysUntil(e, now);
          return (
            <button key={e.id} className={`card clickable exam-card ${left <= 3 ? "soon" : ""}`} onClick={() => setOpen(e.id)}>
              <span className="exam-count"><span className="serif">{left <= 0 ? "!" : left}</span><span className="tiny">{left <= 0 ? L("today", "bugün") : left === 1 ? L("day", "gün") : L("days", "gün")}</span></span>
              <span className="stack grow" style={{ gap: 4, minWidth: 0 }}>
                <span className="row between nowrap"><strong className="truncate">{e.subject ? `${e.subject} · ` : ""}{e.title}</strong><span className="tiny muted nowrap">{EXAM_KIND_LABEL(e.kind)}</span></span>
                <span className="tiny muted">{fmtDate(e.date, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {L(`${e.loIds.length} topics`, `${e.loIds.length} konu`)}</span>
                <Bar value={r.score} mastered={r.score >= 0.78} />
              </span>
            </button>
          );
        })}
      </div>
      {upcoming.length > 0 && (
        <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => void saveTextFile("lab-exams.ics", examsICS(upcoming, g), "text/calendar")}>{L("Export all to calendar (.ics)", "Hepsini takvime aktar (.ics)")}</button>
      )}
      {past.length > 0 && (
        <details>
          <summary className="small muted" style={{ cursor: "pointer" }}>{L(`Past (${past.length})`, `Geçmiş (${past.length})`)}</summary>
          <div className="card list" style={{ marginTop: 6 }}>
            {past.map((e) => (
              <button key={e.id} className="list-item lo-row" onClick={() => setOpen(e.id)}>
                <span className="grow stack" style={{ gap: 0, minWidth: 0, textAlign: "left" }}>
                  <span className="truncate">{e.subject ? `${e.subject} · ` : ""}{e.title}</span>
                  <span className="tiny muted">{fmtDate(e.date)}</span>
                </span>
                <span className="small">{e.result?.score !== undefined ? `${e.result.score}${e.result.outOf ? `/${e.result.outOf}` : ""}` : L("add result", "sonuç gir")}</span>
              </button>
            ))}
          </div>
        </details>
      )}
      {adding && <ExamEditor g={g} onClose={() => setAdding(false)} />}
      {exam && <ExamDetail db={db} g={g} exam={exam} onClose={() => setOpen(null)} />}
    </div>
  );
}
