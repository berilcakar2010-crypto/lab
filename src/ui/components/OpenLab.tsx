/**
 * Open Lab: the opening experience. One thing now (with its actual question),
 * a way back into unfinished work, "surprise me", "I don't know what to
 * study", a few real discoveries, and the first-run question for a new Lab.
 */
import { useEffect, useMemo, useState } from "react";
import type { LabDB } from "../../domain/types";
import { CHALLENGE_LEVELS, type ChallengeLevel } from "../../domain/academic";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { L } from "../../i18n";
import { ENTRY_LABEL, VERB_LABEL, logEntryChosen, logEntryShown, openLab, routesWhenUnsure, surpriseMe, type Entry, type Resume } from "../../adaptive/entry";
import { DISCOVERY_LABEL, discoveries } from "../../adaptive/discovery";
import { createGoal, suggestGoalObjects } from "../../academic/goals";
import { createPath } from "../../adaptive/pathPlanner";
import { logEvent } from "../../engines/analytics";
import { act, navigate, store, useDB } from "../state";
import { Icon, Sheet } from "./common";
import { MathText } from "./MathText";
import { WhyList } from "./Adaptive";
import { QuickCheck } from "./QuickCheck";

export const LEVEL_LABEL = (l: ChallengeLevel): string =>
  ({ COMFORT: L("Comfort", "Rahat"), STRETCH: L("Stretch", "Esneme"), HARD: L("Hard", "Zor"), EXTREME: L("Extreme", "En zor") })[l];

/** Go where an entry points. */
export function followEntry(e: Entry, from: string) {
  act((d) => logEntryChosen(d, e, from));
  const t = e.target;
  if (t.milestoneId) navigate(`/session/${t.milestoneId}`);
  else if (t.researchId) navigate(`/study?tab=research&res=${t.researchId}`);
  else if (t.projectId) navigate(`/work?tab=projects&id=${t.projectId}`);
  else if (t.experimentId) navigate("/focus");
  else if (t.loId) navigate(`/graph?lo=${encodeURIComponent(t.loId)}`);
  else navigate("/graph");
}

export function EntryCard({ e, primary, from }: { e: Entry; primary?: boolean; from: string }) {
  return (
    <section className={`card ${primary ? "accent one-thing" : "clickable"} stack rise`} style={{ gap: 10 }}>
      <div className="row between nowrap">
        <span className="eyebrow">{primary ? L("One thing now", "Şimdi tek şey") + " · " : ""}{ENTRY_LABEL(e.kind)}</span>
        <span className="tiny muted" title={L("How strongly the data supports this", "Verinin bunu ne kadar desteklediği")}>{L("confidence", "güven")} {Math.round(e.confidence * 100)}%</span>
      </div>
      <span className="serif" style={{ fontSize: primary ? "1.3rem" : "1.05rem" }}>{e.title}</span>
      {e.challenge && (
        <div className="challenge stack" style={{ gap: 4 }}>
          <span className="tiny muted">{VERB_LABEL(e.challenge.verb)}</span>
          <div className={primary ? "" : "small"} style={{ maxHeight: primary ? 180 : 72, overflow: "hidden" }}><MathText text={e.challenge.prompt} /></div>
        </div>
      )}
      <WhyList reasons={e.why} />
      <button className={`btn ${primary ? "primary" : ""}`} style={{ alignSelf: "flex-start" }} onClick={() => followEntry(e, from)}>
        {primary ? L("Start", "Başla") : L("Go", "Git")} <Icon.arrow />
      </button>
    </section>
  );
}

/** "Continue where you left off?" — continue, restart, review or switch. */
export function ResumeCard({ r, onSwitch }: { r: Resume; onSwitch: () => void }) {
  const db = useDB();
  const lo = db.milestones[r.milestoneId]?.learningObjectIds?.[0];
  const log = (mode: string) => act((d) => logEvent(d, "SESSION_RESUMED", { milestoneId: r.milestoneId }, { mode }));
  return (
    <section className="card stack" style={{ gap: 8 }}>
      <span className="eyebrow">{L("Continue where you left off?", "Kaldığın yerden devam?")}</span>
      <span className="serif" style={{ fontSize: "1.05rem" }}>{r.title}</span>
      <div className="row" style={{ gap: 6 }}>
        <button className="btn small primary" onClick={() => { log("continue"); navigate(`/session/${r.milestoneId}`); }}>{L("Continue", "Devam et")}</button>
        <button className="btn small" onClick={() => { log("restart"); navigate(`/session/${r.milestoneId}?restart=1`); }}>{L("Restart", "Baştan başla")}</button>
        {lo && <button className="btn small" onClick={() => { log("review"); navigate(`/graph?lo=${encodeURIComponent(lo)}`); }}>{L("Review the idea", "Fikri gözden geçir")}</button>}
        <button className="btn small ghost" onClick={() => { log("switch"); onSwitch(); }}>{L("Switch", "Değiştir")}</button>
      </div>
    </section>
  );
}

