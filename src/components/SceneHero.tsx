"use client";

import { useEffect, useRef } from "react";
import type { SceneId } from "@/lib/gl/shaders";
import { SceneRenderer } from "@/lib/gl/renderer";
import { isPaused, subscribe } from "@/lib/motion";
import { MotionToggle } from "./MotionToggle";

type Props = {
  scene: SceneId;
  title: string;
  line?: string;
  kicker?: string;
  children?: React.ReactNode;
};

/** Page opener: one looping scene behind the page title. */
export function SceneHero({ scene, title, line, kicker, children }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const el = box.current;
    if (!cv || !el) return;
    let r: SceneRenderer;
    try {
      r = new SceneRenderer(cv, { quality: 0.6, maxWidth: 1400 });
    } catch {
      el.classList.add("no-webgl");
      return;
    }
    r.setTime(10);
    r.setScenes(scene, scene, 0);
    r.resize();
    let inView = true;
    const sync = () => (isPaused() || !inView ? r.stop() : r.play());
    const io = new IntersectionObserver((e) => {
      inView = e.some((x) => x.isIntersecting);
      sync();
    });
    io.observe(el);
    const unsub = subscribe(sync);
    const onResize = () => r.resize();
    window.addEventListener("resize", onResize);
    sync();
    return () => {
      io.disconnect();
      unsub();
      r.stop();
      window.removeEventListener("resize", onResize);
    };
  }, [scene]);

  return (
    <section className="scene-hero" ref={box} data-scene={scene}>
      <canvas ref={ref} className="scene-hero-canvas" aria-hidden="true" />
      <div className="scene-hero-scrim" aria-hidden="true" />
      <div className="scene-hero-text">
        {kicker && <p className="scene-hero-kicker">{kicker}</p>}
        <h1 className="scene-hero-title">{title}</h1>
        {line && <p className="scene-hero-line">{line}</p>}
        {children}
      </div>
      <MotionToggle className="is-in-hero" />
    </section>
  );
}
