import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

// Inertial scrolling for mouse and trackpad. Touch screens keep their own native momentum.
// Turned off for people who ask their system for reduced motion.

let lenis: Lenis | null = null;
let raf = 0;
let users = 0;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startSmoothScroll(): () => void {
  users++;
  if (!lenis && !prefersReducedMotion() && window.matchMedia("(pointer: fine)").matches) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false });
    document.documentElement.classList.add("has-smooth-scroll");
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  return () => {
    users--;
    if (users > 0 || !lenis) return;
    cancelAnimationFrame(raf);
    lenis.destroy();
    lenis = null;
    document.documentElement.classList.remove("has-smooth-scroll");
  };
}

export const hasSmoothScroll = () => lenis !== null;

/** Scroll the page to y, gently. Any wheel, key or touch from the reader takes over at once. */
export function scrollToY(y: number, duration = 1.1) {
  if (lenis) lenis.scrollTo(y, { duration, easing: easeInOutCubic });
  else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Jump without animation, e.g. after a route change. */
export function jumpToY(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "auto" });
}