export function SurpriseMe({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const [level, setLevel] = useState<ChallengeLevel>(db.preferences.challengeLevel);
  const [pick, setPick] = useState<Entry | null | undefined>(undefined);
  const roll = (lv = level) => setPick(surpriseMe(store.state, g, lv));
  return (
    <section className="stack" style={{ gap: 8 }}>
      <div className="row" style={{ gap: 6 }}>
        <button className="btn small" onClick={() => roll()}><Icon.spark /> {L("Surprise me", "Beni şaşırt")}</button>
        <div className="seg small" role="radiogroup" aria-label={L("Challenge level", "Zorluk seviyesi")}>
          {CHALLENGE_LEVELS.map((l) => (
            <button key={l} role="radio" aria-checked={level === l} className={level === l ? "on" : ""} onClick={() => { setLevel(l); act((d) => { d.preferences.challengeLevel = l; }); if (pick !== undefined) roll(l); }}>{LEVEL_LABEL(l)}</button>
          ))}
        </div>
      </div>
      {pick && <EntryCard e={pick} from="surprise" />}
      {pick === null && <span className="small muted">{L("Nothing new fits that level right now.", "Şu an bu seviyeye uyan yeni bir şey yok.")}</span>}
    </section>
  );
}

export function UnsureSheet({ g, onClose }: { g: KnowledgeGraph; onClose: () => void }) {
  const routes = useMemo(() => routesWhenUnsure(store.state, g), [g]);
  return (
    <Sheet title={L("Not sure what to study?", "Ne çalışacağından emin değil misin?")} onClose={onClose}>
      <div className="stack" style={{ gap: 10 }}>
        <p className="small text-2">{L("A few different directions, each with its reason. Pick one — or none.", "Birkaç farklı yön, her biri gerekçesiyle. Birini seç — ya da hiçbirini.")}</p>
        {routes.length ? routes.map((e, i) => <EntryCard key={i} e={e} from="unsure" />) : <p className="small muted">{L("Not enough history yet. Try “Surprise me” or open the graph.", "Henüz yeterli geçmiş yok. “Beni şaşırt”ı dene ya da grafiği aç.")}</p>}
      </div>
    </Sheet>
  );
}

export function DiscoverStrip({ db, g, limit = 3, exclude }: { db: LabDB; g: KnowledgeGraph; limit?: number; exclude?: string }) {
  const ds = useMemo(() => discoveries(db, g, Date.now(), limit + 1).filter((d) => d.loId !== exclude).slice(0, limit), [db.events.length, g, exclude]);
  useEffect(() => {
    if (ds.length) act((d) => logEvent(d, "DISCOVERY_SHOWN", {}, { loIds: ds.map((x) => x.loId), kinds: ds.map((x) => x.kind) }));
  }, [ds.map((x) => x.loId).join()]);
  if (!ds.length) return null;
  return (
    <section className="stack" style={{ gap: 8 }}>
      <h2>{L("Discover", "Keşfet")}</h2>
      {ds.map((d) => (
        <button key={d.loId} className="card clickable stack discover-card" style={{ textAlign: "left", color: "inherit", font: "inherit", gap: 4 }}
          onClick={() => { act((x) => logEvent(x, "DISCOVERY_OPENED", { loIds: [d.loId] }, { kind: d.kind, from: d.fromId })); navigate(`/graph?lo=${encodeURIComponent(d.loId)}`); }}>
          <span className="eyebrow">{DISCOVERY_LABEL(d.kind)}</span>
          <span className="serif">{d.title}</span>
          <span className="tiny text-2">{d.detail}</span>
          {d.question && <span className="small" style={{ fontStyle: "italic" }}>“{d.question}”</span>}
        </button>
      ))}
    </section>
  );
}

/** A new Lab: "What do you want to understand?" → goal → current knowledge → first path. */
export function FirstRun({ g }: { g: KnowledgeGraph }) {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string[] | null>(null);
  const [level, setLevel] = useState<"new" | "some" | "confident">("new");
  const [check, setCheck] = useState<string[] | null>(null);
  const suggestions = useMemo(() => (text.trim().length >= 3 ? suggestGoalObjects(g, text, 5) : []), [text, g]);
  const finish = (ids: string[]) => {
    act((d) => {
      const goal = createGoal(d, { title: text.trim() || g.objects[ids[0]].title, loIds: ids, currentState: { new: L("new to me", "yeni"), some: L("some exposure", "biraz biliyorum"), confident: L("confident", "eminim") }[level] });
      createPath(d, g, { goalIds: ids, title: goal.title });
      d.preferences.firstRunAt = Date.now();
    });
  };
  return (
    <section className="card accent stack rise" style={{ gap: 12 }}>
      <h1 className="serif">{L("What do you want to understand?", "Neyi anlamak istiyorsun?")}</h1>
      <input className="input" autoFocus value={text} onChange={(e) => { setText(e.target.value); setPicked(null); }}
        placeholder={L("e.g. Fourier transforms, how neurons fire, Japanese grammar", "ör. Fourier dönüşümü, nöronlar nasıl ateşlenir, Japonca dilbilgisi")} aria-label={L("Goal", "Hedef")} />
      {suggestions.length > 0 && (
        <div className="stack" style={{ gap: 6 }}>
          <span className="tiny muted">{L("In the knowledge graph:", "Bilgi grafiğinde:")}</span>
          {suggestions.map((id) => {
            const on = picked ? picked.includes(id) : id === suggestions[0];
            return (
              <label key={id} className="row nowrap small" style={{ gap: 8 }}>
                <input type="checkbox" checked={on} onChange={() => { const cur = picked ?? [suggestions[0]]; setPicked(on ? cur.filter((x) => x !== id) : [...cur, id]); }} />
                <span className="grow">{g.objects[id].title}</span>
                <span className="tiny muted">{g.objects[id].field}</span>
              </label>
            );
          })}
          <span className="tiny muted">{L("How much do you know already?", "Ne kadarını zaten biliyorsun?")}</span>
          <div className="seg small" role="radiogroup">
            {(["new", "some", "confident"] as const).map((l) => (
              <button key={l} role="radio" aria-checked={level === l} className={level === l ? "on" : ""} onClick={() => setLevel(l)}>{{ new: L("New to me", "Yeni"), some: L("Some", "Biraz"), confident: L("Confident", "Eminim") }[l]}</button>
            ))}
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn primary" disabled={!(picked ?? [suggestions[0]]).length} onClick={() => {
              const ids = picked ?? [suggestions[0]];
              if (level === "new") finish(ids);
              else setCheck(ids);
            }}>{level === "new" ? L("Build my first path", "İlk rotamı kur") : L("Check what I know first", "Önce bildiklerimi kontrol et")} <Icon.arrow /></button>
          </div>
        </div>
      )}
      {text.trim().length >= 3 && !suggestions.length && <span className="small muted">{L("Not in the graph yet — you can build a course from it.", "Henüz grafikte yok — bundan bir ders oluşturabilirsin.")} <a href="#/build">{L("Build a course", "Ders oluştur")}</a></span>}
      <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => act((d) => { d.preferences.firstRunAt = Date.now(); })}>{L("Skip — I'll explore on my own", "Geç — kendim keşfedeceğim")}</button>
      {check && <QuickCheck target={{ loIds: check }} title={L("What you already know", "Zaten bildiklerin")} onClose={() => { finish(check); setCheck(null); }} />}
    </section>
  );
}

