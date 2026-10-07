import { useMemo, useState } from "react";
import type { ID, InteractionType, Milestone, MilestoneType } from "../../domain/types";
import { INTERACTION_TYPES, MILESTONE_TYPES } from "../../domain/types";
import {
  addMilestone, addTopic, addUnit, connectPrerequisite, courseMilestones, courseUnits, deleteCourse, deleteMilestone,
  mergeMilestones, milestoneQuestions, prereqMap, removePrerequisite, reorderMilestone, splitMilestone, unitTopics,
  updateMilestone, type SplitPart,
} from "../../engines/curriculum";
import { dependsOn } from "../../engines/graph";
import { replaceTopicMilestones, sanitizeQuestion, type MilestoneSpec } from "../../engines/curriculumSpec";
import { grantMastery, revokeMastery, skipMilestone, unskipMilestone } from "../../engines/progress";
import { generateQuestionsAI, generateTopicMilestonesAI, splitMilestoneAI } from "../../ai/curriculumAI";
import { addQuestion } from "../../engines/curriculum";
import { aiHost, navigate, store, toast, useAsync, useDB } from "../state";
import { editCurriculum } from "../editing";
import { Difficulty, Icon, Sheet, StatusChip, TYPE_LABEL, minutes } from "../components/common";

export function CurriculumEditor({ courseId }: { courseId: ID }) {
  const db = useDB();
  const course = db.courses[courseId];
  const [selected, setSelected] = useState<Set<ID>>(new Set());
  const [editing, setEditing] = useState<ID | null>(null);
  const [regenTopic, setRegenTopic] = useState<ID | null>(null);
  const [mergeTitle, setMergeTitle] = useState("");
  const ordered = courseMilestones(db, courseId);
  const indexOf = (id: ID) => ordered.findIndex((m) => m.id === id);

  const toggle = (id: ID) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const merge = () => {
    const ids = ordered.filter((m) => selected.has(m.id)).map((m) => m.id);
    const r = editCurriculum(courseId, "merge", (d) => mergeMilestones(d, ids, mergeTitle), `Merged ${ids.length} milestones.`);
    if (r) {
      setSelected(new Set());
      setMergeTitle("");
    }
  };

  const addNewMilestone = (topicId: ID) => {
    const m = editCurriculum(courseId, "add", (d) => {
      const inTopic = courseMilestones(d, courseId).filter((x) => x.topicId === topicId);
      const last = inTopic[inTopic.length - 1];
      return addMilestone(d, { title: "New milestone", topicId, prerequisites: last ? [last.id] : [] });
    });
    if (m) setEditing(m.id);
  };

  return (
    <div className="stack">
      <div className="banner info small">Everything here is yours to change. Edits that would create a prerequisite loop or a dead end are refused, so the map always stays playable.</div>
      {selected.size >= 2 && (
        <div className="card accent row" style={{ position: "sticky", top: 8, zIndex: 5 }}>
          <span className="small">{selected.size} selected</span>
          <input className="input grow" placeholder="Merged title (optional)" value={mergeTitle} onChange={(e) => setMergeTitle(e.target.value)} style={{ minWidth: 160 }} />
          <button className="btn primary small" onClick={merge}>Merge</button>
          <button className="btn ghost small" onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}
      {courseUnits(db, courseId).map((u) => (
        <section key={u.id} className="card stack" style={{ gap: 10 }}>
          <InlineTitle value={u.title} onSave={(t) => editCurriculum(courseId, "rename-unit", (d) => void (d.units[u.id].title = t))} className="serif" style={{ fontSize: "1.15rem" }} />
          {unitTopics(db, u.id).map((t) => {
            const ms = ordered.filter((m) => m.topicId === t.id);
            return (
              <div key={t.id} className="stack" style={{ gap: 4 }}>
                <div className="row between nowrap">
                  <InlineTitle value={t.title} onSave={(v) => editCurriculum(courseId, "rename-topic", (d) => void (d.topics[t.id].title = v))} className="small text-2" style={{ fontWeight: 650 }} />
                  <div className="row nowrap" style={{ gap: 4 }}>
                    <button className="btn ghost small" onClick={() => setRegenTopic(t.id)} title="Regenerate this topic with AI"><Icon.spark /> Regenerate</button>
                    <button className="btn ghost small" onClick={() => addNewMilestone(t.id)} aria-label="Add milestone"><Icon.plus /></button>
                  </div>
                </div>
                <div className="list">
                  {ms.map((m) => (
                    <div key={m.id} className="list-item" style={{ paddingLeft: 0 }}>
                      <input type="checkbox" aria-label={`Select ${m.title}`} checked={selected.has(m.id)} onChange={() => toggle(m.id)} style={{ width: 20, height: 20, flex: "none" }} />
                      <button className="grow" onClick={() => setEditing(m.id)} style={{ background: "none", border: 0, textAlign: "left", padding: 0, cursor: "pointer", minWidth: 0 }}>
                        <div className="truncate">{m.title}</div>
                        <div className="row tiny muted" style={{ gap: 8, marginTop: 2 }}>
                          <span>{TYPE_LABEL[m.milestoneType]}</span><Difficulty value={m.difficulty} /><span>{minutes(m.estimatedDuration)}</span>
                          {m.optional && <span>optional</span>}
                          <span>{milestoneQuestions(db, m.id).length} q</span>
                        </div>
                      </button>
                      <StatusChip status={m.status} />
                      <div className="row nowrap" style={{ gap: 0 }}>
                        <button className="btn ghost small" aria-label="Move earlier" onClick={() => editCurriculum(courseId, "reorder", (d) => reorderMilestone(d, m.id, indexOf(m.id) - 1))}><Icon.up /></button>
                        <button className="btn ghost small" aria-label="Move later" onClick={() => editCurriculum(courseId, "reorder", (d) => reorderMilestone(d, m.id, indexOf(m.id) + 1))}><Icon.down /></button>
                      </div>
                    </div>
                  ))}
                  {!ms.length && <div className="small muted" style={{ padding: 8 }}>No milestones — add one or regenerate.</div>}
                </div>
              </div>
            );
          })}
          <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => editCurriculum(courseId, "add-topic", (d) => addTopic(d, u.id, "New topic"))}><Icon.plus /> Topic</button>
        </section>
      ))}
      <div className="row">
        <button className="btn" onClick={() => editCurriculum(courseId, "add-unit", (d) => { const unit = addUnit(d, courseId, "New unit"); addTopic(d, unit.id, "New topic"); })}><Icon.plus /> Unit</button>
        <span className="grow" />
        <button className="btn danger" onClick={() => {
          if (confirm(`Delete "${course.title}" and its curriculum? Your raw learning history is kept.`)) {
            store.transact((d) => deleteCourse(d, courseId));
            navigate("/");
          }
        }}>Delete course</button>
      </div>
      {editing && db.milestones[editing] && <MilestoneSheet milestone={db.milestones[editing]} onClose={() => setEditing(null)} />}
      {regenTopic && <RegenerateTopicSheet topicId={regenTopic} onClose={() => setRegenTopic(null)} />}
    </div>
  );
}

