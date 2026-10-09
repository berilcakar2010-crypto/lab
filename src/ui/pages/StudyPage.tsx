import { CountUp } from "../components/Effects";
import { useEffect, useMemo, useState } from "react";
import { dueTopics, syncTopicSchedule } from "../../study/topics";
import { ReminderSettings, StudyCalendar, TopicReviewSession } from "../components/TopicReview";
import { fmtDate, L, lower } from "../../i18n";
import { getGraph } from "../../knowledge/graph";
import { LEARNING_PATHS } from "../../knowledge/paths";
import { addAutoCards, cardStats, renderCloze } from "../../study/flashcards";
import { prioritizedDueCards } from "../../adaptive/retention";
import { openErrors } from "../../adaptive/errors";
import { adaptiveExport } from "../../adaptive/exportData";
import { ErrorsTab } from "../components/Adaptive";
import { ResearchTab } from "../components/LabTools";
import { chatsMarkdown, explanationsMarkdown, studyExport } from "../../study/actions";
import { dueRetentionChecks } from "../../engines/progress";
import { navigate, store, toast, useDB } from "../state";
import { Icon } from "../components/common";
import { ReviewSession, exportCards } from "../components/Flashcards";
import { MathText } from "../components/MathText";
import { ExamsPanel } from "../components/Exams";
import { QuestionBankTab } from "../components/QuestionBank";
import { upcomingExams } from "../../study/exams";
import { saveTextFile } from "../native";
import { fmtNum } from "../../i18n";
type Tab = "topics" | "exams" | "errors" | "research" | "questions" | "review" | "calendar" | "cards" | "explain" | "chats" | "export";

