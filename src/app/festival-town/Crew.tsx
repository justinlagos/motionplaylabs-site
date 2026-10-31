"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import { heroes } from "@/content/festival-town";
import { sprites } from "@/content/festival-town-sprites";
import { Character } from "./Character";
import { PlayLink } from "./client";
import { Shape, type ShapeKind } from "./Shapes";

type Kid = "ada" | "tobi" | "amina";

// Each friend stands on their own stamp shape.
const SHAPE: Record<Kid, ShapeKind> = { ada: "sun", tobi: "diamond", amina: "star" };
const ratio = (id: string) => `${sprites[id].vb[0]} / ${sprites[id].vb[1]}`;

/**
 * The game's own first choice, on the page: tap a friend and they step forward with their line.
 * The speech bubble has its own row above the figures, so it can never sit over a face.
 */
export function Crew() {
  const kids = heroes.filter((h) => h.id !== "zizi");
  const [kid, setKid] = useState<Kid>("ada");
  const [n, setN] = useState(0);
  const chosen = heroes.find((h) => h.id === kid)!;
  const zizi = heroes.find((h) => h.id === "zizi")!;

  const choose = (id: Kid) => {
    if (id === kid) return;
    setKid(id);
    setN((x) => x + 1);
    track("ft_pick", { kid: id });
  };

  return (
    <div className="ftx-crew" style={{ "--cc": chosen.colour } as React.CSSProperties}>
      <div className="ftx-crew-stage">
        <span className="ftx-crew-name" aria-hidden="true" key={`n-${kid}`}>
          {chosen.name}
        </span>
        <div className="ftx-crew-shape" aria-hidden="true" key={`s-${kid}`}>
          <Shape kind={SHAPE[kid]} />
        </div>
        <p className="ftx-bubble ftx-crew-line" aria-live="polite" key={`l-${kid}`}>
          <b>{chosen.name}</b>
          {chosen.says}
        </p>
        <div className="ftx-crew-figures">
          <div className="ftx-crew-kid" key={`${kid}-${n}`} style={{ aspectRatio: ratio(kid) }}>
            <Character id={kid} pose="cheer" alt={`${chosen.name}, cheering`} delay={0.8} />
          </div>
          <div className="ftx-crew-zizi" aria-hidden="true" style={{ aspectRatio: ratio("zizi") }}>
            <Character id="zizi" pose="idle" alt="" delay={2.2} bob />
          </div>
        </div>
      </div>

      <div className="ftx-crew-copy">
        <h2 id="ftx-crew-h" className="ftx-h2">
          Pick a friend
        </h2>
        <p className="ftx-lead">Every adventure starts the way the game does: choose who comes along. Zizi, the town’s little orange guide, walks beside whoever you pick.</p>
        <div className="ftx-picks" role="group" aria-label="Choose a friend">
          {kids.map((h) => (
            <button key={h.id} type="button" className="ftx-pick" aria-pressed={kid === h.id} onClick={() => choose(h.id as Kid)} style={{ "--c": h.colour } as React.CSSProperties}>
              <img src={`/festival-town/portrait/${h.id}.webp`} alt="" width={256} height={256} loading="lazy" />
              <span>{h.name}</span>
              <small>{h.role}</small>
            </button>
          ))}
        </div>
        <p className="ftx-crew-body">{chosen.body}</p>
        <p className="ftx-crew-body is-zizi">
          <b>{zizi.name}:</b> {zizi.body}
        </p>
        <PlayLink place="crew" className="ftx-btn is-purple">
          Play as {chosen.name}
        </PlayLink>
      </div>
    </div>
  );
}
