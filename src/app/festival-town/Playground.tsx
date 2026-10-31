"use client";

import { track } from "@vercel/analytics";
import { useCallback, useEffect, useRef, useState } from "react";
import { worlds, type World } from "@/content/festival-town";
import { Character } from "./Character";
import { PlayLink } from "./client";
import { earn, resetGifts, useGifts } from "./store";

// Five short tasters on the page, one per place, built from the game's own art and modelled on
// one activity from each place. They are deliberately small: the game has the voiced versions.

type Id = World["id"];
type Taster = {
  icon: string;
  scene: string;
  kid: { id: string; pose: string };
  practises: string;
  gift: { img: string; w: number; h: number; label: string };
  win: string;
};

const T: Record<Id, Taster> = {
  market: {
    icon: "mango",
    scene: "bg_market_mango",
    kid: { id: "ada", pose: "cheer" },
    practises: "Counting objects and stopping at the right number",
    gift: { img: "fe_mangoes", w: 413, h: 429, label: "A basket of mangoes" },
    win: "All packed! Mama Bisi’s mangoes are off to the festival square.",
  },
  farm: {
    icon: "sunflower",
    scene: "bg_farm_garden",
    kid: { id: "amina", pose: "cheer" },
    practises: "Life cycles: putting stages in order",
    gift: { img: "fe_sunflowers", w: 313, h: 460, label: "Sunflowers" },
    win: "Seed, sprout, plant, flowers. Grandma’s sunflowers are on their way.",
  },
  tech: {
    icon: "bolt",
    scene: "bg_tech",
    kid: { id: "amina", pose: "cheer" },
    practises: "Sequencing: planning steps, then testing them",
    gift: { img: "speaker", w: 460, h: 343, label: "A music speaker" },
    win: "Bolt found his battery! The music speaker is going to the square.",
  },
  build: {
    icon: "duck",
    scene: "bg_build",
    kid: { id: "tobi", pose: "cheer" },
    practises: "Predicting, then testing what floats and what sinks",
    gift: { img: "fe_boat", w: 330, h: 460, label: "A boat for the river" },
    win: "Five things tested. Engineer Bayo’s boat is ready for the river.",
  },
  adire: {
    icon: "stamp_star",
    scene: "bg_adire",
    kid: { id: "ada", pose: "cheer" },
    practises: "Spotting and continuing a repeating pattern",
    gift: { img: "fe_kites", w: 409, h: 460, label: "Kites for the sky" },
    win: "The cloth is finished! Aunty Kemi’s kites are ready to fly.",
  },
};

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pausedMotion = () => typeof document !== "undefined" && document.querySelector(".ftx")?.getAttribute("data-ft-motion") === "paused";
const calm = () => reduceMotion() || pausedMotion();

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

type GameProps = { onWin: () => void; say: (line: string) => void; replay: number };

/* ---------- Market Street: pack the mangoes ---------- */