function InlineTitle({ value, onSave, className, style }: { value: string; onSave: (v: string) => void; className?: string; style?: React.CSSProperties }) {
  const [edit, setEdit] = useState(false);
  const [v, setV] = useState(value);
  if (!edit) return <button className={className} style={{ ...style, background: "none", border: 0, padding: 0, textAlign: "left", cursor: "text", color: "inherit" }} onClick={() => { setV(value); setEdit(true); }}>{value}</button>;
  const commit = () => {
    setEdit(false);
    if (v.trim() && v.trim() !== value) onSave(v.trim());
  };
  return <input className="input" autoFocus value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()} />;
}

export function MilestoneSheet({ milestone: m, onClose }: { milestone: Milestone; onClose: () => void }) {
  const db = useDB();
  const courseId = m.courseId;
  const [form, setForm] = useState({
    title: m.title, learningObjective: m.learningObjective, description: m.description, milestoneType: m.milestoneType,
    difficulty: m.difficulty, estimatedDuration: m.estimatedDuration, optional: m.optional,
    recommendedInteractionType: m.recommendedInteractionType, mastery: m.masteryCriteria.description, requiredCorrect: m.masteryCriteria.requiredCorrect,
    topicId: m.topicId,
  });
  const [split, setSplit] = useState<SplitPart[] | null>(null);
  const { busy, run } = useAsync();
  const others = courseMilestones(db, courseId).filter((x) => x.id !== m.id);
  const pm = useMemo(() => prereqMap(db, courseId), [db, courseId]);
  const questions = milestoneQuestions(db, m.id);
  const topics = courseUnits(db, courseId).flatMap((u) => unitTopics(db, u.id).map((t) => ({ ...t, unit: u.title })));

  const save = () => {
    const ok = editCurriculum(courseId, "edit", (d) => updateMilestone(d, m.id, {
      title: form.title, learningObjective: form.learningObjective, description: form.description, milestoneType: form.milestoneType,
      difficulty: form.difficulty, estimatedDuration: form.estimatedDuration, optional: form.optional, required: !form.optional,
      recommendedInteractionType: form.recommendedInteractionType, topicId: form.topicId,
      masteryCriteria: { ...m.masteryCriteria, description: form.mastery, requiredCorrect: Math.max(1, form.requiredCorrect) },
    }), "Saved.");
    if (ok) onClose();
  };

  const togglePrereq = (p: ID, on: boolean) =>
    editCurriculum(courseId, on ? "connect" : "disconnect", (d) => (on ? connectPrerequisite(d, m.id, p) : removePrerequisite(d, m.id, p)));

  const proposeSplit = () => run(async () => {
    const res = await splitMilestoneAI(aiHost, m);
    if (res.fallbackUsed) toast("Using an offline split (concept → practice → application). Edit the titles before confirming.");
    setSplit(res.value);
  });

  const doSplit = () => {
    if (!split) return;
    const ok = editCurriculum(courseId, "split", (d) => splitMilestone(d, m.id, split.filter((p) => p.title.trim())), `Split into ${split.length}.`);
    if (ok) onClose();
  };

  const genQuestions = () => run(async () => {
    const res = await generateQuestionsAI(aiHost, store.state, m);
    editCurriculum(courseId, "questions", (d) => {
      const repairs: string[] = [];
      for (const q of res.value) {
        const clean = sanitizeQuestion(q, m.id, m.recommendedInteractionType, res.provider, repairs);
        if (clean) addQuestion(d, clean);
      }
    }, res.fallbackUsed ? "Added rubric-based practice prompts (offline)." : `Added ${res.value.length} questions.`);
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });

  if (split) {
    return (
      <Sheet title="Split milestone" onClose={() => setSplit(null)}>
        <div className="stack">
          <p className="small text-2">Each part should be a meaningful achievement. The first part keeps your history; the last part keeps the outgoing connections.</p>
          {split.map((p, i) => (
            <div key={i} className="card raised stack" style={{ gap: 6 }}>
              <input className="input" value={p.title} onChange={(e) => setSplit(split.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
              <span className="tiny muted">{p.learningObjective}</span>
            </div>
          ))}
          <div className="row">
            <button className="btn" onClick={() => setSplit([...split, { title: "New part" }])}><Icon.plus /> Part</button>
            {split.length > 2 && <button className="btn" onClick={() => setSplit(split.slice(0, -1))}>Remove last</button>}
            <button className="btn primary grow" onClick={doSplit}>Split</button>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="Edit milestone" onClose={onClose}>
      <div className="stack">
        <div className="field"><label htmlFor="ms-f1">Title</label>
            <input id="ms-f1" className="input" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="field"><label htmlFor="ms-f2">After this, the student can…</label>
            <textarea id="ms-f2" className="textarea" style={{ minHeight: 70 }} value={form.learningObjective} onChange={(e) => set("learningObjective", e.target.value)} /></div>
        <div className="field"><label htmlFor="ms-f3">Mastery criterion</label>
            <input id="ms-f3" className="input" value={form.mastery} onChange={(e) => set("mastery", e.target.value)} /></div>
        <div className="grid-2">
          <div className="field"><label htmlFor="ms-f4">Type</label>
            <select id="ms-f4" className="select" value={form.milestoneType} onChange={(e) => set("milestoneType", e.target.value as MilestoneType)}>
              {MILESTONE_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select></div>
          <div className="field"><label htmlFor="ms-f5">Interaction</label>
            <select id="ms-f5" className="select" value={form.recommendedInteractionType} onChange={(e) => set("recommendedInteractionType", e.target.value as InteractionType)}>
              {INTERACTION_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ").toLowerCase()}</option>)}
            </select></div>
          <div className="field"><label htmlFor="ms-f6">Difficulty (1–5)</label>
            <input id="ms-f6" className="input" type="number" min={1} max={5} value={form.difficulty} onChange={(e) => set("difficulty", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="ms-f7">Estimated minutes</label>
            <input id="ms-f7" className="input" type="number" min={2} value={form.estimatedDuration} onChange={(e) => set("estimatedDuration", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="ms-f8">Correct answers for mastery</label>
            <input id="ms-f8" className="input" type="number" min={1} max={10} value={form.requiredCorrect} onChange={(e) => set("requiredCorrect", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="ms-f9">Topic</label>
            <select id="ms-f9" className="select" value={form.topicId} onChange={(e) => set("topicId", e.target.value)}>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.unit} · {t.title}</option>)}
            </select></div>
        </div>
        <label className="row nowrap"><input type="checkbox" checked={form.optional} onChange={(e) => set("optional", e.target.checked)} style={{ width: 20, height: 20 }} /> Optional (a side branch; not required for the course goal)</label>
        <button className="btn primary" onClick={save}>Save changes</button>

        <hr className="sep" />
        <h3>Prerequisites</h3>
        <div className="list" style={{ maxHeight: 260, overflow: "auto" }}>
          {others.map((o) => {
            const on = m.prerequisites.includes(o.id);
            const wouldLoop = !on && dependsOn(pm, o.id, m.id);
            return (
              <label key={o.id} className="list-item small" style={{ opacity: wouldLoop ? 0.45 : 1, cursor: wouldLoop ? "not-allowed" : "pointer" }} title={wouldLoop ? "This milestone already depends on the current one" : undefined}>
                <input type="checkbox" checked={on} disabled={wouldLoop} onChange={(e) => togglePrereq(o.id, e.target.checked)} style={{ width: 20, height: 20 }} />
                <span className="grow">{o.title}</span>
                {wouldLoop && <span className="tiny muted">would loop</span>}
              </label>
            );
          })}
        </div>

        <hr className="sep" />
        <h3>Questions ({questions.length})</h3>
        <div className="list">
          {questions.map((q) => (
            <div key={q.id} className="list-item small">
              <span className="chip">{q.purpose.toLowerCase()}</span>
              <span className="grow truncate">{q.prompt}</span>
              <button className="btn ghost small" aria-label="Delete question" onClick={() => editCurriculum(courseId, "delete-question", (d) => void delete d.questions[q.id])}><Icon.close /></button>
            </div>
          ))}
        </div>
        <button className="btn" onClick={genQuestions} disabled={busy}>{busy ? <span className="spinner" /> : <Icon.spark />} Generate more questions</button>

        <hr className="sep" />
        <div className="row">
          <button className="btn" onClick={proposeSplit} disabled={busy}>Split…</button>
          {m.skippedAt
            ? <button className="btn" onClick={() => editCurriculum(courseId, "unskip", (d) => unskipMilestone(d, m.id))}>Unskip</button>
            : !m.masteredAt && <button className="btn" onClick={() => editCurriculum(courseId, "skip", (d) => skipMilestone(d, m.id))}>Skip</button>}
          {m.masteredAt
            ? <button className="btn" onClick={() => editCurriculum(courseId, "revoke", (d) => revokeMastery(d, m.id))}>Undo mastery</button>
            : <button className="btn" onClick={() => editCurriculum(courseId, "self-attest", (d) => void grantMastery(d, m.id, [], false, true), "Marked as mastered (self-attested).")}>I already know this</button>}
          <span className="grow" />
          <button className="btn danger" onClick={() => {
            if (confirm(`Delete "${m.title}"? Milestones after it will inherit its prerequisites.`)) {
              if (editCurriculum(courseId, "delete", (d) => deleteMilestone(d, m.id), "Deleted.") !== undefined) onClose();
            }
          }}>Delete</button>
        </div>
      </div>
    </Sheet>
  );
}

function RegenerateTopicSheet({ topicId, onClose }: { topicId: ID; onClose: () => void }) {
  const db = useDB();
  const topic = db.topics[topicId];
  const [instruction, setInstruction] = useState("");
  const [proposal, setProposal] = useState<MilestoneSpec[] | null>(null);
  const { busy, run } = useAsync();

  const generate = () => run(async () => {
    const res = await generateTopicMilestonesAI(aiHost, store.state, topicId, instruction);
    if (!res.value) {
      toast(res.error ? `AI unavailable (${res.error}). Use split, merge or add instead.` : "Topic regeneration needs an AI provider (Settings). You can still split, merge and add by hand.", "error");
      return;
    }
    setProposal(res.value);
  });

  const accept = () => {
    if (!proposal) return;
    const r = editCurriculum(topic.courseId, "regenerate-topic", (d) => replaceTopicMilestones(d, topicId, proposal, d.preferences.aiProvider), "Topic regenerated. Mastered milestones were kept.");
    if (r) onClose();
  };

  return (
    <Sheet title={`Regenerate “${topic.title}”`} onClose={onClose}>
      {!proposal ? (
        <div className="stack">
          <div className="field">
            <label>How should it change? (optional)</label>
            <textarea className="textarea" style={{ minHeight: 80 }} value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="e.g. smaller steps; more derivations; add an experiment" />
          </div>
          <p className="small muted">Mastered milestones in this topic are kept. Connections into and out of the topic are re-attached automatically.</p>
          <button className="btn primary" onClick={generate} disabled={busy}>{busy ? <><span className="spinner" /> Generating…</> : "Generate proposal"}</button>
        </div>
      ) : (
        <div className="stack">
          {proposal.map((p, i) => (
            <div key={i} className="card raised small"><strong>{p.title}</strong><div className="muted">{p.learningObjective}</div></div>
          ))}
          <div className="row"><button className="btn" onClick={() => setProposal(null)}>Back</button><button className="btn primary grow" onClick={accept}>Replace topic</button></div>
        </div>
      )}
    </Sheet>
  );
}
