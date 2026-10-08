import { useMemo, useState, type ReactNode } from "react";
import type { LabDB } from "../../domain/types";
import { getBaseGraph, getGraph, incomingLinks, mappingsFor } from "../../knowledge/graph";
import {
  DOMAINS, domainLabel, evidenceLabel, loTypeLabel, mappingStatusLabel, scopeLabel, strengthHelp, strengthLabel,
  type Domain, type KnowledgeGraph, type LearningObject, type Mapping, type MappingSystem,
} from "../../knowledge/schema";
import { LO_STATE_LABEL, personalGraph, readiness, recommendObjects, type LOState, type PersonalGraph } from "../../knowledge/state";
import { LEARNING_PATHS, pathDescription, pathStages, pathTitle } from "../../knowledge/paths";
import { courseForObject, setPath, setSelfAttested, studyObjects, toggleGoal } from "../../knowledge/actions";
import { ISSUE_LABEL, SEVERITY_LABEL, summarize, validateGraph, type Issue } from "../../knowledge/validate";
import { applyPlan, CHANGE_LABEL, diffUpdate, exportGraph, knownIds, parseUpdate, type UpdatePlan } from "../../knowledge/planner";
import { CHANGELOG } from "../../knowledge/registry";
import { domainMindMap, objectMindMap } from "../../study/mindmap";
import { addMapItem, removeMapItem, setNoteText } from "../../study/actions";
import { cardStats } from "../../study/flashcards";
import { fmtDate, getLang, L, lower } from "../../i18n";
import { navigate, store, toast, useDB } from "../state";
import { Icon, Sheet } from "../components/common";
import { canSpeak, saveTextFile, speak, stopSpeaking } from "../native";
import { AtlasMap, DomainMap, NeighbourhoodMap, DOMAIN_COLOR } from "../components/GraphMap";
import { MindMapView } from "../components/MindMap";
import { ObjectFlashcards } from "../components/Flashcards";
import { AskAI } from "../components/AskAI";
import { ExplainPanel } from "../components/ExplainPanel";

const STATE_CLASS: Record<LOState, string> = {
  USTALASILDI: "s-MASTERED", TEKRAR: "s-NEEDS_REVIEW", BEYAN: "s-OPTIONAL", CALISILIYOR: "s-ATTEMPTED",
  HAZIR: "s-AVAILABLE", ONKOSUL_EKSIK: "s-LOCKED", PASIF: "s-SKIPPED",
};

export const LOStateChip = ({ state }: { state: LOState }) => <span className={`chip ${STATE_CLASS[state]}`}>{LO_STATE_LABEL[state]}</span>;
const mappingNote = (m: Mapping) => (m.note || m.noteEn ? L(m.noteEn ?? m.note ?? "", m.note ?? "") : "");
const bilingual = (s: string) => (s.includes(" | ") ? L(s.split(" | ")[1], s.split(" | ")[0]) : s);

function usePersonal(): { db: LabDB; g: KnowledgeGraph; pg: PersonalGraph } {
  const db = useDB();
  const g = getGraph(db.knowledge);
  return { db, g, pg: personalGraph(db, g) };
}

type View = "baglam" | "harita" | "yollar" | "disiplin" | "esleme" | "dogrulama" | "surum";
const VIEWS = (): [View, string][] => [
  ["baglam", L("Context", "Bağlam")],
  ["harita", L("Map", "Harita")],
  ["yollar", L("Paths", "Yollar")],
  ["disiplin", L("Fields", "Disiplinler")],
  ["esleme", L("Mappings", "Eşlemeler")],
  ["dogrulama", L("Validation", "Doğrulama")],
  ["surum", L("Version", "Sürüm")],
];

