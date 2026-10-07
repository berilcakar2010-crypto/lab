import type { CSSProperties } from "react";

/**
 * Renders question text with light typographic treatment: paragraphs,
 * superscripts for ^n, and monospaced inline `code`.
 */
export function MathText({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const paras = text.split(/\n{2,}/);
  return (
    <div className={className} style={style}>
      {paras.map((p, i) => (
        <p key={i} style={{ marginTop: i ? 8 : 0, whiteSpace: "pre-wrap" }}>{renderInline(p)}</p>
      ))}
    </div>
  );
}

function renderInline(s: string) {
  const parts = s.split(/(`[^`]+`|\^\(?[-\d.a-z/]+\)?)/gi);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="mono" style={{ background: "var(--raised-2)", padding: "1px 5px", borderRadius: 5 }}>{part.slice(1, -1)}</code>;
    if (part.startsWith("^")) return <sup key={i}>{part.slice(1).replace(/^\((.*)\)$/, "$1")}</sup>;
    return <span key={i}>{part}</span>;
  });
}
