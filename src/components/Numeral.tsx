/**
 * Roman numerals drawn with the logo's own stroke: round-capped bars and a closing dot,
 * so the chapter numbers read as part of the mark. The film draws them in as each chapter opens
 * (CSS variable --draw from 0 to 1 on a parent).
 */
const SW = 11; // stroke width, about a ninth of the height, as in the mark
const H = 89; // stroke length inside a 100-unit box
const GAP = 24; // space between strokes
const VHALF = 30; // half the width of a V
const DOT = 8; // dot radius

export function Numeral({ value, className }: { value: string; className?: string }) {
  const top = SW / 2;
  const bottom = SW / 2 + H;
  let x = SW / 2;
  const paths: string[] = [];
  for (const ch of value) {
    if (ch === "I") {
      paths.push(`M${x} ${top}V${bottom}`);
      x += GAP;
    } else if (ch === "V") {
      paths.push(`M${x} ${top}L${x + VHALF} ${bottom}L${x + 2 * VHALF} ${top}`);
      x += 2 * VHALF + GAP;
    }
  }
  const lastEdge = x - GAP;
  const cx = lastEdge + SW / 2 + 9 + DOT;
  const width = cx + DOT + 1;
  return (
    <svg className={`numeral ${className ?? ""}`} viewBox={`0 0 ${width} 100`} aria-hidden="true" focusable="false">
      {paths.map((d) => (
        <path key={d} d={d} pathLength={1} />
      ))}
      <circle cx={cx} cy={100 - DOT} r={DOT} />
    </svg>
  );
}
