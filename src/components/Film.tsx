"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Beat } from "@/content/film";
import { doors } from "@/content/film";
import { footage } from "@/content/footage";
import { method } from "@/content/method";
import { site } from "@/content/site";
import { startFilm } from "@/lib/film-engine";
import { ClipPicture, ClipThumb } from "./Clip";
import { Badge } from "./Logo";
import { MotionToggle } from "./MotionToggle";
import { Numeral } from "./Numeral";

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

function Caption({ beat }: { beat: Beat }) {
  return <p className="beat-caption">{footage[beat.clip].caption}</p>;
}

export function Film({ beats }: { beats: Beat[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (root.current) return startFilm(root.current, beats);
  }, [beats]);

  return (
    <div className="film" ref={root} data-tone={footage[beats[0].clip].tone}>
      <a className="skip-film" href="#after-film">
        Skip the film
      </a>
      <div className="stage" aria-hidden="true">
        {beats.map((b, k) => (
          <div key={b.id} className="plate" data-for={k} data-kind={b.kind} data-tone={footage[b.clip].tone}>
            <ClipPicture id={b.clip} eager={k === 0} />
            <video muted playsInline loop preload="none" disablePictureInPicture />
            <div className="plate-scrim" />
          </div>
        ))}
        <div className="stage-flash" />
      </div>

      <div className="badge-dock" aria-hidden="true">
        <Badge className="is-drawing" />
      </div>

      {beats.map((b, i) => (
        <section
          key={b.id}
          data-beat={i}
          data-tone={footage[b.clip].tone}
          className={`beat beat-${b.kind}`}
          style={{ ["--len" as string]: b.length }}
        >
          <div className="beat-frame">
            {b.kind === "title" && (
              <div className="title">
                <h1 className="visually-hidden">MotionPlay Labs</h1>
                <p className="title-descriptor">
                  {site.descriptor[0]}
                  <br />
                  {site.descriptor[1]}
                </p>
                <p className="title-cue">Scroll</p>
              </div>
            )}
            {b.kind === "hero" && (
              <>
                <Caption beat={b} />
                <p className="hero-line">
                  <Words text={b.words} />
                </p>
              </>
            )}
            {b.kind === "statement" && (
              <>
                <Caption beat={b} />
                <p className="statement">
                  <Words text={b.words} />
                </p>
              </>
            )}
            {b.kind === "interlude" && <Caption beat={b} />}
            {b.kind === "index" && (
              <div className="index">
                <h2 className="index-title">
                  <Words text={b.words} />
                </h2>
                <ol className="index-rows">
                  {method.map((s, k) => (
                    <li key={s.slug} style={{ ["--k" as string]: k }}>
                      <Link href={`/method/${s.slug}/`}>
                        <span className="index-numeral" aria-hidden="true">
                          {s.numeral}
                        </span>
                        <span className="index-name">{s.name}</span>{" "}
                        <span className="index-line">{s.line}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {b.kind === "chapter" && (
              <div className="chapter">
                <Caption beat={b} />
                <Numeral value={b.numeral} className="chapter-numeral" />
                <div className="chapter-text">
                  <h2 className="chapter-title">
                    <span className="visually-hidden">{b.numeral}. </span>
                    {b.name}
                  </h2>
                  <p className="chapter-line">{b.line}.</p>
                  <Link className="chapter-open" href={`/method/${b.slug}/`}>
                    Read about {b.name.toLowerCase()}
                  </Link>
                </div>
              </div>
            )}
            {b.kind === "close" && (
              <div className="close">
                <div className="close-head">
                  <p className="statement">
                    <Words text={b.words} />
                  </p>
                  <Badge className="close-badge" />
                </div>
                <ul className="doors">
                  {doors.map((d) => (
                    <li key={d.href}>
                      <Link href={d.href}>
                        <ClipThumb id={d.clip} className="door-clip" />
                        <span className="door-name">{d.name}</span>{" "}
                        <span className="door-line">{d.line}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="close-contact">
                  Questions, briefs and tenders: <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
              </div>
            )}
          </div>
        </section>
      ))}

      <MotionToggle className="is-fixed" />
      <div id="after-film" tabIndex={-1} />
    </div>
  );
}
