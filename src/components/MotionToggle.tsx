"use client";

import { setPaused, useMotionPaused } from "@/lib/motion";

/** Pauses every moving scene on the site. Shown wherever footage is moving. */
export function MotionToggle({ className = "" }: { className?: string }) {
  const paused = useMotionPaused();
  return (
    <button type="button" className={`motion-toggle ${className}`} aria-pressed={paused} onClick={() => setPaused(!paused)}>
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}