/** The opening screen content. */
export function OpenLabView({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const lab = useMemo(() => openLab(db, g), [db.events.length, db.preferences.dailySuggestions, g]);
  const [showMore, setShowMore] = useState(false);
  const [unsure, setUnsure] = useState(false);
  const primaryKey = lab.primary ? `${lab.primary.kind}:${lab.primary.target.milestoneId ?? lab.primary.target.loId ?? ""}` : "";
  useEffect(() => {
    if (lab.primary) act((d) => logEntryShown(d, lab.primary!));
  }, [primaryKey]);
  const resumeIsPrimary = lab.resume && lab.primary?.target.milestoneId === lab.resume.milestoneId;
  return (
    <div className="stack-lg">
      <p className="state-line serif">{lab.stateLine}</p>
      {lab.resume && !resumeIsPrimary && <ResumeCard r={lab.resume} onSwitch={() => setShowMore(true)} />}
      {lab.primary ? <EntryCard e={lab.primary} primary from="home" /> : !db.preferences.dailySuggestions ? null : (
        <section className="card stack"><span className="small text-2">{L("Nothing is waiting. Pick a topic in the graph, or let Lab surprise you.", "Bekleyen bir şey yok. Grafikten bir konu seç ya da Lab seni şaşırtsın.")}</span></section>
      )}
      <div className="row" style={{ gap: 6 }}>
        {lab.alternatives.length > 0 && <button className="btn small" onClick={() => setShowMore(!showMore)} aria-expanded={showMore}>{showMore ? L("Fewer options", "Daha az seçenek") : L(`Other options (${lab.alternatives.length})`, `Diğer seçenekler (${lab.alternatives.length})`)}</button>}
        <button className="btn small ghost" onClick={() => setUnsure(true)}>{L("I don't know what to study", "Ne çalışacağımı bilmiyorum")}</button>
      </div>
      {showMore && <div className="stack" style={{ gap: 8 }}>{lab.alternatives.map((e, i) => <EntryCard key={i} e={e} from="home-more" />)}</div>}
      <SurpriseMe db={db} g={g} />
      {unsure && <UnsureSheet g={g} onClose={() => setUnsure(false)} />}
    </div>
  );
}

