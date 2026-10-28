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
};

/** A game character: the pose cutout with its closed-eyes layer on top, placed by the game's own sprite table. */
export function Character({ id, pose, alt, className = "", delay = 0, bob = false, priority = false }: Props) {
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
  const blink = `/festival-town/char/${id}_${pose}_blink.webp`;
  return (
    <span
      className={`ft-char ${bob ? "ft-bob" : ""} ${className}`}
      style={{ aspectRatio: `${vw} / ${vh}`, "--d": `${delay}s` } as React.CSSProperties}
    >
      <img src={base} alt={alt} style={box(p)} width={p.w} height={p.h} loading={priority ? "eager" : "lazy"} decoding="async" />
      <img className="ft-blink" src={blink} alt="" aria-hidden="true" style={box(p.blink)} width={p.blink.w} height={p.blink.h} loading="lazy" decoding="async" />
    </span>
  );
}

export function Host({ id, name, className = "" }: { id: string; name: string; className?: string }) {
  return <img className={`ft-host ${className}`} src={`/festival-town/char/${id}_wave.webp`} alt={`${name}, waving`} loading="lazy" decoding="async" />;
}

export function Prop({ id, className = "" }: { id: string; className?: string }) {
  return <img className={`ft-prop ${className}`} src={`/festival-town/prop/${id}.webp`} alt="" aria-hidden="true" loading="lazy" decoding="async" />;
}

export function Scene({ id, alt, className = "", priority = false }: { id: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <span className={`ft-scene ${className}`}>
      <img
        src={`/festival-town/scene/${id}-1600.webp`}
        srcSet={`/festival-town/scene/${id}-900.webp 900w, /festival-town/scene/${id}-1600.webp 1600w`}
        sizes="(max-width: 900px) 100vw, 60vw"
        alt={alt}
        width={1600}
        height={686}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </span>
  );
}