/** Everything you study with: spaced-repetition cards, your explanations, AI conversations and exports. */
export function StudyPage() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const query = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const wanted = query.get("tab");
  const [tab, setTab] = useState<Tab>((["topics", "exams", "errors", "research", "questions", "review", "calendar", "cards", "explain", "chats", "export"] as const).find((t) => t === wanted) ?? "topics");
  const openErrorCount = openErrors(db).length;
  const examsSoon = upcomingExams(db).length;
  const [topicReview, setTopicReview] = useState(false);
  // Pick up study done elsewhere (sessions, explanations, AI questions) into the topic schedule.
  useEffect(() => {
    store.transact((d) => void syncTopicSchedule(d));
  }, []);
  const topicsDue = dueTopics(db).filter((r) => g.objects[r.id]).length;
  const [reviewing, setReviewing] = useState(false);
  const [q, setQ] = useState("");
  const stats = cardStats(db);
  const due = useMemo(() => prioritizedDueCards(db, g), [db, g, stats.due]);
  const retentionDue = dueRetentionChecks(db).filter((r) => r.kind !== "IMMEDIATE").length;
  const goals = db.knowledge.goals.length ? db.knowledge.goals : LEARNING_PATHS.find((p) => p.id === db.knowledge.pathId)?.targets ?? [];
  const known = g.order.filter((id) => db.knowledge.selfAttested[id] || Object.values(db.milestones).some((m) => m.learningObjectIds?.includes(id) && m.status === "MASTERED"));

  const makeDeck = (ids: string[], label: string) => {
    const n = store.transact((d) => ids.reduce((s, id) => s + addAutoCards(d, g, id), 0));
    toast(n ? L(`${n} cards added for ${label}.`, `${label} için ${n} kart eklendi.`) : L("Those cards already exist.", "Bu kartlar zaten var."));
  };

  const cards = Object.values(db.flashcards)
    .filter((c) => !q.trim() || lower(`${c.front} ${c.back} ${c.loId ? g.objects[c.loId]?.title ?? "" : ""}`).includes(lower(q.trim())))
    .sort((a, b) => a.due - b.due);
  const explanations = Object.values(db.explanations).sort((a, b) => b.createdAt - a.createdAt);
  const chats = Object.values(db.chats).sort((a, b) => b.updatedAt - a.updatedAt);

  const TABS: [Tab, string][] = [
    ["topics", L(`Topics${topicsDue ? ` · ${topicsDue}` : ""}`, `Konular${topicsDue ? ` · ${topicsDue}` : ""}`)],
    ["exams", L(`Exams${examsSoon ? ` · ${examsSoon}` : ""}`, `Sınavlar${examsSoon ? ` · ${examsSoon}` : ""}`)],
    ["errors", L(`Errors${openErrorCount ? ` · ${openErrorCount}` : ""}`, `Hatalar${openErrorCount ? ` · ${openErrorCount}` : ""}`)],
    ["research", L("Research", "Araştırma")],
    ["questions", L("Question bank", "Soru bankası")],
    ["review", L(`Card review${stats.due ? ` · ${stats.due}` : ""}`, `Kart tekrarı${stats.due ? ` · ${stats.due}` : ""}`)],
    ["calendar", L("Calendar", "Takvim")],
    ["cards", L("Cards", "Kartlar")],
    ["explain", L("Explanations", "Anlatımlar")],
    ["chats", L("AI chats", "YZ sohbetleri")],
    ["export", L("Export", "Dışa aktar")],
  ];

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">{L("Study", "Çalış")}</span>
        <h1>{L("Remember what you learn", "Öğrendiğini kalıcı yap")}</h1>
        <p className="text-2">{L("Spaced-repetition cards, explaining in your own words, and questions to the AI — all linked to the knowledge graph.", "Aralıklı tekrar kartları, kendi cümlelerinle anlatma ve YZ'ye sorular — hepsi bilgi grafiğine bağlı.")}</p>
      </header>

      <div className="grid-3">
        <div className="card stat"><span className="eyebrow">{L("Topics due", "Sıradaki konu")}</span><span className="serif stat-n"><CountUp value={topicsDue} /></span></div>
        <div className="card stat"><span className="eyebrow">{L("Cards due", "Sıradaki kart")}</span><span className="serif stat-n"><CountUp value={stats.due} /></span></div>
        <div className="card stat"><span className="eyebrow">{L("Recall (30 d)", "Hatırlama 30g")}</span><span className="serif stat-n">{stats.retention === null ? "—" : `${fmtNum(stats.retention * 100, 0)}%`}</span></div>
      </div>

      {retentionDue > 0 && (
        <button className="banner warn row between" style={{ textAlign: "left", color: "inherit", font: "inherit", cursor: "pointer" }} onClick={() => navigate("/retention")}>
          <span>{L(`${retentionDue} retention checks on your milestones are waiting.`, `Adımlarında ${retentionDue} kalıcılık kontrolü bekliyor.`)}</span><Icon.arrow />
        </button>
      )}

      <div className="chip-scroll" role="tablist">
        {TABS.map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} className={`btn small ${tab === k ? "primary" : ""}`} onClick={() => { setTab(k); setReviewing(false); setTopicReview(false); }}>{label}</button>)}
      </div>

      {tab === "topics" && (topicReview ? <TopicReviewSession db={db} g={g} onDone={() => setTopicReview(false)} /> : (
        <div className="stack">
          <button className="btn primary block" disabled={!topicsDue} onClick={() => setTopicReview(true)}>
            {topicsDue ? L(`Review ${topicsDue} topics`, `${topicsDue} konuyu tekrar et`) : L("No topic is due — well done", "Tekrarı gelen konu yok — harika")}
          </button>
          <p className="small text-2">{L("Every topic you study is tracked by date and comes back for review on an expanding schedule (1, 3, 7, 14, 30, 60, 120 days). Recall it first, then check against the graph and rate how well it came back.", "Çalıştığın her konu tarihiyle izlenir ve giderek uzayan aralıklarla (1, 3, 7, 14, 30, 60, 120 gün) tekrara gelir. Önce hatırlamaya çalış, sonra grafikle karşılaştır ve ne kadar iyi hatırladığını işaretle.")}</p>
          <details className="card">
            <summary className="small" style={{ cursor: "pointer" }}>{L("Reminders", "Hatırlatmalar")} · {db.preferences.reminders.enabled ? `${String(db.preferences.reminders.hour).padStart(2, "0")}:${String(db.preferences.reminders.minute).padStart(2, "0")}` : L("off", "kapalı")}</summary>
            <div style={{ marginTop: 8 }}><ReminderSettings db={db} /></div>
          </details>
        </div>
      ))}

      {tab === "exams" && <ExamsPanel db={db} g={g} initial={query.get("exam") ?? undefined} />}

      {tab === "errors" && <ErrorsTab />}
      {tab === "questions" && <QuestionBankTab />}
      {tab === "research" && <ResearchTab db={db} g={g} initial={query.get("res") ?? undefined} />}

      {tab === "calendar" && <StudyCalendar db={db} g={g} />}

      {tab === "review" && (reviewing ? <ReviewSession cards={due} g={g} onDone={() => setReviewing(false)} /> : (
        <div className="stack">
          <button className="btn primary block" disabled={!stats.due} onClick={() => setReviewing(true)}>
            {stats.due ? L(`Start review (${stats.due} cards)`, `Tekrara başla (${stats.due} kart)`) : L("Nothing due — well done", "Sırada kart yok — harika")}
          </button>
          <div className="card stack">
            <strong>{L("Make cards", "Kart oluştur")}</strong>
            <p className="small text-2">{L("Cards are made from the graph (what it is, why it matters, entry questions, objectives, misconceptions, connections). Open any object for AI cards or your own.", "Kartlar grafikten yapılır (ne olduğu, neden önemli, giriş soruları, hedefler, yanılgılar, bağlantılar). YZ kartları ya da kendi kartların için herhangi bir nesneyi aç.")}</p>
            <div className="row">
              <button className="btn small" disabled={!goals.length} onClick={() => makeDeck(goals, L("your goals", "hedeflerin"))}>{L(`For my goals (${goals.length})`, `Hedeflerim için (${goals.length})`)}</button>
              <button className="btn small" disabled={!known.length} onClick={() => makeDeck(known, L("what you know", "bildiklerin"))}>{L(`For what I know (${known.length})`, `Bildiklerim için (${known.length})`)}</button>
              <button className="btn small ghost" onClick={() => navigate("/graph")}>{L("Choose in the graph", "Grafikte seç")}</button>
            </div>
          </div>
        </div>
      ))}

      {tab === "cards" && (
        <div className="stack">
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("Search cards…", "Kartlarda ara…")} aria-label={L("Search cards", "Kartlarda ara")} />
          {!cards.length && <p className="small muted">{L("No cards yet.", "Henüz kart yok.")}</p>}
          <div className="card list">
            {cards.slice(0, 150).map((c) => (
              <div key={c.id} className="list-item" style={{ alignItems: "flex-start" }}>
                <span className="grow small">
                  <MathText text={c.kind === "CLOZE" ? renderCloze(c.front, true) : c.front} />
                  <span className="tiny muted">{c.loId ? `${g.objects[c.loId]?.title ?? c.loId} · ` : ""}{L("next", "sonraki")} {fmtDate(c.due)} · {c.reps}×{c.suspended ? ` · ${L("paused", "duraklatıldı")}` : ""}</span>
                </span>
                {c.loId && <button className="btn small ghost" onClick={() => navigate(`/graph?lo=${encodeURIComponent(c.loId!)}`)}>{L("Open", "Aç")}</button>}
              </div>
            ))}
          </div>
          {cards.length > 150 && <p className="tiny muted">{L(`Showing 150 of ${cards.length}.`, `${cards.length} kartın 150'si gösteriliyor.`)}</p>}
        </div>
      )}

      {tab === "explain" && (
        <div className="stack">
          {!explanations.length && <p className="small muted">{L("Open an object and use Explain to say the logic in your own words — typed, spoken or on video.", "Mantığını kendi cümlelerinle anlatmak için bir nesne aç ve Anlat'ı kullan — yazılı, sesli ya da videolu.")}</p>}
          <div className="card list">
            {explanations.map((e) => (
              <button key={e.id} className="list-item lo-row" onClick={() => e.loId && navigate(`/graph?lo=${encodeURIComponent(e.loId)}`)}>
                <span className="grow stack" style={{ gap: 2, textAlign: "left", minWidth: 0 }}>
                  <span className="truncate">{e.loId ? g.objects[e.loId]?.title ?? e.prompt : e.prompt}</span>
                  <span className="tiny muted">{fmtDate(e.createdAt)} · {e.mode === "TEXT" ? L("text", "metin") : e.mode === "AUDIO" ? L("audio", "ses") : L("video", "video")}</span>
                </span>
                {e.evaluation && <span className={`chip ${e.evaluation.score >= 0.75 ? "s-MASTERED" : e.evaluation.score >= 0.4 ? "s-ATTEMPTED" : "s-NEEDS_REVIEW"}`}>{Math.round(e.evaluation.score * 100)}%</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "chats" && (
        <div className="stack">
          {!chats.length && <p className="small muted">{L("Open an object and use Ask AI to ask about it.", "Bir nesne aç ve onunla ilgili soru sormak için YZ'ye sor'u kullan.")}</p>}
          <div className="card list">
            {chats.map((c) => (
              <button key={c.id} className="list-item lo-row" onClick={() => c.loId && navigate(`/graph?lo=${encodeURIComponent(c.loId)}`)}>
                <span className="grow stack" style={{ gap: 2, textAlign: "left", minWidth: 0 }}>
                  <span className="truncate">{c.loId ? g.objects[c.loId]?.title ?? c.title : c.title}</span>
                  <span className="tiny muted truncate">{c.messages.filter((m) => m.role === "user").slice(-1)[0]?.text ?? ""}</span>
                </span>
                <span className="tiny muted">{c.messages.length}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "export" && (
        <div className="card stack">
          <p className="small text-2">{L("Everything you make here belongs to you. Export it for other apps or as a backup (recordings are exported one by one from each explanation).", "Burada ürettiğin her şey senin. Başka uygulamalar için ya da yedek olarak dışa aktar (kayıtlar her anlatımdan tek tek dışa aktarılır).")}</p>
          <div className="row">
            <button className="btn small" onClick={() => exportCards(db, g, "anki")}>{L("Cards for Anki (.txt)", "Anki için kartlar (.txt)")}</button>
            <button className="btn small" onClick={() => exportCards(db, g, "csv")}>{L("Cards (CSV)", "Kartlar (CSV)")}</button>
            <button className="btn small" onClick={() => saveTextFile("lab-explanations.md", explanationsMarkdown(db, g), "text/markdown")}>{L("Explanations (Markdown)", "Anlatımlar (Markdown)")}</button>
            <button className="btn small" onClick={() => saveTextFile("lab-ai-chats.md", chatsMarkdown(db, g), "text/markdown")}>{L("AI chats (Markdown)", "YZ sohbetleri (Markdown)")}</button>
            <button className="btn small" onClick={() => saveTextFile("lab-study-data.json", studyExport(db), "application/json")}>{L("All study data (JSON)", "Tüm çalışma verisi (JSON)")}</button>
            <button className="btn small" onClick={() => saveTextFile("lab-adaptive-data.json", adaptiveExport(db), "application/json")}>{L("Paths, errors, mastery, decisions (JSON)", "Rotalar, hatalar, ustalık, kararlar (JSON)")}</button>
          </div>
          <p className="tiny muted">{L("Anki: File → Import, choose the .txt file, separator Tab, allow HTML.", "Anki: Dosya → İçe aktar, .txt dosyasını seç, ayırıcı Sekme, HTML'ye izin ver.")}</p>
        </div>
      )}
    </div>
  );
}
