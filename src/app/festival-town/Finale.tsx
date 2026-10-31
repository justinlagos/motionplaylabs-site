"use client";

import { worlds } from "@/content/festival-town";
import { Bunting } from "./Bunting";
import { Character } from "./Character";
import { JumpLink, PlayLink } from "./client";
import { useGifts } from "./store";

// Where each place's gift stands on the festival ground, as a share of the scene.
const SPOTS: Record<string, { img: string; x: number; y: number; w: number }> = {
  market: { img: "fe_mangoes", x: 6, y: 64, w: 10 },
  farm: { img: "fe_sunflowers", x: 57, y: 33, w: 6.5 },
  tech: { img: "speaker", x: 70, y: 42, w: 7.5 },
  build: { img: "fe_boat", x: 85, y: 64, w: 10 },
  adire: { img: "fe_kites", x: 64, y: 3, w: 8 },
};

/** The festival square. Whatever the visitor earned in the tasters is standing on it. */
export function Finale() {
  const gifts = useGifts();
  const n = gifts.length;
  const said =
    n === 0 ? "The town is waiting. Let’s make it a festival." : n === worlds.length ? "The square is ready. Time for the real festival." : `${n} of 5 gifts are here. The rest are in the game.`;

  return (
    <section className="ftx-finale" id="festival" aria-labelledby="ftx-finale-h">
      <div className="ftx-finale-scene">
        <img
          className="ftx-finale-land"
          src="/festival-town/scene/bg_fest-1600.webp"
          srcSet="/festival-town/scene/bg_fest-900.webp 900w, /festival-town/scene/bg_fest-1600.webp 1600w"
          sizes="(max-width: 700px) 180vw, 100vw"
          alt="The festival square, an open sandy ground with a wooden stage, in front of the town"
          width={1600}
          height={686}
          loading="lazy"
        />
        <div className="ftx-finale-gifts" aria-hidden="true">
          {worlds.map((w) => {
            const s = SPOTS[w.id];
            const has = gifts.includes(w.id);
            return (
              <img
                key={w.id}
                src={`/festival-town/prop/${s.img}.webp`}
                alt=""
                data-has={has ? "yes" : "no"}
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%` } as React.CSSProperties}
                loading="lazy"
              />
            );
          })}
        </div>
        <Bunting className="ftx-finale-bunting" flags={30} sag={30} height={100} offset={2} />
        <div className="ftx-finale-cast" aria-hidden="true">
          <Character id="tobi" pose="cheer" alt="" delay={0.7} />
          <Character id="ada" pose="cheer" alt="" delay={1.9} />
          <Character id="amina" pose="cheer" alt="" delay={3.3} />
          <Character id="zizi" pose="cheer" alt="" bob />
        </div>
      </div>
      <div className="ftx-finale-copy">
        <h2 id="ftx-finale-h" className="ftx-sticker-type is-big">
          {said}
        </h2>
        <div className="ftx-finale-actions">
          <PlayLink place="finale" className="ftx-btn is-big">
            Play free now
          </PlayLink>
          <JumpLink to="signup" className="ftx-btn is-ghost">
            <span>Get new adventures by email</span>
          </JumpLink>
        </div>
      </div>
    </section>
  );
}
