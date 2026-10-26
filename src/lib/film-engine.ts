import type { Beat } from "@/content/film";
import { footage, media } from "@/content/footage";
import { isPaused, prefersReducedMotion, subscribe } from "@/lib/motion";

// The homepage film. Scroll position picks the beat; the beat's words reveal; the footage hands
// over to the next beat either through a lens (an iris that opens from the centre, used when the
// tone changes between light and dark) or a focus pull (used when the tone stays the same).
// The circle badge starts large in the middle, docks in the corner, and its ring turns with scroll.
// Plain DOM so the same engine runs in the site and in the static preview.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startFilm(el: HTMLElement, beats: Beat[]): () => void {
  const root = document.documentElement;
  root.classList.add("film-on");

  const sections = Array.from(el.querySelectorAll<HTMLElement>("[data-beat]"));
  const frames = sections.map((s) => s.querySelector<HTMLElement>(".beat-frame")!);
  const words = frames.map((f) => Array.from(f.querySelectorAll<HTMLElement>(".w")));
  const plates = Array.from(el.querySelectorAll<HTMLElement>(".plate"));
  const videos = plates.map((p) => p.querySelector<HTMLVideoElement>("video"));
  const badge = el.querySelector<HTMLElement>(".badge-dock");
  const ring = badge?.querySelector<SVGGElement>(".badge-ring") ?? null;
  const tones = beats.map((b) => footage[b.clip].tone);

  const reduced = prefersReducedMotion();
  const fine = window.matchMedia("(pointer: fine) and (min-width: 900px)").matches;

  // Choose landscape or portrait files once, by the shape of the screen.
  const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
  videos.forEach((v, k) => {
    if (!v) return;
    const m = media(beats[k].clip);
    v.addEventListener("playing", () => v.classList.add("is-playing"), { once: true });
    v.replaceChildren();
    const add = (src: string, type: string) => {
      const s = document.createElement("source");
      s.src = src;
      s.type = type;
      v.appendChild(s);
    };
    if (portrait) add(m.portrait, "video/mp4");
    else {
      add(m.av1, 'video/mp4; codecs="av01.0.08M.08"');
      add(m.h264, "video/mp4");
    }
  });

  let tops: number[] = [];
  let heights: number[] = [];
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let filmEnd = 0;
  let active = -1;
  let tone = "";
  let ticking = false;
  let inView = true;

  const measure = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
    heights = sections.map((s) => s.offsetHeight);
    filmEnd = tops[tops.length - 1] + heights[heights.length - 1];
  };

  const setTone = (t: string) => {
    if (t === tone) return;
    tone = t;
    root.dataset.tone = t;
    el.dataset.tone = t;
  };

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const probe = y + vh * 0.5;
    let i = sections.length - 1;
    for (let k = 0; k < sections.length; k++) {
      if (probe < tops[k] + heights[k]) {
        i = k;
        break;
      }
    }
    const local = clamp((probe - tops[i]) / heights[i]);
    const beat = beats[i];
    const isLast = i === beats.length - 1;

    if (i !== active) {
      frames.forEach((f, k) => f.classList.toggle("is-active", k === i));
      el.dataset.beat = beat.id;
      active = i;
    }

    // Words: frame fades in and out at the edges of its beat
    const fadeOut = isLast ? 1 : 1 - smooth(0.8, 0.9, local);
    const fadeIn = i === 0 ? 1 : smooth(0.04, 0.16, local);
    frames.forEach((f, k) => {
      f.style.opacity = k === i ? String(fadeIn * fadeOut) : "0";
    });

    // Word-by-word reveal; unrevealed words stay dim
    const ws = words[i];
    if (ws.length) {
      const r = reduced ? 1 : smooth(0.08, 0.55, local);
      const n = ws.length;
      ws.forEach((w, j) => {
        const v = clamp(r * (n + 2) - j);
        w.style.opacity = String(0.2 + 0.8 * v);
      });
    }
    if (beat.kind === "index") {
      frames[i].style.setProperty("--rows", String(reduced ? 1 : smooth(0.3, 0.62, local)));
    }

    // Footage hand-over
    const mix = isLast ? 0 : easeInOut(smooth(0.78, 1, local));
    const iris = !isLast && tones[i] !== tones[i + 1] && !reduced;
    plates.forEach((p, k) => {
      const v = videos[k];
      let show = false;
      if (k === i) {
        show = true;
        p.style.zIndex = "1";
        p.style.clipPath = "none";
        p.style.opacity = "1";
        if (iris) {
          p.style.transform = `scale(${1 - 0.06 * mix})`;
          p.style.filter = fine ? `brightness(${1 - 0.25 * mix})` : "none";
        } else {
          p.style.transform = reduced ? "none" : `scale(${1 + 0.03 * mix})`;
          p.style.filter = fine && !reduced && mix > 0 ? `blur(${(mix * 10).toFixed(2)}px)` : "none";
        }
      } else if (k === i + 1 && mix > 0) {
        show = true;
        p.style.zIndex = "2";
        if (iris) {
          const R = Math.hypot(vw, vh) / 2 + 4;
          p.style.opacity = "1";
          p.style.clipPath = `circle(${(R * mix).toFixed(1)}px at 50% 50%)`;
          p.style.transform = `scale(${1.22 - 0.22 * easeOut(mix)})`;
          p.style.filter = "none";
        } else {
          p.style.clipPath = "none";
          p.style.opacity = String(mix);
          p.style.transform = reduced ? "none" : `scale(${1.04 - 0.04 * mix})`;
          p.style.filter = fine && !reduced && mix < 1 ? `blur(${((1 - mix) * 10).toFixed(2)}px)` : "none";
        }
      }
      p.style.visibility = show ? "visible" : "hidden";
      if (!v) return;
      if ((k === i || k === i + 1 || k === i + 2) && v.preload !== "auto") {
        v.preload = "auto";
        v.load();
      }
      const want = show && !isPaused() && inView;
      if (want && v.paused) v.play().catch(() => {});
      if (!want && !v.paused) v.pause();
    });

    // Light or dark: flips halfway through the hand-over
    setTone(mix > 0.5 ? tones[i + 1] : tones[i]);
    const past = y > filmEnd - vh * 0.75;
    el.classList.toggle("is-past", past);
    if (past) delete root.dataset.filmActive;
    else {
      root.dataset.filmActive = "1";
      delete root.dataset.chrome;
    }

    // Badge: large in the middle on the title, docked in the corner after it
    if (badge) {
      const t = i === 0 ? easeInOut(smooth(0.18, 0.92, local)) : 1;
      const big = badge.offsetWidth;
      const small = vw < 700 ? 56 : 84;
      const m = vw < 700 ? 16 : 28;
      const dx = vw - m - small / 2 - vw / 2;
      const dy = vh - m - small / 2 - vh / 2;
      const s = 1 + (small / big - 1) * t;
      badge.style.transform = `translate(-50%, -50%) translate(${(dx * t).toFixed(1)}px, ${(dy * t).toFixed(1)}px) scale(${s.toFixed(4)})`;
      badge.classList.toggle("is-docked", t > 0.98);
    }
  };

  // Ring rotation: a slow turn, plus whatever the reader scrolls
  let angle = 0;
  let lastY = window.scrollY;
  let lastT = performance.now();
  let raf = 0;
  const spin = (now: number) => {
    const dt = Math.min(0.1, (now - lastT) / 1000);
    lastT = now;
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    angle = (angle + dt * 5 + dy * 0.12) % 360;
    if (ring) ring.style.transform = `rotate(${angle.toFixed(2)}deg)`;
    raf = requestAnimationFrame(spin);
  };
  const runSpin = () => {
    const want = !reduced && !isPaused() && inView && !!ring;
    if (want && !raf) {
      lastT = performance.now();
      lastY = window.scrollY;
      raf = requestAnimationFrame(spin);
    } else if (!want && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
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
    el.classList.toggle("is-paused", isPaused());
    runSpin();
    update();
  };

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      syncPlayback();
    },
    { rootMargin: "0px 0px -30% 0px" },
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
  // Fonts and late layout can move section tops
  const late = window.setTimeout(onResize, 600);

  return () => {
    root.classList.remove("film-on");
    delete root.dataset.filmActive;
    unsub();
    io.disconnect();
    if (raf) cancelAnimationFrame(raf);
    window.clearTimeout(late);
    videos.forEach((v) => v?.pause());
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    el.removeEventListener("focusin", onFocus);
  };
}
