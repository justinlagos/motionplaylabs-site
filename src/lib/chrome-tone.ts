// Keeps the header readable: it takes the tone (light or dark) of whatever sits under it, and
// gets a solid background once it is over page content rather than a clip.
// On the homepage the film sets the tone itself while it is on screen (html[data-film-active]).
// Plain DOM so the static preview can use it too.

export function watchChromeTone(): () => void {
  const root = document.documentElement;
  let ticking = false;
  const read = () => {
    ticking = false;
    if (root.dataset.filmActive) {
      delete root.dataset.chrome;
      return;
    }
    const stack = document.elementsFromPoint(window.innerWidth / 2, 30);
    for (const e of stack) {
      if (e.closest(".chrome, .menu-panel")) continue;
      const t = e.closest<HTMLElement>("[data-tone]");
      if (t?.dataset.tone) {
        if (root.dataset.tone !== t.dataset.tone) root.dataset.tone = t.dataset.tone;
        root.dataset.chrome = e.closest(".plate-hero") ? "clear" : "solid";
        return;
      }
    }
    root.dataset.tone = "light";
    root.dataset.chrome = "solid";
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(read);
    }
  };
  read();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}
