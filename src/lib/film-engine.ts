import type { Beat } from "@/content/film";
import { footage, media } from "@/content/footage";
import { isPaused, prefersReducedMotion, subscribe } from "@/lib/motion";

// The homepage film. Scroll position picks the beat; the beat's words reveal; the footage hands
// over to the next beat in one of three ways, each named for what a camera does:
//   lens       light to dark: the next clip opens out of the dot in the header logo, soft-edged
//   exposure   dark to light: the dark clip overexposes and the light clip settles out of the white
//   focus      same tone: the focus pulls from one clip to the next
// The circle badge draws itself in on the title and leaves as the film starts; it returns,
// turning, beside the closing line. Plain DOM so the same engine runs in the site and in the preview.

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
  const flash = el.querySelector<HTMLElement>(".stage-flash");
  const rings = Array.from(el.querySelectorAll<SVGGElement>(".badge-ring"));
  const tones = beats.map((b) => footage[b.clip].tone);
  // Header items recoloured one by one as the lens passes over them
  const chromeItems = Array.from(
    document.querySelectorAll<HTMLElement>(".chrome-brand, .chrome-nav a, .chrome-contact, .chrome-menu, .motion-toggle.is-fixed"),
  );
  const ink = (t: string) => (t === "dark" ? "#fff" : "#000");
  const FEATHER = 70;

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
  let origin = { x: 0, y: 0 };
  let reach = 0;
  let itemCentres: { x: number; y: number }[] = [];
  let itemsTinted = false;

  const measure = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
    heights = sections.map((s) => s.offsetHeight);
    filmEnd = tops[tops.length - 1] + heights[heights.length - 1];
    // The lens opens from the dot of the logo in the header
    const dot = document.querySelector(".chrome-logo circle")?.getBoundingClientRect();
    origin = dot ? { x: dot.left + dot.width / 2, y: dot.top + dot.height / 2 } : { x: vw / 2, y: vh / 2 };
    reach = Math.max(Math.hypot(origin.x, origin.y), Math.hypot(vw - origin.x, origin.y), Math.hypot(origin.x, vh - origin.y), Math.hypot(vw - origin.x, vh - origin.y)) + FEATHER;
    itemCentres = chromeItems.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  };

  const tintItems = (radius: number, from: string, to: string) => {
    chromeItems.forEach((c, k) => {
      const p = itemCentres[k];
      const inside = Math.hypot(p.x - origin.x, p.y - origin.y) < radius - FEATHER / 2;
      c.style.color = ink(inside ? to : from);
    });
    itemsTinted = true;
  };
  const clearItems = () => {
    if (!itemsTinted) return;
    chromeItems.forEach((c) => (c.style.color = ""));
    itemsTinted = false;
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
      el.dataset.current = beat.id;
      active = i;
    }

    // Words: frame fades in and out at the edges of its beat
    const fadeOut = isLast ? 1 : 1 - smooth(0.72, 0.84, local);
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
    if (beat.kind === "chapter") {
      frames[i].style.setProperty("--draw", String(reduced ? 1 : smooth(0.06, 0.4, local)));
    }

    // Footage hand-over
    const mix = isLast ? 0 : easeInOut(smooth(0.8, 1, local));
    const kind = isLast || reduced ? "focus" : tones[i] === tones[i + 1] ? "focus" : tones[i + 1] === "dark" ? "lens" : "exposure";
    const radius = reach * mix;
    plates.forEach((p, k) => {
      const v = videos[k];
      let show = false;
      p.style.maskImage = "none";
      p.style.webkitMaskImage = "none";
      if (k === i) {
        show = true;
        p.style.zIndex = "1";
        p.style.opacity = "1";
        p.style.transformOrigin = "50% 50%";
        if (kind === "lens") {
          p.style.transform = "none";
          p.style.filter = "none";
        } else if (kind === "exposure") {
          p.style.transform = "none";
          p.style.filter = "none";
        } else {
          p.style.transform = reduced ? "none" : `scale(${1 + 0.03 * mix})`;
          p.style.filter = fine && !reduced && mix > 0 ? `blur(${(mix * 10).toFixed(2)}px)` : "none";
        }
      } else if (k === i + 1 && mix > 0) {
        show = true;
        p.style.zIndex = "2";
        if (kind === "lens") {
          const at = `${origin.x.toFixed(0)}px ${origin.y.toFixed(0)}px`;
          const m = `radial-gradient(circle at ${at}, #000 ${Math.max(0, radius - FEATHER).toFixed(1)}px, transparent ${radius.toFixed(1)}px)`;
          p.style.opacity = "1";
          p.style.maskImage = m;
          p.style.webkitMaskImage = m;
          p.style.transformOrigin = at;
          p.style.transform = `scale(${(1.12 - 0.12 * easeOut(mix)).toFixed(4)})`;
          p.style.filter = "none";
        } else if (kind === "exposure") {
          p.style.transformOrigin = "50% 50%";
          p.style.opacity = String(smooth(0.3, 0.6, mix));
          p.style.transform = `scale(${(1.05 - 0.05 * easeOut(mix)).toFixed(4)})`;
          p.style.filter = "none";
        } else {
          p.style.transformOrigin = "50% 50%";
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

    // Exposure: the frame washes to white and the light clip settles out of it
    if (flash) flash.style.opacity = kind === "exposure" && mix > 0 && mix < 1 ? (Math.pow(Math.sin(Math.PI * mix), 1.4) * 0.92).toFixed(3) : "0";

    // Light or dark. Through the lens, each header item changes as the lens reaches it.
    const flip = kind === "lens" ? 0.97 : kind === "exposure" ? 0.35 : 0.5;
    setTone(mix > flip ? tones[i + 1] : tones[i]);
    if (kind === "lens" && mix > 0 && mix < 0.97) tintItems(radius, tones[i], tones[i + 1]);
    else clearItems();
    const past = y > filmEnd - vh * 0.75;
    el.classList.toggle("is-past", past);
    if (past) delete root.dataset.filmActive;
    else {
      root.dataset.filmActive = "1";
      delete root.dataset.chrome;
    }

    // Badge: large in the middle on the title, then it steps back as the film starts
    if (badge) {
      const t = i === 0 ? smooth(0.3, 0.85, local) : 1;
      badge.style.opacity = String(1 - t);
      badge.style.visibility = t >= 1 ? "hidden" : "visible";
      badge.style.transform = `translate(-50%, -50%) translateY(${(-6 * t).toFixed(2)}vh) scale(${(1 - 0.18 * t).toFixed(4)})`;
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
    rings.forEach((r) => (r.style.transform = `rotate(${angle.toFixed(2)}deg)`));
    raf = requestAnimationFrame(spin);
  };
  const runSpin = () => {
    const want = !reduced && !isPaused() && inView && rings.length > 0;
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
    clearItems();
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
