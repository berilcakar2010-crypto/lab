import { useState } from "react";
import type { LabDB } from "../../domain/types";
import type { PathOptions } from "../../domain/adaptive";
import { fmtDate, L } from "../../i18n";
import type { KnowledgeGraph } from "../../knowledge/schema";
import { suggestTopics } from "../../study/exams";
import { abandonPath, activePath, addStep, createPath, currentStep, moveStep, refreshPath, restoreStep, resumePath, ROLE_LABEL, skipStep } from "../../adaptive/pathPlanner";
import { act, toast } from "../state";
import { Icon } from "./common";
import { DOMAIN_COLOR } from "./GraphMap";
import { WhyList } from "./Adaptive";

/** Your path over the graph: plan from goals, see why each step is there, change it freely. */
export function PathView({ db, g, onOpen }: { db: LabDB; g: KnowledgeGraph; onOpen: (id: string) => void }) {
  const path = activePath(db);
  const others = Object.values(db.paths).filter((p) => p.id !== path?.id).sort((a, b) => b.updatedAt - a.updatedAt);
  const [goalQuery, setGoalQuery] = useState("");
  const [goals, setGoals] = useState<string[]>(db.knowledge.goals.filter((id) => g.objects[id]));
  const [opts, setOpts] = useState<PathOptions>({ difficulty: "normal", includeSoft: false });
  const [adding, setAdding] = useState("");
  const found = goalQuery.trim().length > 1 ? suggestTopics(g, goalQuery, 6).filter((id) => !goals.includes(id)) : [];
  const addFound = adding.trim().length > 1 && path ? suggestTopics(g, adding, 5).filter((id) => !path.steps.some((s) => s.loId === id)) : [];

  const plan = () => {
    if (!goals.length) return;
    const p = act((d) => createPath(d, g, { goalIds: goals, options: opts }));
    toast(L(`Path planned: ${p.steps.length} steps. It's a suggestion — change it as you like.`, `Rota hazır: ${p.steps.length} adım. Bu bir öneri — dilediğin gibi değiştir.`));
  };
  const refresh = () => {
    if (!path) return;
    const done = act((d) => refreshPath(d, path.id));
    toast(done.length ? L(`${done.length} steps done from your evidence.`, `Kanıtlarına göre ${done.length} adım tamam.`) : L("No new evidence for the remaining steps yet.", "Kalan adımlar için henüz yeni kanıt yok."));
  };

  return (
    <div className="stack-lg">
      {path ? (
        <section className="stack" style={{ gap: 8 }}>
          <div className="row between">
            <div className="stack" style={{ gap: 2 }}>
              <span className="eyebrow">{L("Current path", "Mevcut rota")}{path.mode === "EXAM" ? ` · ${L("exam", "sınav")}` : ""}</span>
              <h2 style={{ margin: 0 }}>{path.title}</h2>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn small" onClick={refresh}>{L("Update from evidence", "Kanıtla güncelle")}</button>
              <button className="btn small ghost" onClick={() => confirm(L("Abandon this path? You can resume it later.", "Bu rota bırakılsın mı? Sonra devam edebilirsin.")) && act((d) => abandonPath(d, path.id))}>{L("Abandon", "Bırak")}</button>
            </div>
          </div>
          <p className="tiny muted">{L("A suggestion over the same graph — the curriculum does not change. Skip, add or reorder anything.", "Aynı grafik üzerinde bir öneri — müfredat değişmez. İstediğini atla, ekle ya da sırala.")}</p>
          <ol className="path-steps">
            {path.steps.map((s, i) => {
              const o = g.objects[s.loId];
              const cur = currentStep(path)?.loId === s.loId;
              return (
                <li key={s.loId} className={`path-step ${s.status.toLowerCase()} ${cur ? "current" : ""}`}>
                  <div className="row nowrap" style={{ gap: 8 }}>
                    <span className="lo-dot" style={{ background: o ? DOMAIN_COLOR[o.domain] : undefined }} aria-hidden />
                    <button className="grow stack path-title" onClick={() => onOpen(s.loId)}>
                      <span className="truncate">{o?.title ?? s.loId}</span>
                      <span className="tiny muted">{ROLE_LABEL(s.role)}{s.status !== "TODO" ? ` · ${s.status === "DONE" ? L("done", "tamam") : L("skipped", "atlandı")}` : ""}{cur ? ` · ${L("now", "şimdi")}` : ""}</span>
                    </button>
                    <div className="row nowrap" style={{ gap: 2 }}>
                      <button className="btn small ghost" aria-label={L("Move up", "Yukarı taşı")} disabled={i === 0} onClick={() => act((d) => moveStep(d, path.id, s.loId, -1))}><Icon.up /></button>
                      <button className="btn small ghost" aria-label={L("Move down", "Aşağı taşı")} disabled={i === path.steps.length - 1} onClick={() => act((d) => moveStep(d, path.id, s.loId, 1))}><Icon.down /></button>
                      {s.status === "SKIPPED"
                        ? <button className="btn small ghost" onClick={() => act((d) => restoreStep(d, path.id, s.loId))}>{L("Restore", "Geri al")}</button>
                        : s.status === "TODO" && <button className="btn small ghost" onClick={() => act((d) => skipStep(d, path.id, s.loId))}>{L("Skip", "Atla")}</button>}
                    </div>
                  </div>
                  <WhyList reasons={s.reasons} label={L("Why this step?", "Bu adım neden?")} />
                </li>
              );
            })}
          </ol>
          <div className="stack" style={{ gap: 6 }}>
            <input className="input" value={adding} onChange={(e) => setAdding(e.target.value)} placeholder={L("Add a topic to the path…", "Rotaya konu ekle…")} aria-label={L("Add a topic", "Konu ekle")} />
            {addFound.map((id) => (
              <button key={id} className="list-item lo-row" onClick={() => { act((d) => addStep(d, g, path.id, id)); setAdding(""); }}>
                <span className="grow truncate" style={{ textAlign: "left" }}>{g.objects[id].title}</span><span className="muted">+</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <p className="small text-2">{L("No active path. Choose one or more goals and Lab plans a route from what you have verified, your errors and what is fading — with a reason for every step.", "Etkin rota yok. Bir ya da birkaç hedef seç; Lab doğruladıklarına, hatalarına ve solmaya başlayanlara göre bir rota çıkarır — her adımın gerekçesiyle.")}</p>
      )}

      <section className="card stack" style={{ gap: 8 }}>
        <strong>{path ? L("Plan a new path", "Yeni rota planla") : L("Plan a path", "Rota planla")}</strong>
        <div className="row" style={{ gap: 6 }}>
          {goals.map((id) => <button key={id} className="chip" onClick={() => setGoals(goals.filter((x) => x !== id))}>{g.objects[id]?.title ?? id} ×</button>)}
        </div>
        <input className="input" value={goalQuery} onChange={(e) => setGoalQuery(e.target.value)} placeholder={L("Goal, e.g. neural coding", "Hedef, ör. nöral kodlama")} aria-label={L("Goal", "Hedef")} />
        {found.map((id) => (
          <button key={id} className="list-item lo-row" onClick={() => { setGoals([...goals, id]); setGoalQuery(""); }}>
            <span className="grow truncate" style={{ textAlign: "left" }}>{g.objects[id].title}</span><span className="muted">+</span>
          </button>
        ))}
        <div className="row" style={{ gap: 6 }}>
          {(["gentle", "normal", "stretch"] as const).map((d) => (
            <button key={d} className={`btn small ${opts.difficulty === d ? "primary" : ""}`} aria-pressed={opts.difficulty === d} onClick={() => setOpts({ ...opts, difficulty: d })}>
              {d === "gentle" ? L("Gentle", "Nazik") : d === "normal" ? L("Normal", "Normal") : L("Stretch", "Zorlayıcı")}
            </button>
          ))}
          <label className="row nowrap small" style={{ gap: 6 }}><input type="checkbox" checked={opts.includeSoft} onChange={(e) => setOpts({ ...opts, includeSoft: e.target.checked })} />{L("Include helpful prerequisites", "Yardımcı önkoşulları da al")}</label>
        </div>
        <button className="btn primary" disabled={!goals.length} onClick={plan}>{L("Plan the path", "Rotayı planla")}</button>
      </section>

      {others.length > 0 && (
        <details>
          <summary className="small muted" style={{ cursor: "pointer" }}>{L(`Other paths (${others.length})`, `Diğer rotalar (${others.length})`)}</summary>
          <div className="card list" style={{ marginTop: 6 }}>
            {others.map((p) => (
              <div key={p.id} className="list-item">
                <span className="grow stack" style={{ gap: 0, minWidth: 0 }}>
                  <span className="truncate">{p.title}</span>
                  <span className="tiny muted">{p.status === "ABANDONED" ? L("abandoned", "bırakıldı") : p.status === "PAUSED" ? L("paused", "duraklatıldı") : L("completed", "tamamlandı")} · {fmtDate(p.updatedAt)} · {p.steps.filter((s) => s.status === "DONE").length}/{p.steps.length}</span>
                </span>
                {p.status !== "COMPLETED" && <button className="btn small" onClick={() => act((d) => resumePath(d, p.id))}>{L("Resume", "Devam et")}</button>}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
