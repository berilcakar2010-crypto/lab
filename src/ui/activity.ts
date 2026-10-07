import { useEffect } from "react";
import type { ID } from "../domain/types";
import { logEvent } from "../engines/analytics";
import { act } from "./state";

export const IDLE_AFTER_MS = 60_000;
const HEARTBEAT_MS = 120_000;

/**
 * Records raw activity events for the session: idle stretches (no input for a
 * minute — shorter pauses count as thinking), interruptions (app hidden), and
 * a sparse heartbeat so an abandoned session still has a last-activity point.
 * Active time is later derived from these events, never stored as a total.
 */
export function useActivityTracker(sessionId: ID | null, milestoneId?: ID) {
  useEffect(() => {
    if (!sessionId) return;
    const ctx = { sessionId, milestoneId };
    let lastInput = Date.now();
    let lastBeat = Date.now();
    let idle = false;
    let hiddenAt: number | null = null;

    const endIdle = (now: number) => {
      if (!idle) return;
      idle = false;
      act((d) => logEvent(d, "IDLE_END", { ...ctx, at: now }, {}));
    };
    const onInput = () => {
      const now = Date.now();
      endIdle(now);
      lastInput = now;
    };
    const onVisibility = () => {
      const now = Date.now();
      if (document.visibilityState === "hidden" && hiddenAt === null) {
        endIdle(now);
        hiddenAt = now;
        act((d) => logEvent(d, "INTERRUPTION", { ...ctx, at: now }, { phase: "start", cause: "hidden" }));
      } else if (document.visibilityState === "visible" && hiddenAt !== null) {
        act((d) => logEvent(d, "INTERRUPTION", { ...ctx, at: now }, { phase: "end", durationMs: now - hiddenAt! }));
        hiddenAt = null;
        lastInput = now;
      }
    };
    const timer = setInterval(() => {
      const now = Date.now();
      if (hiddenAt !== null) return;
      if (!idle && now - lastInput > IDLE_AFTER_MS) {
        idle = true;
        // Idle began at the last input, not when we noticed it.
        act((d) => logEvent(d, "IDLE_START", { ...ctx, at: lastInput }, { thresholdMs: IDLE_AFTER_MS }));
      } else if (!idle && now - lastBeat > HEARTBEAT_MS) {
        lastBeat = now;
        act((d) => logEvent(d, "ACTIVITY_TICK", { ...ctx, at: now }, {}));
      }
    }, 5000);

    const opts = { passive: true, capture: true } as const;
    const evs = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"] as const;
    let moveThrottle = 0;
    const handler = (e: Event) => {
      if (e.type === "pointermove") {
        const now = Date.now();
        if (now - moveThrottle < 2000) return;
        moveThrottle = now;
      }
      onInput();
    };
    evs.forEach((t) => window.addEventListener(t, handler, opts));
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(timer);
      endIdle(Date.now());
      evs.forEach((t) => window.removeEventListener(t, handler, opts));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [sessionId, milestoneId]);
}
