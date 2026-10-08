import { useEffect, useRef, useState } from "react";
import { store } from "../state";

const reduced = () =>
  store?.state?.preferences.reduceMotion || (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

/** A number that counts up to its value (ease-out, ~0.7 s). Text, not animation, carries the meaning. */
export function CountUp({ value, format = (n) => String(Math.round(n)) }: { value: number; format?: (n: number) => string }) {
  const [shown, setShown] = useState(() => (reduced() ? value : 0));
  const from = useRef(shown);
  useEffect(() => {
    if (reduced()) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 700);
      const v = a + (value - a) * (1 - Math.pow(1 - k, 3));
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(shown)}</>;
}

const COLORS = ["#e28a9a", "#f3e9e1", "#9cc5a1", "#e0b46a", "#a7a3ef"];

/** A small burst of sparks (pure CSS), e.g. when a review session is finished. */
export function Celebrate({ count = 18 }: { count?: number }) {
  const [sparks] = useState(() =>
    Array.from({ length: count }, (_, i) => {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const d = 50 + Math.random() * 60;
      return { dx: `${Math.cos(a) * d}px`, dy: `${Math.sin(a) * d - 20}px`, r: `${Math.round(Math.random() * 360)}deg`, c: COLORS[i % COLORS.length], delay: Math.random() * 0.15 };
    }),
  );
  if (reduced()) return null;
  return (
    <div className="celebrate" aria-hidden>
      {sparks.map((s, i) => (
        <i key={i} style={{ background: s.c, animationDelay: `${s.delay}s`, ["--dx" as string]: s.dx, ["--dy" as string]: s.dy, ["--r" as string]: s.r }} />
      ))}
    </div>
  );
}
