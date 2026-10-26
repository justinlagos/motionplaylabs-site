"use client";

import Link from "next/link";
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
  /** Drawn above the title, e.g. a method step's numeral. */
  mark?: React.ReactNode;
  children?: React.ReactNode;
};

/** Page opener: one clip behind the page title, in the clip's tone. */
export function PlateHero({ clip, title, line, kicker, mark, children }: HeroProps) {
  const c = footage[clip];
  return (
    <section className="plate-hero" data-tone={c.tone}>
      <Plate id={clip} eager />
      <div className="plate-hero-text">
        {mark}
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

type NextProps = { clip: ClipId; href: string; kicker: string; title: string; line?: string };

/** The end of a detail page: the next page's own clip, and the whole band is the link to it. */
export function NextBand({ clip, href, kicker, title, line }: NextProps) {
  const c = footage[clip];
  return (
    <section className="cta-band is-next" data-tone={c.tone}>
      <Plate id={clip} />
      <div className="cta-band-text">
        <p className="cta-band-kicker">{kicker}</p>
        <h2 className="cta-band-title">
          <Link className="stretch" href={href}>
            {title}
          </Link>
        </h2>
        {line && <p className="cta-band-line">{line}</p>}
      </div>
      <span className="next-mark" aria-hidden="true">
        <svg viewBox="0 0 100 100" focusable="false">
          <path d="M8 50H88M60 22L88 50L60 78" />
        </svg>
      </span>
      <p className="plate-band-caption">{c.caption}</p>
    </section>
  );
}

/** Closing band: a dark clip behind the next step, so a page ends in the same light-to-dark rhythm as the film. */
export function CtaBand({ clip, title, line, children }: { clip: ClipId; title: string; line?: string; children?: React.ReactNode }) {
  const c = footage[clip];
  return (
    <section className="cta-band" data-tone={c.tone}>
      <Plate id={clip} />
      <div className="cta-band-text">
        <h2 className="cta-band-title">{title}</h2>
        {line && <p className="cta-band-line">{line}</p>}
        {children}
      </div>
      <p className="plate-band-caption">{c.caption}</p>
    </section>
  );
}
