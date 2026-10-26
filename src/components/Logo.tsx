import { useId } from "react";
import { BADGE, HORIZONTAL, STACKED } from "./logo-art";

type Common = { className?: string; title?: string };

function a11y(title?: string) {
  return title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const, focusable: "false" as const };
}

/** Mark, rule and stacked name. Used in the header. */
export function LogoHorizontal({ className, title }: Common) {
  return (
    <svg className={className} viewBox={HORIZONTAL.viewBox} {...a11y(title)}>
      <g fill="currentColor">
        {HORIZONTAL.mark.map((d) => (
          <path key={d} d={d} />
        ))}
        <circle cx={HORIZONTAL.dot.cx} cy={HORIZONTAL.dot.cy} r={HORIZONTAL.dot.r} />
        {HORIZONTAL.word.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <line {...HORIZONTAL.rule} stroke="currentColor" strokeOpacity={0.5} strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Mark over the name, centred. Used in the footer. */
export function LogoStacked({ className, title }: Common) {
  return (
    <svg className={className} viewBox={STACKED.viewBox} {...a11y(title)}>
      <g fill="currentColor">
        {STACKED.mark.map((d) => (
          <path key={d} d={d} />
        ))}
        <circle cx={STACKED.dot.cx} cy={STACKED.dot.cy} r={STACKED.dot.r} />
        {STACKED.motionPlay.map((d) => (
          <path key={d} d={d} />
        ))}
        {STACKED.labs.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The circle badge. The ring turns about its centre (CSS var --ring, or the .is-looping class),
 * and the mark can draw itself in once (.is-drawing): bar, then chevron, then the dot.
 */
export function Badge({ className, title }: Common) {
  const id = useId().replace(/:/g, "");
  const { x, y } = BADGE.centre;
  return (
    <svg className={`badge ${className ?? ""}`} viewBox={BADGE.viewBox} {...a11y(title)}>
      <defs>
        <mask id={`badge-draw-${id}`} maskUnits="userSpaceOnUse" x="565" y="307" width="666" height="666">
          <path className="badge-stroke s1" d="M718 696 L842 569" pathLength={1} />
          <path className="badge-stroke s2" d="M860 702 L972 587 L1034 651" pathLength={1} />
        </mask>
      </defs>
      <g className="badge-ring" fill="currentColor">
        {/* Invisible circle keeps the ring's box centred on the ring for rotation. */}
        <circle cx={x} cy={y} r={331} fill="none" />
        {BADGE.ringTop.map((d) => (
          <path key={d} d={d} />
        ))}
        {BADGE.ringBottom.map((d) => (
          <path key={d} d={d} />
        ))}
        {BADGE.ticks.map((t) => (
          <rect key={t.x} {...t} />
        ))}
      </g>
      <g className="badge-mark" fill="currentColor" mask={`url(#badge-draw-${id})`}>
        {BADGE.mark.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle className="badge-dot" cx={BADGE.dot.cx} cy={BADGE.dot.cy} r={BADGE.dot.r} fill="currentColor" />
    </svg>
  );
}
