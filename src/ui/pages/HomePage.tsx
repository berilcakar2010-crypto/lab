import type { ID } from "../../domain/types";
import { courseMilestones } from "../../engines/curriculum";
import { dueRetentionChecks } from "../../engines/progress";
import { recommendNext, topPicks } from "../../engines/progression";
import { engagementLift } from "../../engines/statistics";
import { logEvent } from "../../engines/analytics";
import { act, navigate, useDB } from "../state";
import { Bar, Icon, KindChip, TYPE_LABEL, minutes } from "../components/common";
import { courseProgress } from "./CoursePage";
import { getGraph } from "../../knowledge/graph";
import { personalGraph, recommendObjects } from "../../knowledge/state";
import { LEARNING_PATHS } from "../../knowledge/paths";
import type { LabDB } from "../../domain/types";
import { L, fmtDate } from "../../i18n";
import { LanguageToggle } from "../components/LanguageToggle";
import { cardStats } from "../../study/flashcards";
import { dueTopics } from "../../study/topics";

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

/** Home: the current objective, the one thing in progress, what's next. Not a dashboard. */
export function HomePage() {
  const db = useDB();
  const courses = Object.values(db.courses).filter((c) => !c.archived);
  // Most recently touched course first.
  const lastTouch = (id: ID) => {
    for (let i = db.events.length - 1; i >= 0; i--) if (db.events[i].courseId === id) return db.events[i].at;
    return db.courses[id].createdAt;
  };
  courses.sort((a, b) => lastTouch(b.id) - lastTouch(a.id));
  const due = dueRetentionChecks(db).filter((r) => r.kind !== "IMMEDIATE");

  if (!courses.length) {
    return (
      <div className="stack-lg rise">
        <header className="stack" style={{ gap: 4 }}>
          <div className="row between nowrap"><span className="eyebrow">{L("Lab · research notebook", "Lab · araştırma defteri")}</span><LanguageToggle compact /></div>
          <h1>{L("What's next?", "Sırada ne var?")}</h1>
        </header>
        <div className="card stack">
          <h2>{L("Start with a big goal", "Büyük bir hedefle başla")}</h2>
          <p className="text-2">{L("Name a course or paste a syllabus. Lab turns it into the next meaningful thing you can actually do — then you attempt it, get feedback, master it, and see yourself move forward.", "Bir ders adı yaz ya da müfredat yapıştır. Lab bunu şu an gerçekten yapabileceğin bir sonraki anlamlı adıma dönüştürür — sen dener, geri bildirim alır, ustalaşır ve ilerlediğini görürsün.")}</p>
          <button className="btn primary" onClick={() => navigate("/build")}><Icon.plus /> {L("New course", "Yeni ders")}</button>
        </div>
        <GraphCard db={db} />
      </div>
    );
  }

  const focus = courses[0];
  const inProgress = courseMilestones(db, focus.id)
    .filter((m) => m.status === "ACTIVE" || m.status === "ATTEMPTED")
    .sort((a, b) => lastMilestoneTouch(b.id) - lastMilestoneTouch(a.id))[0];
  function lastMilestoneTouch(id: ID) {
    for (let i = db.events.length - 1; i >= 0; i--) if (db.events[i].milestoneId === id) return db.events[i].at;
    return 0;
  }
  const picks = topPicks(recommendNext(db, focus.id, { engagementLift: engagementLift(db) }), 3).filter((r) => r.milestoneId !== inProgress?.id);
  const recent = Object.values(db.mastery).sort((a, b) => b.achievedAt - a.achievedAt).slice(0, 4).filter((r) => db.milestones[r.milestoneId]);
  const fp = courseProgress(db, focus.id);
  const open = (id: ID, kind?: string) => {
    if (kind) act((d) => logEvent(d, "RECOMMENDATION_CHOSEN", { milestoneId: id, courseId: focus.id }, { kind, from: "home" }));
    navigate(`/session/${id}`);
  };

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <div className="row between nowrap"><span className="eyebrow">{fmtDate(Date.now(), { day: "numeric", month: "long" })} · {focus.title}</span><LanguageToggle compact /></div>
        <h1>{L("What's next?", "Sırada ne var?")}</h1>
        <p className="text-2">{focus.goal}</p>
        <Bar value={fp.requiredTotal ? fp.requiredMastered / fp.requiredTotal : 0} mastered />
        <span className="small muted">{L(`${fp.requiredMastered} of ${fp.requiredTotal} core milestones mastered`, `${fp.requiredTotal} temel adımın ${fp.requiredMastered} tanesinde ustalaşıldı`)}</span>
      </header>

      {inProgress && (
        <button className="card accent clickable stack" style={{ textAlign: "left", color: "inherit", font: "inherit", gap: 6 }} onClick={() => open(inProgress.id)}>
          <span className="eyebrow">{L("In progress", "Devam eden")}</span>
          <span className="serif" style={{ fontSize: "1.2rem" }}>{inProgress.title}</span>
          <span className="small text-2">{inProgress.learningObjective}</span>
          <span className="row small" style={{ color: "var(--accent)", gap: 6 }}>{L("Continue", "Devam et")} <Icon.arrow /></span>
        </button>
      )}

      {due.length > 0 && (
        <button className="banner warn row between" style={{ textAlign: "left", color: "inherit", font: "inherit", cursor: "pointer" }} onClick={() => navigate("/retention")}>
          <span>{L(`${due.length} retention check${due.length > 1 ? "s" : ""} due — a few minutes to see what stuck.`, `${due.length} kalıcılık kontrolü bekliyor — neyin aklında kaldığını görmek birkaç dakika sürer.`)}</span>
          <Icon.arrow />
        </button>
      )}

      {picks.length > 0 && (
        <section className="stack" style={{ gap: 10 }}>
          <h2>{inProgress ? L("Or choose", "Ya da seç") : L("Recommended", "Önerilenler")}</h2>
          {picks.map((r, i) => {
            const m = db.milestones[r.milestoneId];
            return (
              <button key={r.milestoneId} className={`card clickable ${!inProgress && i === 0 ? "accent" : ""}`} style={{ textAlign: "left", color: "inherit", font: "inherit" }} onClick={() => open(m.id, r.kind)}>
                <div className="row between nowrap" style={{ marginBottom: 4 }}><KindChip kind={r.kind} /><span className="tiny muted">{TYPE_LABEL[m.milestoneType]} · {minutes(m.estimatedDuration)}</span></div>
                <div className="serif" style={{ fontSize: "1.05rem" }}>{m.title}</div>
                <div className="tiny muted" style={{ marginTop: 4 }}>{r.reasons[0]}</div>
              </button>
            );
          })}
          <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => navigate(`/course/${focus.id}?tab=map`)}>{L("Open the map", "Haritayı aç")} <Icon.arrow /></button>
        </section>
      )}

      <GraphCard db={db} />
      <StudyCard db={db} />

      <section className="stack" style={{ gap: 10 }}>
        <div className="row between"><h2>{L("Courses", "Dersler")}</h2><button className="btn small" onClick={() => navigate("/build")}><Icon.plus /> {L("New", "Yeni")}</button></div>
        {courses.map((c) => {
          const p = courseProgress(db, c.id);
          return (
            <button key={c.id} className="card clickable stack" style={{ textAlign: "left", color: "inherit", font: "inherit", gap: 6 }} onClick={() => navigate(`/course/${c.id}`)}>
              <div className="row between nowrap"><strong className="truncate">{c.title}</strong><span className="small muted mono">{p.requiredMastered}/{p.requiredTotal}</span></div>
              <Bar value={p.requiredTotal ? p.requiredMastered / p.requiredTotal : 0} mastered />
            </button>
          );
        })}
      </section>

      {recent.length > 0 && (
        <section className="stack" style={{ gap: 6 }}>
          <h2>{L("Recent progress", "Son ilerlemeler")}</h2>
          {recent.map((r) => (
            <div key={r.id} className="row small nowrap">
              <span style={{ color: "var(--mastered)" }}>✓</span>
              <span className="grow truncate">{db.milestones[r.milestoneId].title}</span>
              <span className="muted">{r.selfAttested ? L("self-attested", "kendi beyanın") : fmtDate(r.achievedAt)}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
