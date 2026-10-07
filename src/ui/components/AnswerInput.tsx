import { useMemo, useState } from "react";
import type { Question } from "../../domain/types";
import type { Answer } from "../../engines/evaluation";
import { answerMode } from "../../engines/evaluation";
import { Icon } from "./common";

/** Shuffle deterministically per question so retries see a stable order. */
export function stableShuffle<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) | 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) | 0;
    const j = Math.abs(h) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  // Never present an ordering task already solved.
  if (out.length > 1 && out.every((x, i) => x === items[i])) out.push(out.shift()!);
  return out;
}

export interface AnswerInputProps {
  question: Question;
  value: Answer | null;
  onChange: (a: Answer) => void;
  disabled?: boolean;
  /** Called on Enter in single-line inputs. */
  onSubmit?: () => void;
}

export function AnswerInput({ question: q, value, onChange, disabled, onSubmit }: AnswerInputProps) {
  const mode = answerMode(q);
  switch (mode) {
    case "choice":
      return <ChoiceInput q={q} value={value?.kind === "choice" ? value.index : null} onChange={(index) => onChange({ kind: "choice", index })} disabled={disabled} />;
    case "number":
      return (
        <div className="row nowrap">
          <input
            className="input mono" inputMode="decimal" autoComplete="off" placeholder="Cevabın, örn. 8,66"
            aria-label="Sayısal cevap" disabled={disabled}
            value={value?.kind === "number" ? value.text : ""}
            onChange={(e) => onChange({ kind: "number", text: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
          />
          {q.numeric?.unit && <span className="muted mono" style={{ minWidth: 40 }}>{q.numeric.unit}</span>}
        </div>
      );
    case "expression":
      return (
        <div className="stack" style={{ gap: 6 }}>
          <input
            className="input mono" autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="örn. 6*t + 2"
            aria-label="İfade cevabı" disabled={disabled}
            value={value?.kind === "expression" ? value.text : ""}
            onChange={(e) => onChange({ kind: "expression", text: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
          />
          <MathKeys disabled={disabled} vars={q.variables ?? []} onKey={(k) => onChange({ kind: "expression", text: (value?.kind === "expression" ? value.text : "") + k })} />
        </div>
      );
    case "order":
      return <OrderInput q={q} value={value?.kind === "order" ? value.items : null} onChange={(items) => onChange({ kind: "order", items })} disabled={disabled} />;
    case "classify":
      return <ClassifyInput q={q} value={value?.kind === "classify" ? value.map : {}} onChange={(map) => onChange({ kind: "classify", map })} disabled={disabled} />;
    default:
      return (
        <textarea
          className="textarea" placeholder="Cevabını yaz. Akıl yürütmeni göster." aria-label="Yazılı cevap" disabled={disabled}
          value={value?.kind === "text" ? value.text : ""}
          onChange={(e) => onChange({ kind: "text", text: e.target.value, drawing: value?.kind === "text" ? value.drawing : undefined })}
        />
      );
  }
}

function ChoiceInput({ q, value, onChange, disabled }: { q: Question; value: number | null; onChange: (i: number) => void; disabled?: boolean }) {
  const order = useMemo(() => stableShuffle(q.choices!.map((_, i) => i), q.id), [q.id, q.choices]);
  return (
    <div className="stack" style={{ gap: 8 }} role="radiogroup">
      {order.map((i) => (
        <button
          key={i} type="button" role="radio" aria-checked={value === i} disabled={disabled}
          className="btn" onClick={() => onChange(i)}
          style={{ justifyContent: "flex-start", textAlign: "left", padding: "10px 14px", height: "auto", fontWeight: 450,
            borderColor: value === i ? "var(--accent)" : undefined, background: value === i ? "var(--accent-soft)" : undefined }}
        >
          <span style={{ width: 18, height: 18, borderRadius: 999, border: "2px solid", borderColor: value === i ? "var(--accent)" : "var(--border-strong)", flex: "none", display: "grid", placeItems: "center" }}>
            {value === i && <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />}
          </span>
          <span>{q.choices![i]}</span>
        </button>
      ))}
    </div>
  );
}

function OrderInput({ q, value, onChange, disabled }: { q: Question; value: string[] | null; onChange: (items: string[]) => void; disabled?: boolean }) {
  const initial = useMemo(() => stableShuffle(q.orderItems!, q.id), [q.id, q.orderItems]);
  const items = value ?? initial;
  const [drag, setDrag] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };
  return (
    <ol className="stack" style={{ gap: 8, padding: 0, margin: 0, listStyle: "none" }} aria-label="Sıralamak için sürükle ya da okları kullan">
      {items.map((item, i) => (
        <li
          key={item}
          draggable={!disabled}
          onDragStart={() => setDrag(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => { if (drag !== null) move(drag, i); setDrag(null); }}
          className="card raised row nowrap"
          style={{ padding: "8px 10px", opacity: drag === i ? 0.5 : 1, touchAction: "manipulation" }}
        >
          <span className="mono muted" style={{ width: 20 }}>{i + 1}</span>
          <span className="grow">{item}</span>
          <button type="button" className="btn ghost small" aria-label="Yukarı taşı" disabled={disabled || i === 0} onClick={() => move(i, i - 1)}><Icon.up /></button>
          <button type="button" className="btn ghost small" aria-label="Aşağı taşı" disabled={disabled || i === items.length - 1} onClick={() => move(i, i + 1)}><Icon.down /></button>
        </li>
      ))}
      {value === null && !disabled && (
        <li><button type="button" className="btn ghost small" onClick={() => onChange(items)}>Cevabım bu sıralama</button></li>
      )}
    </ol>
  );
}

function ClassifyInput({ q, value, onChange, disabled }: { q: Question; value: Record<string, string>; onChange: (m: Record<string, string>) => void; disabled?: boolean }) {
  const c = q.classification!;
  const items = useMemo(() => stableShuffle(c.items.map((i) => i.text), q.id), [q.id, c.items]);
  return (
    <div className="stack" style={{ gap: 10 }}>
      {items.map((text) => (
        <div key={text} className="card raised" style={{ padding: 10 }}>
          <div style={{ marginBottom: 8 }}>{text}</div>
          <div className="row" style={{ gap: 6 }}>
            {c.categories.map((cat) => (
              <button key={cat} type="button" disabled={disabled} className="btn small"
                style={{ borderColor: value[text] === cat ? "var(--accent)" : undefined, background: value[text] === cat ? "var(--accent-soft)" : undefined }}
                onClick={() => onChange({ ...value, [text]: cat })}>{cat}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MathKeys({ onKey, vars, disabled }: { onKey: (k: string) => void; vars: string[]; disabled?: boolean }) {
  const keys = [...vars, "^", "*", "/", "(", ")", "sqrt(", "pi", "sin(", "cos("];
  return (
    <div className="row" style={{ gap: 6 }}>
      {keys.map((k) => (
        <button key={k} type="button" className="btn small mono" disabled={disabled} onClick={() => onKey(k)} style={{ minWidth: 44 }}>{k}</button>
      ))}
    </div>
  );
}
