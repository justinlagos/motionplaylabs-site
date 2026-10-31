"use client";

import { useEffect, useRef } from "react";
import { isPaused, subscribe } from "@/lib/motion";
import { Bunting } from "./Bunting";
import { Character } from "./Character";
import { FilmButton, MotionSwitch, PlayLink } from "./client";

/**
 * Arrival. The sky, the town and the four friends, layered so they move apart a little as the
 * pointer moves and the page scrolls. The arrival sequence (bunting drops, friends pop up, Zizi
 * speaks) is CSS, so it plays without waiting for scripts; this file only adds depth.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    let raf = 0;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let visible = true;

    const frame = () => {
      raf = 0;
      if (isPaused() || reduce.matches) {
        el.style.setProperty("--px", "0");
        el.style.setProperty("--py", "0");
        el.style.setProperty("--sy", "0");
        return;
      }
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      el.style.setProperty("--px", px.toFixed(4));
      el.style.setProperty("--py", py.toFixed(4));
      el.style.setProperty("--sy", Math.min(window.scrollY, 1200).toFixed(1));
      if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (!fine.matches) return;
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", kick, { passive: true });
    const unsub = subscribe(kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", kick);
      unsub();
    };
  }, []);

  return (
    <section ref={ref} className="ftx-hero" id="top" aria-labelledby="ftx-h1">
      <div className="ftx-hero-sky" aria-hidden="true">
        <img className="ftx-cloud c1" src="/festival-town/prop/cloud.webp" alt="" width={460} height={295} />
        <img className="ftx-cloud c2" src="/festival-town/prop/cloud.webp" alt="" width={460} height={295} />
        <img className="ftx-cloud c3" src="/festival-town/prop/cloud.webp" alt="" width={460} height={295} />
        <img className="ftx-kite" src="/festival-town/prop/kite.webp" alt="" width={285} height={460} />
      </div>

      <div className="ftx-hero-copy">
        <h1 id="ftx-h1" className="ftx-sticker-type">
          <span>Help the town get ready</span> <span>for the festival</span>
        </h1>
        <p className="ftx-hero-lead">
          A free learning game for ages 4 to 7. Pick a friend, visit five places in a Nigerian town, and count, grow, code, build and make your way to the big street festival.
        </p>
        <div className="ftx-hero-row">
          <div className="ftx-hero-actions">
            <PlayLink place="hero" className="ftx-btn is-big">
              Play free now
            </PlayLink>
            <FilmButton className="ftx-btn is-ghost is-film" />
          </div>
          <ul className="ftx-promises" aria-label="Good to know">
            <li>Ages 4 to 7</li>
            <li>Free to play</li>
            <li>No ads</li>
            <li>No sign-up</li>
          </ul>
        </div>
      </div>

      <div className="ftx-hero-stage">
        <div className="ftx-hero-town">
          <img
            src="/festival-town/scene/bg_title-1600.webp"
            srcSet="/festival-town/scene/bg_title-900.webp 900w, /festival-town/scene/bg_title-1600.webp 1600w"
            sizes="(max-width: 700px) 190vw, 100vw"
            alt="Festival Town: a computer shop, a market stall, a farm and a building yard around a green, ready for a street festival"
            width={1600}
            height={686}
            fetchPriority="high"
          />
        </div>
        <Bunting className="ftx-hero-bunting" flags={26} sag={44} height={120} />
        <div className="ftx-hero-cast" aria-hidden="true">
          <Character id="tobi" pose="point" alt="" className="c-tobi" priority delay={0.4} />
          <Character id="ada" pose="wave" alt="" className="c-ada" priority delay={1.9} />
          <Character id="amina" pose="cheer" alt="" className="c-amina" priority delay={3.1} />
          <div className="c-zizi-wrap">
            <p className="ftx-bubble ftx-hero-bubble">
              <b>Zizi</b>
              Welcome to our town! The big street festival is on Saturday.
            </p>
            <Character id="zizi" pose="wave" alt="" className="c-zizi" priority delay={2.5} />
          </div>
        </div>
      </div>
      <MotionSwitch className="ftx-hero-motion" />
    </section>
  );
}
