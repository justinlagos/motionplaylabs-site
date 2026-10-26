// Static preview of the homepage film (no React). Built by scripts/build-film-preview.mjs.
import { film } from "@/content/film";
import { startFilm } from "@/lib/film-engine";
import { sceneStill } from "@/lib/gl/renderer";
import type { SceneId } from "@/lib/gl/shaders";
import { isPaused, setPaused, subscribe } from "@/lib/motion";

const root = document.querySelector<HTMLElement>(".film");
if (root) startFilm(root, film);

document.querySelectorAll<HTMLElement>(".scene-still[data-scene]").forEach((el) => {
  const url = sceneStill(el.dataset.scene as SceneId, 480, 270);
  if (!url) return;
  const img = new Image(480, 270);
  img.src = url;
  img.alt = "";
  el.appendChild(img);
});

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
