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
import { calibrateDifficultyAI, difficultySignal } from "../../ai/tutor";
import { INTERACTION_TR } from "../../engines/statistics";
import { addQuestion } from "../../engines/curriculum";
import { aiHost, navigate, store, toast, useAsync, useDB } from "../state";
import { editCurriculum } from "../editing";
import { Difficulty, Icon, Sheet, StatusChip, TYPE_LABEL, minutes } from "../components/common";
import { L, pick } from "../../i18n";

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
    const r = editCurriculum(courseId, "merge", (d) => mergeMilestones(d, ids, mergeTitle), L(`Merged ${ids.length} milestones.`, `${ids.length} adım birleştirildi.`));
    if (r) {
      setSelected(new Set());
      setMergeTitle("");
    }
  };

  const addNewMilestone = (topicId: ID) => {
    const m = editCurriculum(courseId, "add", (d) => {
      const inTopic = courseMilestones(d, courseId).filter((x) => x.topicId === topicId);
      const last = inTopic[inTopic.length - 1];
      return addMilestone(d, { title: L("New milestone", "Yeni adım"), topicId, prerequisites: last ? [last.id] : [] });
    });
    if (m) setEditing(m.id);
  };

  return (
    <div className="stack">
      <div className="banner info small">{L("Everything here is yours to change. Edits that would create a prerequisite loop or a dead end are refused, so the map always stays playable.", "Buradaki her şeyi değiştirebilirsin. Ön koşul döngüsü ya da çıkmaz yaratacak düzenlemeler reddedilir; böylece harita her zaman oynanabilir kalır.")}</div>
      {selected.size >= 2 && (
        <div className="card accent row" style={{ position: "sticky", top: 8, zIndex: 5 }}>
          <span className="small">{selected.size} {L("selected", "seçildi")}</span>
          <input className="input grow" placeholder={L("Merged title (optional)", "Birleşik başlık (isteğe bağlı)")} value={mergeTitle} onChange={(e) => setMergeTitle(e.target.value)} style={{ minWidth: 160 }} />
          <button className="btn primary small" onClick={merge}>{L("Merge", "Birleştir")}</button>
          <button className="btn ghost small" onClick={() => setSelected(new Set())}>{L("Clear", "Temizle")}</button>
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
                    <button className="btn ghost small" onClick={() => setRegenTopic(t.id)} title={L("Regenerate this topic with AI", "Bu konuyu YZ ile yeniden oluştur")}><Icon.spark /> {L("Regenerate", "Yeniden oluştur")}</button>
                    <button className="btn ghost small" onClick={() => addNewMilestone(t.id)} aria-label={L("Add milestone", "Adım ekle")}><Icon.plus /></button>
                  </div>
                </div>
                <div className="list">
                  {ms.map((m) => (
                    <div key={m.id} className="list-item" style={{ paddingLeft: 0 }}>
                      <input type="checkbox" aria-label={L(`Select ${m.title}`, `Seç: ${m.title}`)} checked={selected.has(m.id)} onChange={() => toggle(m.id)} style={{ width: 20, height: 20, flex: "none" }} />
                      <button className="grow" onClick={() => setEditing(m.id)} style={{ background: "none", border: 0, textAlign: "left", padding: 0, cursor: "pointer", minWidth: 0 }}>
                        <div className="truncate">{m.title}</div>
                        <div className="row tiny muted" style={{ gap: 8, marginTop: 2 }}>
                          <span>{TYPE_LABEL[m.milestoneType]}</span><Difficulty value={m.difficulty} /><span>{minutes(m.estimatedDuration)}</span>
                          {m.optional && <span>{L("optional", "isteğe bağlı")}</span>}
                          <span>{milestoneQuestions(db, m.id).length} {L("q", "soru")}</span>
                        </div>
                      </button>
                      <StatusChip status={m.status} />
                      <div className="row nowrap" style={{ gap: 0 }}>
                        <button className="btn ghost small" aria-label={L("Move earlier", "Öne al")} onClick={() => editCurriculum(courseId, "reorder", (d) => reorderMilestone(d, m.id, indexOf(m.id) - 1))}><Icon.up /></button>
                        <button className="btn ghost small" aria-label={L("Move later", "Sona al")} onClick={() => editCurriculum(courseId, "reorder", (d) => reorderMilestone(d, m.id, indexOf(m.id) + 1))}><Icon.down /></button>
                      </div>
                    </div>
                  ))}
                  {!ms.length && <div className="small muted" style={{ padding: 8 }}>{L("No milestones — add one or regenerate.", "Adım yok — bir tane ekle ya da yeniden oluştur.")}</div>}
                </div>
              </div>
            );
          })}
          <button className="btn ghost small" style={{ alignSelf: "flex-start" }} onClick={() => editCurriculum(courseId, "add-topic", (d) => addTopic(d, u.id, L("New topic", "Yeni konu")))}><Icon.plus /> {L("Topic", "Konu")}</button>
        </section>
      ))}
      <div className="row">
        <button className="btn" onClick={() => editCurriculum(courseId, "add-unit", (d) => { const unit = addUnit(d, courseId, L("New unit", "Yeni ünite")); addTopic(d, unit.id, L("New topic", "Yeni konu")); })}><Icon.plus /> {L("Unit", "Ünite")}</button>
        <span className="grow" />
        <button className="btn danger" onClick={() => {
          if (confirm(L(`Delete "${course.title}" and its curriculum? Your raw learning history is kept.`, `"${course.title}" ve müfredatı silinsin mi? Ham öğrenme geçmişin saklanır.`))) {
            store.transact((d) => deleteCourse(d, courseId));
            navigate("/");
          }
        }}>{L("Delete course", "Dersi sil")}</button>
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
    }), L("Saved.", "Kaydedildi."));
    if (ok) onClose();
  };

  const togglePrereq = (p: ID, on: boolean) =>
    editCurriculum(courseId, on ? "connect" : "disconnect", (d) => (on ? connectPrerequisite(d, m.id, p) : removePrerequisite(d, m.id, p)));

  const proposeSplit = () => run(async () => {
    const res = await splitMilestoneAI(aiHost, m);
    if (res.fallbackUsed) toast(L("Using an offline split (concept → practice → application). Edit the titles before confirming.", "Çevrimdışı bölme kullanılıyor (kavram → alıştırma → uygulama). Onaylamadan önce başlıkları düzenle."));
    setSplit(res.value);
  });

  const doSplit = () => {
    if (!split) return;
    const ok = editCurriculum(courseId, "split", (d) => splitMilestone(d, m.id, split.filter((p) => p.title.trim())), L(`Split into ${split.length}.`, `${split.length} parçaya bölündü.`));
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
    }, res.fallbackUsed ? L("Added rubric-based practice prompts (offline).", "Ölçüt temelli alıştırma soruları eklendi (çevrimdışı).") : L(`Added ${res.value.length} questions.`, `${res.value.length} soru eklendi.`));
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });

  if (split) {
    return (
      <Sheet title={L("Split milestone", "Adımı böl")} onClose={() => setSplit(null)}>
        <div className="stack">
          <p className="small text-2">{L("Each part should be a meaningful achievement. The first part keeps your history; the last part keeps the outgoing connections.", "Her parça anlamlı bir kazanım olmalı. İlk parça geçmişini korur; son parça çıkan bağlantıları korur.")}</p>
          {split.map((p, i) => (
            <div key={i} className="card raised stack" style={{ gap: 6 }}>
              <input className="input" value={p.title} onChange={(e) => setSplit(split.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
              <span className="tiny muted">{p.learningObjective}</span>
            </div>
          ))}
          <div className="row">
            <button className="btn" onClick={() => setSplit([...split, { title: L("New part", "Yeni parça") }])}><Icon.plus /> {L("Part", "Parça")}</button>
            {split.length > 2 && <button className="btn" onClick={() => setSplit(split.slice(0, -1))}>{L("Remove last", "Sonuncuyu kaldır")}</button>}
            <button className="btn primary grow" onClick={doSplit}>{L("Split", "Böl")}</button>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title={L("Edit milestone", "Adımı düzenle")} onClose={onClose}>
      <div className="stack">
        <div className="field"><label htmlFor="ms-f1">{L("Title", "Başlık")}</label>
            <input id="ms-f1" className="input" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="field"><label htmlFor="ms-f2">{L("After this, the student can…", "Bunun sonunda öğrenci şunu yapabilir…")}</label>
            <textarea id="ms-f2" className="textarea" style={{ minHeight: 70 }} value={form.learningObjective} onChange={(e) => set("learningObjective", e.target.value)} /></div>
        <div className="field"><label htmlFor="ms-f3">{L("Mastery criterion", "Ustalık ölçütü")}</label>
            <input id="ms-f3" className="input" value={form.mastery} onChange={(e) => set("mastery", e.target.value)} /></div>
        <div className="grid-2">
          <div className="field"><label htmlFor="ms-f4">{L("Type", "Tür")}</label>
            <select id="ms-f4" className="select" value={form.milestoneType} onChange={(e) => set("milestoneType", e.target.value as MilestoneType)}>
              {MILESTONE_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select></div>
          <div className="field"><label htmlFor="ms-f5">{L("Interaction", "Etkileşim")}</label>
            <select id="ms-f5" className="select" value={form.recommendedInteractionType} onChange={(e) => set("recommendedInteractionType", e.target.value as InteractionType)}>
              {INTERACTION_TYPES.map((t) => <option key={t} value={t}>{INTERACTION_TR[t] ?? t}</option>)}
            </select></div>
          <div className="field"><label htmlFor="ms-f6">{L("Difficulty (1–5)", "Zorluk (1–5)")}</label>
            <input id="ms-f6" className="input" type="number" min={1} max={5} value={form.difficulty} onChange={(e) => set("difficulty", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="ms-f7">{L("Estimated minutes", "Tahmini dakika")}</label>
            <input id="ms-f7" className="input" type="number" min={2} value={form.estimatedDuration} onChange={(e) => set("estimatedDuration", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="ms-f8">{L("Correct answers for mastery", "Ustalık için doğru cevap sayısı")}</label>
            <input id="ms-f8" className="input" type="number" min={1} max={10} value={form.requiredCorrect} onChange={(e) => set("requiredCorrect", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="ms-f9">{L("Topic", "Konu")}</label>
            <select id="ms-f9" className="select" value={form.topicId} onChange={(e) => set("topicId", e.target.value)}>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.unit} · {t.title}</option>)}
            </select></div>
        </div>
        <label className="row nowrap"><input type="checkbox" checked={form.optional} onChange={(e) => set("optional", e.target.checked)} style={{ width: 20, height: 20 }} /> {L("Optional (a side branch; not required for the course goal)", "İsteğe bağlı (yan dal; dersin hedefi için gerekli değil)")}</label>
        <button className="btn primary" onClick={save}>{L("Save changes", "Değişiklikleri kaydet")}</button>
        <DifficultyHint milestoneId={m.id} onApply={(d) => setForm({ ...form, difficulty: d })} />

        <hr className="sep" />
        <h3>{L("Prerequisites", "Ön koşullar")}</h3>
        <div className="list" style={{ maxHeight: 260, overflow: "auto" }}>
          {others.map((o) => {
            const on = m.prerequisites.includes(o.id);
            const wouldLoop = !on && dependsOn(pm, o.id, m.id);
            return (
              <label key={o.id} className="list-item small" style={{ opacity: wouldLoop ? 0.45 : 1, cursor: wouldLoop ? "not-allowed" : "pointer" }} title={wouldLoop ? L("This milestone already depends on the current one", "Bu adım zaten şu anki adıma bağlı") : undefined}>
                <input type="checkbox" checked={on} disabled={wouldLoop} onChange={(e) => togglePrereq(o.id, e.target.checked)} style={{ width: 20, height: 20 }} />
                <span className="grow">{o.title}</span>
                {wouldLoop && <span className="tiny muted">{L("would loop", "döngü yaratır")}</span>}
              </label>
            );
          })}
        </div>

        <hr className="sep" />
        <h3>{L("Questions", "Sorular")} ({questions.length})</h3>
        <div className="list">
          {questions.map((q) => (
            <div key={q.id} className="list-item small">
              <span className="chip">{pick({ PRACTICE: "practice", MASTERY: "mastery", RETENTION: "retention", TRANSFER: "transfer" }, { PRACTICE: "alıştırma", MASTERY: "ustalık", RETENTION: "kalıcılık", TRANSFER: "transfer" })[q.purpose]}</span>
              <span className="grow truncate">{q.prompt}</span>
              <button className="btn ghost small" aria-label={L("Delete question", "Soruyu sil")} onClick={() => editCurriculum(courseId, "delete-question", (d) => void delete d.questions[q.id])}><Icon.close /></button>
            </div>
          ))}
        </div>
        <button className="btn" onClick={genQuestions} disabled={busy}>{busy ? <span className="spinner" /> : <Icon.spark />} {L("Generate more questions", "Daha fazla soru oluştur")}</button>

        <hr className="sep" />
        <div className="row">
          <button className="btn" onClick={proposeSplit} disabled={busy}>{L("Split…", "Böl…")}</button>
          {m.skippedAt
            ? <button className="btn" onClick={() => editCurriculum(courseId, "unskip", (d) => unskipMilestone(d, m.id))}>{L("Unskip", "Atlamayı geri al")}</button>
            : !m.masteredAt && <button className="btn" onClick={() => editCurriculum(courseId, "skip", (d) => skipMilestone(d, m.id))}>{L("Skip", "Atla")}</button>}
          {m.masteredAt
            ? <button className="btn" onClick={() => editCurriculum(courseId, "revoke", (d) => revokeMastery(d, m.id))}>{L("Undo mastery", "Ustalığı geri al")}</button>
            : <button className="btn" onClick={() => editCurriculum(courseId, "self-attest", (d) => void grantMastery(d, m.id, [], false, true), L("Marked as mastered (self-attested).", "Ustalaşıldı olarak işaretlendi (kendi beyanın)."))}>{L("I already know this", "Bunu zaten biliyorum")}</button>}
          <span className="grow" />
          <button className="btn danger" onClick={() => {
            if (confirm(L(`Delete "${m.title}"? Milestones after it will inherit its prerequisites.`, `"${m.title}" silinsin mi? Sonraki adımlar onun ön koşullarını devralır.`))) {
              if (editCurriculum(courseId, "delete", (d) => deleteMilestone(d, m.id), L("Deleted.", "Silindi.")) !== undefined) onClose();
            }
          }}>{L("Delete", "Sil")}</button>
        </div>
      </div>
    </Sheet>
  );
}

/** Difficulty Calibrator: a suggestion from observed attempts; applying it is the user's choice. */
function DifficultyHint({ milestoneId, onApply }: { milestoneId: ID; onApply: (d: number) => void }) {
  const db = useDB();
  const [sig, setSig] = useState(() => difficultySignal(db, milestoneId));
  const { busy, run } = useAsync();
  if (sig.sample < 4) return <p className="tiny muted">{L("Difficulty calibration: ", "Zorluk ayarı: ")}{sig.rationale}</p>;
  return (
    <div className="banner info small row between">
      <span>{sig.suggested ? L(`Observed performance suggests difficulty ${sig.suggested}/5. `, `Gözlenen performans ${sig.suggested}/5 zorluk öneriyor. `) : L("Rated difficulty matches observed performance. ", "Belirlenen zorluk gözlenen performansla uyumlu. ")}{sig.rationale}</span>
      <div className="row nowrap">
        {db.preferences.aiProvider !== "local" && <button className="btn small" disabled={busy} onClick={() => run(async () => setSig((await calibrateDifficultyAI(aiHost, store.state, milestoneId)).value))}>{L("Ask AI", "YZ'ye sor")}</button>}
        {sig.suggested && <button className="btn small" onClick={() => onApply(sig.suggested!)}>{L(`Use ${sig.suggested}`, `${sig.suggested} kullan`)}</button>}
      </div>
    </div>
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
      toast(res.error ? L(`AI unavailable (${res.error}). Use split, merge or add instead.`, `YZ kullanılamıyor (${res.error}). Bunun yerine bölme, birleştirme ya da ekleme kullan.`) : L("Topic regeneration needs an AI provider (Settings). You can still split, merge and add by hand.", "Konuyu yeniden oluşturmak için bir YZ sağlayıcısı gerekir (Ayarlar). Yine de elle bölebilir, birleştirebilir ve ekleyebilirsin."), "error");
      return;
    }
    setProposal(res.value);
  });

  const accept = () => {
    if (!proposal) return;
    const r = editCurriculum(topic.courseId, "regenerate-topic", (d) => replaceTopicMilestones(d, topicId, proposal, d.preferences.aiProvider), L("Topic regenerated. Mastered milestones were kept.", "Konu yeniden oluşturuldu. Ustalaşılan adımlar korundu."));
    if (r) onClose();
  };

  return (
    <Sheet title={L(`Regenerate “${topic.title}”`, `“${topic.title}” yeniden oluştur`)} onClose={onClose}>
      {!proposal ? (
        <div className="stack">
          <div className="field">
            <label>{L("How should it change? (optional)", "Nasıl değişsin? (isteğe bağlı)")}</label>
            <textarea className="textarea" style={{ minHeight: 80 }} value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder={L("e.g. smaller steps; more derivations; add an experiment", "örn. daha küçük adımlar; daha çok türetme; bir deney ekle")} />
          </div>
          <p className="small muted">{L("Mastered milestones in this topic are kept. Connections into and out of the topic are re-attached automatically.", "Bu konudaki ustalaşılan adımlar korunur. Konuya giren ve çıkan bağlantılar otomatik olarak yeniden kurulur.")}</p>
          <button className="btn primary" onClick={generate} disabled={busy}>{busy ? <><span className="spinner" /> {L("Generating…", "Oluşturuluyor…")}</> : L("Generate proposal", "Öneri oluştur")}</button>
        </div>
      ) : (
        <div className="stack">
          {proposal.map((p, i) => (
            <div key={i} className="card raised small"><strong>{p.title}</strong><div className="muted">{p.learningObjective}</div></div>
          ))}
          <div className="row"><button className="btn" onClick={() => setProposal(null)}>{L("Back", "Geri")}</button><button className="btn primary grow" onClick={accept}>{L("Replace topic", "Konuyu değiştir")}</button></div>
        </div>
      )}
    </Sheet>
  );
}