const PILE = [
  { x: 12, y: 58, r: -12 },
  { x: 30, y: 66, r: 8 },
  { x: 48, y: 60, r: -4 },
  { x: 20, y: 30, r: 14 },
  { x: 40, y: 34, r: -16 },
  { x: 58, y: 36, r: 6 },
  { x: 8, y: 8, r: -6 },
  { x: 28, y: 6, r: 18 },
  { x: 48, y: 10, r: -10 },
];
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function Market({ onWin, say, replay }: GameProps) {
  const [target, setTarget] = useState(5);
  const [taken, setTaken] = useState<boolean[]>(() => PILE.map(() => false));
  const count = taken.filter(Boolean).length;
  const done = count === target;

  useEffect(() => {
    const t = replay === 0 ? 5 : 3 + Math.floor(Math.random() * 5);
    setTarget(t);
    setTaken(PILE.map(() => false));
    say(`Please pack ${t} mangoes for my stall. Count as you go!`);
  }, [replay, say]);

  const tap = (i: number) => {
    if (taken[i] || done) return;
    const next = taken.map((v, k) => (k === i ? true : v));
    setTaken(next);
    const n = next.filter(Boolean).length;
    if (n === target) {
      say(`${WORDS[n][0].toUpperCase()}${WORDS[n].slice(1)}! That’s exactly ${target}. Thank you!`);
      window.setTimeout(onWin, 900);
    }
  };

  return (
    <div className="g-market">
      <div className="g-market-pile" role="group" aria-label="Mangoes to pack">
        {PILE.map((p, i) => (
          <button
            key={i}
            type="button"
            className="g-mango"
            data-taken={taken[i] ? "yes" : "no"}
            disabled={taken[i] || done}
            aria-label={taken[i] ? "Packed" : "Pack a mango"}
            style={{ left: `${p.x}%`, top: `${p.y}%`, "--r": `${p.r}deg` } as React.CSSProperties}
            onClick={() => tap(i)}
          >
            <img src="/festival-town/prop/mango.webp" alt="" width={322} height={385} draggable={false} />
          </button>
        ))}
      </div>
      <div className="g-market-basket">
        <div className="g-target" aria-hidden="true">
          <span>Pack</span>
          <b>{target}</b>
        </div>
        <div className="g-basket">
          <div className="g-basket-fill" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
              <img
                key={i}
                src="/festival-town/prop/mango.webp"
                alt=""
                width={322}
                height={385}
                style={{ left: `${6 + (i % 4) * 21}%`, bottom: `${44 + Math.floor(i / 4) * 16}%`, "--r": `${(i % 3) * 14 - 14}deg` } as React.CSSProperties}
              />
            ))}
          </div>
          <img className="g-basket-front" src="/festival-town/prop/basket.webp" alt="" width={384} height={351} />
          {count > 0 && (
            <span key={count} className="g-count" aria-hidden="true">
              {count}
            </span>
          )}
        </div>
        <p className="g-tally" aria-live="polite">
          {count === 0 ? "Basket is empty" : `${count} of ${target} packed`}
        </p>
      </div>
    </div>
  );
}

/* ---------- Grandma's Farm: the bean's life cycle ---------- */

const STAGES = [
  { id: "seed", img: "pl_seed", w: 301, h: 240, label: "Seed" },
  { id: "sprout", img: "pl_sprout", w: 260, h: 256, label: "Sprout" },
  { id: "plant", img: "pl_plant", w: 257, h: 382, label: "Bean plant" },
  { id: "flower", img: "pl_flower", w: 284, h: 394, label: "Flowers" },
];

