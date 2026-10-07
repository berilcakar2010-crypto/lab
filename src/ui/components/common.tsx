import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { MilestoneStatus, MilestoneType, RecommendationKind } from "../../domain/types";
import { useToasts } from "../state";

const P = { width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Icon = {
  home: () => <svg viewBox="0 0 24 24" {...P}><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></svg>,
  map: () => <svg viewBox="0 0 24 24" {...P}><circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="8" r="2.2" /><circle cx="9" cy="18" r="2.2" /><path d="M8 7l8 1M7 8l2 8M16.5 9.8L10.5 16.4" /></svg>,
  stats: () => <svg viewBox="0 0 24 24" {...P}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>,
  flask: () => <svg viewBox="0 0 24 24" {...P}><path d="M9 3h6M10 3v6l-5.5 9.5A1.6 1.6 0 0 0 5.9 21h12.2a1.6 1.6 0 0 0 1.4-2.5L14 9V3" /><path d="M7.5 15h9" /></svg>,
  memory: () => <svg viewBox="0 0 24 24" {...P}><path d="M12 6V3M12 21v-3M6 12H3M21 12h-3" /><circle cx="12" cy="12" r="5" /><path d="M12 9.5V12l1.8 1.2" /></svg>,
  gear: () => <svg viewBox="0 0 24 24" {...P}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>,
  plus: () => <svg viewBox="0 0 24 24" {...P}><path d="M12 5v14M5 12h14" /></svg>,
  back: () => <svg viewBox="0 0 24 24" {...P}><path d="M15 18l-6-6 6-6" /></svg>,
  close: () => <svg viewBox="0 0 24 24" {...P}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  check: () => <svg viewBox="0 0 24 24" {...P}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  lock: () => <svg viewBox="0 0 24 24" {...P}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  arrow: () => <svg viewBox="0 0 24 24" {...P}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  edit: () => <svg viewBox="0 0 24 24" {...P}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M14 6l4 4" /></svg>,
  spark: () => <svg viewBox="0 0 24 24" {...P}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" /></svg>,
  bulb: () => <svg viewBox="0 0 24 24" {...P}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" /></svg>,
  up: () => <svg viewBox="0 0 24 24" {...P}><path d="M6 15l6-6 6 6" /></svg>,
  down: () => <svg viewBox="0 0 24 24" {...P}><path d="M6 9l6 6 6-6" /></svg>,
};

export function Sheet({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  // Portal to <body> so animated (transformed) ancestors can't offset the fixed overlay.
  return createPortal(
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div className="sheet" style={wide ? { maxWidth: 860 } : undefined} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="row between nowrap" style={{ marginBottom: 16 }}>
          <h2>{title}</h2>
          <button className="btn ghost small" onClick={onClose} aria-label="Close"><Icon.close /></button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export const STATUS_LABEL: Record<MilestoneStatus, string> = {
  LOCKED: "Locked", AVAILABLE: "Available", ACTIVE: "Active", ATTEMPTED: "In progress", MASTERED: "Mastered",
  NEEDS_REVIEW: "Needs review", SKIPPED: "Skipped", OPTIONAL: "Optional", BOSS: "Boss",
};

export const KIND_LABEL: Record<RecommendationKind, string> = {
  CONTINUE: "Continue", REVIEW: "Review", PRACTICE: "Practice", CHALLENGE: "Challenge", EXPLORE: "Explore", BOSS: "Boss",
};

export const TYPE_LABEL: Record<MilestoneType, string> = {
  CONCEPT: "Concept", PRACTICE: "Practice", APPLICATION: "Application", DERIVATION: "Derivation", PROOF: "Proof",
  PROBLEM_SOLVING: "Problem solving", EXPERIMENT: "Experiment", PROJECT: "Project", REVIEW: "Review", CHALLENGE: "Challenge", BOSS: "Boss",
};

export const StatusChip = ({ status }: { status: MilestoneStatus }) => <span className={`chip s-${status}`}>{STATUS_LABEL[status]}</span>;
export const KindChip = ({ kind }: { kind: RecommendationKind }) => <span className={`chip k-${kind}`}>{KIND_LABEL[kind]}</span>;

export function Toasts() {
  const list = useToasts();
  if (!list.length) return null;
  const t = list[list.length - 1];
  return <div className={`toast ${t.kind === "error" ? "error" : ""}`} role="status" aria-live="polite">{t.text}</div>;
}

export function Bar({ value, mastered }: { value: number; mastered?: boolean }) {
  return <div className={`bar ${mastered ? "mastered" : ""}`} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} /></div>;
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty"><h3>{title}</h3>{children}</div>;
}

export const minutes = (n: number) => (n >= 90 ? `${Math.round((n / 60) * 10) / 10} h` : `${Math.round(n)} min`);

export function Difficulty({ value }: { value: number }) {
  return (
    <span className="row nowrap" style={{ gap: 3 }} aria-label={`Difficulty ${value} of 5`} title={`Difficulty ${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: 2, background: i <= value ? "var(--text-2)" : "var(--border-strong)" }} />
      ))}
    </span>
  );
}
