import type { ID } from "../../domain/types";
import { navigate, useDB } from "../state";
import { Bar, Icon } from "../components/common";
import { courseProgress } from "./CoursePage";
import { getGraph } from "../../knowledge/graph";
import { personalGraph, recommendObjects } from "../../knowledge/state";
import { LEARNING_PATHS } from "../../knowledge/paths";
import type { LabDB } from "../../domain/types";
import { L, fmtDate } from "../../i18n";
import { LanguageToggle } from "../components/LanguageToggle";
import { cardStats } from "../../study/flashcards";
import { dueTopics } from "../../study/topics";
import { daysUntil, examReadiness, upcomingExams } from "../../study/exams";
import { countdown, TodayForExams } from "../components/Exams";
import { DiscoverStrip, FirstRun, OpenLabView } from "../components/OpenLab";
import { openPalette } from "../components/CommandPalette";
import { passedDeadlines } from "../../academic/school";

/** Due flashcards: a two-minute habit that keeps what you learned. */
function StudyCard({ db }: { db: LabDB }) {
  const s = cardStats(db);
  const topics = dueTopics(db).length;
  if (!s.total && !topics && !Object.keys(db.topicReviews).length) return null;
  const parts = [topics ? L(`${topics} topics`, `${topics} konu`) : "", s.due ? L(`${s.due} cards`, `${s.due} kart`) : ""].filter(Boolean).join(L(" and ", " ve "));
  return (
    <button className="card clickable row between nowrap" style={{ textAlign: "left", color: "inherit", font: "inherit" }} onClick={() => navigate("/study")}>
      <span className="stack" style={{ gap: 2 }}>
        <span className="eyebrow">{L("Spaced repetition", "Aralıklı tekrar")}</span>
        <span className="small">{parts ? L(`${parts} are due — a few minutes keeps them.`, `${parts} tekrar için hazır — birkaç dakika onları kalıcı yapar.`) : L("Everything is up to date.", "Her şey güncel.")}</span>
      </span>
      <Icon.arrow />
    </button>
  );
}

/** The next exam with a countdown, and today's plan for the exams coming up. */
function ExamsCard({ db }: { db: LabDB }) {
  const next = upcomingExams(db)[0];
  if (!next) return null;
  const g = getGraph(db.knowledge);
  const left = daysUntil(next);
  const ready = examReadiness(db, g, next);
  return (
    <div className="stack" style={{ gap: 8 }}>
      <button className={`card clickable exam-card ${left <= 3 ? "soon" : ""}`} onClick={() => navigate(`/study?tab=exams&exam=${next.id}`)}>
        <span className="exam-count"><span className="serif">{left <= 0 ? "!" : left}</span><span className="tiny">{left <= 0 ? L("today", "bugün") : L("days", "gün")}</span></span>
        <span className="stack grow" style={{ gap: 4, minWidth: 0 }}>
          <span className="eyebrow">{L("Next exam", "Sıradaki sınav")} · {countdown(left)}</span>
          <strong className="truncate">{next.subject ? `${next.subject} · ` : ""}{next.title}</strong>
          <Bar value={ready.score} mastered={ready.score >= 0.78} />
          <span className="tiny muted">{L(`Ready ${Math.round(ready.score * 100)}%`, `Hazırlık %${Math.round(ready.score * 100)}`)} · {fmtDate(next.date, { weekday: "short", day: "numeric", month: "short" })}</span>
        </span>
      </button>
      <TodayForExams db={db} g={g} compact />
    </div>
  );
}