function Farm({ onWin, say, replay }: GameProps) {
  const [deck, setDeck] = useState(() => [STAGES[2], STAGES[0], STAGES[3], STAGES[1]]);
  const [placed, setPlaced] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const misses = useRef(0);

  useEffect(() => {
    if (replay > 0) setDeck(shuffle(STAGES));
    setPlaced(0);
    misses.current = 0;
    say("My bean has grown up! Tap the pictures in order, from first to last.");
  }, [replay, say]);

  const tap = (id: string) => {
    if (STAGES.slice(0, placed).some((s) => s.id === id)) return;
    if (STAGES[placed].id === id) {
      const n = placed + 1;
      setPlaced(n);
      setWrong(null);
      if (n === STAGES.length) {
        say("Seed, sprout, plant, flowers. You’ve got it!");
        window.setTimeout(onWin, 900);
      } else say(["Yes, it starts as a seed in the soil.", "Then a little sprout pushes up.", "It grows into a bean plant…"][placed]);
    } else {
      misses.current += 1;
      setWrong(id);
      window.setTimeout(() => setWrong(null), 500);
      say(misses.current > 1 && placed === 0 ? "Every plant starts small. Look for the seed." : "Not yet. What has to happen before that?");
    }
  };

  return (
    <div className="g-farm">
      <ol className="g-slots" aria-label="Life cycle, first to last">
        {STAGES.map((s, i) => (
          <li key={s.id} data-filled={i < placed ? "yes" : "no"}>
            <span className="g-slot-n" aria-hidden="true">
              {i + 1}
            </span>
            {i < placed ? (
              <>
                <img src={`/festival-town/prop/${s.img}.webp`} alt="" width={s.w} height={s.h} />
                <span className="g-slot-label">{s.label}</span>
              </>
            ) : (
              <span className="visually-hidden">Empty</span>
            )}
          </li>
        ))}
      </ol>
      <div className="g-deck" role="group" aria-label="Pictures to put in order">
        {deck.map((s) => {
          const used = STAGES.slice(0, placed).some((p) => p.id === s.id);
          return (
            <button key={s.id} type="button" className="g-card" data-used={used ? "yes" : "no"} data-wrong={wrong === s.id ? "yes" : "no"} disabled={used} onClick={() => tap(s.id)}>
              <img src={`/festival-town/prop/${s.img}.webp`} alt="" width={s.w} height={s.h} draggable={false} />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Computer Village: code Bolt ---------- */

type Dir = "up" | "down" | "left" | "right";
const COLS = 4;
const ROWS = 3;
const START = { c: 0, r: 1 };
const GOAL = { c: 3, r: 0 };
const CRATE = { c: 2, r: 1 };
const STEP: Record<Dir, { c: number; r: number }> = { up: { c: 0, r: -1 }, down: { c: 0, r: 1 }, left: { c: -1, r: 0 }, right: { c: 1, r: 0 } };
const ARROW: Record<Dir, string> = { up: "M12 4l7 8h-4.5v8h-5v-8H5z", down: "M12 20l-7-8h4.5V4h5v8H19z", left: "M4 12l8-7v4.5h8v5h-8V19z", right: "M20 12l-8 7v-4.5H4v-5h8V5z" };
const Arrow = ({ d }: { d: Dir }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={ARROW[d]} fill="currentColor" />
  </svg>
);

function Tech({ onWin, say, replay }: GameProps) {
  const [prog, setProg] = useState<Dir[]>([]);
  const [pos, setPos] = useState(START);
  const [step, setStep] = useState(-1);
  const [bump, setBump] = useState(false);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const MAX = 6;

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    setProg([]);
    setPos(START);
    setStep(-1);
    setRunning(false);
    say("Bolt needs his battery. Tap arrows to plan his path, then press Go.");
    return clearTimers;
  }, [replay, say]);

  const run = () => {
    if (running || prog.length === 0) return;
    setRunning(true);
    const dt = calm() ? 260 : 520;
    let p = { ...START };
    let i = 0;
    const tick = () => {
      if (i >= prog.length) {
        setStep(-1);
        if (p.c === GOAL.c && p.r === GOAL.r) {
          say("Beep beep! Bolt reached his battery.");
          timers.current.push(window.setTimeout(onWin, 700));
        } else {
          say("Bolt stopped before the battery. Change your arrows and try again.");
          timers.current.push(
            window.setTimeout(() => {
              setPos(START);
              setRunning(false);
            }, 1100),
          );
        }
        return;
      }
      const d = prog[i];
      const n = { c: p.c + STEP[d].c, r: p.r + STEP[d].r };
      setStep(i);
      const out = n.c < 0 || n.r < 0 || n.c >= COLS || n.r >= ROWS;
      const hit = n.c === CRATE.c && n.r === CRATE.r;
      if (out || hit) {
        setBump(true);
        say(hit ? "Bonk! Bolt bumped into the crate. Can he go around it?" : "Oops, that’s off the mat. Try a different arrow.");
        timers.current.push(
          window.setTimeout(() => {
            setBump(false);
            setStep(-1);
            setPos(START);
            setRunning(false);
          }, 1200),
        );
        return;
      }
      p = n;
      setPos(n);
      i++;
      timers.current.push(window.setTimeout(tick, dt));
    };
    setPos(START);
    timers.current.push(window.setTimeout(tick, 200));
    track("ft_taster_go", { length: prog.length });
  };

  const add = (d: Dir) => {
    if (running || prog.length >= MAX) return;
    setProg((p) => [...p, d]);
  };

  return (
    <div className="g-tech">
      <div
        className="g-mat"
        role="img"
        aria-label={`A mat of ${COLS} by ${ROWS} squares. Bolt is in row ${pos.r + 1}, column ${pos.c + 1}. The battery is in row 1, column 4. A crate blocks row 2, column 3.`}
      >
        {Array.from({ length: COLS * ROWS }, (_, k) => (
          <span key={k} className="g-cell" />
        ))}
        <img className="g-battery" src="/festival-town/prop/battery.webp" alt="" width={233} height={456} style={{ "--c": GOAL.c, "--r": GOAL.r } as React.CSSProperties} />
        <img className="g-crate" src="/festival-town/prop/block.webp" alt="" width={300} height={300} style={{ "--c": CRATE.c, "--r": CRATE.r } as React.CSSProperties} />
        <img className="g-bolt" data-bump={bump ? "yes" : "no"} src="/festival-town/prop/bolt.webp" alt="" width={333} height={460} style={{ "--c": pos.c, "--r": pos.r } as React.CSSProperties} />
      </div>
      <div className="g-code">
        <ol className="g-prog" aria-label={`Bolt's plan: ${prog.length ? prog.join(", ") : "empty"}`}>
          {Array.from({ length: MAX }, (_, k) => (
            <li key={k} data-on={k === step ? "yes" : "no"} data-filled={prog[k] ? "yes" : "no"}>
              {prog[k] ? <Arrow d={prog[k]} /> : null}
            </li>
          ))}
        </ol>
        <div className="g-pad">
          {(["left", "up", "down", "right"] as Dir[]).map((d) => (
            <button key={d} type="button" className={`g-arrow is-${d}`} onClick={() => add(d)} disabled={running || prog.length >= MAX} aria-label={`Add ${d}`}>
              <Arrow d={d} />
            </button>
          ))}
        </div>
        <div className="g-run">
          <button type="button" className="g-go" onClick={run} disabled={running || prog.length === 0}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.6-6.8a1 1 0 0 0 0-1.8L9.6 4.3C8.9 3.9 8 4.4 8 5.2z" fill="currentColor" />
            </svg>
            Go
          </button>
          <button type="button" className="g-small" onClick={() => setProg((p) => p.slice(0, -1))} disabled={running || prog.length === 0}>
            Undo
          </button>
          <button type="button" className="g-small" onClick={() => setProg([])} disabled={running || prog.length === 0}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Builders' Yard: float or sink ---------- */

const THINGS = [
  { id: "cork", name: "cork", w: 289, h: 352, floats: true },
  { id: "stone", name: "stone", w: 366, h: 306, floats: false },
  { id: "duck", name: "rubber duck", w: 367, h: 460, floats: true },
  { id: "key", name: "key", w: 392, h: 460, floats: false },
  { id: "leaf", name: "leaf", w: 333, h: 378, floats: true },
];

function Build({ onWin, say, replay }: GameProps) {
  const [i, setI] = useState(0);
  const [tested, setTested] = useState<{ id: string; right: boolean }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setI(0);
    setTested([]);
    setBusy(false);
    say("Will it float or sink? Make a guess, then drop it in the river.");
  }, [replay, say]);

  const thing = THINGS[i];
  const guess = (floats: boolean) => {
    if (busy || !thing) return;
    setBusy(true);
    const right = floats === thing.floats;
    setTested((t) => [...t, { id: thing.id, right }]);
    const verb = thing.floats ? "floats" : "sinks";
    say(right ? `You were right. The ${thing.name} ${verb}!` : `Good guess! Look: the ${thing.name} ${verb}.`);
    window.setTimeout(
      () => {
        const n = i + 1;
        setI(n);
        setBusy(false);
        if (n === THINGS.length) window.setTimeout(onWin, 500);
      },
      calm() ? 700 : 1500,
    );
  };

  const score = tested.filter((t) => t.right).length;

  return (
    <div className="g-build">
      <div className="g-river" aria-hidden="true">
        <div className="g-water" />
        {tested.map((t, k) => {
          const th = THINGS.find((x) => x.id === t.id)!;
          return (
            <img
              key={t.id}
              className="g-thing"
              data-floats={th.floats ? "yes" : "no"}
              src={`/festival-town/prop/${th.id}.webp`}
              alt=""
              width={th.w}
              height={th.h}
              style={{ "--x": `${8 + k * 19}%` } as React.CSSProperties}
            />
          );
        })}
      </div>
      <div className="g-build-ask">
        {thing ? (
          <>
            <div className="g-hold">
              <img key={thing.id} src={`/festival-town/prop/${thing.id}.webp`} alt="" width={thing.w} height={thing.h} data-busy={busy ? "yes" : "no"} />
              <p>
                The <b>{thing.name}</b>
              </p>
            </div>
            <div className="g-choices">
              <button type="button" className="g-choice is-float" onClick={() => guess(true)} disabled={busy}>
                It will float
              </button>
              <button type="button" className="g-choice is-sink" onClick={() => guess(false)} disabled={busy}>
                It will sink
              </button>
            </div>
          </>
        ) : (
          <p className="g-summary">
            {score} of {THINGS.length} guesses right
          </p>
        )}
        <p className="g-tally" aria-live="polite">
          {tested.length} of {THINGS.length} tested
        </p>
      </div>
    </div>
  );
}

/* ---------- Adire Workshop: finish the pattern ---------- */

type Shape = "circle" | "star" | "tri";
const ROUNDS: { seq: Shape[]; next: Shape }[] = [
  { seq: ["circle", "star", "tri", "circle", "star"], next: "tri" },
  { seq: ["circle", "circle", "star", "circle", "circle"], next: "star" },
  { seq: ["star", "tri", "tri", "star", "tri"], next: "tri" },
];
const SHAPE_NAME: Record<Shape, string> = { circle: "circle", star: "star", tri: "triangle" };

export function AdireMark({ s }: { s: Shape }) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" className="g-mark">
      {s === "circle" && (
        <g fill="none" stroke="currentColor" strokeWidth="4">
          <circle cx="30" cy="30" r="22" />
          <circle cx="30" cy="30" r="12" />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
        </g>
      )}
      {s === "star" && <path d="M30 6l6.5 15.3 16.5 1.4-12.6 10.8 3.9 16.2L30 41l-14.3 8.7 3.9-16.2L7 22.7l16.5-1.4z" fill="currentColor" />}
      {s === "tri" && (
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
          <path d="M30 7l24 44H6z" />
          <path d="M30 24l10 18H20z" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}

function Adire({ onWin, say, replay }: GameProps) {
  const [round, setRound] = useState(0);
  const [filled, setFilled] = useState(false);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setRound(0);
    setFilled(false);
    say("Help me finish the cloth. Which stamp comes next?");
  }, [replay, say]);

  const r = ROUNDS[round];
  const pick = (s: Shape) => {
    if (filled) return;
    if (s === r.next) {
      setFilled(true);
      const last = round === ROUNDS.length - 1;
      say(last ? "Beautiful! The pattern is complete." : `Yes, a ${SHAPE_NAME[s]}! Here’s another piece of cloth.`);
      window.setTimeout(
        () => {
          if (last) onWin();
          else {
            setRound(round + 1);
            setFilled(false);
          }
        },
        calm() ? 600 : 1200,
      );
    } else {
      setWrong(true);
      window.setTimeout(() => setWrong(false), 500);
      say(`Say it out loud: ${r.seq.map((x) => SHAPE_NAME[x]).join(", ")}… what comes next?`);
    }
  };

  return (
    <div className="g-adire">
      <p className="g-round" aria-live="polite">
        Cloth {round + 1} of {ROUNDS.length}
      </p>
      <ol key={round} className="g-cloth" aria-label={`Pattern: ${r.seq.map((x) => SHAPE_NAME[x]).join(", ")}, then a gap`}>
        {r.seq.map((s, k) => (
          <li key={k}>
            <AdireMark s={s} />
          </li>
        ))}
        <li className="g-gap" data-filled={filled ? "yes" : "no"} data-wrong={wrong ? "yes" : "no"}>
          {filled ? <AdireMark s={r.next} /> : <span aria-hidden="true">?</span>}
        </li>
      </ol>
      <div className="g-stamps" role="group" aria-label="Choose a stamp">
        {(["circle", "star", "tri"] as Shape[]).map((s) => (
          <button key={s} type="button" className="g-stamp" onClick={() => pick(s)} disabled={filled}>
            <img src={`/festival-town/prop/stamp_${s === "tri" ? "tri" : s}.webp`} alt="" width={340} height={422} draggable={false} />
            <span>{SHAPE_NAME[s]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const GAMES: Record<Id, (p: GameProps) => React.ReactElement> = { market: Market, farm: Farm, tech: Tech, build: Build, adire: Adire };

/* ---------- The board ---------- */

export function Playground() {
  const gifts = useGifts();
  const [sel, setSel] = useState(0);
  const [replay, setReplay] = useState(0);
  const [won, setWon] = useState(false);
  const [line, setLine] = useState("");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const board = useRef<HTMLDivElement>(null);
  const slots = useRef<Record<string, HTMLElement | null>>({});
  const world = worlds[sel];
  const t = T[world.id];
  const Game = GAMES[world.id];
  const say = useCallback((l: string) => setLine(l), []);
  const allDone = gifts.length === worlds.length;

  const choose = (i: number) => {
    if (i === sel) return;
    setSel(i);
    setWon(false);
    setReplay(0);
    track("ft_taster_open", { place: worlds[i].id });
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % worlds.length;
    else if (e.key === "ArrowLeft") n = (i + worlds.length - 1) % worlds.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = worlds.length - 1;
    else return;
    e.preventDefault();
    choose(n);
    tabs.current[n]?.focus();
  };

  const onWin = useCallback(() => {
    const id = worlds[sel].id;
    const first = !gifts.includes(id);
    setWon(true);
    track("ft_taster_win", { place: id });
    if (!first) return;
    // Fly the gift from the board to its slot in the festival square, then mark it earned.
    const from = board.current?.getBoundingClientRect();
    const to = slots.current[id]?.getBoundingClientRect();
    if (!from || !to || calm()) {
      earn(id);
      return;
    }
    const img = document.createElement("img");
    img.src = `/festival-town/prop/${T[id].gift.img}.webp`;
    img.alt = "";
    img.className = "ftx-flyer";
    const size = 140;
    const x0 = from.left + from.width / 2 - size / 2;
    const y0 = from.top + from.height / 2 - size / 2;
    const x1 = to.left + to.width / 2 - size / 2;
    const y1 = to.top + to.height / 2 - size / 2;
    Object.assign(img.style, { left: `${x0}px`, top: `${y0}px`, width: `${size}px`, height: `${size}px` });
    document.body.appendChild(img);
    const dx = x1 - x0;
    const dy = y1 - y0;
    const anim = img.animate(
      [
        { transform: "translate(0,0) scale(.4) rotate(-10deg)", opacity: 0 },
        { transform: "translate(0,-40px) scale(1.15) rotate(6deg)", opacity: 1, offset: 0.25 },
        { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 120}px) scale(.9) rotate(-4deg)`, opacity: 1, offset: 0.65 },
        { transform: `translate(${dx}px, ${dy}px) scale(.5) rotate(0deg)`, opacity: 1 },
      ],
      { duration: 1100, easing: "cubic-bezier(.3,.7,.3,1)" },
    );
    anim.onfinish = () => {
      img.remove();
      earn(id);
    };
  }, [sel, gifts]);

  const nextOpen = worlds.findIndex((w, i) => i !== sel && !gifts.includes(w.id));

  return (
    <div className="ftx-play" style={{ "--wc": world.colour, "--wd": world.dark } as React.CSSProperties}>
      <div className="ftx-tabs" role="tablist" aria-label="Choose a place">
        {worlds.map((w, i) => (
          <button
            key={w.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`ftx-tab-${w.id}`}
            type="button"
            role="tab"
            aria-selected={sel === i}
            aria-controls="ftx-board"
            tabIndex={sel === i ? 0 : -1}
            className="ftx-tab"
            style={{ "--tc": w.colour, "--td": w.dark } as React.CSSProperties}
            onClick={() => choose(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="ftx-tab-icon">
              <img src={`/festival-town/prop/${T[w.id].icon}.webp`} alt="" width={64} height={64} />
              {gifts.includes(w.id) && (
                <span className="ftx-tab-done" aria-hidden="true">
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </span>
            <span className="ftx-tab-name">{w.name}</span>
            <span className="ftx-tab-verb">{w.verb}</span>
            {gifts.includes(w.id) && <span className="visually-hidden">, done</span>}
          </button>
        ))}
      </div>

      <div className="ftx-play-grid">
        <div ref={board} id="ftx-board" className="ftx-board" role="tabpanel" aria-labelledby={`ftx-tab-${world.id}`}>
          <img
            className="ftx-board-scene"
            src={`/festival-town/scene/${t.scene}-900.webp`}
            srcSet={`/festival-town/scene/${t.scene}-900.webp 900w, /festival-town/scene/${t.scene}-1600.webp 1600w`}
            sizes="(max-width: 900px) 100vw, 900px"
            alt=""
            width={1600}
            height={686}
          />
          <div className="ftx-board-top">
            <p className="ftx-bubble ftx-board-line" aria-live="polite">
              <b>{world.host.name}</b>
              {line}
            </p>
          </div>
          <div className="ftx-board-main">
            <div className="ftx-board-host" aria-hidden="true" key={`host-${world.id}`}>
              <Character id={world.host.id} pose="wave" alt="" />
            </div>
            <div className="ftx-card" key={`${world.id}-${replay}`}>
              <Game onWin={onWin} say={say} replay={replay} />
              {won && (
                <div className="ftx-win" role="status">
                  <div className="ftx-confetti" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, k) => (
                      <i key={k} style={{ "--k": k } as React.CSSProperties} />
                    ))}
                  </div>
                  <div className="ftx-win-kid" aria-hidden="true">
                    <Character id={t.kid.id} pose={t.kid.pose} alt="" />
                  </div>
                  <div className="ftx-win-copy">
                    <h3>{t.win}</h3>
                    <p>In the game, {world.name} has three activities like this, with spoken instructions and hints from Zizi.</p>
                    <div className="ftx-win-actions">
                      {nextOpen >= 0 ? (
                        <button type="button" className="ftx-btn is-purple" onClick={() => choose(nextOpen)}>
                          <span>Next place: {worlds[nextOpen].name}</span>
                        </button>
                      ) : (
                        <PlayLink place="taster-win" className="ftx-btn">
                          Play the full game
                        </PlayLink>
                      )}
                      <button
                        type="button"
                        className="ftx-link"
                        onClick={() => {
                          setWon(false);
                          setReplay((n) => n + 1);
                        }}
                      >
                        Play this one again
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="ftx-board-foot">
            <p>
              <b>{world.subject}.</b> {t.practises}.
            </p>
            {!won && (
              <button type="button" className="ftx-link" onClick={() => setReplay((n) => n + 1)}>
                Start again
              </button>
            )}
          </div>
        </div>

        <aside className="ftx-square" aria-labelledby="ftx-square-h">
          <div className="ftx-square-head">
            <h3 id="ftx-square-h">Festival square</h3>
            <p aria-live="polite">{allDone ? "Everything’s ready!" : `${gifts.length} of 5 gifts`}</p>
          </div>
          <ul className="ftx-square-slots">
            {worlds.map((w) => {
              const has = gifts.includes(w.id);
              const g = T[w.id].gift;
              return (
                <li
                  key={w.id}
                  ref={(el) => {
                    slots.current[w.id] = el;
                  }}
                  data-has={has ? "yes" : "no"}
                  style={{ "--tc": w.colour } as React.CSSProperties}
                >
                  <img src={`/festival-town/prop/${g.img}.webp`} alt="" width={g.w} height={g.h} loading="lazy" />
                  <span>{has ? g.label : `From ${w.name}`}</span>
                </li>
              );
            })}
          </ul>
          {allDone ? (
            <div className="ftx-square-done">
              <p>That was five of the game’s fifteen activities. The other ten are waiting.</p>
              <PlayLink place="square-done">Play the full game</PlayLink>
              <button type="button" className="ftx-link" onClick={resetGifts}>
                Empty the square
              </button>
            </div>
          ) : (
            <p className="ftx-square-note">Finish a taster and its gift comes here, like in the game.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
