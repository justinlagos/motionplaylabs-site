import type { SceneId } from "@/lib/gl/shaders";

export const site = {
  name: "MotionPlay Labs",
  url: "https://motionplaylabs.com",
  description:
    "MotionPlay Labs is a design and product lab in the UK and Nigeria. We design for organisations, build our own products and teach people to build.",
  descriptor: ["Design and product lab", "UK and Nigeria"],
  email: "hello@motionplaylabs.com",
  ukCompany: {
    legalName: "MotionPlay Labs Ltd",
    number: "17304660",
    jurisdiction: "England and Wales",
  },
  // TODO(D4): add the Nigerian company's legal name and CAC number once confirmed.
  ngCompany: null as null | { legalName: string; rc: string },
  ungmVendor: "1246998",
  schoolUrl: "https://workshop.motionplaylabs.com",
};

export const nav = [
  { href: "/", label: "Method" },
  { href: "/studio/", label: "Studio" },
  { href: "/work/", label: "Work" },
  { href: "/products/", label: "Products" },
  { href: "/school/", label: "School" },
  { href: "/company/", label: "Company" },
];

export const footerNav = [
  {
    title: "Studio",
    links: [
      { href: "/studio/", label: "What we make" },
      { href: "/work/", label: "Work" },
      { href: "/procurement/", label: "For procurement teams" },
      { href: "/contact/", label: "Start a project" },
    ],
  },
  {
    title: "Products",
    links: [
      { href: "/products/", label: "All products" },
      { href: "/products/draw-in-the-air/", label: "Draw in the Air" },
      { href: "/products/void-canvas/", label: "Void Canvas" },
      { href: "/products/pamiit/", label: "Pamiit" },
    ],
  },
  {
    title: "School",
    links: [
      { href: "/school/", label: "The Build Session" },
      { href: "/lab-notes/", label: "Lab notes" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company/", label: "About" },
      { href: "/contact/", label: "Contact" },
      { href: "/legal/privacy/", label: "Privacy" },
      { href: "/legal/accessibility/", label: "Accessibility" },
    ],
  },
];

/** Which placeholder scene sits behind each page hero until real footage exists. */
export const pageScenes: Record<string, SceneId> = {
  studio: "cmy",
  work: "halftone",
  products: "circuit",
  school: "chalk",
  labNotes: "trail",
  company: "emboss",
  procurement: "halftone",
  contact: "ink",
  legal: "emboss",
};
