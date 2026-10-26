/**
 * The footage library. Every moving picture on the site comes from here.
 *
 * Each clip is encoded by scripts/encode-video.sh into public/media/<id>/:
 *   1080.av1.mp4, 1080.h264.mp4   landscape, 1920x1080
 *   portrait.h264.mp4             9:16 crop for phones, 720x1280
 *   poster.webp, poster-portrait.webp, thumb.mp4 (640x360 loop), thumb.webp
 *
 * Tone says whether the picture is mostly white (light) or mostly black (dark).
 * The page chrome and type flip to match it.
 *
 * To swap a clip for our own footage: encode the new file into the same folder, update the
 * caption and credit below, and nothing else needs to change.
 */

export type Tone = "light" | "dark";

export type Clip = {
  id: ClipId;
  tone: Tone;
  /** What the picture shows, in plain words. Shown as a caption and read by screen readers. */
  caption: string;
  credit: { by: string; source: "Mixkit" | "Pexels" | "Coverr" | "MotionPlay Labs"; url: string };
  /** Horizontal focus for the phone crop, 0 = left edge, 50 = centre, 100 = right edge. */
  focusX?: number;
};

export type ClipId =
  | "droplets"
  | "inkclouds"
  | "soapfilm"
  | "pencil"
  | "folds"
  | "ferrofluid"
  | "pigment"
  | "circuit"
  | "milkdrop"
  | "inkdark"
  | "inkfade"
  | "magenta"
  | "dust";

// Where the files live. Set NEXT_PUBLIC_MEDIA_ROOT to serve them from a CDN instead of /media.
const ROOT = process.env.NEXT_PUBLIC_MEDIA_ROOT ?? "/media";
const base = (id: ClipId) => `${ROOT}/${id}`;

export const media = (id: ClipId) => ({
  av1: `${base(id)}/1080.av1.mp4`,
  h264: `${base(id)}/1080.h264.mp4`,
  portrait: `${base(id)}/portrait.h264.mp4`,
  poster: `${base(id)}/poster.webp`,
  posterPortrait: `${base(id)}/poster-portrait.webp`,
  thumb: `${base(id)}/thumb.mp4`,
  thumbPoster: `${base(id)}/thumb.webp`,
});

// Settings for each clip's cut and grade are in scripts/encode-all.sh.
export const footage: Record<ClipId, Clip> = {
  droplets: { id: "droplets", tone: "light", caption: "Water on a white surface", focusX: 50, credit: { by: "", source: "Mixkit", url: "https://mixkit.co/free-stock-video/white-bubbles-dripping-down-674/" } },
  inkclouds: { id: "inkclouds", tone: "light", caption: "Ink meeting in water", focusX: 50, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/a-black-liquid-mixed-with-water-9809335/" } },
  soapfilm: { id: "soapfilm", tone: "dark", caption: "Light on a soap film", focusX: 50, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/rainbow-light-reflection-on-a-soap-bubble-4431323/" } },
  pencil: { id: "pencil", tone: "light", caption: "Graphite on paper", focusX: 30, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/close-up-of-pencil-drawing-line-in-black-and-white-33063729/" } },
  folds: { id: "folds", tone: "light", caption: "Folded paper in moving light", focusX: 50, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/light-and-shadows-on-folded-papers-7235006/" } },
  ferrofluid: { id: "ferrofluid", tone: "dark", caption: "Ferrofluid in a magnetic field", focusX: 60, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/inky-16296848/" } },
  pigment: { id: "pigment", tone: "light", caption: "Pigment folding into white paint", focusX: 50, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/drops-of-red-ink-falling-into-white-paint-10695823/" } },
  circuit: { id: "circuit", tone: "dark", caption: "Circuit board", focusX: 50, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/close-up-shot-of-a-printed-circuit-board-6754819/" } },
  milkdrop: { id: "milkdrop", tone: "light", caption: "A drop striking white liquid", focusX: 53, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/slow-motion-footage-of-a-drop-of-red-liquid-being-dropped-on-a-white-liquid-2603665/" } },
  inkdark: { id: "inkdark", tone: "dark", caption: "Ink spreading through water", focusX: 50, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/grey-ink-in-water-7075991/" } },
  inkfade: { id: "inkfade", tone: "light", caption: "Ink dispersing", focusX: 55, credit: { by: "", source: "Mixkit", url: "https://mixkit.co/free-stock-video/abstract-black-and-white-ink-shot-underwater-510/" } },
  magenta: { id: "magenta", tone: "light", caption: "Black and magenta ink in water", focusX: 50, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/ink-in-water-18333375/" } },
  dust: { id: "dust", tone: "dark", caption: "Fine dust falling through light", focusX: 40, credit: { by: "", source: "Pexels", url: "https://www.pexels.com/video/falling-tiny-white-dust-particles-on-black-background-9665237/" } },
};

export const clip = (id: ClipId) => footage[id];
