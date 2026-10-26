// The mark: one continuous traced line. Placeholder drawing until the brand sprint (D8).
// The same path is used by the WebGL light-trail and emboss scenes.
export const MARK_PATH = "M4 44C24 44 40 40 52 28C62 18 60 6 50 6C40 6 38 20 48 30C60 42 84 46 116 30";

type Props = {
  className?: string;
  /** 0 to 1. When set, only that share of the line is drawn. */
  draw?: number;
  /** Draw a faint full line under the drawn part. */
  track?: boolean;
  strokeWidth?: number;
};

export function Mark({ className, draw, track, strokeWidth = 3.2 }: Props) {
  const drawn = draw === undefined ? undefined : { strokeDasharray: 1, strokeDashoffset: 1 - draw };
  return (
    <svg className={className} viewBox="0 0 120 52" aria-hidden="true" focusable="false">
      {track && (
        <path d={MARK_PATH} pathLength={1} fill="none" stroke="currentColor" strokeOpacity={0.28} strokeWidth={strokeWidth} strokeLinecap="round" />
      )}
      <path
        className="mark-line"
        d={MARK_PATH}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={drawn}
      />
    </svg>
  );
}
