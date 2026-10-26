import type { SceneId } from "@/lib/gl/shaders";
import { method } from "./method";

/**
 * Media for one beat. Until the shoot, every beat uses a placeholder scene.
 * After the shoot, set kind "video" and point at the encoded files (see scripts/encode-video.sh);
 * the scene stays as the fallback while the video loads and for reduced motion.
 */
export type Media =
  | { kind: "scene"; scene: SceneId }
  | {
      kind: "video";
      scene: SceneId;
      poster: string;
      src: { av1?: string; h264: string };
      portrait?: { av1?: string; h264: string; poster: string };
    };

export type Beat =
  | { id: string; kind: "title"; length: number; media: Media }
  | { id: string; kind: "hero"; length: number; media: Media; words: string }
  | { id: string; kind: "statement"; length: number; media: Media; words: string }
  | { id: string; kind: "interlude"; length: number; media: Media; shot: string }
  | { id: string; kind: "index"; length: number; media: Media; words: string }
  | {
      id: string;
      kind: "chapter";
      length: number;
      media: Media;
      numeral: string;
      name: string;
      line: string;
      slug: string;
    }
  | { id: string; kind: "close"; length: number; media: Media; words: string };

const scene = (s: SceneId): Media => ({ kind: "scene", scene: s });

export const film: Beat[] = [
  { id: "load", kind: "title", length: 1.3, media: scene("black") },
  {
    id: "hero",
    kind: "hero",
    length: 2,
    media: scene("ink"),
    // TODO(D9): hero line pending Justin's decision.
    words: "We build what we design.",
  },
  {
    id: "statement",
    kind: "statement",
    length: 2.6,
    media: scene("trail"),
    words:
      "MotionPlay Labs is a design and product lab in the UK and Nigeria. We design for organisations, build our own products and teach people to build.",
  },
  {
    id: "interlude",
    kind: "interlude",
    length: 1.4,
    media: scene("graphite"),
    shot: "Graphite pencil dragging across cotton paper",
  },
  {
    id: "method",
    kind: "index",
    length: 2.6,
    media: scene("emboss"),
    words: "One method runs everything we make. Here is how it works:",
  },
  ...method.map(
    (s): Beat => ({
      id: s.slug,
      kind: "chapter",
      length: 1.7,
      media: scene(s.scene),
      numeral: s.numeral,
      name: s.name,
      line: s.line,
      slug: s.slug,
    }),
  ),
  {
    id: "close",
    kind: "close",
    length: 2.4,
    media: scene("inkReverse"),
    words: "What we teach brings back new problems. The loop starts again.",
  },
];

export const doors = [
  { href: "/studio/", name: "Studio", line: "Brand, campaigns, publications, events and web", scene: "cmy" as SceneId },
  { href: "/products/", name: "Products", line: "Software and hardware we build and run", scene: "circuit" as SceneId },
  { href: "/school/", name: "School", line: "Live sessions where you build with AI", scene: "chalk" as SceneId },
];
