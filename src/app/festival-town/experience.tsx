"use client";

import { useEffect, useRef, useState } from "react";
import { festivalTown, worlds } from "@/content/festival-town";
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
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % worlds.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + worlds.length - 1) % worlds.length;
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
        <div className="ft-world-visual">
          <figure><img src={`/festival-town/play/${world.id}-laptop.webp`} alt={`Real gameplay from ${world.name}`} width={1280} height={736} loading="lazy" /><figcaption>Inside the game · {world.host.name}’s neighbourhood</figcaption></figure>
        </div>
        <div className="ft-world-info">
          <div className="ft-world-heading"><span className="ft-world-subject">{world.subject}</span><span>0{selected + 1} / 05</span></div>
          <h3>{location.promise}</h3><p>{world.intro}</p>
          <p><strong>They’ll discover:</strong> {location.outcome}</p>
          <details className="ft-world-activities"><summary>Explore the 3 activities <span aria-hidden="true">+</span></summary><ol>{world.activities.map(a => <li key={a.name}><b>{a.name}</b><span>{a.what}.</span></li>)}</ol></details>
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

const DeviceIcon = ({ type }: { type: "web" | "tv" | "android" }) => <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{type === "web" ? <><rect x="3" y="5" width="26" height="19" rx="3"/><path d="M11 28h10M16 24v4M3 10h26"/><circle cx="7" cy="7.5" r=".5"/></> : type === "tv" ? <><rect x="2" y="5" width="23" height="17" rx="2"/><path d="m8 26 3-4m8 4-3-4"/><rect x="27" y="15" width="4" height="13" rx="2"/></> : <><rect x="8" y="2" width="16" height="28" rx="4"/><path d="M13 6h6M14 26h4"/></>}</svg>;

export function PlayEverywhere() {
  return <section className="ft-platforms ft-section" id="play-anywhere" aria-labelledby="ft-platforms-h">
    <div className="ft-inner">
      <header className="ft-section-heading"><div><p className="ft-kicker">Little screen. Big screen. Your screen.</p><h2 id="ft-platforms-h">The whole town.<br />Right at home.</h2></div><p>On the sofa, at the kitchen table, or wherever curiosity strikes. Find your favourite way to play.</p></header>
      <div className="ft-platform-feature">
        <figure className="ft-tv-photo"><img src="/festival-town/scene/family-tv-1600.webp" srcSet="/festival-town/scene/family-tv-900.webp 900w, /festival-town/scene/family-tv-1600.webp 1600w" sizes="(max-width: 900px) 100vw, 70vw" alt="A mother and child playing Festival Town on a television, with the child holding a TV remote" width={1600} height={898} loading="lazy" /><figcaption>Make room for a little together-time. <span>Illustrative family scene created with AI.</span></figcaption></figure>
        <div className="ft-platform-choices">
          <a className="ft-platform-option" href={festivalTown.amazonUrl} target="_blank" rel="noopener"><DeviceIcon type="tv"/><span><small>Available on</small><strong>Amazon Appstore</strong><em>Bring the adventure to your TV.</em></span><span aria-hidden="true">↗</span></a>
          <a className="ft-platform-option" href={festivalTown.playUrl} target="_blank" rel="noopener"><DeviceIcon type="web"/><span><small>Play now · free</small><strong>Your web browser</strong><em>Phone, tablet, laptop & desktop.</em></span><span aria-hidden="true">↗</span></a>
          <div className="ft-platform-option is-soon"><DeviceIcon type="android"/><span><small>{festivalTown.googlePlayStatus}</small><strong>Google Play</strong><em>Our Android release is in review.</em></span></div>
          <p className="ft-device-note">For Amazon device compatibility, check the store listing. Browser progress stays on the device you play on.</p>
        </div>
      </div>
      <div className="ft-all-screens">
        <div className="ft-screens-copy"><p className="ft-kicker">Pick up. Play. Discover.</p><h3>Small hands.<br />So many possibilities.</h3><p>Tap on a phone or tablet. Click on a computer. Settle in together for a big-screen adventure.</p><PlayLink place="devices" className="ft-text-link">Open the browser game <span aria-hidden="true">↗</span></PlayLink></div>
        <div className="ft-devices" aria-label="Festival Town on a desktop, tablet and phone">
          <figure className="ft-device ft-device-desktop"><div><img src="/festival-town/play/tech-laptop.webp" alt="Coding activity on a desktop screen" width={1280} height={736} loading="lazy"/></div><figcaption>Desktop & laptop</figcaption></figure>
          <figure className="ft-device ft-device-tablet"><div><img src="/festival-town/play/farm-tablet.webp" alt="Farm activity on a tablet" width={1024} height={706} loading="lazy"/></div><figcaption>Tablet</figcaption></figure>
          <figure className="ft-device ft-device-phone"><div><img src="/festival-town/play/market-phone.webp" alt="Market activity on a phone in landscape orientation" width={844} height={390} loading="lazy"/></div><figcaption>Phone</figcaption></figure>
        </div>
      </div>
    </div>
  </section>;
}