/** The living knowledge graph. Contextual by default; the learner expands as they wish (section 43). */
export function KnowledgePage() {
  const { db, g, pg } = usePersonal();
  const query = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
  const [view, setView] = useState<View>((VIEWS().find((v) => v[0] === query.get("view"))?.[0]) ?? "baglam");
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
        <span className="eyebrow">{g.name} v{g.version} · {L(`${g.order.length} objects`, `${g.order.length} nesne`)}</span>
        <h1>{L("The structure of knowledge", "Bilginin yapısı")}</h1>
        <p className="text-2">
          {L("Not a list of things to learn — a map of how ideas build on each other.", "Bu, öğrenilecek şeylerin listesi değil; fikirlerin birbirine nasıl dayandığının haritası.")}
          {" "}
          {counts.known ? L(`You already know ${counts.known} objects`, `${counts.known} nesneyi zaten biliyorsun`) : L("Nothing is marked as known yet", "Henüz bildiğin bir nesne işaretlenmedi")}
          {counts.studying ? L(`, and you are working on ${counts.studying}.`, `, ${counts.studying} tanesi üzerinde çalışıyorsun.`) : "."}
        </p>
      </header>
      <div className="chip-scroll" role="tablist" aria-label={L("Graph view", "Grafik görünümü")}>
        {VIEWS().map(([k, label]) => (
          <button key={k} role="tab" aria-selected={view === k} className={`btn small ${view === k ? "primary" : ""}`} onClick={() => setView(k)}>{label}</button>
        ))}
      </div>
      {view === "baglam" && <ContextView db={db} pg={pg} onOpen={setOpen} />}
      {view === "harita" && <MapView pg={pg} onOpen={setOpen} />}
      {view === "yollar" && <PathsView db={db} pg={pg} onOpen={setOpen} />}
      {view === "disiplin" && <DisciplineView pg={pg} onOpen={setOpen} />}
      {view === "esleme" && <MappingView pg={pg} onOpen={setOpen} />}
      {view === "dogrulama" && <ValidationView db={db} g={g} onOpen={setOpen} />}
      {view === "surum" && <VersionView db={db} g={g} />}
      {open && g.objects[open] && <LOSheet key={open} id={open} db={db} pg={pg} onOpen={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}

function LORow({ id, pg, onOpen, note }: { id: string; pg: PersonalGraph; onOpen: (id: string) => void; note?: ReactNode }) {
  const o = pg.g.objects[id];
  const p = pg.progress.get(id);
  // A goal or link to an object that is no longer in the graph is skipped, not fatal.
  if (!o || !p) return null;
  return (
    <button className="list-item lo-row" onClick={() => onOpen(id)}>
      <span className="lo-dot" style={{ background: DOMAIN_COLOR[o.domain] }} aria-hidden />
      <span className="grow stack" style={{ gap: 2, minWidth: 0, textAlign: "left" }}>
        <span className="truncate">{o.title}</span>
        <span className="tiny muted truncate">{note ?? `${domainLabel(o.domain)} · ${o.unit}`}</span>
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
// Context: goals, readiness, recommended next, what you already know, search
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
    const needle = lower(q.trim());
    if (needle.length < 2) return [];
    const base = getBaseGraph(db.knowledge);
    return g.order.filter((id) => {
      const o = g.objects[id];
      const b = base.objects[id];
      return lower(`${o.title} ${b?.title ?? ""} ${o.tags.join(" ")} ${o.unit} ${o.field} ${id}`).includes(needle);
    }).slice(0, 25);
  }, [q, g, db.knowledge]);

  return (
    <div className="stack-lg">
      <div className="field">
        <label htmlFor="lo-search">{L("Search the graph", "Grafikte ara")}</label>
        <input id="lo-search" className="input" placeholder={L("e.g. Hodgkin, derivative, entropy, German", "örn. Hodgkin, türev, entropi, Almanca")} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {q.trim().length >= 2 && (
        <section className="card list">
          {results.length ? results.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />) : <p className="small muted">{L("No matching object.", "Eşleşen nesne yok.")}</p>}
        </section>
      )}

      <section className="stack" style={{ gap: 10 }}>
        <h2>{goals.length ? L("Your goals", "Hedeflerin") : path ? `${L("Path", "Yol")}: ${pathTitle(path)}` : L("Goal", "Hedef")}</h2>
        {!targets.length && (
          <div className="card stack">
            <p className="text-2">{L("You haven't chosen a goal yet. Open an object and tap ", "Henüz bir hedef seçmedin. Bir nesneyi açıp ")}<em>{L("Make it a goal", "Hedef yap")}</em>{L(", or pick a learning path under ", " de ya da ")}<em>{L("Paths", "Yollar")}</em>{L(". Lab shows which prerequisites are ready and where it makes sense to start.", "dan bir öğrenme yolu seç; Lab hangi önkoşulların hazır olduğunu ve nereden başlamanın mantıklı olduğunu gösterir.")}</p>
          </div>
        )}
        {goals.length > 0 && <div className="card list">{goals.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />)}</div>}
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
                  <span className="tiny muted">{L(`If you already know some of the basics you don't have to go back: mark ${basics.length} introductory objects as known (your own claim) and undo any of them later.`, `Temel önkoşullardan bazılarını zaten biliyorsan geri dönmek zorunda değilsin: ${basics.length} giriş düzeyi nesneyi kendi beyanınla işaretleyebilir, sonra tek tek geri alabilirsin.`)}</span>
                  <button className="btn small" style={{ alignSelf: "flex-start" }} onClick={() => store.transact((d) => { for (const id of basics) setSelfAttested(d, id, true); })}>
                    {L(`I know the introductory level (${basics.length})`, `Giriş düzeyini biliyorum (${basics.length})`)}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="stack" style={{ gap: 10 }}>
        <h2>{L("Recommended next", "Önerilen sonraki")}</h2>
        {recs.length ? recs.map((r, i) => {
          const o = g.objects[r.id];
          return (
            <button key={r.id} className={`card clickable ${i === 0 ? "accent" : ""}`} style={{ textAlign: "left", color: "inherit", font: "inherit" }} onClick={() => onOpen(r.id)}>
              <div className="row between nowrap" style={{ marginBottom: 4 }}>
                <span className="tiny muted truncate">{domainLabel(o.domain)} · {loTypeLabel(o.milestoneType)}</span>
                <LOStateChip state={pg.progress.get(r.id)!.state} />
              </div>
              <div className="serif" style={{ fontSize: "1.05rem" }}>{o.title}</div>
              <div className="tiny muted" style={{ marginTop: 4 }}>{r.reasons.slice(0, 2).join(" · ")}</div>
            </button>
          );
        }) : <p className="small muted">{L("No ready object to recommend right now.", "Şu an önerilecek hazır bir nesne yok.")}</p>}
      </section>

      <Collapsible title={L("You already know these", "Bunları zaten biliyorsun")} count={known.length}>
        {known.length ? <div className="list">{known.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />)}</div>
          : <p className="small muted">{L("Objects you've mastered or marked as known appear here.", "Ustalaştığın ya da \"biliyorum\" dediğin nesneler burada görünür.")}</p>}
      </Collapsible>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Map: atlas of fields → one field → one object's neighbourhood