/** A small entry into the knowledge graph: one suggestion, never the whole list. */
function GraphCard({ db }: { db: LabDB }) {
  const g = getGraph(db.knowledge);
  const pg = personalGraph(db, g);
  const path = LEARNING_PATHS.find((p) => p.id === db.knowledge.pathId);
  const targets = db.knowledge.goals.length ? db.knowledge.goals : path?.targets ?? [];
  const rec = recommendObjects(pg, targets, 1)[0];
  const known = g.order.filter((id) => pg.satisfied(id)).length;
  return (
    <button className="card clickable stack graph-card" style={{ textAlign: "left", color: "inherit", font: "inherit", gap: 6 }}
      onClick={() => navigate(rec ? `/graph?lo=${encodeURIComponent(rec.id)}` : "/graph")}>
      <span className="eyebrow">{L("Knowledge graph", "Bilgi grafiği")} · {g.name} v{g.version}</span>
      {rec ? (
        <>
          <span className="serif" style={{ fontSize: "1.1rem" }}>{g.objects[rec.id].title}</span>
          <span className="tiny muted">{rec.reasons.slice(0, 2).join(" · ")}</span>
        </>
      ) : <span className="small text-2">{L("See how the ideas build on each other.", "Fikirlerin birbirine nasıl dayandığını gör.")}</span>}
      <span className="row small" style={{ color: "var(--accent)", gap: 6 }}>{known ? L(`You know ${known} objects · `, `${known} nesneyi biliyorsun · `) : ""}{L("Open the graph", "Grafiği aç")} <Icon.arrow /></span>
    </button>
  );
}

/**
 * Home is Open Lab: where you stand, one thing to do now (starting with the
 * actual question), a way back into unfinished work, discovery — and, below,
 * the library of courses. Not a dashboard of tasks.
 */
export function HomePage() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const courses = Object.values(db.courses).filter((c) => !c.archived);
  const lastTouch = (id: ID) => {
    for (let i = db.events.length - 1; i >= 0; i--) if (db.events[i].courseId === id) return db.events[i].at;
    return db.courses[id].createdAt;
  };
  courses.sort((a, b) => lastTouch(b.id) - lastTouch(a.id));
  const firstRun = !db.preferences.firstRunAt && !courses.length && !Object.keys(db.attempts).length && !Object.keys(db.academicGoals).length;
  const passed = passedDeadlines(db, g);
  const nextExam = upcomingExams(db)[0];

  return (
    <div className="stack-lg rise">
      <header className="row between nowrap">
        <span className="eyebrow">{fmtDate(Date.now(), { weekday: "long", day: "numeric", month: "long" })}</span>
        <span className="row nowrap" style={{ gap: 6 }}>
          <button className="btn small ghost" onClick={() => openPalette()} aria-label={L("Search and quick actions", "Arama ve hızlı komutlar")}><Icon.search /> <span className="hide-narrow">{L("Search", "Ara")}</span></button>
          <LanguageToggle compact />
        </span>
      </header>

      {firstRun ? <FirstRun g={g} /> : <OpenLabView db={db} g={g} />}

      {passed.slice(0, 1).map((p) => (
        <div key={p.examId} className="banner info row between" style={{ gap: 8 }}>
          <span className="small">{p.message}</span>
          <button className="btn small" onClick={() => navigate(`/study?tab=exams&exam=${p.examId}`)}>{L("Add the result", "Sonucu ekle")}</button>
        </div>
      ))}
      {nextExam && daysUntil(nextExam) <= 14 && <ExamsCard db={db} />}

      {!firstRun && <DiscoverStrip db={db} g={g} />}

      <details className="library" open={!firstRun && courses.length > 0 && courses.length <= 2}>
        <summary className="row between"><h2 style={{ margin: 0 }}>{L("Library", "Kütüphane")}</h2><span className="tiny muted">{L(`${courses.length} courses`, `${courses.length} ders`)}</span></summary>
        <div className="stack" style={{ gap: 10, marginTop: 10 }}>
          {courses.map((c) => {
            const p = courseProgress(db, c.id);
            return (
              <button key={c.id} className="card clickable stack" style={{ textAlign: "left", color: "inherit", font: "inherit", gap: 6 }} onClick={() => navigate(`/course/${c.id}`)}>
                <div className="row between nowrap"><strong className="truncate">{c.title}</strong><span className="small muted mono">{p.requiredMastered}/{p.requiredTotal}</span></div>
                <Bar value={p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0} mastered />
              </button>
            );
          })}
          <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={() => navigate("/build")}><Icon.plus /> {L("New course", "Yeni ders")}</button>
          <GraphCard db={db} />
          <StudyCard db={db} />
        </div>
      </details>
    </div>
  );
}
