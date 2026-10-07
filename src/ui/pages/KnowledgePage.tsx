import { useMemo, useState, type ReactNode } from "react";
import type { LabDB } from "../../domain/types";
import { getGraph, incomingLinks, mappingsFor } from "../../knowledge/graph";
import {
  DOMAINS, DOMAIN_LABEL, EVIDENCE_LABEL, LO_TYPE_LABEL, MAPPING_STATUS_LABEL, SCOPE_LABEL, STRENGTH_HELP, STRENGTH_LABEL,
  type Domain, type KnowledgeGraph, type LearningObject, type MappingSystem,
} from "../../knowledge/schema";
import {
  LO_STATE_LABEL, personalGraph, readiness, recommendObjects, type LOState, type PersonalGraph,
} from "../../knowledge/state";
import { LEARNING_PATHS, pathStages } from "../../knowledge/paths";
import { courseForObject, setPath, setSelfAttested, studyObjects, toggleGoal } from "../../knowledge/actions";
import { ISSUE_LABEL, SEVERITY_LABEL, summarize, validateGraph, type Issue } from "../../knowledge/validate";
import { applyPlan, CHANGE_LABEL, diffUpdate, exportGraph, knownIds, parseUpdate, type UpdatePlan } from "../../knowledge/planner";
import { CHANGELOG } from "../../knowledge/registry";
import { navigate, store, toast, useDB } from "../state";
import { Icon, Sheet } from "../components/common";
import { saveTextFile } from "../native";

const STATE_CLASS: Record<LOState, string> = {
  USTALASILDI: "s-MASTERED", TEKRAR: "s-NEEDS_REVIEW", BEYAN: "s-OPTIONAL", CALISILIYOR: "s-ATTEMPTED",
  HAZIR: "s-AVAILABLE", ONKOSUL_EKSIK: "s-LOCKED", PASIF: "s-SKIPPED",
};

export const LOStateChip = ({ state }: { state: LOState }) => <span className={`chip ${STATE_CLASS[state]}`}>{LO_STATE_LABEL[state]}</span>;

function usePersonal(): { db: LabDB; g: KnowledgeGraph; pg: PersonalGraph } {
  const db = useDB();
  const g = getGraph(db.knowledge);
  return { db, g, pg: personalGraph(db, g) };
}

const VIEWS = [
  ["baglam", "Bağlam"],
  ["yollar", "Yollar"],
  ["disiplin", "Disiplinler"],
  ["esleme", "Eşlemeler"],
  ["dogrulama", "Doğrulama"],
  ["surum", "Sürüm"],
] as const;
type View = (typeof VIEWS)[number][0];

