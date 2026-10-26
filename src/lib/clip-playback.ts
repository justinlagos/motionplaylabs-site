import { isPaused, subscribe } from "@/lib/motion";

// Playback rules for clips outside the homepage film. Plain DOM so the static preview can use them.

function revealOnPlay(v: HTMLVideoElement) {
  v.addEventListener("playing", () => v.classList.add("is-playing"), { once: true });
}

/** Full-bleed clip: plays while on screen, unless motion is paused. */
export function wirePlate(el: HTMLElement): () => void {
  const v = el.querySelector("video");
  if (!v) return () => {};
  revealOnPlay(v);
  let visible = false;
  const sync = () => {
    const want = visible && !isPaused();
    if (want) {
      if (v.preload !== "auto") v.preload = "auto";
      if (v.paused) v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  };
  const io = new IntersectionObserver((e) => {
    visible = e.some((x) => x.isIntersecting);
    sync();
  });
  io.observe(el);
  const unsub = subscribe(sync);
  return () => {
    io.disconnect();
    unsub();
    v.pause();
  };
}

/** Small clip inside a link: plays while the link is hovered or focused. */
export function wireThumb(el: HTMLElement): () => void {
  const v = el.querySelector("video");
  const host = (el.closest("a") as HTMLElement | null) ?? el;
  if (!v) return () => {};
  revealOnPlay(v);
  const on = () => {
    if (isPaused()) return;
    v.preload = "auto";
    v.play().catch(() => {});
  };
  const off = () => v.pause();
  host.addEventListener("pointerenter", on);
  host.addEventListener("focusin", on);
  host.addEventListener("pointerleave", off);
  host.addEventListener("focusout", off);
  const unsub = subscribe(() => isPaused() && off());
  return () => {
    host.removeEventListener("pointerenter", on);
    host.removeEventListener("focusin", on);
    host.removeEventListener("pointerleave", off);
    host.removeEventListener("focusout", off);
    unsub();
    off();
  };
}
