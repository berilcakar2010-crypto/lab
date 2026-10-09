/**
 * Work: the learner's academic production and long-term direction —
 * goals (with their decomposition), projects, the journal, the portfolio of
 * artifacts, the school layer (subjects, AP, grades) and the academic
 * timeline with the yearly reflection.
 */
import { useMemo, useState } from "react";
import type { ID, LabDB } from "../../domain/types";
import { ARTIFACT_KINDS, JOURNAL_KINDS, PROJECT_KINDS, SCHOOL_SUBJECT_KINDS, type ArtifactKind, type JournalKind, type ProjectKind, type SchoolSubjectKind } from "../../domain/academic";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { getGraph } from "../../knowledge/graph";
import { L, fmtDate } from "../../i18n";
import { act, navigate, toast, useDB } from "../state";
import { Bar, Icon } from "../components/common";
import { ARTIFACT_LABEL, JOURNAL_LABEL, PROJECT_LABEL, PROJECT_STATUS_LABEL, addJournal, createProject, deleteArtifact, deleteJournal, projectOverview, saveArtifact, updateProject } from "../../academic/records";
import { GOAL_STATUS_LABEL, createGoal, decomposeGoal, pathForGoal, suggestGoalObjects, updateGoal } from "../../academic/goals";
import { restoreVersion } from "../../academic/versioning";
import { SUBJECT_KIND_LABEL, addGrade, addSchoolSubject, deleteGrade, subjectSummary } from "../../academic/school";
import { portfolio, timeline, yearlyReflection, type TimelineKind } from "../../academic/portfolio";
import { competitionReport } from "../../academic/layers";
import { globalSearch } from "../../adaptive/search";

type Tab = "goals" | "projects" | "journal" | "portfolio" | "school" | "timeline";
const TABS = (): [Tab, string][] => [
  ["goals", L("Goals", "Hedefler")], ["projects", L("Projects", "Projeler")], ["journal", L("Journal", "Günlük")],
  ["portfolio", L("Portfolio", "Portfolyo")], ["school", L("School", "Okul")], ["timeline", L("Timeline", "Zaman çizelgesi")],
];

const query = () => new URLSearchParams(window.location.hash.split("?")[1] ?? "");
const pctText = (x: number) => L(`${Math.round(x * 100)}%`, `%${Math.round(x * 100)}`);

export function WorkPage() {
  const db = useDB();
  const g = getGraph(db.knowledge);
  const q = query();
  const [tab, setTab] = useState<Tab>(() => (TABS().some(([k]) => k === q.get("tab")) ? (q.get("tab") as Tab) : "goals"));
  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">{L("Your academic work", "Akademik çalışman")}</span>
        <h1>{L("Work", "Çalışmalar")}</h1>
      </header>
      <div className="chip-scroll" role="tablist">
        {TABS().map(([k, label]) => <button key={k} role="tab" aria-selected={tab === k} className={`btn small ${tab === k ? "primary" : ""}`} onClick={() => setTab(k)}>{label}</button>)}
      </div>
      {tab === "goals" && <Goals db={db} g={g} initial={q.get("id") ?? undefined} />}
      {tab === "projects" && <Projects db={db} g={g} initial={q.get("id") ?? undefined} />}
      {tab === "journal" && <Journal db={db} g={g} />}
      {tab === "portfolio" && <Portfolio db={db} g={g} />}
      {tab === "school" && <School db={db} g={g} />}
      {tab === "timeline" && <Timeline db={db} g={g} />}
    </div>
  );
}

