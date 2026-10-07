import type { ReactNode } from "react";
import type { Rate } from "../../engines/statistics";
import { L } from "../../i18n";

export const pct = (x: number) => L(`${Math.round(x * 100)}%`, `%${Math.round(x * 100)}`);

/** Headline number, or an explicit insufficient-data state instead of a fake value. */
export function StatTile({ label, value, note, needed }: { label: string; value: ReactNode | null; note?: ReactNode; needed?: string }) {
  return (
    <div className="card stack" style={{ gap: 4, padding: 14 }}>
      <span className="eyebrow">{label}</span>
      {value === null ? (
        <span className="small muted" style={{ minHeight: 34, display: "flex", alignItems: "center" }}>{L("Not enough data", "Yeterli veri yok")}{needed ? ` (${needed})` : ""}</span>
      ) : (
        <span className="serif" style={{ fontSize: 28, lineHeight: 1.2 }}>{value}</span>
      )}
      {note && <span className="tiny muted">{note}</span>}
    </div>
  );
}

export function RateTile({ label, r, note }: { label: string; r: Rate; note?: string }) {
  return (
    <StatTile label={label} value={r.value === null ? null : pct(r.value)} needed={L(`${r.n} of ${Math.max(r.n + 1, 5)} needed`, `${r.n}/${Math.max(r.n + 1, 5)} gözlem`)}
      note={r.value === null ? note : <>{r.k}/{r.n} · {L("likely", "olası aralık")} {pct(r.low!)}–{pct(r.high!)}{note ? ` · ${note}` : ""}</>} />
  );
}

/**
 * One single-series bar per group: magnitude in one hue, value and sample size
 * in text ink, the 95% interval as a recessive band. Hover shows the exact counts.
 */
export function RateBars({ rows, empty }: { rows: { label: string; r: Rate }[]; empty?: string }) {
  const usable = rows.filter((x) => x.r.n > 0);
  if (!usable.length) return <p className="small muted">{empty ?? L("No data yet.", "Henüz veri yok.")}</p>;
  return (
    <div className="stack" style={{ gap: 8 }} role="table">
      {usable.map(({ label, r }) => (
        <div key={label} className="row nowrap" style={{ gap: 10 }} role="row" title={L(`${label}: ${r.k} of ${r.n}${r.value !== null ? ` (${pct(r.value)}, 95% interval ${pct(r.low!)}–${pct(r.high!)})` : " — not enough data"}`, `${label}: ${r.k}/${r.n}${r.value !== null ? ` (${pct(r.value)}, %95 aralık ${pct(r.low!)}–${pct(r.high!)})` : " — yeterli veri yok"}`)}>
          <span className="small text-2 truncate" style={{ width: "34%", minWidth: 110 }} role="cell">{label}</span>
          <div style={{ flex: 1, height: 14, position: "relative", background: "var(--raised-2)", borderRadius: 4 }} role="cell">
            {r.value !== null && (
              <>
                <span style={{ position: "absolute", left: `${r.low! * 100}%`, width: `${(r.high! - r.low!) * 100}%`, top: 0, bottom: 0, background: "rgba(226,138,154,0.16)", borderRadius: 4 }} />
                <span style={{ position: "absolute", left: 0, width: `${r.value * 100}%`, top: 4, bottom: 4, background: "var(--accent)", borderRadius: "0 4px 4px 0", transition: "width .6s var(--ease)" }} />
              </>
            )}
          </div>
          <span className="small mono" style={{ width: 92, textAlign: "right" }} role="cell">
            {r.value === null ? <span className="muted">n={r.n}</span> : <>{pct(r.value)} <span className="muted">n={r.n}</span></>}
          </span>
        </div>
      ))}
    </div>
  );
}
