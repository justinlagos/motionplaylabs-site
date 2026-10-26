import type { CSSProperties } from "react";
import { type Stage, stages } from "@/content/products";

const position = (stage: Stage) => stages.indexOf(stage as (typeof stages)[number]);

/** Where a product sits on the five stages. The logo's dot marks the current one. */
export function StageTrack({ stage }: { stage: Stage }) {
  const at = position(stage);
  const parked = at < 0;
  return (
    <ol
      className={`stage-track${parked ? " is-parked" : ""}`}
      aria-label={parked ? "Stages. This product is parked." : "Stages"}
      style={{ "--p": parked ? 0 : at / stages.length } as CSSProperties}
    >
      {stages.map((s, i) => (
        <li key={s} className={i < at ? "is-done" : i === at ? "is-here" : undefined} aria-current={i === at ? "step" : undefined}>
          {s}
        </li>
      ))}
    </ol>
  );
}

/** Five short bars for lists: filled up to the current stage. */
export function StageMini({ stage }: { stage: Stage }) {
  const at = position(stage);
  return (
    <span className={`stage-mini${at < 0 ? " is-parked" : ""}`} aria-hidden="true">
      {stages.map((s, i) => (
        <span key={s} className={i <= at ? "is-on" : undefined} />
      ))}
    </span>
  );
}

export const stageRank = (stage: Stage) => position(stage);
