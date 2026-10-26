import type { Beat, Media } from "@/content/film";
import { SceneRenderer } from "@/lib/gl/renderer";
import { isPaused, prefersReducedMotion, subscribe } from "@/lib/motion";

// The homepage film: scroll position picks the beat, fades its words in, cross-fades the footage
// and draws the progress mark. Plain DOM so the same engine runs in the site and in a static preview.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const sceneOf = (m: Media) => m.scene;

export function startFilm(el: HTMLElement, beats: Beat[]): () => void {
  const cv = el.querySelector<HTMLCanvasElement>(".stage-canvas");
  const progressLine = el.querySelector<SVGPathElement>(".film-progress .mark-line");
  if (!cv) return () => {};
  document.documentElement.classList.add("film-on");

  let renderer: SceneRenderer | null = null;
  try {
    renderer = new SceneRenderer(cv, { quality: 0.6, maxWidth: 1400 });
    renderer.setTime(6);
  } catch {
    el.classList.add("no-webgl");
  }

  const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-beat]"));
  const frames = sections.map((s) => s.querySelector<HTMLElement>(".beat-frame")!);
  const words = frames.map((f) => Array.from(f.querySelectorAll<HTMLElement>(".w")));
  const reduced = prefersReducedMotion();

  // Real footage, once encoded: one <video> per beat that has it, over the placeholder scene.
  const videos = new Map<number, HTMLVideoElement>();
  const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
  el.querySelectorAll<HTMLVideoElement>("video[data-for]").forEach((v) => {
    const k = Number(v.dataset.for);
    const m = beats[k].media;
    if (m.kind !== "video") return;
    const set = portrait && m.portrait ? m.portrait : m.src;
    v.poster = portrait && m.portrait ? m.portrait.poster : m.poster;
    v.replaceChildren();
    if (set.av1) {
      const s = document.createElement("source");
      s.src = set.av1;
      s.type = 'video/mp4; codecs="av01.0.05M.08"';
      v.appendChild(s);
    }
    const h = document.createElement("source");
    h.src = set.h264;
    h.type = "video/mp4";
    v.appendChild(h);
    videos.set(k, v);
  });
  let tops: number[] = [];
  let heights: number[] = [];
  let vh = window.innerHeight;
  let filmEnd = 0;
  let active = -1;
  let ticking = false;
  let inView = true;

  const measure = () => {
    vh = window.innerHeight;
    tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
    heights = sections.map((s) => s.offsetHeight);
    filmEnd = tops[tops.length - 1] + heights[heights.length - 1];
    renderer?.resize();
  };

  const update = () => {
    ticking = false;
    const probe = window.scrollY + vh * 0.5;
    let i = sections.length - 1;
    for (let k = 0; k < sections.length; k++) {
      if (probe < tops[k] + heights[k]) {
        i = k;
        break;
      }
    }
    const local = clamp((probe - tops[i]) / heights[i]);
    const beat = beats[i];

    if (i !== active) {
      frames.forEach((f, k) => f.classList.toggle("is-active", k === i));
      el.dataset.beat = beat.id;
      active = i;
    }

    // Frame fade in and out
    const isLast = i === beats.length - 1;
    const fadeOut = isLast ? 1 : 1 - smooth(0.86, 0.98, local);
    const fadeIn = i === 0 ? 1 : smooth(0.02, 0.14, local);
    frames.forEach((f, k) => {
      f.style.opacity = k === i ? String(fadeIn * fadeOut) : "0";
    });

    // Word-by-word reveal; unrevealed words stay dim, as in the reference
    const ws = words[i];
    if (ws.length) {
      const r = reduced ? 1 : smooth(0.06, 0.55, local);
      const n = ws.length;
      ws.forEach((w, j) => {
        const v = clamp(r * (n + 2) - j);
        w.style.opacity = String(0.22 + 0.78 * v);
      });
    }

    // Numerals on the method beat appear after the sentence
    if (beat.kind === "index") {
      frames[i].style.setProperty("--numerals", String(reduced ? 1 : smooth(0.55, 0.7, local)));
    }
    if (beat.kind === "title") {
      frames[i].style.setProperty("--draw", String(reduced ? 1 : smooth(0.0, 0.55, local + 0.18)));
    }

    // Cross-fade the footage into the next beat
    const next = beats[Math.min(i + 1, beats.length - 1)];
    const mix = isLast ? 0 : smooth(0.84, 1, local);
    renderer?.setScenes(sceneOf(beat.media), sceneOf(next.media), mix);
    videos.forEach((v, k) => {
      const o = k === i ? 1 - mix : k === i + 1 ? mix : 0;
      v.style.opacity = String(o);
      if ((k === i || k === i + 1) && v.preload !== "auto") {
        v.preload = "auto";
        v.load();
      }
      const want = o > 0 && !isPaused() && inView;
      if (want && v.paused) v.play().catch(() => {});
      if (!want && !v.paused) v.pause();
    });

    // Overall progress on the mark
    const p = clamp(window.scrollY / Math.max(1, filmEnd - vh));
    if (progressLine) progressLine.style.strokeDashoffset = String(1 - p);
    el.classList.toggle("is-past", window.scrollY > filmEnd - vh * 0.6);
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  const onResize = () => {
    measure();
    update();
  };

  const syncPlayback = () => {
    if (renderer) {
      if (isPaused() || !inView) renderer.stop();
      else renderer.play();
    }
    if (videos.size) update();
  };

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      syncPlayback();
    },
    { rootMargin: "0px 0px -40% 0px" },
  );
  io.observe(el);

  // Keyboard users: focusing a link inside a frame scrolls to that beat
  const onFocus = (e: FocusEvent) => {
    const sec = (e.target as HTMLElement).closest<HTMLElement>("[data-beat]");
    if (!sec) return;
    const k = Number(sec.dataset.beat);
    if (k === active) return;
    window.scrollTo({ top: tops[k] + heights[k] * 0.45 - vh * 0.5, behavior: "auto" });
  };

  measure();
  update();
  const unsub = subscribe(syncPlayback);
  syncPlayback();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  el.addEventListener("focusin", onFocus);

  return () => {
    document.documentElement.classList.remove("film-on");
    unsub();
    io.disconnect();
    renderer?.stop();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    el.removeEventListener("focusin", onFocus);
  };
}