/** Pick graph objects by typing (search over the graph). */
function ConceptPicker({ g, value, onChange }: { g: KnowledgeGraph; value: string[]; onChange: (ids: string[]) => void }) {
  const db = useDB();
  const [t, setT] = useState("");
  const hits = useMemo(() => (t.trim().length >= 2 ? globalSearch(db, g, t, 8).filter((r) => r.type === "CONCEPT" && !value.includes(r.id)) : []), [t, value, g]);
  return (
    <div className="stack" style={{ gap: 6 }}>
      <div className="row" style={{ gap: 4 }}>
        {value.map((id) => <span key={id} className="chip">{g.objects[id]?.title ?? id} <button className="btn ghost small" style={{ minHeight: 0, padding: 0 }} aria-label={L("Remove", "Kaldır")} onClick={() => onChange(value.filter((x) => x !== id))}>×</button></span>)}
      </div>
      <input className="input" value={t} onChange={(e) => setT(e.target.value)} placeholder={L("Link a topic from the graph…", "Grafikten bir konu bağla…")} aria-label={L("Topic", "Konu")} />
      {hits.map((h) => <button key={h.id} className="list-item small" style={{ textAlign: "left" }} onClick={() => { onChange([...value, h.id]); setT(""); }}>{h.title} <span className="tiny muted">{h.context}</span></button>)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

function Goals({ db, g, initial }: { db: LabDB; g: KnowledgeGraph; initial?: ID }) {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState<ID | null>(initial ?? null);
  const goals = Object.values(db.academicGoals).sort((a, b) => b.updatedAt - a.updatedAt);
  const add = () => {
    const ids = suggestGoalObjects(g, title, 3);
    const goal = act((d) => createGoal(d, { title, loIds: ids }));
    setTitle("");
    setOpen(goal.id);
  };
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="card stack" style={{ gap: 8 }}>
        <span className="small text-2">{L("A long-term goal, in your own words. Lab links it to the graph and breaks it down; nothing here is a deadline.", "Kendi cümlelerinle uzun vadeli bir hedef. Lab onu grafiğe bağlar ve parçalara ayırır; burada hiçbir şey bir son tarih değildir.")}</span>
        <div className="row nowrap" style={{ gap: 6 }}>
          <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("e.g. Become strong in computational neuroscience", "ör. Hesaplamalı nörobilimde güçlenmek")} aria-label={L("Goal", "Hedef")} />
          <button className="btn primary" disabled={!title.trim()} onClick={add}><Icon.plus /></button>
        </div>
      </div>
      {!goals.length && <p className="small muted">{L("No goals yet. A goal gives the suggestions a direction.", "Henüz hedef yok. Bir hedef önerilere yön verir.")}</p>}
      {goals.map((goal) => {
        const d = decomposeGoal(db, g, goal);
        const expanded = open === goal.id;
        return (
          <section key={goal.id} className="card stack" style={{ gap: 8 }}>
            <button className="row between nowrap" style={{ background: "none", border: 0, color: "inherit", padding: 0, cursor: "pointer", textAlign: "left" }} onClick={() => setOpen(expanded ? null : goal.id)}>
              <span className="stack" style={{ gap: 2 }}>
                <span className="serif" style={{ fontSize: "1.1rem" }}>{goal.title}</span>
                <span className="tiny muted">{GOAL_STATUS_LABEL(goal.status)} · {L(`${d.shown} of ${d.conceptCount} concepts shown`, `${d.conceptCount} kavramın ${d.shown} tanesi gösterildi`)}</span>
              </span>
              {expanded ? <Icon.up /> : <Icon.down />}
            </button>
            <Bar value={d.progress} mastered />
            {expanded && (
              <div className="stack" style={{ gap: 10 }}>
                <label className="field"><span>{L("Why", "Neden")}</span><textarea className="textarea" style={{ minHeight: 60 }} defaultValue={goal.why} onBlur={(e) => e.target.value !== goal.why && act((x) => updateGoal(x, goal.id, { why: e.target.value }))} /></label>
                <div className="grid-2">
                  <label className="field"><span>{L("Where I am", "Şu an neredeyim")}</span><input className="input" defaultValue={goal.currentState} onBlur={(e) => e.target.value !== goal.currentState && act((x) => updateGoal(x, goal.id, { currentState: e.target.value }))} /></label>
                  <label className="field"><span>{L("Where I want to be", "Nereye varmak istiyorum")}</span><input className="input" defaultValue={goal.desiredState} onBlur={(e) => e.target.value !== goal.desiredState && act((x) => updateGoal(x, goal.id, { desiredState: e.target.value }))} /></label>
                </div>
                <ConceptPicker g={g} value={goal.loIds} onChange={(ids) => act((x) => updateGoal(x, goal.id, { loIds: ids }, L("Topics changed", "Konular değişti")))} />
                {d.domains.map((dom) => (
                  <div key={dom.domain} className="stack" style={{ gap: 4 }}>
                    <span className="eyebrow">{dom.label}</span>
                    {dom.concepts.map((c) => (
                      <button key={c.loId} className="list-item small" style={{ textAlign: "left" }} onClick={() => navigate(`/graph?lo=${encodeURIComponent(c.loId)}`)}>
                        <span className="grow stack" style={{ gap: 0, minWidth: 0 }}>
                          <span className="truncate">{c.target ? "◆ " : ""}{c.title}</span>
                          <span className="tiny muted truncate">{c.capabilities[0]}{c.capabilities.length > 1 ? L(` +${c.capabilities.length - 1} capabilities`, ` +${c.capabilities.length - 1} yetenek`) : ""} · {c.milestoneIds.length ? L(`${c.milestoneIds.length} milestones`, `${c.milestoneIds.length} adım`) : L("not planned yet", "henüz planlanmadı")} · {c.evidence ? L(`${c.evidence} evidence`, `${c.evidence} kanıt`) : L("no evidence", "kanıt yok")}</span>
                        </span>
                        <span className="mono tiny">{pctText(c.verified)}</span>
                      </button>
                    ))}
                  </div>
                ))}
                <div className="row" style={{ gap: 6 }}>
                  <button className="btn small primary" disabled={!goal.loIds.length} onClick={() => { try { act((x) => pathForGoal(x, g, goal.id)); navigate("/graph?view=rota"); } catch (e) { toast(e instanceof Error ? e.message : String(e), "error"); } }}>{L("Plan a path", "Rota planla")}</button>
                  <select className="input small" style={{ width: "auto", minHeight: 36 }} value={goal.status} onChange={(e) => act((x) => updateGoal(x, goal.id, { status: e.target.value as typeof goal.status }, L("Status changed", "Durum değişti")))} aria-label={L("Status", "Durum")}>
                    {(["ACTIVE", "PAUSED", "ACHIEVED", "ARCHIVED"] as const).map((s) => <option key={s} value={s}>{GOAL_STATUS_LABEL(s)}</option>)}
                  </select>
                </div>
                <Versions versions={goal.versions} onRestore={(i) => act((x) => restoreVersion(x.academicGoals[goal.id], i, L("Restored an earlier version", "Önceki sürüm geri yüklendi")))} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Versions({ versions, onRestore }: { versions: { at: number; summary: string; snapshot: Record<string, unknown> }[]; onRestore: (i: number) => void }) {
  if (!versions.length) return null;
  return (
    <details>
      <summary className="tiny muted" style={{ cursor: "pointer" }}>{L(`History (${versions.length} changes)`, `Geçmiş (${versions.length} değişiklik)`)}</summary>
      <div className="stack" style={{ gap: 4, marginTop: 6 }}>
        {[...versions].map((v, i) => ({ v, i })).reverse().slice(0, 12).map(({ v, i }) => (
          <div key={i} className="row nowrap tiny">
            <span className="muted">{fmtDate(v.at)}</span>
            <span className="grow truncate">{v.summary} · {Object.keys(v.snapshot).join(", ")}</span>
            <button className="btn small ghost" onClick={() => onRestore(i)}>{L("Restore", "Geri yükle")}</button>
          </div>
        ))}
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

function Lines({ label, value, onSave }: { label: string; value: string[]; onSave: (v: string[]) => void }) {
  return (
    <label className="field"><span>{label}</span>
      <textarea className="textarea" style={{ minHeight: 60 }} defaultValue={value.join("\n")} onBlur={(e) => { const v = e.target.value.split("\n").map((x) => x.trim()).filter(Boolean); if (v.join("\n") !== value.join("\n")) onSave(v); }} placeholder={L("One per line", "Her satıra bir tane")} />
    </label>
  );
}

function Projects({ db, g, initial }: { db: LabDB; g: KnowledgeGraph; initial?: ID }) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ProjectKind>("PROJECT");
  const [open, setOpen] = useState<ID | null>(initial ?? null);
  const list = Object.values(db.projects).filter((p) => p.status !== "ARCHIVED" || p.id === open).sort((a, b) => b.updatedAt - a.updatedAt);
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="card row nowrap" style={{ gap: 6 }}>
        <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("New project, paper, presentation…", "Yeni proje, makale, sunum…")} aria-label={L("Project title", "Proje başlığı")} />
        <select className="input" style={{ width: "auto" }} value={kind} onChange={(e) => setKind(e.target.value as ProjectKind)} aria-label={L("Kind", "Tür")}>{PROJECT_KINDS.map((k) => <option key={k} value={k}>{PROJECT_LABEL(k)}</option>)}</select>
        <button className="btn primary" disabled={!title.trim()} onClick={() => { const p = act((d) => createProject(d, { title, kind })); setTitle(""); setOpen(p.id); }}><Icon.plus /></button>
      </div>
      {!list.length && <p className="small muted">{L("Projects collect what you build: questions, concepts, sources, experiments, results.", "Projeler ürettiklerini toplar: sorular, kavramlar, kaynaklar, deneyler, sonuçlar.")}</p>}
      {list.map((p) => {
        const o = projectOverview(db, p.id)!;
        const expanded = open === p.id;
        const upd = (patch: Parameters<typeof updateProject>[2], why?: string) => act((d) => updateProject(d, p.id, patch, why));
        return (
          <section key={p.id} className="card stack" style={{ gap: 8 }}>
            <button className="row between nowrap" style={{ background: "none", border: 0, color: "inherit", padding: 0, cursor: "pointer", textAlign: "left" }} onClick={() => setOpen(expanded ? null : p.id)}>
              <span className="stack" style={{ gap: 2 }}>
                <span className="serif" style={{ fontSize: "1.05rem" }}>{p.title}</span>
                <span className="tiny muted">{PROJECT_LABEL(p.kind)} · {PROJECT_STATUS_LABEL(p.status)} · {L(`${o.artifacts.length} artifacts`, `${o.artifacts.length} eser`)}</span>
              </span>
              {expanded ? <Icon.up /> : <Icon.down />}
            </button>
            {expanded && (
              <div className="stack" style={{ gap: 10 }}>
                <label className="field"><span>{L("Goal", "Amaç")}</span><input className="input" defaultValue={p.goal} onBlur={(e) => e.target.value !== p.goal && upd({ goal: e.target.value })} /></label>
                <Lines label={L("Questions", "Sorular")} value={p.questions} onSave={(v) => upd({ questions: v })} />
                <ConceptPicker g={g} value={p.loIds} onChange={(ids) => upd({ loIds: ids }, L("Concepts changed", "Kavramlar değişti"))} />
                <label className="field"><span>{L("Notes", "Notlar")}</span><textarea className="textarea" defaultValue={p.notes} onBlur={(e) => e.target.value !== p.notes && upd({ notes: e.target.value })} /></label>
                <label className="field"><span>{L("Results", "Sonuçlar")}</span><textarea className="textarea" style={{ minHeight: 60 }} defaultValue={p.results} onBlur={(e) => e.target.value !== p.results && upd({ results: e.target.value })} /></label>
                <Lines label={L("Next questions", "Sonraki sorular")} value={p.nextQuestions} onSave={(v) => upd({ nextQuestions: v })} />
                <div className="stack" style={{ gap: 4 }}>
                  <span className="eyebrow">{L("Linked", "Bağlı")}</span>
                  <select className="input small" value="" onChange={(e) => e.target.value && upd({ researchIds: [...p.researchIds, e.target.value] })} aria-label={L("Link research", "Araştırma bağla")}>
                    <option value="">{L("+ link a research project…", "+ bir araştırma projesi bağla…")}</option>
                    {Object.values(db.research).filter((r) => !p.researchIds.includes(r.id)).map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                  <select className="input small" value="" onChange={(e) => e.target.value && upd({ sourceIds: [...p.sourceIds, e.target.value] })} aria-label={L("Link source", "Kaynak bağla")}>
                    <option value="">{L("+ link a source…", "+ bir kaynak bağla…")}</option>
                    {Object.values(db.sources).filter((s) => !p.sourceIds.includes(s.id)).map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                  <select className="input small" value="" onChange={(e) => e.target.value && upd({ experimentIds: [...p.experimentIds, e.target.value] })} aria-label={L("Link experiment", "Deney bağla")}>
                    <option value="">{L("+ link a Focus Lab experiment…", "+ bir Focus Lab deneyi bağla…")}</option>
                    {Object.values(db.experiments).filter((x) => !p.experimentIds.includes(x.id)).map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
                  </select>
                  {[...o.research.map((r) => [L("Research", "Araştırma"), r.title, `/study?tab=research&res=${r.id}`]), ...o.sources.map((s) => [L("Source", "Kaynak"), s.title, ""]), ...o.experiments.map((x) => [L("Experiment", "Deney"), x.title, "/focus"])].map(([k, t, href], i) => (
                    <div key={i} className="row nowrap small"><span className="chip">{k}</span><span className="grow truncate">{t}</span>{href && <button className="btn small ghost" onClick={() => navigate(href)}><Icon.arrow /></button>}</div>
                  ))}
                </div>
                <ArtifactForm projectId={p.id} loIds={p.loIds} />
                {o.artifacts.map((a) => <div key={a.id} className="row nowrap small"><span className="chip">{ARTIFACT_LABEL(a.kind)}</span><span className="grow truncate">{a.title}</span></div>)}
                <div className="row" style={{ gap: 6 }}>
                  <select className="input small" style={{ width: "auto", minHeight: 36 }} value={p.status} onChange={(e) => upd({ status: e.target.value as typeof p.status }, L("Status changed", "Durum değişti"))} aria-label={L("Status", "Durum")}>
                    {(["ACTIVE", "PAUSED", "DONE", "ARCHIVED"] as const).map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABEL(s)}</option>)}
                  </select>
                </div>
                <Versions versions={p.versions} onRestore={(i) => act((d) => restoreVersion(d.projects[p.id], i, L("Restored an earlier version", "Önceki sürüm geri yüklendi")))} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function ArtifactForm({ projectId, loIds }: { projectId?: ID; loIds?: string[] }) {
  const [kind, setKind] = useState<ArtifactKind>("DERIVATION");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  if (!open) return <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => setOpen(true)}><Icon.plus /> {L("Add something you made", "Ürettiğin bir şeyi ekle")}</button>;
  return (
    <div className="card raised stack" style={{ gap: 6 }}>
      <div className="row nowrap" style={{ gap: 6 }}>
        <select className="input" style={{ width: "auto" }} value={kind} onChange={(e) => setKind(e.target.value as ArtifactKind)} aria-label={L("Kind", "Tür")}>{ARTIFACT_KINDS.map((k) => <option key={k} value={k}>{ARTIFACT_LABEL(k)}</option>)}</select>
        <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("Title", "Başlık")} aria-label={L("Title", "Başlık")} />
      </div>
      <textarea className="textarea" value={body} onChange={(e) => setBody(e.target.value)} placeholder={L("The derivation, proof, code, result… (optional)", "Türetme, ispat, kod, sonuç… (isteğe bağlı)")} aria-label={L("Content", "İçerik")} />
      <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={L("Link (optional)", "Bağlantı (isteğe bağlı)")} aria-label="URL" />
      <div className="row" style={{ gap: 6 }}>
        <button className="btn small primary" disabled={!title.trim()} onClick={() => { act((d) => saveArtifact(d, { kind, title, body, url: url || undefined, projectId, loIds })); setTitle(""); setBody(""); setUrl(""); setOpen(false); toast(L("Saved to your portfolio.", "Portfolyona kaydedildi.")); }}>{L("Save", "Kaydet")}</button>
        <button className="btn small ghost" onClick={() => setOpen(false)}>{L("Cancel", "Vazgeç")}</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------

function Journal({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const [kind, setKind] = useState<JournalKind>("IDEA");
  const [text, setText] = useState("");
  const [los, setLos] = useState<string[]>([]);
  const [filter, setFilter] = useState<JournalKind | "">("");
  const list = Object.values(db.journal).filter((j) => !filter || j.kind === filter).sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="card stack" style={{ gap: 8 }}>
        <div className="seg small" role="radiogroup" aria-label={L("Kind", "Tür")}>
          {JOURNAL_KINDS.map((k) => <button key={k} role="radio" aria-checked={kind === k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{JOURNAL_LABEL(k)}</button>)}
        </div>
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder={L("An idea, an insight, a question, a confusion…", "Bir fikir, bir içgörü, bir soru, bir kafa karışıklığı…")} aria-label={L("Journal entry", "Günlük kaydı")} />
        <ConceptPicker g={g} value={los} onChange={setLos} />
        <button className="btn small primary" style={{ alignSelf: "flex-start" }} disabled={!text.trim()} onClick={() => { act((d) => addJournal(d, { kind, text, loIds: los })); setText(""); setLos([]); }}>{L("Save", "Kaydet")}</button>
      </div>
      <select className="input small" style={{ width: "auto" }} value={filter} onChange={(e) => setFilter(e.target.value as JournalKind | "")} aria-label={L("Filter", "Filtre")}>
        <option value="">{L("All entries", "Tüm kayıtlar")}</option>
        {JOURNAL_KINDS.map((k) => <option key={k} value={k}>{JOURNAL_LABEL(k)}</option>)}
      </select>
      {!list.length && <p className="small muted">{L("Nothing here yet.", "Burada henüz bir şey yok.")}</p>}
      {list.map((j) => (
        <article key={j.id} className="card stack" style={{ gap: 4 }}>
          <div className="row between nowrap"><span className="eyebrow">{JOURNAL_LABEL(j.kind)}</span><span className="tiny muted">{fmtDate(j.createdAt)}</span></div>
          <p className="small" style={{ margin: 0, whiteSpace: "pre-wrap" }}>{j.text}</p>
          <div className="row" style={{ gap: 4 }}>
            {j.loIds.map((id) => <button key={id} className="chip" onClick={() => navigate(`/graph?lo=${encodeURIComponent(id)}`)}>{g.objects[id]?.title ?? id}</button>)}
            <span className="grow" />
            <button className="btn small ghost" onClick={() => confirm(L("Delete this entry?", "Bu kayıt silinsin mi?")) && act((d) => deleteJournal(d, j.id))} aria-label={L("Delete", "Sil")}><Icon.close /></button>
          </div>
        </article>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

function Portfolio({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const items = portfolio(db);
  return (
    <div className="stack" style={{ gap: 12 }}>
      <p className="small text-2">{L("Everything you produced: derivations, proofs, simulations, results, papers, presentations, concluded experiments.", "Ürettiğin her şey: türetmeler, ispatlar, simülasyonlar, sonuçlar, makaleler, sunumlar, tamamlanan deneyler.")}</p>
      <ArtifactForm />
      {!items.length && <p className="small muted">{L("Your portfolio is empty. Save a sandbox run, a research result or an explanation — or add something you made.", "Portfolyon boş. Bir sandbox çalıştırması, bir araştırma sonucu ya da bir açıklama kaydet — ya da ürettiğin bir şeyi ekle.")}</p>}
      {items.map((it) => {
        const a = it.kind === "ARTIFACT" ? db.artifacts[it.id] : undefined;
        return (
          <article key={`${it.kind}:${it.id}`} className="card stack" style={{ gap: 4 }}>
            <div className="row between nowrap">
              <span className="eyebrow">{a ? ARTIFACT_LABEL(a.kind) : it.kind === "PROJECT" ? PROJECT_LABEL(db.projects[it.id].kind) : it.kind === "RESEARCH" ? L("Research", "Araştırma") : L("Experiment", "Deney")}</span>
              <span className="tiny muted">{fmtDate(it.at)}</span>
            </div>
            <strong>{it.title}</strong>
            {a?.body && <p className="small text-2" style={{ margin: 0, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "hidden" }}>{a.body}</p>}
            {a?.url && <a className="small" href={a.url} target="_blank" rel="noreferrer">{a.url}</a>}
            <div className="row" style={{ gap: 4 }}>
              {a?.loIds.map((id) => <span key={id} className="chip">{g.objects[id]?.title ?? id}</span>)}
              <span className="grow" />
              {it.kind === "PROJECT" && <button className="btn small ghost" onClick={() => navigate(`/work?tab=projects&id=${it.id}`)}><Icon.arrow /></button>}
              {it.kind === "RESEARCH" && <button className="btn small ghost" onClick={() => navigate(`/study?tab=research&res=${it.id}`)}><Icon.arrow /></button>}
              {a && <button className="btn small ghost" onClick={() => confirm(L("Remove from the portfolio?", "Portfolyodan kaldırılsın mı?")) && act((d) => deleteArtifact(d, a.id))} aria-label={L("Delete", "Sil")}><Icon.close /></button>}
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// School
// ---------------------------------------------------------------------------

function School({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<SchoolSubjectKind>("SCHOOL");
  const [year, setYear] = useState("");
  const subjects = Object.values(db.schoolSubjects).filter((s) => !s.archived).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="stack" style={{ gap: 12 }}>
      <p className="small text-2">{L("School, AP and competition subjects with grades. They link to the graph by topic; nothing here changes the graph, and a new school year resets nothing.", "Notlarıyla okul, AP ve yarışma dersleri. Grafiğe konu üzerinden bağlanırlar; burada hiçbir şey grafiği değiştirmez ve yeni bir okul yılı hiçbir şeyi sıfırlamaz.")}</p>
      <div className="card row" style={{ gap: 6 }}>
        <input className="input grow" value={name} onChange={(e) => setName(e.target.value)} placeholder={L("Subject, e.g. AP Physics C", "Ders, ör. AP Physics C")} aria-label={L("Subject", "Ders")} />
        <select className="input" style={{ width: "auto" }} value={kind} onChange={(e) => setKind(e.target.value as SchoolSubjectKind)} aria-label={L("Kind", "Tür")}>{SCHOOL_SUBJECT_KINDS.map((k) => <option key={k} value={k}>{SUBJECT_KIND_LABEL(k)}</option>)}</select>
        <input className="input" style={{ width: 110 }} value={year} onChange={(e) => setYear(e.target.value)} placeholder={L("Year", "Yıl")} aria-label={L("Year", "Yıl")} />
        <button className="btn primary" disabled={!name.trim()} onClick={() => { act((d) => addSchoolSubject(d, { name, kind, year })); setName(""); }}><Icon.plus /></button>
      </div>
      {subjects.map((s) => <SubjectCard key={s.id} id={s.id} db={db} g={g} />)}
      <button className="btn small ghost" style={{ alignSelf: "flex-start" }} onClick={() => navigate("/study?tab=exams")}>{L("Exams and deadlines", "Sınavlar ve son tarihler")} <Icon.arrow /></button>
    </div>
  );
}

function SubjectCard({ id, db, g }: { id: ID; db: LabDB; g: KnowledgeGraph }) {
  const s = subjectSummary(db, id)!;
  const [title, setTitle] = useState("");
  const [score, setScore] = useState("");
  const [outOf, setOutOf] = useState("100");
  return (
    <section className="card stack" style={{ gap: 8 }}>
      <div className="row between nowrap">
        <span className="stack" style={{ gap: 2 }}><strong>{s.subject.name}</strong><span className="tiny muted">{SUBJECT_KIND_LABEL(s.subject.kind)}{s.subject.year ? ` · ${s.subject.year}` : ""}{s.upcoming ? L(` · ${s.upcoming} upcoming`, ` · ${s.upcoming} yaklaşan`) : ""}</span></span>
        <span className="stack" style={{ gap: 0, alignItems: "flex-end" }}>
          <span className="mono small">{s.average === null ? "—" : pctText(s.average)}</span>
          <span className="tiny muted">{L("grades", "notlar")}</span>
        </span>
      </div>
      {s.subject.kind === "COMPETITION" && (() => { const c = competitionReport(db, g, s.subject.loIds.length ? s.subject.loIds : undefined); return c.attempts ? <span className="tiny text-2">{L(`Competition practice: ${c.attempts} attempts · first-try ${c.accuracy === null ? "—" : pctText(c.accuracy)} · median ${c.medianSeconds === null ? "—" : `${Math.round(c.medianSeconds)} s`} · hardest ${c.hardestSolved ?? "—"}/5`, `Yarışma pratiği: ${c.attempts} deneme · ilk deneme ${c.accuracy === null ? "—" : pctText(c.accuracy)} · medyan ${c.medianSeconds === null ? "—" : `${Math.round(c.medianSeconds)} sn`} · en zor ${c.hardestSolved ?? "—"}/5`)}</span> : null; })()}
      {s.mastery !== null && <span className="tiny text-2">{L(`Verified mastery of its topics: ${pctText(s.mastery)} — grades and mastery are kept apart.`, `Konularındaki doğrulanmış ustalık: ${pctText(s.mastery)} — notlar ve ustalık ayrı tutulur.`)}</span>}
      <ConceptPicker g={g} value={s.subject.loIds} onChange={(ids) => act((d) => { d.schoolSubjects[id].loIds = ids; })} />
      {s.grades.map((gr) => (
        <div key={gr.id} className="row nowrap small"><span className="grow truncate">{gr.title}</span><span className="mono">{gr.score}/{gr.outOf}{gr.weight ? ` ×${gr.weight}` : ""}</span><button className="btn small ghost" onClick={() => act((d) => deleteGrade(d, gr.id))} aria-label={L("Delete", "Sil")}><Icon.close /></button></div>
      ))}
      <div className="row nowrap" style={{ gap: 6 }}>
        <input className="input grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L("Grade, e.g. Midterm", "Not, ör. Ara sınav")} aria-label={L("Grade title", "Not başlığı")} />
        <input className="input mono" style={{ width: 70 }} inputMode="decimal" value={score} onChange={(e) => setScore(e.target.value)} placeholder="85" aria-label={L("Score", "Puan")} />
        <input className="input mono" style={{ width: 70 }} inputMode="decimal" value={outOf} onChange={(e) => setOutOf(e.target.value)} aria-label={L("Out of", "Üzerinden")} />
        <button className="btn small" disabled={!score} onClick={() => { try { act((d) => addGrade(d, { subjectId: id, title, score: Number(score.replace(",", ".")), outOf: Number(outOf.replace(",", ".")) })); setTitle(""); setScore(""); } catch (e) { toast(e instanceof Error ? e.message : String(e), "error"); } }}><Icon.plus /></button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Timeline and yearly reflection
// ---------------------------------------------------------------------------

const TL_LABEL = (k: TimelineKind) => ({ CONCEPT: L("Learned", "Öğrenildi"), CHECK: L("Shown in a check", "Kontrolde gösterildi"), PROJECT: L("Project", "Proje"), RESEARCH: L("Research result", "Araştırma sonucu"), ARTIFACT: L("Made", "Üretildi"), DOMAIN: L("New field", "Yeni alan"), EXAM: L("Exam", "Sınav"), GOAL: L("Goal", "Hedef") })[k];

function Timeline({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const years = [...new Set(db.events.map((e) => new Date(e.at).getFullYear()))].sort((a, b) => b - a);
  const [year, setYear] = useState(years[0] ?? new Date().getFullYear());
  const items = timeline(db, g, new Date(year, 0, 1).getTime(), new Date(year + 1, 0, 1).getTime() - 1);
  const y = yearlyReflection(db, g, year);
  const months = new Map<string, typeof items>();
  for (const it of items) {
    const k = fmtDate(it.at, { month: "long", year: "numeric" });
    months.set(k, [...(months.get(k) ?? []), it]);
  }
  return (
    <div className="stack" style={{ gap: 12 }}>
      {years.length > 1 && <select className="input small" style={{ width: "auto" }} value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label={L("Year", "Yıl")}>{years.map((x) => <option key={x} value={x}>{x}</option>)}</select>}
      <section className="card stack" style={{ gap: 6 }}>
        <h2>{L(`What I learned in ${year}`, `${year} yılında ne öğrendim`)}</h2>
        {y.empty ? <p className="small muted">{L("Not enough data yet for this year.", "Bu yıl için henüz yeterli veri yok.")}</p> : (
          <ul className="small text-2 tight">
            <li>{L(`${y.newConcepts.length} new concepts`, `${y.newConcepts.length} yeni kavram`)}{y.checksPassed ? L(` (${y.checksPassed} shown in short checks)`, ` (${y.checksPassed} tanesi kısa kontrollerde gösterildi)`) : ""}</li>
            {y.newDomains.length > 0 && <li>{y.newDomains.join(", ")}</li>}
            {y.transferSolved > 0 && <li>{L(`${y.transferSolved} transfer problems solved`, `${y.transferSolved} transfer problemi çözüldü`)}</li>}
            {(y.projects || y.researchResults || y.artifacts) > 0 && <li>{L(`${y.projects} projects · ${y.researchResults} research results · ${y.artifacts} artifacts`, `${y.projects} proje · ${y.researchResults} araştırma sonucu · ${y.artifacts} eser`)}</li>}
            {y.discoveries > 0 && <li>{L(`${y.discoveries} discoveries opened`, `${y.discoveries} keşif açıldı`)}</li>}
            {y.strongest.length > 0 && <li>{L("Strongest areas: ", "En güçlü alanlar: ")}{y.strongest.map((s) => `${s.label} (${pctText(s.meanVerified)})`).join(", ")}</li>}
            {y.recurringWeaknesses.length > 0 && <li>{L("Recurring weak spots: ", "Tekrarlayan zayıf noktalar: ")}{y.recurringWeaknesses.slice(0, 3).join(" · ")}</li>}
          </ul>
        )}
      </section>
      {[...months].reverse().map(([m, its]) => (
        <section key={m} className="stack" style={{ gap: 4 }}>
          <span className="eyebrow">{m}</span>
          <div className="timeline">
            {its.map((it, i) => (
              <div key={i} className={`tl-item k-${it.kind}`}>
                <span className="tiny muted">{TL_LABEL(it.kind)}</span>
                <span className="small">{it.title}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
