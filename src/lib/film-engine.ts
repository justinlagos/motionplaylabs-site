import type { Beat } from "@/content/film";
import { footage, media } from "@/content/footage";
import { isPaused, prefersReducedMotion, subscribe } from "@/lib/motion";
import { hasSmoothScroll, jumpToY, scrollToY } from "@/lib/scroll";

// The homepage film.
//
// One animation loop reads a smoothed scroll position and draws everything from it, so every
// change follows the reader's hand with weight instead of jumping with each wheel step.
// Scroll picks the beat; the beat's words rise into place; the clip under it pushes in slowly;
// and the hand-over to the next beat is one of three, each named for what a camera does:
//   lens       light to dark: the next clip opens out of the dot in the header logo
//   exposure   dark to light: the frame washes to white and the light clip settles out of it
//   focus      same tone: the focus pulls from one clip to the next
// If the reader stops part-way through a hand-over, the film finishes it for them (or eases back),
// so the screen never rests on a half-changed frame. A rail on the right shows where you are.
// Plain DOM so the same engine runs in the site and in the static preview.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Where in its beat the reader is "at rest" (words fully in), and where the hand-over starts
const REST = 0.3;
const HANDOVER = 0.8;

type Kind = "lens" | "exposure" | "focus";

export function startFilm(el: HTMLElement, beats: Beat[]): () => void {
  const root = document.documentElement;
  root.classList.add("film-on");

  const sections = Array.from(el.querySelectorAll<HTMLElement>("section[data-beat]"));
  const frames = sections.map((s) => s.querySelector<HTMLElement>(".beat-frame")!);
  const words = frames.map((f) => Array.from(f.querySelectorAll<HTMLElement>(".w")));
  const plates = Array.from(el.querySelectorAll<HTMLElement>(".stage .plate"));
  const videos = plates.map((p) => p.querySelector<HTMLVideoElement>("video"));
  const badge = el.querySelector<HTMLElement>(".badge-dock");
  const flash = el.querySelector<HTMLElement>(".stage-flash");
  const rings = Array.from(el.querySelectorAll<SVGGElement>(".badge-ring"));
  const rail = el.querySelector<HTMLElement>(".film-rail");
  const railDot = el.querySelector<HTMLElement>(".film-rail-dot");
  const railFill = el.querySelector<HTMLElement>(".film-rail-fill");
  const railLinks = Array.from(el.querySelectorAll<HTMLAnchorElement>(".film-rail a[data-k]"));
  const bar = el.querySelector<HTMLElement>(".film-bar");
  const tones = beats.map((b) => footage[b.clip].tone);

  // Header items recoloured one by one as the lens passes over them
  const chromeItems = Array.from(
    document.querySelectorAll<HTMLElement>(".chrome-brand, .chrome-nav a, .chrome-contact, .chrome-menu, .motion-toggle.is-fixed, .film-rail"),
  );
  const ink = (t: string) => (t === "dark" ? "#fff" : "#000");

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
  let inView = true;
  let origin = { x: 0, y: 0 };
  let cornerDist = 0;
  let itemCentres: { x: number; y: number }[] = [];
  let itemsTinted = false;
  let state = { i: 0, mix: 0 };

  const restY = (k: number) => tops[k] + heights[k] * REST - vh * 0.5;
  const handoverY = (k: number) => tops[k] + heights[k] * (HANDOVER - 0.08) - vh * 0.5;

  const measure = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
    heights = sections.map((s) => s.offsetHeight);
    filmEnd = tops[tops.length - 1] + heights[heights.length - 1];
    // The lens opens from the dot of the logo in the header
    const dot = document.querySelector(".chrome-logo circle")?.getBoundingClientRect();
    origin = dot && dot.width > 0 ? { x: dot.left + dot.width / 2, y: dot.top + dot.height / 2 } : { x: vw / 2, y: vh * 0.4 };
    cornerDist = Math.max(
      Math.hypot(origin.x, origin.y),
      Math.hypot(vw - origin.x, origin.y),
      Math.hypot(origin.x, vh - origin.y),
      Math.hypot(vw - origin.x, vh - origin.y),
    );
    itemCentres = chromeItems.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    // Rail ticks sit where each beat comes to rest
    const span = Math.max(1, filmEnd - vh);
    railLinks.forEach((a) => {
      const k = Number(a.dataset.k);
      a.style.setProperty("--at", String(clamp(restY(k) / span)));
    });
  };

  // The lens edge is soft, and softer the wider it opens, like light spreading
  const feather = (r: number) => 90 + 0.2 * r;
  const lensReach = () => (cornerDist + 90) / 0.8;

  const setTone = (t: string) => {
    if (t === tone) return;
    tone = t;
    root.dataset.tone = t;
    el.dataset.tone = t;
  };

  const tintItems = (radius: number, from: string, to: string) => {
    const f = feather(radius);
    chromeItems.forEach((c, k) => {
      const p = itemCentres[k];
      const inside = Math.hypot(p.x - origin.x, p.y - origin.y) < radius - f / 2;
      c.style.color = ink(inside ? to : from);
    });
    itemsTinted = true;
  };
  const clearItems = () => {
    if (!itemsTinted) return;
    chromeItems.forEach((c) => (c.style.color = ""));
    itemsTinted = false;
  };

  const render = (y: number) => {
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
      railLinks.forEach((a) => {
        const k = Number(a.dataset.k);
        const next = railLinks.find((b) => Number(b.dataset.k) > k);
        const current = i >= k && (!next || i < Number(next.dataset.k));
        a.classList.toggle("is-current", current);
        if (current) a.setAttribute("aria-current", "step");
        else a.removeAttribute("aria-current");
      });
    }

    // Words: the frame rises in, holds, and lifts away at the edges of its beat
    const fadeOut = isLast ? 1 : 1 - smooth(HANDOVER - 0.1, HANDOVER + 0.04, local);
    const fadeIn = i === 0 ? 1 : smooth(0.03, 0.18, local);
    frames.forEach((f, k) => {
      if (k !== i) {
        f.style.opacity = "0";
        return;
      }
      f.style.opacity = String(fadeIn * fadeOut);
      f.style.transform = reduced ? "none" : `translate3d(0, ${((1 - easeOut(fadeIn)) * 40 - (1 - fadeOut) * 40).toFixed(2)}px, 0)`;
    });

    // Word by word: each word brightens and rises a little as you read
    const ws = words[i];
    if (ws.length) {
      const r = reduced ? 1 : smooth(0.06, 0.5, local);
      const n = ws.length;
      ws.forEach((w, j) => {
        const v = easeOut(clamp(r * (n + 3) - j, 0, 1));
        w.style.opacity = String(0.18 + 0.82 * v);
        w.style.transform = reduced ? "none" : `translate3d(0, ${((1 - v) * 0.22).toFixed(3)}em, 0)`;
      });
    }
    if (beat.kind === "index") frames[i].style.setProperty("--rows", String(reduced ? 1 : smooth(0.24, 0.56, local)));
    if (beat.kind === "chapter") frames[i].style.setProperty("--draw", String(reduced ? 1 : smooth(0.04, 0.36, local)));

    // Footage
    const mix = isLast ? 0 : easeInOut(smooth(HANDOVER, 1, local));
    const kind: Kind = isLast || reduced || tones[i] === tones[i + 1] ? "focus" : tones[i + 1] === "dark" ? "lens" : "exposure";
    const push = reduced ? 1 : 1 + 0.045 * local; // slow push-in through the beat
    const radius = lensReach() * mix;
    state = { i, mix };
    plates.forEach((p, k) => {
      const v = videos[k];
      let show = false;
      if (k === i) {
        show = true;
        p.style.zIndex = "1";
        p.style.opacity = "1";
        p.style.maskImage = "none";
        p.style.webkitMaskImage = "none";
        p.style.transformOrigin = "50% 50%";
        if (kind === "lens") {
          p.style.transform = `scale(${(push + 0.05 * mix).toFixed(4)})`;
          p.style.filter = "none";
        } else if (kind === "exposure") {
          p.style.transform = `scale(${(push + 0.03 * mix).toFixed(4)})`;
          p.style.filter = "none";
        } else {
          p.style.transform = `scale(${(push + 0.03 * mix).toFixed(4)})`;
          p.style.filter = fine && !reduced && mix > 0.001 ? `blur(${(mix * 9).toFixed(2)}px)` : "none";
        }
      } else if (k === i + 1 && mix > 0.001) {
        show = true;
        p.style.zIndex = "2";
        if (kind === "lens") {
          const at = `${origin.x.toFixed(0)}px ${origin.y.toFixed(0)}px`;
          const f = feather(radius);
          const m = `radial-gradient(circle at ${at}, #000 ${Math.max(0, radius - f).toFixed(1)}px, rgba(0,0,0,0.5) ${Math.max(0, radius - f * 0.45).toFixed(1)}px, transparent ${radius.toFixed(1)}px)`;
          p.style.opacity = "1";
          p.style.maskImage = m;
          p.style.webkitMaskImage = m;
          p.style.transformOrigin = at;
          p.style.transform = `scale(${(1.14 - 0.14 * easeOut(mix)).toFixed(4)})`;
          p.style.filter = "none";
        } else if (kind === "exposure") {
          p.style.maskImage = "none";
          p.style.webkitMaskImage = "none";
          p.style.transformOrigin = "50% 50%";
          p.style.opacity = String(smooth(0.28, 0.62, mix));
          p.style.transform = `scale(${(1.06 - 0.06 * easeOut(mix)).toFixed(4)})`;
          p.style.filter = "none";
        } else {
          p.style.maskImage = "none";
          p.style.webkitMaskImage = "none";
          p.style.transformOrigin = "50% 50%";
          p.style.opacity = String(mix);
          p.style.transform = reduced ? "none" : `scale(${(1.04 - 0.04 * mix).toFixed(4)})`;
          p.style.filter = fine && !reduced && mix < 0.999 ? `blur(${((1 - mix) * 9).toFixed(2)}px)` : "none";
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
    if (flash) flash.style.opacity = kind === "exposure" && mix > 0 && mix < 1 ? (Math.pow(Math.sin(Math.PI * mix), 1.3) * 0.9).toFixed(3) : "0";

    // Light or dark. Through the lens, each header item changes as the lens reaches it.
    const flip = kind === "lens" ? 0.97 : kind === "exposure" ? 0.32 : 0.5;
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

    // Where you are
    const p = clamp(y / Math.max(1, filmEnd - vh));
    if (rail) rail.classList.toggle("is-shown", i > 0 && !isLast);
    if (railDot) railDot.style.setProperty("--p", p.toFixed(4));
    if (railFill) railFill.style.setProperty("--p", p.toFixed(4));
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };

  // ---- The loop: smoothed scroll in, frames out ----
  let sy = window.scrollY;
  let lastY = sy;
  let lastDrawn = -1;
  let lastT = performance.now();
  let raf = 0;
  let angle = 0;
  let lastScrollT = 0;
  let settling = false;
  let settleTarget = 0;
  let pointerDown = false;
  let dirty = true;

  const loop = (now: number) => {
    const dt = Math.min(0.1, (now - lastT) / 1000);
    lastT = now;
    const target = window.scrollY;
    // Inertial scrolling already smooths the page; on touch, smooth the animation ourselves
    if (hasSmoothScroll() || reduced) sy = target;
    else {
      sy += (target - sy) * (1 - Math.exp(-dt * 11));
      if (Math.abs(target - sy) < 0.25) sy = target;
    }
    if (dirty || Math.abs(sy - lastDrawn) > 0.05) {
      render(sy);
      lastDrawn = sy;
      dirty = false;
    }

    // Ring: a slow turn, plus whatever the reader scrolls
    if (!reduced && !isPaused() && rings.length) {
      angle = (angle + dt * 5 + (target - lastY) * 0.12) % 360;
      rings.forEach((r) => (r.style.transform = `rotate(${angle.toFixed(2)}deg)`));
    }
    lastY = target;

    // Settle: never leave the reader on a half-changed frame
    if (settling && Math.abs(window.scrollY - settleTarget) < 2) settling = false;
    if (!reduced && !settling && !pointerDown && now - lastScrollT > 260 && Math.abs(target - sy) < 1) {
      const { i, mix } = state;
      if (mix > 0.03 && mix < 0.97 && i < beats.length - 1) {
        settleTarget = mix > 0.5 ? restY(i + 1) : handoverY(i);
        settling = true;
        scrollToY(settleTarget, 0.9 + 0.5 * Math.abs(mix - (mix > 0.5 ? 1 : 0)));
      }
    }

    raf = inView ? requestAnimationFrame(loop) : 0;
  };
  const wake = () => {
    if (!raf && inView) {
      lastT = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };

  const onScroll = () => {
    lastScrollT = performance.now();
    wake();
  };
  const onInput = () => {
    settling = false;
    lastScrollT = performance.now();
  };
  const onDown = () => {
    pointerDown = true;
    onInput();
  };
  const onUp = () => {
    pointerDown = false;
    lastScrollT = performance.now();
  };
  const onResize = () => {
    measure();
    dirty = true;
    wake();
  };

  const syncPlayback = () => {
    el.classList.toggle("is-paused", isPaused());
    dirty = true;
    wake();
  };

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      dirty = true;
      if (inView) wake();
      else render(window.scrollY); // pause clips that leave the screen
    },
    { rootMargin: "0px 0px -30% 0px" },
  );
  io.observe(el);

  // Keyboard users: focusing a link inside a frame brings that beat to rest
  const onFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".film-rail")) return;
    const sec = target.closest<HTMLElement>("section[data-beat]");
    if (!sec) return;
    const k = Number(sec.dataset.beat);
    if (k === active) return;
    jumpToY(restY(k) + heights[k] * 0.15);
  };

  // Rail: jump to a chapter
  const onRail = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(".film-rail a[data-k]");
    if (!a) return;
    e.preventDefault();
    settling = true;
    settleTarget = restY(Number(a.dataset.k)) + heights[Number(a.dataset.k)] * 0.12;
    scrollToY(settleTarget, 1.6);
  };

  measure();
  render(window.scrollY);
  const unsub = subscribe(syncPlayback);
  syncPlayback();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onInput, { passive: true });
  window.addEventListener("keydown", onInput);
  window.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("touchend", onUp, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("resize", onResize);
  el.addEventListener("focusin", onFocus);
  el.addEventListener("click", onRail);
  // Fonts and late layout can move section tops
  const late = window.setTimeout(onResize, 700);
  wake();

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
    window.removeEventListener("wheel", onInput);
    window.removeEventListener("keydown", onInput);
    window.removeEventListener("touchstart", onDown);
    window.removeEventListener("touchend", onUp);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("resize", onResize);
    el.removeEventListener("focusin", onFocus);
    el.removeEventListener("click", onRail);
  };
}
