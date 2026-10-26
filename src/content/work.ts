import type { ClipId } from "./footage";

// Launch case studies are our own products, which we can show without anyone's permission.
// Client case studies are added once each client agrees in writing (decision D6).

export type CaseStudy = {
  slug: string;
  title: string;
  owner: string;
  discipline: string;
  market: string;
  year: string;
  clip: ClipId;
  summary: string;
  problem: string;
  decisions: string[];
  results: string[];
  credits: { role: string; name: string }[];
  links?: { href: string; label: string }[];
};

export const work: CaseStudy[] = [
  {
    slug: "draw-in-the-air",
    title: "Draw in the Air",
    owner: "MotionPlay Labs product",
    discipline: "Product, brand, web",
    market: "UK and Nigeria",
    year: "2026",
    clip: "pencil",
    summary: "A learning platform where children aged 3 to 7 learn by moving, not tapping.",
    problem: "Most screen time for children aged 3 to 7 asks them to sit still and tap glass.",
    decisions: [
      "Use the webcam as the input, so the movement of a child's hand is the lesson.",
      "Run in the browser, so a school can try it with nothing to install.",
      "Follow the Early Years Foundation Stage, so teachers can map it to what they already teach.",
      "Add Class Mode and a teacher dashboard for whole-class use.",
    ],
    results: [
      "Approved on the Chrome Web Store.",
      "Running in a UK primary school pilot.",
      "A television version on a Raspberry Pi compute module has reached design freeze.",
    ],
    credits: [{ role: "Product, design and build", name: "Justin Ukaegbu" }],
    links: [{ href: "https://drawintheair.com", label: "drawintheair.com" }],
  },
  {
    slug: "void-canvas",
    title: "Void Canvas",
    owner: "MotionPlay Labs product",
    discipline: "Product, interface",
    market: "Everywhere",
    year: "2026",
    clip: "pigment",
    summary: "An image editor that runs entirely in the browser and uploads nothing.",
    problem: "Quick image work usually means a heavy desktop app, or uploading files to someone else's server.",
    decisions: [
      "Do everything in the browser, on the user's own machine.",
      "Open the files designers already have: layered PSDs with several artboards, and PDFs.",
      "Ship effects as ready presets, more than 60 of them.",
    ],
    results: ["Live and free to use.", "Successor to Art Director Studio, which designers in Nigeria use."],
    credits: [{ role: "Product, design and build", name: "Justin Ukaegbu" }],
    links: [{ href: "https://voidcanvas.netlify.app", label: "Open Void Canvas" }],
  },
  {
    slug: "pamiit",
    title: "Pamiit",
    owner: "MotionPlay Labs product",
    discipline: "Product, brand, interface",
    market: "UK and Nigeria",
    year: "2026",
    clip: "milkdrop",
    summary: "Ticketing for organisers who want to sell under their own name.",
    problem: "Small organisers pay a ticketing company and send their buyers to someone else's brand.",
    decisions: [
      "Give each organiser their own page, and a ticket box they can embed on their own site.",
      "Run two payment rails, UK and Nigeria, and show the all-in price before checkout.",
      "Reserve a ticket before payment, so an event cannot oversell.",
      "Check guests in from a phone, with or without signal.",
    ],
    results: [
      "A working prototype covering storefront, checkout, organiser tools, buyer wallet, door scanner and admin.",
      "A live database with oversell protection tested.",
      "Next: the first three organisers selling real tickets.",
    ],
    credits: [{ role: "Product, design and build", name: "Justin Ukaegbu" }],
  },
  {
    slug: "the-build-session",
    title: "The Build Session",
    owner: "MotionPlay School",
    discipline: "Programme, automation, email",
    market: "UK and Nigeria",
    year: "2026",
    clip: "dust",
    summary: "A paid live workshop run by one person, with the admin handled by automation.",
    problem: "Run a paid live workshop as one person, across two currencies, without handling every application by hand.",
    decisions: [
      "Sort each application by experience level as it arrives, and flag the ones that need a look.",
      "Send payment links in pounds or naira, and confirm the seat when payment lands.",
      "Send prep emails, the call link and reminders on a schedule.",
      "After the session, give each person a kit with sign-in codes and an assistant that answers questions by email.",
    ],
    results: [
      "Founding Cohort 01 ran on 24 October 2026, with 8 seats.",
      "Kit support runs to 14 November 2026.",
    ],
    credits: [{ role: "Programme, design and build", name: "Justin Ukaegbu" }],
    links: [{ href: "https://workshop.motionplaylabs.com", label: "workshop.motionplaylabs.com" }],
  },
];

export const caseBySlug = (slug: string) => work.find((w) => w.slug === slug);
