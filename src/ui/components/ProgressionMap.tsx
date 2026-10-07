import { useEffect, useMemo, useRef, useState } from "react";
import type { ID, Milestone, MilestoneStatus, RecommendationKind } from "../../domain/types";
import { courseMilestones, courseUnits } from "../../engines/curriculum";
import { layoutMap } from "../../engines/mapLayout";
import { recommendNext, topPicks } from "../../engines/progression";
import { useDB } from "../state";
import { Difficulty, KIND_LABEL, KindChip, STATUS_LABEL, Sheet, StatusChip, TYPE_LABEL, minutes } from "./common";
import { L } from "../../i18n";

const SEEN_KEY = (courseId: ID) => `lab.map.seen.${courseId}`;

function readSeen(courseId: ID): Record<ID, MilestoneStatus> {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY(courseId)) ?? "{}");
  } catch {
    return {};
  }
}
function writeSeen(courseId: ID, v: Record<ID, MilestoneStatus>) {
  try {
    localStorage.setItem(SEEN_KEY(courseId), JSON.stringify(v));
  } catch {
    /* per-device convenience only */
  }
}

/**
 * The progression map: where you are, what's done, what's open, what's locked,
 * branches, reviews, challenges and bosses — and the recommended next steps.
 * Status changes since your last visit animate once (unlock, mastery).
 */
