"use client";

import { useEffect, useRef, useState } from "react";
import { worlds } from "@/content/festival-town";
import { useMotionPaused } from "@/lib/motion";
import { PlayLink } from "./client";

const locations = [
  { x: 50, y: 26, icon: "mango", gift: "fe_mangoes", promise: "A little counting goes a long way.", outcome: "Count objects, make a total and share equally." },
  { x: 74, y: 36, icon: "sunflower", gift: "fe_sunflowers", promise: "Small seeds. Wonderful discoveries.", outcome: "Explore what living things need and how they grow." },
  { x: 26, y: 33, icon: "bolt", gift: "speaker", promise: "Big ideas start with little steps.", outcome: "Put instructions in order, fix mistakes and complete a circuit." },
  { x: 65, y: 72, icon: "brick", gift: "fe_stage", promise: "Try it. Test it. Build it again.", outcome: "Experiment with floating, balance, length and strong shapes." },
  { x: 32, y: 70, icon: "stamp_star", gift: "fe_kites", promise: "Make something worth celebrating.", outcome: "Recognise patterns, measure lengths and explore symmetry." },
];

export function TownExplorer() {
  const [selected, setSelected] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const world = worlds[selected];
  const location = locations[selected];
  const choose = (index: number) => {
    setSelected(index);
    setVisited(previous => previous.includes(index) ? previous : [...previous, index]);
  };
  const keyDown = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % worlds.length;
    else if (event.key === "ArrowLeft") next = (index + worlds.length - 1) % worlds.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = worlds.length - 1;
    else return;
    event.preventDefault(); choose(next); tabs.current[next]?.focus();
  };

  return (
    <div className="ft-town-explorer" style={{ "--world-colour": world.dark } as React.CSSProperties}>
      <div className="ft-town-tabs" role="tablist" aria-label="Explore the five places">
        {worlds.map((w, i) => <button key={w.id} ref={el => { tabs.current[i] = el; }} id={`tab-${w.id}`} type="button" role="tab" aria-selected={selected === i} aria-controls="world-panel" tabIndex={selected === i ? 0 : -1} onClick={() => choose(i)} onKeyDown={e => keyDown(e, i)}><img src={`/festival-town/prop/${locations[i].icon}.webp`} width={48} height={48} alt="" loading="lazy" /><span>{w.name}<small>{w.verb}</small></span></button>)}
      </div>
      <div className="ft-town-display" role="tabpanel" id="world-panel" aria-labelledby={`tab-${world.id}`} tabIndex={0}>
        <div className="ft-town-map"><div className="ft-map-canvas">
          <img className="ft-map-land" src="/festival-town/scene/town-900.webp" alt="Illustrated Festival Town map" width={900} height={386} loading="lazy" />
          {worlds.map((w, i) => <button key={w.id} type="button" className={`ft-map-pin${i === selected ? " is-selected" : ""}`} style={{ left: `${locations[i].x}%`, top: `${locations[i].y}%` }} onClick={() => choose(i)} aria-label={`Explore ${w.name}`} aria-pressed={i === selected}><span>{i + 1}</span><b>{w.name}</b></button>)}
          </div><div className="ft-map-neighbour"><img src={`/festival-town/char/${world.host.id}_wave.webp`} alt={`${world.host.name}, waving`} width={140} height={200} loading="lazy" /><div><span className="ft-kicker">Meet your neighbour</span><h4>{world.host.name}</h4><p>{world.intro}</p></div></div>
        </div>
        <div className="ft-world-info">
          <div className="ft-world-heading"><span className="ft-world-subject">{world.subject}</span><span>0{selected + 1} / 05</span></div>
          <h3>{world.name}</h3><p className="ft-world-promise">{location.promise}</p>
          <figure><img src={`/festival-town/play/${world.id}-laptop.webp`} alt={`Real gameplay from ${world.name}`} width={1280} height={736} loading="lazy" /><figcaption>Inside the game · {world.host.name}’s neighbourhood</figcaption></figure>
          <p><strong>They’ll discover:</strong> {location.outcome}</p>
          <details className="ft-world-activities"><summary>See all 3 activities <span aria-hidden="true">+</span></summary><ol>{world.activities.map(a => <li key={a.name}><b>{a.name}</b><span>{a.what}.</span></li>)}</ol></details>
          <p className="ft-world-gift"><img src={`/festival-town/prop/${location.gift}.webp`} alt="" width={42} height={42} loading="lazy" /><span><b>For the festival</b>{world.gift}.</span></p>
        </div>
      </div>
      <div className="ft-discovery-footer"><div className="ft-discovery-gifts" aria-hidden="true">{locations.map((l, i) => <img key={l.gift} className={visited.includes(i) ? "is-discovered" : ""} src={`/festival-town/prop/${l.gift}.webp`} alt="" width={50} height={50} loading="lazy" />)}</div><p aria-live="polite">{visited.length === 5 ? "You’ve met the whole neighbourhood. Ready to play?" : `${visited.length} of 5 places explored. Each one brings something to the festival.`}</p><PlayLink place="explorer">Explore in the game</PlayLink></div>
    </div>
  );
}

export function GameplayPreview() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const paused = useMotionPaused();
  useEffect(() => { if (paused) ref.current?.pause(); }, [paused]);
  useEffect(() => { if (started) ref.current?.play().catch(() => undefined); }, [started]);
  return <div className="ft-gameplay-player">{started ? <video ref={ref} controls muted playsInline preload="metadata" poster="/festival-town/play/tech-laptop.webp" aria-label="Real Festival Town gameplay: code a robot, test a floating cork and complete a pattern"><source src="/festival-town/film/gameplay-preview.mp4" type="video/mp4" /><track kind="captions" src="/festival-town/film/gameplay-preview.vtt" srcLang="en" label="English descriptions" /></video> : <><img src="/festival-town/play/tech-laptop.webp" alt="The coding activity: arrange arrows to guide Bolt to his battery" width={1280} height={736} loading="lazy" /><button type="button" onClick={() => setStarted(true)}><span aria-hidden="true">▶</span>Watch real gameplay <small>8 seconds · sound off</small></button></>}</div>;
}
