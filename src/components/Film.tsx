"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Beat } from "@/content/film";
import { doors } from "@/content/film";
import { method } from "@/content/method";
import { startFilm } from "@/lib/film-engine";
import { Mark } from "./Mark";
import { MotionToggle } from "./MotionToggle";
import { SceneStill } from "./SceneStill";

function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((w, i) => (
        <span key={i}>
          <span className="w">{w}</span>
          {i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}


export function Film({ beats }: { beats: Beat[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (root.current) return startFilm(root.current, beats);
  }, [beats]);

  return (
    <div className="film" ref={root}>
      <a className="skip-film" href="#after-film">
        Skip the film
      </a>
      <div className="stage" aria-hidden="true">
        <canvas className="stage-canvas" />
        {beats.map((b, k) =>
          b.media.kind === "video" ? <video key={b.id} className="stage-video" data-for={k} muted playsInline loop preload="none" /> : null,
        )}
        <div className="stage-scrim" />
      </div>

      {beats.map((b, i) => (
        <section
          key={b.id}
          data-beat={i}
          className={`beat beat-${b.kind}`}
          style={{ ["--len" as string]: b.length }}
        >
          <div className="beat-frame">
            {b.kind === "title" && (
              <h1 className="title-lockup">
                <Mark className="title-mark" strokeWidth={2.4} />
                <span className="title-word">MotionPlay Labs</span>
              </h1>
            )}
            {b.kind === "hero" && (
              <p className="hero-line">
                <Words text={b.words} />
              </p>
            )}
            {b.kind === "statement" && (
              <p className="statement">
                <Words text={b.words} />
              </p>
            )}
            {b.kind === "interlude" && <span className="visually-hidden">{b.shot}</span>}
            {b.kind === "index" && (
              <div className="index">
                <h2 className="statement">
                  <Words text={b.words} />
                </h2>
                <ol className="numerals">
                  {method.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/method/${s.slug}/`}>
                        <span aria-hidden="true">{s.numeral}.</span>
                        <span className="visually-hidden">
                          {s.numeral}. {s.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {b.kind === "chapter" && (
              <div className="chapter">
                <span className="chapter-numeral" aria-hidden="true">
                  {b.numeral}.
                </span>
                <h2 className="chapter-title">
                  <span className="visually-hidden">{b.numeral}. </span>
                  {b.name}: {b.line}
                </h2>
                <Link className="chapter-open" href={`/method/${b.slug}/`} aria-label={`Open chapter ${b.numeral}, ${b.name}`}>
                  <span aria-hidden="true">+</span>
                </Link>
              </div>
            )}
            {b.kind === "close" && (
              <div className="close">
                <p className="statement">
                  <Words text={b.words} />
                </p>
                <ul className="doors">
                  {doors.map((d) => (
                    <li key={d.href}>
                      <Link href={d.href}>
                        <SceneStill scene={d.scene} className="door-still" />
                        <span className="door-name">{d.name}</span>
                        <span className="door-line">{d.line}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ))}

      <div className="film-progress" aria-hidden="true">
        <svg viewBox="0 0 120 52" focusable="false">
          <path d="M4 44C24 44 40 40 52 28C62 18 60 6 50 6C40 6 38 20 48 30C60 42 84 46 116 30" pathLength={1} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={2.4} strokeLinecap="round" />
          <path
            className="mark-line"
            d="M4 44C24 44 40 40 52 28C62 18 60 6 50 6C40 6 38 20 48 30C60 42 84 46 116 30"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
        </svg>
      </div>
      <MotionToggle className="is-fixed" />
      <div id="after-film" tabIndex={-1} />
    </div>
  );
}