export function ProgressionMap({ courseId, onOpen }: { courseId: ID; onOpen: (id: ID) => void }) {
  const db = useDB();
  const ms = courseMilestones(db, courseId);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(760);
  const [selected, setSelected] = useState<ID | null>(null);
  const [filterUnit, setFilterUnit] = useState<ID | "all">("all");
  const seenRef = useRef<Record<ID, MilestoneStatus>>(readSeen(courseId));

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Remember statuses after the animation had a chance to play.
  useEffect(() => {
    const t = setTimeout(() => writeSeen(courseId, Object.fromEntries(ms.map((m) => [m.id, m.status]))), 1500);
    return () => clearTimeout(t);
  });

  const visible = filterUnit === "all" ? ms : ms.filter((m) => m.unitId === filterUnit);
  const sig = visible.map((m) => `${m.id}:${m.prerequisites.join(",")}:${m.order}`).join("|");
  const layout = useMemo(
    () => layoutMap(visible, { minWidth: Math.max(320, width) }),
    [sig, width], // `sig` captures every field the layout reads
  );
  // Wide graphs scroll inside the card; start centred on the graph rather than at its left edge.
  useEffect(() => {
    const el = wrapRef.current;
    if (el && layout.width > el.clientWidth) el.scrollLeft = (layout.width - el.clientWidth) / 2;
  }, [layout.width, filterUnit]);

  const recs = topPicks(recommendNext(db, courseId), 4);
  const recKind = new Map<ID, RecommendationKind>(recs.map((r) => [r.milestoneId, r.kind]));
  const byId = new Map(ms.map((m) => [m.id, m]));
  const units = courseUnits(db, courseId);
  const counts = ms.reduce<Record<string, number>>((acc, m) => ((acc[m.status] = (acc[m.status] ?? 0) + 1), acc), {});

  if (!ms.length) return <div className="card"><p className="text-2">{L("This course has no milestones yet. Add some in the Curriculum tab.", "Bu derste henüz adım yok. Müfredat sekmesinden ekleyebilirsin.")}</p></div>;

  const sel = selected ? byId.get(selected) : undefined;
  return (
    <div className="stack">
      <div className="row small text-2" style={{ gap: 12 }}>
        <Legend color="var(--mastered)" fill label={`${L("Mastered", "Ustalaşılan")} ${(counts.MASTERED ?? 0) + (counts.NEEDS_REVIEW ?? 0)}`} />
        <Legend color="var(--accent)" label={`${L("Open", "Açık")} ${(counts.AVAILABLE ?? 0) + (counts.ATTEMPTED ?? 0) + (counts.ACTIVE ?? 0) + (counts.OPTIONAL ?? 0) + (counts.BOSS ?? 0)}`} />
        <Legend color="var(--review)" label={`${L("Review", "Tekrar")} ${counts.NEEDS_REVIEW ?? 0}`} />
        <Legend color="var(--locked)" label={`${L("Locked", "Kilitli")} ${counts.LOCKED ?? 0}`} />
        {counts.SKIPPED ? <Legend color="var(--muted)" dashed label={`${L("Skipped", "Atlanan")} ${counts.SKIPPED}`} /> : null}
      </div>
      {units.length > 1 && (
        <div className="row" style={{ gap: 6 }}>
          <button className="btn small" aria-pressed={filterUnit === "all"} onClick={() => setFilterUnit("all")} style={filterUnit === "all" ? { borderColor: "var(--accent)" } : undefined}>{L("Whole course", "Tüm ders")}</button>
          {units.map((u) => (
            <button key={u.id} className="btn small" aria-pressed={filterUnit === u.id} onClick={() => setFilterUnit(u.id)} style={filterUnit === u.id ? { borderColor: "var(--accent)" } : undefined}>{u.title}</button>
          ))}
        </div>
      )}
      <div ref={wrapRef} className="card" style={{ padding: 0, overflowX: "auto", overflowY: "hidden", touchAction: "pan-x pan-y" }}>
        <svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} role="group" aria-label={L("Progression map", "İlerleme haritası")} style={{ display: "block" }}>
          <defs>
            <radialGradient id="halo"><stop offset="0%" stopColor="#e28a9a" stopOpacity="0.35" /><stop offset="100%" stopColor="#e28a9a" stopOpacity="0" /></radialGradient>
          </defs>
          {layout.edges.map((e) => {
            const from = byId.get(e.from)!, to = byId.get(e.to)!;
            const done = from.status === "MASTERED" || from.status === "NEEDS_REVIEW" || from.status === "SKIPPED";
            const live = done && to.status !== "LOCKED";
            return (
              <path key={`${e.from}-${e.to}`} d={e.path} fill="none"
                stroke={live ? (to.masteredAt ? "#4f7a5a" : "#9b3b50") : "#3e2229"} strokeWidth={live ? 2 : 1.5}
                strokeDasharray={to.optional ? "4 5" : undefined} style={{ transition: "stroke .6s" }} />
            );
          })}
          {[...layout.nodes.values()].map((n) => {
            const m = byId.get(n.id)!;
            const before = seenRef.current[m.id];
            const changed = before !== undefined && before !== m.status;
            return (
              <MapNodeView key={n.id} m={m} x={n.x} y={n.y} rec={recKind.get(m.id)} changed={changed} prev={before}
                isStart={db.courses[courseId]?.startHereMilestoneId === m.id && !m.masteredAt}
                onSelect={() => setSelected(m.id)} maxLabel={Math.max(12, Math.floor(layout.colWidth / 7.4))} />
            );
          })}
        </svg>
      </div>
      {recs.length > 0 && <p className="tiny muted">{L("Glowing nodes are recommended next steps. Tap any milestone — including locked ones — to see why and to open it.", "Parlayan düğümler önerilen sonraki adımlar. Nedenini görmek ve açmak için herhangi bir adıma — kilitliler dahil — dokun.")}</p>}

      {sel && (
        <Sheet title={sel.title} onClose={() => setSelected(null)}>
          <div className="stack">
            <div className="row" style={{ gap: 8 }}>
              <StatusChip status={sel.status} />
              {recKind.get(sel.id) && <KindChip kind={recKind.get(sel.id)!} />}
              <span className="small muted">{TYPE_LABEL[sel.milestoneType]}</span>
              <Difficulty value={sel.difficulty} />
              <span className="small muted">{minutes(sel.estimatedDuration)}</span>
            </div>
            <p className="serif" style={{ fontSize: "1.05rem" }}>{sel.learningObjective}</p>
            {recs.find((r) => r.milestoneId === sel.id) && (
              <ul className="small text-2" style={{ margin: 0, paddingLeft: 18 }}>{recs.find((r) => r.milestoneId === sel.id)!.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
            )}
            {sel.prerequisites.length > 0 && (
              <div className="small text-2">{L("Builds on: ", "Üzerine kurulu: ")}{sel.prerequisites.map((p) => byId.get(p)?.title + (byId.get(p)?.masteredAt ? " ✓" : "")).join(" · ")}</div>
            )}
            {sel.nextMilestones.length > 0 && <div className="small text-2">{L("Leads to: ", "Şuraya götürür: ")}{sel.nextMilestones.map((p) => byId.get(p)?.title).join(" · ")}</div>}
            <button className="btn primary" onClick={() => onOpen(sel.id)}>
              {sel.status === "LOCKED" ? L("Look inside", "İçine bak") : sel.masteredAt ? L("Practise again", "Yeniden çalış") : sel.status === "ATTEMPTED" ? L("Continue", "Devam et") : L("Open", "Aç")}
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

function Legend({ color, label, fill, dashed }: { color: string; label: string; fill?: boolean; dashed?: boolean }) {
  return (
    <span className="row nowrap" style={{ gap: 6 }}>
      <span style={{ width: 12, height: 12, borderRadius: 99, border: `2px ${dashed ? "dashed" : "solid"} ${color}`, background: fill ? color : "transparent" }} />
      {label}
    </span>
  );
}

const COLORS: Record<MilestoneStatus, { stroke: string; fill: string; text: string }> = {
  MASTERED: { stroke: "#9cc5a1", fill: "#9cc5a1", text: "#f3e9e1" },
  NEEDS_REVIEW: { stroke: "#e0b46a", fill: "#2e2214", text: "#f3e9e1" },
  ACTIVE: { stroke: "#e28a9a", fill: "#e28a9a", text: "#f3e9e1" },
  AVAILABLE: { stroke: "#e28a9a", fill: "#1f1015", text: "#f3e9e1" },
  ATTEMPTED: { stroke: "#e28a9a", fill: "#3a1822", text: "#f3e9e1" },
  OPTIONAL: { stroke: "#a9cfc0", fill: "#1f1015", text: "#d2bfb5" },
  BOSS: { stroke: "#a7a3ef", fill: "#221d36", text: "#f3e9e1" },
  LOCKED: { stroke: "#5a3039", fill: "#170b0f", text: "#a08a84" },
  SKIPPED: { stroke: "#5c4146", fill: "#170b0f", text: "#a08a84" },
};

function MapNodeView({ m, x, y, rec, changed, prev, isStart, onSelect, maxLabel }: {
  m: Milestone; x: number; y: number; rec?: RecommendationKind; changed: boolean; prev?: MilestoneStatus; isStart: boolean; onSelect: () => void; maxLabel: number;
}) {
  const c = COLORS[m.status];
  const boss = m.milestoneType === "BOSS";
  const challenge = m.milestoneType === "CHALLENGE";
  const review = m.milestoneType === "REVIEW";
  const r = boss ? 20 : 15;
  const justUnlocked = changed && prev === "LOCKED";
  const justMastered = changed && (m.status === "MASTERED");
  const label = wrap(m.title, maxLabel);
  const shape = boss
    ? <polygon points={hexagon(r)} />
    : challenge ? <rect x={-r * 0.85} y={-r * 0.85} width={r * 1.7} height={r * 1.7} rx="3" transform="rotate(45)" />
    : review ? <rect x={-r} y={-r * 0.8} width={r * 2} height={r * 1.6} rx="6" />
    : <circle r={r} />;
  return (
    <g transform={`translate(${x},${y})`} role="button" tabIndex={0} aria-label={`${m.title}, ${STATUS_LABEL[m.status]}${rec ? `, ${L("recommended", "öneri")}: ${KIND_LABEL[rec]}` : ""}`}
      onClick={onSelect} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()} style={{ cursor: "pointer", outline: "none" }} className="map-node">
      <rect x={-50} y={-28} width={100} height={84} fill="transparent" />
      {rec && <circle r={r + 16} fill="url(#halo)" className="map-halo" />}
      {justUnlocked && <circle r={r} fill="none" stroke="#e28a9a" strokeWidth="2" className="map-burst" />}
      <g fill={c.fill} stroke={c.stroke} strokeWidth={m.status === "ACTIVE" ? 3 : 2} strokeDasharray={m.status === "SKIPPED" || m.optional ? "3 3" : undefined}
        style={{ transition: "fill .6s, stroke .6s" }} className={justUnlocked ? "map-pop" : justMastered ? "map-fill" : undefined}>
        {shape}
      </g>
      {m.status === "MASTERED" && <path d="M-6 0l4 4 8-9" fill="none" stroke="#150a0d" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
      {m.status === "LOCKED" && <g stroke="#a08a84" strokeWidth="1.6" fill="none"><rect x="-5" y="-2" width="10" height="8" rx="1.5" /><path d="M-3 -2v-2.5a3 3 0 0 1 6 0V-2" /></g>}
      {m.status === "NEEDS_REVIEW" && <text y="5" textAnchor="middle" fontSize="14" fill="#e0b46a" fontWeight="700">↻</text>}
      {m.status === "ACTIVE" && <circle r="5" fill="#150a0d" />}
      {m.status === "ATTEMPTED" && <path d={`M0 ${-r} A${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke="#e28a9a" strokeWidth="4" />}
      {isStart && <text y={-r - 8} textAnchor="middle" fontSize="10" letterSpacing="1.5" fill="#e28a9a" fontWeight="700">{L("START HERE", "BURADAN BAŞLA")}</text>}
      {label.map((line, i) => (
        <text key={i} y={r + 16 + i * 14} textAnchor="middle" fontSize="12" fill={c.text} style={{ fontFamily: "var(--sans)" }}>{line}</text>
      ))}
    </g>
  );
}

function hexagon(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function wrap(s: string, max: number): string[] {
  const words = s.replace(/^(Boss|Challenge|Review|Final|Meydan okuma|Tekrar):\s*/i, "").split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length === 2) break;
    } else cur = (cur + " " + w).trim();
  }
  if (lines.length < 2 && cur) lines.push(cur);
  if (lines.length === 2 && words.join(" ").length > lines.join(" ").length) lines[1] = lines[1].slice(0, max - 1) + "…";
  return lines.slice(0, 2);
}
