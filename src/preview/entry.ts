// Static preview of the homepage film (no React). Built by scripts/build-film-preview.mjs.
import { film } from "@/content/film";
import { watchChromeTone } from "@/lib/chrome-tone";
import { wirePlate, wireThumb } from "@/lib/clip-playback";
import { startFilm } from "@/lib/film-engine";
import { startSmoothScroll } from "@/lib/scroll";
import { isPaused, setPaused, subscribe } from "@/lib/motion";

startSmoothScroll();
const root = document.querySelector<HTMLElement>(".film");
if (root) startFilm(root, film);
watchChromeTone();

document.querySelectorAll<HTMLElement>(".clip-thumb").forEach((el) => wireThumb(el));
document.querySelectorAll<HTMLElement>(".plate.is-static").forEach((el) => wirePlate(el));

const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>(".motion-toggle"));
const syncToggles = () =>
  toggles.forEach((b) => {
    b.textContent = isPaused() ? "Play motion" : "Pause motion";
    b.setAttribute("aria-pressed", String(isPaused()));
  });
toggles.forEach((b) => b.addEventListener("click", () => setPaused(!isPaused())));
subscribe(syncToggles);
syncToggles();

const menu = document.querySelector<HTMLButtonElement>(".chrome-menu");
const panel = document.getElementById("menu-panel");
const chrome = document.querySelector(".chrome");
menu?.addEventListener("click", () => {
  if (!panel) return;
  const open = panel.hidden === true;
  panel.hidden = !open;
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "Close" : "Menu";
  chrome?.classList.toggle("is-open", open);
});
