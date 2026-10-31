// Flat stamp shapes for the page's graphic language: the circle, star and triangle that Aunty Kemi
// stamps on adire cloth, plus a rosette sun. Drawn from polar curves so every edge stays soft,
// like the game's rounded art. Colour comes from CSS (currentColor).

const polar = (n: number, r: (t: number) => number) => {
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rr = r(t);
    pts.push(`${(100 + rr * Math.cos(t)).toFixed(2)} ${(100 + rr * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
};

/** Scalloped festival rosette. */
export const rosette = (bumps = 14, depth = 7) => polar(360, (t) => 88 + depth * Math.cos(bumps * (t + Math.PI / 2)));

/** Soft five-point star. */
export const star = () =>
  polar(400, (t) => {
    const k = Math.cos(2.5 * (t + Math.PI / 2));
    return 44 + 52 * Math.pow(Math.abs(k), 2.2);
  });

/** Soft triangle (a rounded, three-lobed curve). */
export const tri = () =>
  polar(360, (t) => {
    const k = Math.cos(1.5 * (t + Math.PI / 2));
    return 58 + 40 * Math.pow(Math.abs(k), 3);
  });

/** Soft four-point diamond. */
export const diamond = () =>
  polar(360, (t) => {
    const k = Math.cos(2 * (t + Math.PI / 2));
    return 62 + 34 * Math.pow(Math.abs(k), 3);
  });

const PATHS = { sun: rosette(), star: star(), tri: tri(), diamond: diamond() };

export type ShapeKind = "sun" | "star" | "tri" | "diamond" | "circle" | "ring" | "dots";

export function Shape({ kind, className = "" }: { kind: ShapeKind; className?: string }) {
  return (
    <svg className={`ftx-shape is-${kind} ${className}`} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {kind === "circle" && <circle cx="100" cy="100" r="96" fill="currentColor" />}
      {kind === "ring" && (
        <g fill="none" stroke="currentColor" strokeWidth="10">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="58" />
          <circle cx="100" cy="100" r="16" fill="currentColor" stroke="none" />
        </g>
      )}
      {kind === "dots" && (
        <g fill="currentColor">
          {Array.from({ length: 25 }, (_, i) => (
            <circle key={i} cx={20 + (i % 5) * 40} cy={20 + Math.floor(i / 5) * 40} r="7" />
          ))}
        </g>
      )}
      {(kind === "sun" || kind === "star" || kind === "tri" || kind === "diamond") && <path d={PATHS[kind]} fill="currentColor" />}
    </svg>
  );
}
