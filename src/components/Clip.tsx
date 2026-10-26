"use client";

import { useEffect, useRef } from "react";
import { type ClipId, footage, media } from "@/content/footage";
import { wirePlate, wireThumb } from "@/lib/clip-playback";
import { MotionToggle } from "./MotionToggle";

const AV1 = 'video/mp4; codecs="av01.0.08M.08"';
const PHONE = "(max-aspect-ratio: 4/5)";

/** The still that shows before the clip plays, and instead of it when motion is paused. */
export function ClipPicture({ id, className = "clip-poster", eager = false }: { id: ClipId; className?: string; eager?: boolean }) {
  const m = media(id);
  return (
    <picture className={className}>
      <source media={PHONE} srcSet={m.posterPortrait} />
      <img src={m.poster} alt="" width={1920} height={1080} loading={eager ? "eager" : "lazy"} decoding="async" />
    </picture>
  );
}

/** Full-bleed clip that plays while it is on screen. */
export function Plate({ id, eager = false }: { id: ClipId; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const m = media(id);
  useEffect(() => (ref.current ? wirePlate(ref.current) : undefined), []);
  return (
    <div className="plate is-static" data-tone={footage[id].tone} ref={ref} aria-hidden="true">
      <ClipPicture id={id} eager={eager} />
      <video muted loop playsInline preload="none" disablePictureInPicture>
        <source media={PHONE} src={m.portrait} type="video/mp4" />
        <source src={m.av1} type={AV1} />
        <source src={m.h264} type="video/mp4" />
      </video>
      <div className="plate-scrim" />
    </div>
  );
}

type HeroProps = {
  clip: ClipId;
  title: string;
  line?: string;
  kicker?: string;
  children?: React.ReactNode;
};

/** Page opener: one clip behind the page title, in the clip's tone. */
export function PlateHero({ clip, title, line, kicker, children }: HeroProps) {
  const c = footage[clip];
  return (
    <section className="plate-hero" data-tone={c.tone}>
      <Plate id={clip} eager />
      <div className="plate-hero-text">
        {kicker && <p className="plate-hero-kicker">{kicker}</p>}
        <h1 className="plate-hero-title">{title}</h1>
        {line && <p className="plate-hero-line">{line}</p>}
        {children}
      </div>
      <p className="plate-hero-caption">{c.caption}</p>
      <MotionToggle className="is-in-hero" />
    </section>
  );
}

/** Small 16:9 clip that plays while its link is hovered or focused. */
export function ClipThumb({ id, className = "" }: { id: ClipId; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = media(id);
  useEffect(() => (ref.current ? wireThumb(ref.current) : undefined), []);
  return (
    <span className={`clip-thumb ${className}`} ref={ref} data-tone={footage[id].tone} aria-hidden="true">
      <img src={m.thumbPoster} alt="" width={640} height={360} loading="lazy" decoding="async" />
      <video muted loop playsInline preload="none" disablePictureInPicture src={m.thumb} />
    </span>
  );
}

/** A full-bleed clip between sections of a page: a pause in the reading, in the clip's tone. */
export function PlateBand({ clip }: { clip: ClipId }) {
  const c = footage[clip];
  return (
    <figure className="plate-band" data-tone={c.tone}>
      <Plate id={clip} />
      <figcaption className="plate-band-caption">{c.caption}</figcaption>
    </figure>
  );
}
