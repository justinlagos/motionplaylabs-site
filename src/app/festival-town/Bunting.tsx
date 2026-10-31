// A string of flags, like the ones strung across the town in the game.
// Each flag is its own group so CSS can drop it in and let it sway (see .ftx-bunting in ft.css).

const colours = ["#FFC23A", "#17A2A8", "#D6336C", "#3E9B5A", "#F26A1F", "#6A35D9"];

function q(p0: [number, number], p1: [number, number], p2: [number, number], t: number): [number, number] {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
}

export function Bunting({ className = "", flags = 22, sag = 70, height = 110, offset = 0 }: { className?: string; flags?: number; sag?: number; height?: number; offset?: number }) {
  const w = 1440;
  const p0: [number, number] = [-10, 14];
  const p1: [number, number] = [w / 2, 14 + sag * 2];
  const p2: [number, number] = [w + 10, 14];
  const items: string[] = [];
  for (let i = 0; i <= flags; i++) {
    const t = (i + 0.5) / (flags + 1);
    const [x, y] = q(p0, p1, p2, t);
    const next = q(p0, p1, p2, t + 0.004);
    const ang = (Math.atan2(next[1] - y, next[0] - x) * 180) / Math.PI;
    const c = colours[(i + offset) % colours.length];
    items.push(
      `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})"><g class="flag" style="--i:${i}"><path d="M-17 0 L17 0 L0 36 Z" fill="${c}"/><path d="M-17 0 L0 0 L0 36 Z" fill="rgba(255,255,255,.2)"/></g></g>`,
    );
  }
  const string = `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
  const svg = `<path class="cord" d="${string}" fill="none" stroke="#22306E" stroke-width="3" stroke-linecap="round"/>${items.join("")}`;
  return <svg className={`ftx-bunting ${className}`} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="xMidYMin slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