/** The living knowledge graph. Contextual by default; the learner expands as they wish (section 43). */
export function KnowledgePage() {
  const { db, g, pg } = usePersonal();
  const query = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const [view, setView] = useState<View>((VIEWS.find((v) => v[0] === query.get("view"))?.[0]) ?? "baglam");
  const [open, setOpen] = useState<string | null>(query.get("lo"));
  const counts = useMemo(() => {
    let known = 0, studying = 0;
    for (const p of pg.progress.values()) {
      if (p.state === "USTALASILDI" || p.state === "BEYAN" || p.state === "TEKRAR") known++;
      else if (p.state === "CALISILIYOR") studying++;
    }
    return { known, studying };
  }, [pg]);

  return (
    <div className="stack-lg rise">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">{g.name} v{g.version} · {g.order.length} nesne</span>
        <h1>Bilginin yapısı</h1>
        <p className="text-2">
          Bu, öğrenilecek şeylerin listesi değil; fikirlerin birbirine nasıl dayandığının haritası.
          {counts.known ? ` ${counts.known} nesneyi zaten biliyorsun` : " Henüz bildiğin bir nesne işaretlenmedi"}
          {counts.studying ? `, ${counts.studying} tanesi üzerinde çalışıyorsun.` : "."}
        </p>
      </header>
      <div className="chip-scroll" role="tablist" aria-label="Grafik görünümü">
        {VIEWS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={view === k} className={`btn small ${view === k ? "primary" : ""}`} onClick={() => setView(k)}>{label}</button>
        ))}
      </div>
      {view === "baglam" && <ContextView db={db} pg={pg} onOpen={setOpen} />}
      {view === "yollar" && <PathsView db={db} pg={pg} onOpen={setOpen} />}
      {view === "disiplin" && <DisciplineView pg={pg} onOpen={setOpen} />}
      {view === "esleme" && <MappingView pg={pg} onOpen={setOpen} />}
      {view === "dogrulama" && <ValidationView db={db} g={g} onOpen={setOpen} />}
      {view === "surum" && <VersionView db={db} g={g} />}
      {open && g.objects[open] && <LOSheet id={open} db={db} pg={pg} onOpen={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function LORow({ id, pg, onOpen, note }: { id: string; pg: PersonalGraph; onOpen: (id: string) => void; note?: ReactNode }) {
  const o = pg.g.objects[id];
  const p = pg.progress.get(id)!;
  return (
    <button className="list-item lo-row" onClick={() => onOpen(id)}>
      <span className="grow stack" style={{ gap: 2, minWidth: 0, textAlign: "left" }}>
        <span className="truncate">{o.title}</span>
        <span className="tiny muted truncate">{note ?? `${DOMAIN_LABEL[o.domain]} · ${o.unit}`}</span>
      </span>
      <LOStateChip state={p.state} />
    </button>
  );
}

function Collapsible({ title, count, children, initial = false }: { title: string; count?: number; children: ReactNode; initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <section className="card stack" style={{ gap: 8 }}>
      <button className="row between nowrap collapse-head" aria-expanded={on} onClick={() => setOn(!on)}>
        <strong className="truncate">{title}</strong>
        <span className="row nowrap small muted" style={{ gap: 6 }}>{count !== undefined && <span className="mono">{count}</span>}{on ? <Icon.up /> : <Icon.down />}</span>
      </button>
      {on && children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Bağlam: goals, readiness, recommended next, what you already know, search
// ---------------------------------------------------------------------------

function ContextView({ db, pg, onOpen }: { db: LabDB; pg: PersonalGraph; onOpen: (id: string) => void }) {
  const { g } = pg;
  const goals = db.knowledge.goals.filter((id) => g.objects[id]);
  const path = LEARNING_PATHS.find((p) => p.id === db.knowledge.pathId);
  const targets = goals.length ? goals : path?.targets ?? [];
  const recs = recommendObjects(pg, targets, 5);
  const ready = targets.length ? readiness(pg, targets) : null;
  const basics = ready ? ready.requiredGaps.filter((id) => g.objects[id].difficulty <= 1 && (pg.progress.get(id)?.milestones.length ?? 0) === 0) : [];
  const known = g.order.filter((id) => pg.satisfied(id));
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase("tr");
    if (needle.length < 2) return [];
    return g.order.filter((id) => {
      const o = g.objects[id];
      return `${o.title} ${o.tags.join(" ")} ${o.unit} ${o.field} ${id}`.toLocaleLowerCase("tr").includes(needle);
    }).slice(0, 25);
  }, [q, g]);

  return (
    <div className="stack-lg">
      <div className="field">
        <label htmlFor="lo-search">Grafikte ara</label>
        <input id="lo-search" className="input" placeholder="örn. Hodgkin, türev, entropi, Almanca" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {q.trim().length >= 2 && (
        <section className="card list">
          {results.length ? results.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />) : <p className="small muted">Eşleşen nesne yok.</p>}
        </section>
      )}

      <section className="stack" style={{ gap: 10 }}>
        <h2>{goals.length ? "Hedeflerin" : path ? `Yol: ${path.title}` : "Hedef"}</h2>
        {!targets.length && (
          <div className="card stack">
            <p className="text-2">Henüz bir hedef seçmedin. Bir nesneyi açıp <em>Hedef yap</em> de ya da <em>Yollar</em>dan bir öğrenme yolu seç; Lab hangi önkoşulların hazır olduğunu ve nereden başlamanın mantıklı olduğunu gösterir.</p>
          </div>
        )}
        {goals.length > 0 && (
          <div className="card list">{goals.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />)}</div>
        )}
        {ready && (
          <div className={`banner ${ready.requiredGaps.length ? "info" : "ok"}`}>
            <div className="stack" style={{ gap: 8 }}>
              <span>{ready.message}</span>
              {ready.startHere.length > 0 && ready.requiredGaps.length > 0 && (
                <div className="row" style={{ gap: 6 }}>
                  {ready.startHere.slice(0, 4).map((id) => <button key={id} className="btn small" onClick={() => onOpen(id)}>{g.objects[id].title}</button>)}
                </div>
              )}
              {basics.length > 0 && (
                <div className="stack" style={{ gap: 4 }}>
                  <span className="tiny muted">Temel önkoşullardan bazılarını zaten biliyorsan geri dönmek zorunda değilsin: {basics.length} giriş düzeyi nesneyi kendi beyanınla işaretleyebilir, sonra tek tek geri alabilirsin.</span>
                  <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={() => store.transact((d) => { for (const id of basics) setSelfAttested(d, id, true); })}>
                    Giriş düzeyini biliyorum ({basics.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="stack" style={{ gap: 10 }}>
        <h2>Önerilen sonraki</h2>
        {recs.length ? recs.map((r, i) => {
          const o = g.objects[r.id];
          return (
            <button key={r.id} className={`card clickable ${i === 0 ? "accent" : ""}`} style={{ textAlign: "left", color: "inherit", font: "inherit" }} onClick={() => onOpen(r.id)}>
              <div className="row between nowrap" style={{ marginBottom: 4 }}>
                <span className="tiny muted truncate">{DOMAIN_LABEL[o.domain]} · {LO_TYPE_LABEL[o.milestoneType]}</span>
                <LOStateChip state={pg.progress.get(r.id)!.state} />
              </div>
              <div className="serif" style={{ fontSize: "1.05rem" }}>{o.title}</div>
              <div className="tiny muted" style={{ marginTop: 4 }}>{r.reasons.slice(0, 2).join(" · ")}</div>
            </button>
          );
        }) : <p className="small muted">Şu an önerilecek hazır bir nesne yok.</p>}
      </section>

      <Collapsible title="Bunları zaten biliyorsun" count={known.length}>
        {known.length ? <div className="list">{known.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />)}</div>
          : <p className="small muted">Ustalaştığın ya da "biliyorum" dediğin nesneler burada görünür.</p>}
      </Collapsible>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Yollar: the same graph seen through three learning paths
// ---------------------------------------------------------------------------

function PathsView({ db, pg, onOpen }: { db: LabDB; pg: PersonalGraph; onOpen: (id: string) => void }) {
  const [sel, setSel] = useState(db.knowledge.pathId ?? LEARNING_PATHS[0].id);
  const path = LEARNING_PATHS.find((p) => p.id === sel)!;
  const stages = pathStages(pg.g, path);
  const total = stages.reduce((s, st) => s + st.ids.length, 0);
  const done = stages.reduce((s, st) => s + st.ids.filter((id) => pg.satisfied(id)).length, 0);
  const active = db.knowledge.pathId === path.id;
  return (
    <div className="stack-lg">
      <div className="chip-scroll">
        {LEARNING_PATHS.map((p) => <button key={p.id} className={`btn small ${sel === p.id ? "primary" : ""}`} onClick={() => setSel(p.id)}>{p.title}</button>)}
      </div>
      <div className="card stack">
        <h2>{path.title}</h2>
        <p className="text-2 small">{path.description}</p>
        <p className="tiny muted">Bu ayrı bir müfredat değil: aynı grafiğin bir görünümü. {total} nesnenin {done} tanesi tamam.</p>
        <button className={`btn small ${active ? "" : "primary"}`} style={{ alignSelf: "flex-start" }}
          onClick={() => store.transact((d) => setPath(d, active ? undefined : path.id))}>
          {active ? "Bu yolu bırak" : "Bu yolu takip et"}
        </button>
      </div>
      {stages.map((st, i) => {
        const left = st.ids.filter((id) => !pg.satisfied(id)).length;
        return (
          <Collapsible key={st.depth} title={`Aşama ${i + 1}`} count={st.ids.length} initial={i === stages.findIndex((s) => s.ids.some((id) => !pg.satisfied(id)))}>
            <p className="tiny muted">{left ? `${left} nesne kaldı` : "Bu aşama tamam"}</p>
            <div className="list">{st.ids.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />)}</div>
          </Collapsible>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Disiplinler, with filters for completed / missing prerequisites / interdisciplinary
// ---------------------------------------------------------------------------

const FILTERS = [
  ["hepsi", "Hepsi"],
  ["tamam", "Tamamlanan"],
  ["eksik", "Önkoşulu eksik"],
  ["bagli", "Disiplinlerarası"],
] as const;

function DisciplineView({ pg, onOpen }: { pg: PersonalGraph; onOpen: (id: string) => void }) {
  const { g } = pg;
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("hepsi");
  const keep = (id: string) => {
    const o = g.objects[id];
    const p = pg.progress.get(id)!;
    if (filter === "tamam") return pg.satisfied(id);
    if (filter === "eksik") return p.state === "ONKOSUL_EKSIK";
    if (filter === "bagli") return o.interdisciplinaryLinks.some((l) => g.objects[l.id] && g.objects[l.id].domain !== o.domain);
    return true;
  };
  return (
    <div className="stack-lg">
      <div className="chip-scroll">
        {FILTERS.map(([k, label]) => <button key={k} className={`btn small ${filter === k ? "primary" : ""}`} onClick={() => setFilter(k)}>{label}</button>)}
      </div>
      {DOMAINS.map((d: Domain) => {
        const ids = g.order.filter((id) => g.objects[id].domain === d && keep(id));
        if (!ids.length) return null;
        const units = new Map<string, string[]>();
        for (const id of ids) {
          const u = `${g.objects[id].field} · ${g.objects[id].unit}`;
          if (!units.has(u)) units.set(u, []);
          units.get(u)!.push(id);
        }
        const done = ids.filter((id) => pg.satisfied(id)).length;
        return (
          <Collapsible key={d} title={DOMAIN_LABEL[d]} count={ids.length}>
            <p className="tiny muted">{done} / {ids.length} tamam</p>
            {[...units.entries()].map(([u, list]) => (
              <div key={u} className="stack" style={{ gap: 0 }}>
                <span className="eyebrow" style={{ marginTop: 6 }}>{u}</span>
                <div className="list">{list.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} note={filter === "bagli" ? g.objects[id].interdisciplinaryLinks.map((l) => g.objects[l.id]?.title).filter(Boolean).join(" · ") : undefined} />)}</div>
              </div>
            ))}
          </Collapsible>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Eşlemeler: school, AP, competition, research — a separate layer with status
// ---------------------------------------------------------------------------

const SYSTEMS: [MappingSystem, string][] = [["AP", "AP"], ["OKUL", "Okul"], ["YARISMA", "Yarışma"], ["ARASTIRMA", "Araştırma"]];

function MappingView({ pg, onOpen }: { pg: PersonalGraph; onOpen: (id: string) => void }) {
  const { g } = pg;
  const [sys, setSys] = useState<MappingSystem>("AP");
  const maps = Object.values(g.mappings).filter((m) => m.system === sys);
  const frameworks = [...new Set(maps.map((m) => m.framework))];
  return (
    <div className="stack-lg">
      <div className="chip-scroll">
        {SYSTEMS.map(([k, label]) => <button key={k} className={`btn small ${sys === k ? "primary" : ""}`} onClick={() => setSys(k)}>{label}</button>)}
      </div>
      <p className="small muted">Eşlemeler grafikten ayrı tutulur. <strong>Doğrulanmış</strong>: ünite listesi resmi kaynakla karşılaştırıldı. <strong>Geçici</strong>: makul ama doğrulanmadı. <strong>Bilinmiyor</strong>: içerik bilinmiyor.</p>
      {frameworks.map((f) => {
        const rows = maps.filter((m) => m.framework === f);
        const ids = [...new Set(rows.flatMap((m) => m.loIds))].filter((id) => g.objects[id]);
        const done = ids.filter((id) => pg.satisfied(id)).length;
        return (
          <Collapsible key={f} title={f} count={rows.length}>
            <div className="row" style={{ gap: 6 }}>
              <span className={`chip map-${rows[0].status}`}>{MAPPING_STATUS_LABEL[rows[0].status]}</span>
              <span className="tiny muted">{done} / {ids.length} nesne tamam</span>
            </div>
            {rows[0].note && <p className="tiny muted">{rows[0].note}</p>}
            {rows[0].source && <p className="tiny muted mono" style={{ overflowWrap: "anywhere" }}>Kaynak: {rows[0].source}{rows[0].checkedAt ? ` · ${rows[0].checkedAt}` : ""}</p>}
            {rows.map((m) => (
              <div key={m.id} className="stack" style={{ gap: 0 }}>
                <span className="eyebrow" style={{ marginTop: 6 }}>{m.unit}</span>
                <div className="list">{m.loIds.filter((id) => g.objects[id]).map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />)}</div>
              </div>
            ))}
          </Collapsible>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Doğrulama: the validator, never auto-fixing
// ---------------------------------------------------------------------------

/** Warnings that exist on purpose; explained instead of "fixed". */
export const INTENTIONAL: Partial<Record<Issue["code"], string>> = {
  DOGRULANMAMIS_TARIH: "Kasıtlı: tarih ve kurum içerikleri kaynakla doğrulanana kadar bu işaretle kalır.",
  KAYNAKSIZ_ICERIK: "Kasıtlı: kaynak katmanı kullanıcıyla birlikte büyür; uydurma kaynak eklenmedi.",
  DISIPLINLERARASI_YOK: "Bilgi: bazı nesneler (ör. dil dilbilgisi) doğal olarak tek alanda kalır.",
};

function ValidationView({ db, g, onOpen }: { db: LabDB; g: KnowledgeGraph; onOpen: (id: string) => void }) {
  const issues = useMemo(() => validateGraph(g, { knownIds: knownIds(db) }), [g, db]);
  const sum = summarize(issues);
  const byCode = new Map<string, Issue[]>();
  for (const i of issues) {
    if (!byCode.has(i.code)) byCode.set(i.code, []);
    byCode.get(i.code)!.push(i);
  }
  return (
    <div className="stack-lg">
      <div className="grid-2">
        <div className="card"><div className="eyebrow">Hata</div><div className="serif" style={{ fontSize: 28 }}>{sum.HATA}</div></div>
        <div className="card"><div className="eyebrow">Uyarı · Bilgi</div><div className="serif" style={{ fontSize: 28 }}>{sum.UYARI} · {sum.BILGI}</div></div>
      </div>
      <p className="small muted">Doğrulayıcı yalnızca raporlar; hiçbir nesneyi kendiliğinden silmez ya da değiştirmez. Bağlantısız nesneler de silinmez.</p>
      {sum.HATA === 0 && <div className="banner ok">Grafik döngüsüz ve tüm önkoşullar var olan nesnelere işaret ediyor.</div>}
      {[...byCode.entries()].map(([code, list]) => (
        <Collapsible key={code} title={`${SEVERITY_LABEL[list[0].severity]}: ${ISSUE_LABEL[code as Issue["code"]]}`} count={list.length}>
          {INTENTIONAL[code as Issue["code"]] && <p className="tiny muted">{INTENTIONAL[code as Issue["code"]]}</p>}
          <div className="list">
            {list.slice(0, 60).map((i, k) => (
              <button key={k} className="list-item lo-row" disabled={!i.loId || !g.objects[i.loId]} onClick={() => i.loId && onOpen(i.loId)}>
                <span className="small" style={{ textAlign: "left" }}>{i.message}</span>
              </button>
            ))}
          </div>
          {list.length > 60 && <p className="tiny muted">…ve {list.length - 60} tane daha</p>}
        </Collapsible>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sürüm: changelog, update import (diff → plan → apply), export
// ---------------------------------------------------------------------------

function VersionView({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const [text, setText] = useState("");
  const [plan, setPlan] = useState<UpdatePlan | null>(null);
  const preview = () => {
    try {
      setPlan(diffUpdate(g, parseUpdate(text), db));
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };
  const apply = () => {
    if (!plan) return;
    try {
      const rec = store.transact((d) => applyPlan(d, plan));
      toast(`Grafik ${rec.toVersion} sürümüne güncellendi.`);
      setPlan(null);
      setText("");
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };
  return (
    <div className="stack-lg">
      <section className="stack" style={{ gap: 10 }}>
        <h2>Sürüm geçmişi</h2>
        {[...db.knowledge.history].reverse().map((h) => (
          <div key={h.id} className="card stack" style={{ gap: 4 }}>
            <strong>v{h.toVersion} <span className="tiny muted">· {new Date(h.at).toLocaleDateString("tr-TR")}</span></strong>
            <span className="small text-2">{h.summary}</span>
            <span className="tiny muted">{h.added.length} yeni · {h.modified.length} değişen · {h.retired.length} kullanım dışı{h.relinkedMilestones ? ` · ${h.relinkedMilestones} adım yeniden bağlandı` : ""}</span>
          </div>
        ))}
        {CHANGELOG.slice().reverse().map((c) => (
          <div key={c.version} className="card stack" style={{ gap: 4 }}>
            <strong>v{c.version} <span className="tiny muted">· {c.date}</span></strong>
            <span className="small">{c.title}</span>
            <ul className="small text-2" style={{ margin: 0, paddingLeft: 18 }}>{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        ))}
        {db.knowledge.migrations.map((m) => <p key={m.id} className="tiny muted">Veri geçişi: {m.note}</p>)}
      </section>

      <section className="card stack">
        <h2>Güncelleme uygula</h2>
        <p className="small text-2">Bir güncellemeyi (elle ya da bir YZ'den) JSON olarak yapıştır. Lab önce farkları ve bir geçiş planı gösterir; hiçbir şey körlemesine üzerine yazılmaz, ID'ler silinmez ve ilerleme korunur.</p>
        <textarea className="textarea mono" style={{ minHeight: 140, fontSize: "0.8rem" }} value={text} onChange={(e) => { setText(e.target.value); setPlan(null); }}
          placeholder={'{\n  "version": "2.1.0",\n  "summary": "…",\n  "objects": [{ "id": "math.calc.limits", "entryQuestions": ["…"] }],\n  "retire": [{ "id": "…", "supersededBy": ["…", "…"] }]\n}'} />
        <div className="row">
          <button className="btn" onClick={preview} disabled={!text.trim()}>Farkları göster</button>
          <button className="btn ghost small" onClick={() => saveTextFile(`lab-mufredat-v${g.version}.json`, exportGraph(g), "application/json")}>Grafiği dışa aktar</button>
        </div>
        {plan && <PlanPreview plan={plan} onApply={apply} />}
      </section>
    </div>
  );
}

function PlanPreview({ plan, onApply }: { plan: UpdatePlan; onApply: () => void }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <span className="eyebrow">Geçiş planı · v{plan.fromVersion} → v{plan.toVersion}</span>
      {plan.changes.map((c, i) => (
        <div key={i} className="row nowrap small" style={{ alignItems: "flex-start" }}>
          <span className={`chip ${c.kind === "REDDEDILDI" ? "s-LOCKED" : c.kind === "EKLE" ? "s-AVAILABLE" : c.kind === "KULLANIM_DISI" ? "s-NEEDS_REVIEW" : "s-ATTEMPTED"}`}>{CHANGE_LABEL[c.kind]}</span>
          <span className="grow"><strong>{c.title}</strong> <span className="muted mono tiny">{c.id}</span><br /><span className="text-2">{c.detail}</span>{c.affectedMilestones ? <span className="muted"> · {c.affectedMilestones} bağlı adım</span> : null}</span>
        </div>
      ))}
      {plan.newErrors.length > 0 && (
        <div className="banner warn">
          <div className="stack" style={{ gap: 4 }}>
            <strong>Bu güncelleme {plan.newErrors.length} yeni hata getiriyor; uygulanamaz:</strong>
            {plan.newErrors.slice(0, 8).map((e, i) => <span key={i} className="small">{e.message}</span>)}
          </div>
        </div>
      )}
      {plan.newWarnings.length > 0 && <p className="tiny muted">{plan.newWarnings.length} yeni uyarı (uygulamayı engellemez).</p>}
      <button className="btn primary" disabled={!plan.ok} onClick={onApply}>Planı uygula</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Object sheet: what, why, how it connects, how you'll prove it, what's next
// ---------------------------------------------------------------------------

function LOSheet({ id, db, pg, onOpen, onClose }: { id: string; db: LabDB; pg: PersonalGraph; onOpen: (id: string) => void; onClose: () => void }) {
  const { g } = pg;
  const o: LearningObject = g.objects[id];
  const p = pg.progress.get(id)!;
  const ready = readiness(pg, [id]);
  const incoming = incomingLinks(g, id);
  const maps = mappingsFor(g, id);
  const isGoal = db.knowledge.goals.includes(id);
  const attested = !!db.knowledge.selfAttested[id];
  const existing = courseForObject(db, id);
  const study = (withGaps: boolean) => {
    try {
      const ids = withGaps ? [...ready.requiredGaps, id] : [id];
      const courseId = store.transact((d) => studyObjects(d, g, ids));
      navigate(`/course/${courseId}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };
  const link = (lid: string, extra?: ReactNode) => (
    <button key={lid} className="list-item lo-row" onClick={() => onOpen(lid)}>
      <span className="grow stack" style={{ gap: 2, minWidth: 0, textAlign: "left" }}>
        <span className="truncate">{g.objects[lid]?.title ?? lid}</span>
        {extra && <span className="tiny muted">{extra}</span>}
      </span>
      {g.objects[lid] && <LOStateChip state={pg.progress.get(lid)!.state} />}
    </button>
  );

  return (
    <Sheet title={o.title} onClose={onClose} wide>
      <div className="stack">
        <div className="row" style={{ gap: 6 }}>
          <LOStateChip state={p.state} />
          <span className="chip">{DOMAIN_LABEL[o.domain]}</span>
          <span className="chip">{LO_TYPE_LABEL[o.milestoneType]}</span>
          {o.optional && <span className="chip s-OPTIONAL">İsteğe bağlı</span>}
          {o.challenge && <span className="chip k-CHALLENGE">Meydan okuma</span>}
          {o.status !== "AKTIF" && <span className="chip s-LOCKED">{o.status === "YERINE_GECILDI" ? "Yerine geçildi" : o.status === "KULLANIM_DISI" ? "Kullanım dışı" : "Taslak"}</span>}
        </div>
        <p className="tiny muted mono">{o.id} · zorluk {o.difficulty}/5 · {SCOPE_LABEL[o.estimatedScope]} · {o.field} › {o.unit}</p>
        {o.supersededBy?.length ? <div className="banner warn">Bu nesnenin yerini şunlar aldı: {o.supersededBy.map((s) => g.objects[s]?.title ?? s).join(", ")}.</div> : null}

        <div className="card accent stack" style={{ gap: 6 }}>
          <span className="eyebrow">Önce düşün</span>
          {o.entryQuestions.map((q) => <p key={q} className="serif" style={{ fontSize: "1.08rem", margin: 0 }}>{q}</p>)}
        </div>

        <Section title="Bu ne?"><p className="small text-2">{o.description}</p></Section>
        <Section title="Neden önemli?"><p className="small text-2">{o.whyItMatters}</p></Section>
        {o.coreQuestions.length > 0 && <Section title="Cevapladığı sorular"><ul className="small text-2 tight">{o.coreQuestions.map((q) => <li key={q}>{q}</li>)}</ul></Section>}
        <Section title="Bunu yapabileceksin"><ul className="small text-2 tight">{o.learningObjectives.map((q) => <li key={q}>{q}</li>)}</ul></Section>
        <Section title="Öğrendiğinin kanıtı">
          <div className="row" style={{ gap: 4 }}>{o.evidenceTypes.map((e) => <span key={e} className="chip">{EVIDENCE_LABEL[e]}</span>)}</div>
          <ul className="small text-2 tight">{o.masteryCriteria.map((c) => <li key={c}>{c}</li>)}</ul>
        </Section>

        <Section title="Önkoşullar">
          {o.prerequisites.length ? (
            <div className="list">{o.prerequisites.map((pr) => link(pr.id, `${STRENGTH_LABEL[pr.strength]} — ${STRENGTH_HELP[pr.strength]}`))}</div>
          ) : <p className="small muted">Önkoşulu yok; buradan doğrudan başlanabilir.</p>}
          <p className={`small ${ready.requiredGaps.length ? "" : "muted"}`}>{ready.message}</p>
        </Section>

        {o.unlocks.length > 0 && <Section title="Açtığı yollar"><p className="tiny muted">Bunlar olası sonraki adımlar; hiçbiri zorunlu değil.</p><div className="list">{o.unlocks.map((u) => link(u))}</div></Section>}
        {(o.interdisciplinaryLinks.length > 0 || incoming.length > 0) && (
          <Section title="Disiplinlerarası bağlantılar">
            <div className="list">
              {o.interdisciplinaryLinks.map((l) => link(l.id, `${DOMAIN_LABEL[g.objects[l.id]?.domain as Domain] ?? ""} · ${l.relation}`))}
              {incoming.filter((l) => !o.interdisciplinaryLinks.some((x) => x.id === l.id)).map((l) => link(l.id, `← ${l.relation}`))}
            </div>
          </Section>
        )}
        {o.commonMisconceptions.length > 0 && <Section title="Yaygın yanılgılar"><ul className="small text-2 tight">{o.commonMisconceptions.map((m) => <li key={m}>{m}</li>)}</ul></Section>}
        {(o.researchApplications.length > 0 || o.competitionApplications.length > 0) && (
          <Section title="Nerede kullanılır">
            <ul className="small text-2 tight">
              {o.researchApplications.map((r) => <li key={r}>Araştırma: {r}</li>)}
              {o.competitionApplications.map((r) => <li key={r}>Yarışma: {r}</li>)}
            </ul>
          </Section>
        )}
        {maps.length > 0 && (
          <Section title="Eşlemeler">
            {maps.map((m) => (
              <div key={m.id} className="row nowrap small" style={{ alignItems: "flex-start" }}>
                <span className={`chip map-${m.status}`}>{MAPPING_STATUS_LABEL[m.status]}</span>
                <span className="grow">{m.framework} — {m.unit}</span>
              </div>
            ))}
          </Section>
        )}
        {o.recommendedResources.length > 0 && (
          <Section title="Kaynaklar">
            <ul className="small text-2 tight">{o.recommendedResources.map((rid) => { const r = g.resources[rid]; return <li key={rid}>{r.title}{r.author ? ` — ${r.author}` : ""}{r.note ? <span className="muted"> ({r.note})</span> : null}</li>; })}</ul>
          </Section>
        )}
        {o.requiresSources && <div className="banner info small">Bu nesne tarih, kurum ya da sınav bilgisi içeriyor. Ayrıntıları birincil ve güncel kaynaklardan doğrula; Lab bunları kesin bilgi olarak sunmaz.</div>}
        {p.milestones.length > 0 && (
          <Section title="Senin adımların">
            <p className="small text-2">{p.milestones.length} adım bu nesneye bağlı; {p.mastered} tanesinde ustalaştın.</p>
          </Section>
        )}

        <div className="stack" style={{ gap: 8, position: "sticky", bottom: 0, paddingTop: 8, background: "var(--surface)" }}>
          {existing ? (
            <button className="btn primary block" onClick={() => navigate(`/course/${existing}`)}>Derse git <Icon.arrow /></button>
          ) : (
            <div className="row nowrap">
              <button className="btn primary grow" onClick={() => study(false)} disabled={o.status !== "AKTIF" && o.status !== "TASLAK"}>Bunu çalış</button>
              {ready.requiredGaps.length > 0 && <button className="btn grow" onClick={() => study(true)}>Eksiklerle birlikte ({ready.requiredGaps.length})</button>}
            </div>
          )}
          <div className="row nowrap">
            <button className="btn grow small" onClick={() => store.transact((d) => setSelfAttested(d, id, !attested))}>{attested ? "Beyanımı geri al" : "Biliyorum (kendi beyanım)"}</button>
            <button className="btn grow small" onClick={() => { const on = store.transact((d) => toggleGoal(d, id)); toast(on ? "Hedeflerine eklendi." : "Hedeflerinden çıkarıldı."); }}>{isGoal ? "Hedeften çıkar" : "Hedef yap"}</button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="stack" style={{ gap: 6 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {children}
    </section>
  );
}
