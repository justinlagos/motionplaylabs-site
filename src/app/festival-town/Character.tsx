import { sprites } from "@/content/festival-town-sprites";

type Props = {
  id: string;
  pose: string;
  alt: string;
  className?: string;
  /** Blink offset so a group does not blink in step. */
  delay?: number;
  bob?: boolean;
  priority?: boolean;
  /** Only the four friends have closed-eye layers; neighbours do not. */
  blink?: boolean;
};

const BLINKERS = new Set(["ada", "tobi", "amina", "zizi"]);

/** A game character: the pose cutout with its closed-eyes layer on top, placed by the game's own sprite table. */
export function Character({ id, pose, alt, className = "", delay = 0, bob = false, priority = false, blink = BLINKERS.has(id) }: Props) {
  const c = sprites[id];
  const p = c?.poses[pose];
  if (!c || !p) return null;
  const [vw, vh] = c.vb;
  const pct = (n: number, of: number) => `${(n / of) * 100}%`;
  const box = (b: { x: number; y: number; w: number; h: number }) => ({
    left: pct(b.x, vw),
    top: pct(b.y, vh),
    width: pct(b.w, vw),
    height: pct(b.h, vh),
  });
  const base = `/festival-town/char/${id}_${pose}.webp`;
  const closed = `/festival-town/char/${id}_${pose}_blink.webp`;
  return (
    <span className={`ft-char ${bob ? "ft-bob" : ""} ${className}`} style={{ aspectRatio: `${vw} / ${vh}`, "--d": `${delay}s` } as React.CSSProperties}>
      <img src={base} alt={alt} style={box(p)} width={p.w} height={p.h} loading={priority ? "eager" : "lazy"} decoding="async" draggable={false} />
      {blink && p.blink && (
        <img className="ft-blink" src={closed} alt="" aria-hidden="true" style={box(p.blink)} width={p.blink.w} height={p.blink.h} loading="lazy" decoding="async" draggable={false} />
      )}
    </span>
  );
}
