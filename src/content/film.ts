import type { ClipId } from "./footage";
import { method } from "./method";

/**
 * The homepage film. Each beat holds one clip; the page flips between light and dark
 * with the clip's tone. Where the tone changes, the next clip opens through a lens (iris);
 * where it stays the same, the focus pulls from one clip to the next.
 * length is the beat's scroll length in screen heights.
 */
export type Beat =
  | { id: string; kind: "title"; length: number; clip: ClipId }
  | { id: string; kind: "hero"; length: number; clip: ClipId; words: string }
  | { id: string; kind: "statement"; length: number; clip: ClipId; words: string }
  | { id: string; kind: "interlude"; length: number; clip: ClipId }
  | { id: string; kind: "index"; length: number; clip: ClipId; words: string }
  | {
      id: string;
      kind: "chapter";
      length: number;
      clip: ClipId;
      numeral: string;
      name: string;
      line: string;
      slug: string;
    }
  | { id: string; kind: "close"; length: number; clip: ClipId; words: string };

export const film: Beat[] = [
  { id: "title", kind: "title", length: 1.5, clip: "droplets" },
  {
    id: "hero",
    kind: "hero",
    length: 2,
    clip: "inkclouds",
    // TODO(D9): hero line pending Justin's decision.
    words: "We build what we design.",
  },
  {
    id: "statement",
    kind: "statement",
    length: 2.6,
    clip: "soapfilm",
    words:
      "MotionPlay Labs is a design and product lab in the UK and Nigeria. We design for organisations, build our own products and teach people to build.",
  },
  { id: "interlude", kind: "interlude", length: 1.4, clip: "pencil" },
  {
    id: "method",
    kind: "index",
    length: 2.6,
    clip: "folds",
    words: "One method runs everything we make.",
  },
  ...method.map(
    (s): Beat => ({
      id: s.slug,
      kind: "chapter",
      length: 1.8,
      clip: s.clip,
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
    clip: "inkfade",
    words: "What we teach brings back new problems. The loop starts again.",
  },
];

export const doors: { href: string; name: string; line: string; clip: ClipId }[] = [
  { href: "/studio/", name: "Studio", line: "Brand, campaigns, publications, events and web", clip: "magenta" },
  { href: "/products/", name: "Products", line: "Software and hardware we build and run", clip: "circuit" },
  { href: "/school/", name: "School", line: "Live sessions where you build with AI", clip: "dust" },
];
