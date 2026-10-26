import type { SceneId } from "@/lib/gl/shaders";

export type Step = {
  slug: string;
  numeral: string;
  name: string;
  line: string;
  scene: SceneId;
  intro: string;
  weDo: string[];
  youGet: string[];
  seenIn: { label: string; href: string }[];
};

export const method: Step[] = [
  {
    slug: "research",
    numeral: "I",
    name: "Research",
    line: "Find the real problem",
    scene: "halftone",
    intro:
      "Every job starts by finding out what is actually wrong, who the work is for and what proof already exists. We read what you have before we draw anything.",
    weDo: [
      "Read your current material, briefs, data and past campaigns",
      "Talk to the people who will use the work",
      "Look at what others in your market are doing",
      "Write the problem down in one paragraph and agree it with you",
    ],
    youGet: ["A one-page brief you sign off", "A list of what we will make and how we will judge it"],
    seenIn: [
      { label: "Draw in the Air", href: "/work/draw-in-the-air/" },
      { label: "The Build Session", href: "/work/the-build-session/" },
    ],
  },
  {
    slug: "design",
    numeral: "II",
    name: "Design",
    line: "Make it clear at a glance",
    scene: "cmy",
    intro:
      "We shape the idea until someone who has never seen it understands it in a few seconds, then build the system that keeps it consistent.",
    weDo: [
      "Sketch routes and test them on real content, not placeholder text",
      "Build the identity, layout or interface as a system with written rules",
      "Review with you in rounds, each with a written list of changes",
    ],
    youGet: ["Design files and their source", "Guidelines or templates so your team can carry it on"],
    seenIn: [
      { label: "Void Canvas", href: "/work/void-canvas/" },
      { label: "Studio", href: "/studio/" },
    ],
  },
  {
    slug: "build",
    numeral: "III",
    name: "Build",
    line: "Make the working thing",
    scene: "circuit",
    intro:
      "We make the working version: the website, the document, the booth, the app. A mock-up is a step, not the result.",
    weDo: [
      "Build in the real medium: code, print-ready files, fabrication drawings",
      "Test on the devices, printers and screens it will be used on",
      "Write down how it works so it can be changed later",
    ],
    youGet: ["The finished thing, live or print-ready", "Editable source files"],
    seenIn: [
      { label: "Pamiit", href: "/work/pamiit/" },
      { label: "TollPilot", href: "/products/tollpilot/" },
    ],
  },
  {
    slug: "launch",
    numeral: "IV",
    name: "Launch",
    line: "Put it in front of people",
    scene: "beam",
    intro: "We put the work in front of the people it is for and watch what they do with it.",
    weDo: [
      "Plan the release: channels, dates, who says what",
      "Produce the launch material: social, email, screens, print",
      "Measure what people do in the first weeks",
    ],
    youGet: ["A launch plan and the assets for it", "A short report on what worked"],
    seenIn: [{ label: "The Build Session", href: "/work/the-build-session/" }],
  },
  {
    slug: "teach",
    numeral: "V",
    name: "Teach",
    line: "Pass it on",
    scene: "chalk",
    intro:
      "What worked becomes a template, a tool or a lesson. Clients keep them, the School teaches them, and the next job starts further on.",
    weDo: [
      "Turn repeated work into templates and tools",
      "Train your team to use them",
      "Run The Build Session for people who want to build their own",
    ],
    youGet: ["Templates and guides your team can use without us", "Training sessions"],
    seenIn: [{ label: "School", href: "/school/" }],
  },
];

export const stepBySlug = (slug: string) => method.find((s) => s.slug === slug);