// ---------------------------------------------------------------------------

function MapView({ pg, onOpen }: { pg: PersonalGraph; onOpen: (id: string) => void }) {
  const { g } = pg;
  const [level, setLevel] = useState<{ kind: "atlas" } | { kind: "domain"; d: Domain } | { kind: "focus"; id: string }>({ kind: "atlas" });
  const [mind, setMind] = useState(false);
  const crumbs = (
    <div className="row small" style={{ gap: 6 }}>
      <button className="btn small ghost" onClick={() => setLevel({ kind: "atlas" })}>{L("All fields", "Tüm alanlar")}</button>
      {level.kind !== "atlas" && <span className="muted">›</span>}
      {level.kind === "domain" && <span>{domainLabel(level.d)}</span>}
      {level.kind === "focus" && (
        <>
          <button className="btn small ghost" onClick={() => setLevel({ kind: "domain", d: g.objects[level.id].domain })}>{domainLabel(g.objects[level.id].domain)}</button>
          <span className="muted">›</span><span className="truncate">{g.objects[level.id].title}</span>
        </>
      )}
    </div>
  );
  return (
    <div className="stack">
      {crumbs}
      {level.kind === "atlas" && <AtlasMap g={g} onDomain={(d) => setLevel({ kind: "domain", d })} />}
      {level.kind === "domain" && (
        <>
          <div className="row">
            <button className={`btn small ${!mind ? "primary" : ""}`} onClick={() => setMind(false)}>{L("Prerequisite map", "Önkoşul haritası")}</button>
            <button className={`btn small ${mind ? "primary" : ""}`} onClick={() => setMind(true)}>{L("Mind map", "Zihin haritası")}</button>
          </div>
          {mind
            ? <MindMapView root={domainMindMap(g, level.d)} onOpenObject={(id) => setLevel({ kind: "focus", id })} fileName={`lab-${level.d.toLowerCase()}-mindmap`} />
            : <DomainMap pg={pg} domain={level.d} onOpen={(id) => setLevel({ kind: "focus", id })} />}
          <p className="tiny muted">{L("Left to right: what comes first to what builds on it. Tap an object to see its neighbourhood.", "Soldan sağa: önce gelenden onun üzerine kurulana. Komşuluğunu görmek için bir nesneye dokun.")}</p>
        </>
      )}
      {level.kind === "focus" && <NeighbourhoodMap pg={pg} focus={level.id} onFocus={(id) => setLevel({ kind: "focus", id })} onOpen={onOpen} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Paths: the same graph seen through three learning paths
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
        {LEARNING_PATHS.map((p) => <button key={p.id} className={`btn small ${sel === p.id ? "primary" : ""}`} onClick={() => setSel(p.id)}>{pathTitle(p)}</button>)}
      </div>
      <div className="card stack">
        <h2>{pathTitle(path)}</h2>
        <p className="text-2 small">{pathDescription(path)}</p>
        <p className="tiny muted">{L(`This is not a separate curriculum: it is a view of the same graph. ${done} of ${total} objects done.`, `Bu ayrı bir müfredat değil: aynı grafiğin bir görünümü. ${total} nesnenin ${done} tanesi tamam.`)}</p>
        <button className={`btn small ${active ? "" : "primary"}`} style={{ alignSelf: "flex-start" }}
          onClick={() => store.transact((d) => setPath(d, active ? undefined : path.id))}>
          {active ? L("Stop following this path", "Bu yolu bırak") : L("Follow this path", "Bu yolu takip et")}
        </button>
      </div>
      {stages.map((st, i) => {
        const left = st.ids.filter((id) => !pg.satisfied(id)).length;
        return (
          <Collapsible key={st.depth} title={L(`Stage ${i + 1}`, `Aşama ${i + 1}`)} count={st.ids.length} initial={i === stages.findIndex((s) => s.ids.some((id) => !pg.satisfied(id)))}>
            <p className="tiny muted">{left ? L(`${left} objects left`, `${left} nesne kaldı`) : L("This stage is done", "Bu aşama tamam")}</p>
            <div className="list">{st.ids.map((id) => <LORow key={id} id={id} pg={pg} onOpen={onOpen} />)}</div>
          </Collapsible>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fields, with filters for completed / missing prerequisites / interdisciplinary
// ---------------------------------------------------------------------------

type Filter = "hepsi" | "tamam" | "eksik" | "bagli";
const FILTERS = (): [Filter, string][] => [
  ["hepsi", L("All", "Hepsi")],
  ["tamam", L("Completed", "Tamamlanan")],
  ["eksik", L("Missing prerequisite", "Önkoşulu eksik")],
  ["bagli", L("Interdisciplinary", "Disiplinlerarası")],
];

function DisciplineView({ pg, onOpen }: { pg: PersonalGraph; onOpen: (id: string) => void }) {
  const { g } = pg;
  const [filter, setFilter] = useState<Filter>("hepsi");
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
        {FILTERS().map(([k, label]) => <button key={k} className={`btn small ${filter === k ? "primary" : ""}`} onClick={() => setFilter(k)}>{label}</button>)}
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
          <Collapsible key={d} title={domainLabel(d)} count={ids.length}>
            <p className="tiny muted">{L(`${done} / ${ids.length} done`, `${done} / ${ids.length} tamam`)}</p>
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
// Mappings: school, AP, competition, research — a separate layer with status
// ---------------------------------------------------------------------------

const SYSTEMS = (): [MappingSystem, string][] => [["AP", "AP"], ["OKUL", L("School", "Okul")], ["YARISMA", L("Competitions", "Yarışma")], ["ARASTIRMA", L("Research", "Araştırma")]];

function MappingView({ pg, onOpen }: { pg: PersonalGraph; onOpen: (id: string) => void }) {
  const { g } = pg;
  const [sys, setSys] = useState<MappingSystem>("AP");
  const maps = Object.values(g.mappings).filter((m) => m.system === sys);
  const frameworks = [...new Set(maps.map((m) => m.framework))];
  return (
    <div className="stack-lg">
      <div className="chip-scroll">
        {SYSTEMS().map(([k, label]) => <button key={k} className={`btn small ${sys === k ? "primary" : ""}`} onClick={() => setSys(k)}>{label}</button>)}
      </div>
      <p className="small muted">
        {L("Mappings are kept apart from the graph. ", "Eşlemeler grafikten ayrı tutulur. ")}
        <strong>{mappingStatusLabel("DOGRULANMIS")}</strong>{L(": the unit list was checked against an official source. ", ": ünite listesi resmi kaynakla karşılaştırıldı. ")}
        <strong>{mappingStatusLabel("GECICI")}</strong>{L(": plausible but not checked. ", ": makul ama doğrulanmadı. ")}
        <strong>{mappingStatusLabel("BILINMIYOR")}</strong>{L(": content unknown.", ": içerik bilinmiyor.")}
      </p>
      {frameworks.map((f) => {
        const rows = maps.filter((m) => m.framework === f);
        const ids = [...new Set(rows.flatMap((m) => m.loIds))].filter((id) => g.objects[id]);
        const done = ids.filter((id) => pg.satisfied(id)).length;
        return (
          <Collapsible key={f} title={f} count={rows.length}>
            <div className="row" style={{ gap: 6 }}>
              <span className={`chip map-${rows[0].status}`}>{mappingStatusLabel(rows[0].status)}</span>
              <span className="tiny muted">{L(`${done} / ${ids.length} objects done`, `${done} / ${ids.length} nesne tamam`)}</span>
            </div>
            {mappingNote(rows[0]) && <p className="tiny muted">{mappingNote(rows[0])}</p>}
            {rows[0].source && <p className="tiny muted mono" style={{ overflowWrap: "anywhere" }}>{L("Source", "Kaynak")}: {rows[0].source}{rows[0].checkedAt ? ` · ${rows[0].checkedAt}` : ""}</p>}
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
// Validation: the validator, never auto-fixing
// ---------------------------------------------------------------------------

const INTENTIONAL = (): Partial<Record<Issue["code"], string>> => ({
  DOGRULANMAMIS_TARIH: L("On purpose: historical and institutional content keeps this flag until checked against sources.", "Kasıtlı: tarih ve kurum içerikleri kaynakla doğrulanana kadar bu işaretle kalır."),
  KAYNAKSIZ_ICERIK: L("On purpose: the resource layer grows with you; no made-up sources were added.", "Kasıtlı: kaynak katmanı kullanıcıyla birlikte büyür; uydurma kaynak eklenmedi."),
  DISIPLINLERARASI_YOK: L("Info: some objects (e.g. grammar) naturally stay within one field.", "Bilgi: bazı nesneler (ör. dil dilbilgisi) doğal olarak tek alanda kalır."),
});

function ValidationView({ db, g, onOpen }: { db: LabDB; g: KnowledgeGraph; onOpen: (id: string) => void }) {
  const issues = useMemo(() => validateGraph(getBaseGraph(db.knowledge), { knownIds: knownIds(db), display: g }), [g, db]);
  const sum = summarize(issues);
  const byCode = new Map<string, Issue[]>();
  for (const i of issues) {
    if (!byCode.has(i.code)) byCode.set(i.code, []);
    byCode.get(i.code)!.push(i);
  }
  const intentional = INTENTIONAL();
  return (
    <div className="stack-lg">
      <div className="grid-2">
        <div className="card"><div className="eyebrow">{SEVERITY_LABEL.HATA}</div><div className="serif" style={{ fontSize: 28 }}>{sum.HATA}</div></div>
        <div className="card"><div className="eyebrow">{SEVERITY_LABEL.UYARI} · {SEVERITY_LABEL.BILGI}</div><div className="serif" style={{ fontSize: 28 }}>{sum.UYARI} · {sum.BILGI}</div></div>
      </div>
      <p className="small muted">{L("The validator only reports; it never deletes or changes an object on its own. Disconnected objects are not deleted either.", "Doğrulayıcı yalnızca raporlar; hiçbir nesneyi kendiliğinden silmez ya da değiştirmez. Bağlantısız nesneler de silinmez.")}</p>
      {sum.HATA === 0 && <div className="banner ok">{L("The graph is acyclic and every prerequisite points to an existing object.", "Grafik döngüsüz ve tüm önkoşullar var olan nesnelere işaret ediyor.")}</div>}
      {[...byCode.entries()].map(([code, list]) => (
        <Collapsible key={code} title={`${SEVERITY_LABEL[list[0].severity]}: ${ISSUE_LABEL[code as Issue["code"]]}`} count={list.length}>
          {intentional[code as Issue["code"]] && <p className="tiny muted">{intentional[code as Issue["code"]]}</p>}
          <div className="list">
            {list.slice(0, 60).map((i, k) => (
              <button key={k} className="list-item lo-row" disabled={!i.loId || !g.objects[i.loId]} onClick={() => i.loId && onOpen(i.loId)}>
                <span className="small" style={{ textAlign: "left" }}>{i.message}</span>
              </button>
            ))}
          </div>
          {list.length > 60 && <p className="tiny muted">{L(`…and ${list.length - 60} more`, `…ve ${list.length - 60} tane daha`)}</p>}
        </Collapsible>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Version: changelog, update import (diff → plan → apply), export
// ---------------------------------------------------------------------------

function VersionView({ db, g }: { db: LabDB; g: KnowledgeGraph }) {
  const [text, setText] = useState("");
  const [plan, setPlan] = useState<UpdatePlan | null>(null);
  const base = getBaseGraph(db.knowledge);
  const preview = () => {
    try {
      setPlan(diffUpdate(base, parseUpdate(text), db));
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };
  const apply = () => {
    if (!plan) return;
    try {
      const rec = store.transact((d) => applyPlan(d, plan));
      toast(L(`The graph was updated to version ${rec.toVersion}.`, `Grafik ${rec.toVersion} sürümüne güncellendi.`));
      setPlan(null);
      setText("");
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), "error");
    }
  };
  return (
    <div className="stack-lg">
      <section className="stack" style={{ gap: 10 }}>
        <h2>{L("Version history", "Sürüm geçmişi")}</h2>
        {[...db.knowledge.history].reverse().map((h) => (
          <div key={h.id} className="card stack" style={{ gap: 4 }}>
            <strong>v{h.toVersion} <span className="tiny muted">· {fmtDate(h.at)}</span></strong>
            <span className="small text-2">{h.summary}</span>
            <span className="tiny muted">{L(`${h.added.length} new · ${h.modified.length} changed · ${h.retired.length} retired`, `${h.added.length} yeni · ${h.modified.length} değişen · ${h.retired.length} kullanım dışı`)}{h.relinkedMilestones ? L(` · ${h.relinkedMilestones} steps relinked`, ` · ${h.relinkedMilestones} adım yeniden bağlandı`) : ""}</span>
          </div>
        ))}
        {CHANGELOG.map((c) => (
          <div key={c.version} className="card stack" style={{ gap: 4 }}>
            <strong>v{c.version} <span className="tiny muted">· {c.date}</span></strong>
            <span className="small">{L(c.titleEn, c.title)}</span>
            <ul className="small text-2 tight">{(getLang() === "en" ? c.notesEn : c.notes).map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        ))}
        {db.knowledge.migrations.map((m) => <p key={m.id} className="tiny muted">{L("Data migration", "Veri geçişi")}: {bilingual(m.note)}</p>)}
      </section>

      <section className="card stack">
        <h2>{L("Apply an update", "Güncelleme uygula")}</h2>
        <p className="small text-2">{L("Paste an update (written by hand or by an AI) as JSON. Lab first shows the differences and a migration plan; nothing is overwritten blindly, ids are never deleted and progress is kept.", "Bir güncellemeyi (elle ya da bir YZ'den) JSON olarak yapıştır. Lab önce farkları ve bir geçiş planı gösterir; hiçbir şey körlemesine üzerine yazılmaz, ID'ler silinmez ve ilerleme korunur.")}</p>
        <textarea className="textarea mono" style={{ minHeight: 140, fontSize: "0.8rem" }} value={text} onChange={(e) => { setText(e.target.value); setPlan(null); }}
          placeholder={'{\n  "version": "2.2.0",\n  "summary": "…",\n  "objects": [{ "id": "math.calc.limits", "entryQuestions": ["…"] }],\n  "retire": [{ "id": "…", "supersededBy": ["…", "…"] }]\n}'} />
        <div className="row">
          <button className="btn" onClick={preview} disabled={!text.trim()}>{L("Show differences", "Farkları göster")}</button>
          <button className="btn ghost small" onClick={() => saveTextFile(`lab-curriculum-v${g.version}.json`, exportGraph(base), "application/json")}>{L("Export the graph", "Grafiği dışa aktar")}</button>
        </div>
        {plan && <PlanPreview plan={plan} onApply={apply} />}
      </section>
    </div>
  );
}

function PlanPreview({ plan, onApply }: { plan: UpdatePlan; onApply: () => void }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <span className="eyebrow">{L("Migration plan", "Geçiş planı")} · v{plan.fromVersion} → v{plan.toVersion}</span>
      {plan.changes.map((c, i) => (
        <div key={i} className="row nowrap small" style={{ alignItems: "flex-start" }}>
          <span className={`chip ${c.kind === "REDDEDILDI" ? "s-LOCKED" : c.kind === "EKLE" ? "s-AVAILABLE" : c.kind === "KULLANIM_DISI" ? "s-NEEDS_REVIEW" : "s-ATTEMPTED"}`}>{CHANGE_LABEL[c.kind]}</span>
          <span className="grow"><strong>{c.title}</strong> <span className="muted mono tiny">{c.id}</span><br /><span className="text-2">{c.detail}</span>{c.affectedMilestones ? <span className="muted">{L(` · ${c.affectedMilestones} linked steps`, ` · ${c.affectedMilestones} bağlı adım`)}</span> : null}</span>
        </div>
      ))}
      {plan.newErrors.length > 0 && (
        <div className="banner warn">
          <div className="stack" style={{ gap: 4 }}>
            <strong>{L(`This update introduces ${plan.newErrors.length} new errors and cannot be applied:`, `Bu güncelleme ${plan.newErrors.length} yeni hata getiriyor; uygulanamaz:`)}</strong>
            {plan.newErrors.slice(0, 8).map((e, i) => <span key={i} className="small">{e.message}</span>)}
          </div>
        </div>
      )}
      {plan.newWarnings.length > 0 && <p className="tiny muted">{L(`${plan.newWarnings.length} new warnings (they don't block the update).`, `${plan.newWarnings.length} yeni uyarı (uygulamayı engellemez).`)}</p>}
      <button className="btn primary" disabled={!plan.ok} onClick={onApply}>{L("Apply the plan", "Planı uygula")}</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Object sheet: overview, map, mind map, cards, ask AI, explain, notes
// ---------------------------------------------------------------------------

type Tab = "overview" | "map" | "mind" | "cards" | "ask" | "explain" | "notes";
const TABS = (): [Tab, string][] => [
  ["overview", L("Overview", "Genel")],
  ["map", L("Map", "Harita")],
  ["mind", L("Mind map", "Zihin haritası")],
  ["cards", L("Cards", "Kartlar")],
  ["ask", L("Ask AI", "YZ'ye sor")],
  ["explain", L("Explain", "Anlat")],
  ["notes", L("Notes", "Notlar")],
];

function LOSheet({ id, db, pg, onOpen, onClose }: { id: string; db: LabDB; pg: PersonalGraph; onOpen: (id: string) => void; onClose: () => void }) {
  const { g } = pg;
  const o: LearningObject = g.objects[id];
  const p = pg.progress.get(id)!;
  const [tab, setTab] = useState<Tab>("overview");
  const due = cardStats(db, Date.now(), id).due;
  return (
    <Sheet title={o.title} onClose={() => { stopSpeaking(); onClose(); }} wide>
      <div className="stack">
        <div className="row" style={{ gap: 6 }}>
          <LOStateChip state={p.state} />
          <span className="chip" style={{ borderColor: DOMAIN_COLOR[o.domain] }}>{domainLabel(o.domain)}</span>
          <span className="chip">{loTypeLabel(o.milestoneType)}</span>
          {o.optional && <span className="chip s-OPTIONAL">{L("Optional", "İsteğe bağlı")}</span>}
          {o.challenge && <span className="chip k-CHALLENGE">{L("Challenge", "Meydan okuma")}</span>}
          {o.status !== "AKTIF" && <span className="chip s-LOCKED">{o.status === "YERINE_GECILDI" ? L("Superseded", "Yerine geçildi") : o.status === "KULLANIM_DISI" ? L("Retired", "Kullanım dışı") : L("Draft", "Taslak")}</span>}
        </div>
        <div className="chip-scroll" role="tablist" aria-label={L("Object tools", "Nesne araçları")}>
          {TABS().map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={`btn small ${tab === k ? "primary" : ""}`} onClick={() => setTab(k)}>
              {label}{k === "cards" && due ? ` · ${due}` : ""}
            </button>
          ))}
        </div>
        {tab === "overview" && <Overview o={o} db={db} pg={pg} onOpen={onOpen} />}
        {tab === "map" && <NeighbourhoodMap pg={pg} focus={id} onFocus={onOpen} onOpen={() => setTab("overview")} />}
        {tab === "mind" && (
          <MindMapView root={objectMindMap(o, g, db.notes[id])} onOpenObject={onOpen} fileName={`lab-${id}-mindmap`}
            onAddItem={(t) => store.transact((d) => addMapItem(d, id, t))} />
        )}
        {tab === "cards" && <ObjectFlashcards db={db} g={g} loId={id} />}
        {tab === "ask" && <AskAI db={db} g={g} loId={id} />}
        {tab === "explain" && <ExplainPanel db={db} g={g} loId={id} />}
        {tab === "notes" && <NotesTab db={db} id={id} />}
      </div>
    </Sheet>
  );
}

function NotesTab({ db, id }: { db: LabDB; id: string }) {
  const n = db.notes[id];
  const [text, setText] = useState(n?.text ?? "");
  return (
    <div className="stack">
      <textarea className="textarea" style={{ minHeight: 180 }} value={text} onChange={(e) => setText(e.target.value)} aria-label={L("Your notes", "Notların")}
        onBlur={() => text !== (n?.text ?? "") && store.transact((d) => setNoteText(d, id, text))}
        placeholder={L("Your own notes, formulas, examples… (saved automatically)", "Kendi notların, formüllerin, örneklerin… (otomatik kaydedilir)")} />
      {!!n?.mapItems.length && (
        <div className="stack" style={{ gap: 4 }}>
          <span className="eyebrow">{L("Your mind-map branches", "Zihin haritası dalların")}</span>
          {n.mapItems.map((m, i) => (
            <div key={i} className="row nowrap small"><span className="grow">{m}</span><button className="btn small ghost" onClick={() => store.transact((d) => removeMapItem(d, id, i))}>×</button></div>
          ))}
        </div>
      )}
    </div>
  );
}

function Overview({ o, db, pg, onOpen }: { o: LearningObject; db: LabDB; pg: PersonalGraph; onOpen: (id: string) => void }) {
  const { g } = pg;
  const id = o.id;
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
  const listen = () => {
    const ok = speak([o.title, o.description, `${L("Why it matters", "Neden önemli")}: ${o.whyItMatters}`, ...o.entryQuestions].join(". "), getLang());
    if (!ok) toast(L("Read-aloud is not available on this device.", "Bu cihazda sesli okuma yok."), "error");
  };
  const link = (lid: string, extra?: ReactNode) => (
    <button key={lid} className="list-item lo-row" onClick={() => onOpen(lid)}>
      {g.objects[lid] && <span className="lo-dot" style={{ background: DOMAIN_COLOR[g.objects[lid].domain] }} aria-hidden />}
      <span className="grow stack" style={{ gap: 2, minWidth: 0, textAlign: "left" }}>
        <span className="truncate">{g.objects[lid]?.title ?? lid}</span>
        {extra && <span className="tiny muted">{extra}</span>}
      </span>
      {g.objects[lid] && <LOStateChip state={pg.progress.get(lid)!.state} />}
    </button>
  );
  return (
    <div className="stack">
      <p className="tiny muted mono">{o.id} · {L("difficulty", "zorluk")} {o.difficulty}/5 · {scopeLabel(o.estimatedScope)} · {o.field} › {o.unit}</p>
      {o.supersededBy?.length ? <div className="banner warn">{L("This object was replaced by: ", "Bu nesnenin yerini şunlar aldı: ")}{o.supersededBy.map((s) => g.objects[s]?.title ?? s).join(", ")}.</div> : null}

      <div className="card accent stack" style={{ gap: 6 }}>
        <div className="row between nowrap"><span className="eyebrow">{L("Think first", "Önce düşün")}</span>
          {canSpeak() && <button className="btn small ghost" onClick={listen} aria-label={L("Read aloud", "Sesli oku")}>🔊 {L("Listen", "Dinle")}</button>}</div>
        {o.entryQuestions.map((q) => <p key={q} className="serif" style={{ fontSize: "1.08rem", margin: 0 }}>{q}</p>)}
      </div>

      <Section title={L("What is it?", "Bu ne?")}><p className="small text-2">{o.description}</p></Section>
      <Section title={L("Why does it matter?", "Neden önemli?")}><p className="small text-2">{o.whyItMatters}</p></Section>
      {o.coreQuestions.length > 0 && <Section title={L("Questions it answers", "Cevapladığı sorular")}><ul className="small text-2 tight">{o.coreQuestions.map((q) => <li key={q}>{q}</li>)}</ul></Section>}
      <Section title={L("You'll be able to", "Bunu yapabileceksin")}><ul className="small text-2 tight">{o.learningObjectives.map((q) => <li key={q}>{q}</li>)}</ul></Section>
      <Section title={L("Evidence that you've learned it", "Öğrendiğinin kanıtı")}>
        <div className="row" style={{ gap: 4 }}>{o.evidenceTypes.map((e) => <span key={e} className="chip">{evidenceLabel(e)}</span>)}</div>
        <ul className="small text-2 tight">{o.masteryCriteria.map((c) => <li key={c}>{c}</li>)}</ul>
      </Section>

      <Section title={L("Prerequisites", "Önkoşullar")}>
        {o.prerequisites.length ? (
          <div className="list">{o.prerequisites.map((pr) => link(pr.id, `${strengthLabel(pr.strength)} — ${strengthHelp(pr.strength)}`))}</div>
        ) : <p className="small muted">{L("No prerequisites; you can start right here.", "Önkoşulu yok; buradan doğrudan başlanabilir.")}</p>}
        <p className={`small ${ready.requiredGaps.length ? "" : "muted"}`}>{ready.message}</p>
      </Section>

      {o.unlocks.length > 0 && <Section title={L("Where it leads", "Açtığı yollar")}><p className="tiny muted">{L("Possible next steps; none of them is required.", "Bunlar olası sonraki adımlar; hiçbiri zorunlu değil.")}</p><div className="list">{o.unlocks.map((u) => link(u))}</div></Section>}
      {(o.interdisciplinaryLinks.length > 0 || incoming.length > 0) && (
        <Section title={L("Interdisciplinary links", "Disiplinlerarası bağlantılar")}>
          <div className="list">
            {o.interdisciplinaryLinks.map((l) => link(l.id, `${g.objects[l.id] ? domainLabel(g.objects[l.id].domain) : ""} · ${l.relation}`))}
            {incoming.filter((l) => !o.interdisciplinaryLinks.some((x) => x.id === l.id)).map((l) => link(l.id, `← ${l.relation}`))}
          </div>
        </Section>
      )}
      {o.commonMisconceptions.length > 0 && <Section title={L("Common misconceptions", "Yaygın yanılgılar")}><ul className="small text-2 tight">{o.commonMisconceptions.map((m) => <li key={m}>{m}</li>)}</ul></Section>}
      {(o.researchApplications.length > 0 || o.competitionApplications.length > 0) && (
        <Section title={L("Where it's used", "Nerede kullanılır")}>
          <ul className="small text-2 tight">
            {o.researchApplications.map((r) => <li key={r}>{L("Research", "Araştırma")}: {r}</li>)}
            {o.competitionApplications.map((r) => <li key={r}>{L("Competitions", "Yarışma")}: {r}</li>)}
          </ul>
        </Section>
      )}
      {maps.length > 0 && (
        <Section title={L("Mappings", "Eşlemeler")}>
          {maps.map((m) => (
            <div key={m.id} className="row nowrap small" style={{ alignItems: "flex-start" }}>
              <span className={`chip map-${m.status}`}>{mappingStatusLabel(m.status)}</span>
              <span className="grow">{m.framework} — {m.unit}</span>
            </div>
          ))}
        </Section>
      )}
      {o.recommendedResources.length > 0 && (
        <Section title={L("Resources", "Kaynaklar")}>
          <ul className="small text-2 tight">{o.recommendedResources.map((rid) => { const r = g.resources[rid]; return <li key={rid}>{r.title}{r.author ? ` — ${r.author}` : ""}{r.note ? <span className="muted"> ({r.note})</span> : null}</li>; })}</ul>
        </Section>
      )}
      {o.requiresSources && <div className="banner info small">{L("This object contains dates, institutions or exam information. Check the details against primary, current sources; Lab does not present them as certain.", "Bu nesne tarih, kurum ya da sınav bilgisi içeriyor. Ayrıntıları birincil ve güncel kaynaklardan doğrula; Lab bunları kesin bilgi olarak sunmaz.")}</div>}
      {p.milestones.length > 0 && (
        <Section title={L("Your steps", "Senin adımların")}>
          <p className="small text-2">{L(`${p.milestones.length} steps are linked to this object; you've mastered ${p.mastered}.`, `${p.milestones.length} adım bu nesneye bağlı; ${p.mastered} tanesinde ustalaştın.`)}</p>
        </Section>
      )}

      <div className="stack sheet-actions">
        {existing ? (
          <button className="btn primary block" onClick={() => navigate(`/course/${existing}`)}>{L("Go to the course", "Derse git")} <Icon.arrow /></button>
        ) : (
          <div className="row nowrap">
            <button className="btn primary grow" onClick={() => study(false)} disabled={o.status !== "AKTIF" && o.status !== "TASLAK"}>{L("Study this", "Bunu çalış")}</button>
            {ready.requiredGaps.length > 0 && <button className="btn grow" onClick={() => study(true)}>{L(`With the gaps (${ready.requiredGaps.length})`, `Eksiklerle birlikte (${ready.requiredGaps.length})`)}</button>}
          </div>
        )}
        <div className="row nowrap">
          <button className="btn grow small" onClick={() => store.transact((d) => setSelfAttested(d, id, !attested))}>{attested ? L("Undo my claim", "Beyanımı geri al") : L("I know this (self-reported)", "Biliyorum (kendi beyanım)")}</button>
          <button className="btn grow small" onClick={() => { const on = store.transact((d) => toggleGoal(d, id)); toast(on ? L("Added to your goals.", "Hedeflerine eklendi.") : L("Removed from your goals.", "Hedeflerinden çıkarıldı.")); }}>{isGoal ? L("Remove goal", "Hedeften çıkar") : L("Make it a goal", "Hedef yap")}</button>
        </div>
      </div>
    </div>
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
