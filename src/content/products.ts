import type { ClipId } from "./footage";

export type Stage = "Explore" | "Prototype" | "Pilot" | "Launch" | "Scale" | "Parked";

export type Product = {
  slug: string;
  name: string;
  line: string;
  body: string[];
  stage: Stage;
  stageNote?: string;
  markets: string;
  forWhom: string;
  facts: { label: string; value: string }[];
  link?: { href: string; label: string };
  /** What happens next, as decided. */
  next: string;
  clip: ClipId;
};

export const stages: Exclude<Stage, "Parked">[] = ["Explore", "Prototype", "Pilot", "Launch", "Scale"];

export const products: Product[] = [
  {
    slug: "draw-in-the-air",
    name: "Draw in the Air",
    line: "Children aged 3 to 7 learn letters, numbers and shapes by drawing in the air in front of a webcam.",
    body: [
      "We trained children to sit still and tap glass. Draw in the Air turns the screen around: the camera follows a child's hand, and the movement is the lesson.",
      "It runs in the browser with nothing to install, follows the Early Years Foundation Stage, and has a Class Mode and a teacher dashboard so a teacher can run it with a whole class.",
      "It is approved on the Chrome Web Store and running in a UK primary school pilot. A television version, built on a Raspberry Pi compute module, has reached design freeze.",
    ],
    stage: "Pilot",
    stageNote: "Running in a UK primary school pilot",
    markets: "UK and Nigeria",
    forWhom: "Nurseries, primary schools and parents",
    facts: [
      { label: "Platform", value: "Browser, with a Chrome Web Store app" },
      { label: "Curriculum", value: "Early Years Foundation Stage" },
      { label: "For schools", value: "Class Mode and teacher dashboard" },
      { label: "Hardware", value: "Television dongle in development" },
    ],
    link: { href: "https://drawintheair.com", label: "Visit drawintheair.com" },
    next: "A pilot in Lagos, and the television version: a small computer that plugs into a TV.",
    clip: "inkdrops",
  },
  {
    slug: "void-canvas",
    name: "Void Canvas",
    line: "A free image editor that runs in the browser. Nothing you open is uploaded.",
    body: [
      "Void Canvas opens layered PSD files with multiple artboards and PDFs, applies more than 60 image effects and exports to the formats a job needs.",
      "It also builds a basic brand guideline from a few inputs. Everything runs on your own machine, in the browser.",
    ],
    stage: "Launch",
    stageNote: "Live and free",
    markets: "Everywhere",
    forWhom: "Designers and anyone who edits images",
    facts: [
      { label: "Opens", value: "Layered PSD, PDF, common image formats" },
      { label: "Effects", value: "More than 60" },
      { label: "Privacy", value: "Runs in the browser; files stay on your machine" },
      { label: "Price", value: "Free" },
    ],
    link: { href: "https://voidcanvas.netlify.app", label: "Open Void Canvas" },
    next: "Bring Art Director Studio's tools into Void Canvas, so the two work as one editor that can still be used in parts.",
    clip: "pigment",
  },
  {
    slug: "art-director-studio",
    name: "Art Director Studio",
    line: "A design tool built for and used by designers in Nigeria.",
    body: [
      "Art Director Studio is a design tool built at home, for the way designers in Nigeria work, and it is live at artdirectorstudio.com.",
      "It came first. Void Canvas is its successor, and the two are being brought together into one editor that can still be used in parts.",
    ],
    stage: "Launch",
    stageNote: "Live",
    markets: "Nigeria",
    forWhom: "Working designers",
    facts: [{ label: "Successor", value: "Void Canvas" }],
    link: { href: "https://artdirectorstudio.com", label: "Visit artdirectorstudio.com" },
    next: "Its tools move into Void Canvas, so designers get both in one place.",
    clip: "magenta",
  },
  {
    slug: "pamiit",
    name: "Pamiit",
    line: "Self-serve event ticketing for organisers in the UK and Nigeria.",
    body: [
      "An organiser signs up, gets their own page, sets up tickets and takes payment in pounds or naira. Buyers can transfer, cancel or refund their own tickets, and the door is checked in from a phone, even offline.",
      "Organisers with their own website can embed the ticket box instead.",
    ],
    stage: "Prototype",
    stageNote: "A working prototype with a live database",
    markets: "UK and Nigeria",
    forWhom: "Event organisers and promoters",
    facts: [
      { label: "Payments", value: "Cards in the UK, local rails in Nigeria" },
      { label: "Check-in", value: "Phone scanner that works offline" },
      { label: "For buyers", value: "Self-service transfers and refunds" },
    ],
    next: "Card payments in the UK first, then naira payments, then the first organisers selling real tickets.",
    clip: "milkdrop",
  },
  {
    slug: "tollpilot",
    name: "TollPilot",
    line: "Tells UK drivers what a journey will cost before they set off.",
    body: [
      "TollPilot warns about tolls, ULEZ and congestion charges before they hit, compares the cost of routes and checks whether a vehicle is compliant.",
      "When a penalty charge notice arrives, it matches the notice against trip evidence and helps put the appeal together. It works alongside Google Maps and Waze, not instead of them.",
    ],
    stage: "Prototype",
    stageNote: "Launch site and waitlist in progress",
    markets: "UK",
    forWhom: "UK drivers",
    facts: [
      { label: "Before", value: "Route cost comparison and charge warnings" },
      { label: "During", value: "Alerts as charges approach" },
      { label: "After", value: "Help with penalty charge notices" },
    ],
    next: "The launch site and waitlist, then routing that can steer around charges.",
    clip: "circuit",
  },
  {
    slug: "election-day-naija",
    name: "Election Day: Naija",
    line: "A browser 3D simulation of a fictional Nigerian election day.",
    body: [
      "A social simulation that runs in the browser. Players live through a fictional election day across Lagos Mainland, Lagos Island and Abuja, from the polling unit outward.",
      "The core game will be free, with no paywall at launch. Port Harcourt follows the first three areas.",
    ],
    stage: "Prototype",
    markets: "Nigeria",
    forWhom: "Players in Nigeria and the diaspora",
    facts: [
      { label: "Setting", value: "Lagos Mainland, Lagos Island, Abuja; Port Harcourt later" },
      { label: "Runs in", value: "The browser, in 3D" },
      { label: "Price", value: "Free core game, no paywall at launch" },
    ],
    next: "The polling-unit finder goes live only when the imported records match INEC's published totals and pass duplicate and ward checks.",
    clip: "inkclouds",
  },
  {
    slug: "life-stages",
    name: "Life-stages game (working title)",
    line: "One Nigerian life played in chapters, starting with NYSC camp.",
    body: [
      "One character's life, played through the stages many Nigerians share. Each stage is its own chapter and its own world.",
      "The first world is the NYSC orientation camp. Igba Boi, the market apprenticeship that ends with being settled into your own business, follows.",
    ],
    stage: "Prototype",
    markets: "Nigeria",
    forWhom: "Players in Nigeria and the diaspora",
    facts: [
      { label: "First chapter", value: "NYSC orientation camp" },
      { label: "Next chapter", value: "Igba Boi" },
      { label: "Started", value: "October 2026" },
    ],
    next: "Test the first world, NYSC camp, then build the Igba Boi apprenticeship chapter.",
    clip: "dust",
  },
  {
    slug: "naijago",
    name: "NaijaGo",
    line: "Find and book experiences across Nigeria.",
    body: [
      "A place to find and book things to do across Nigeria, from tours to events to food.",
      "The web and mobile designs and a design system are complete, with a clickable prototype. There is no back end yet.",
    ],
    stage: "Parked",
    markets: "Nigeria",
    forWhom: "Visitors and residents",
    facts: [],
    next: "The web and app designs are complete. The build starts after the next quarterly review.",
    clip: "droplets",
  },
  {
    slug: "kino",
    name: "Kino",
    line: "Film screenings in homes and venues, booked like a stay.",
    body: [
      "Hosts list their space, screen and food; guests book a seat. Each listing shows where it is, the size of the screen and what is served.",
      "Nigerian filmmakers keep a small share of cinema takings. Kino would give them a second way to reach paying audiences, for premieres and after a film's cinema run.",
    ],
    stage: "Parked",
    markets: "Nigeria first",
    forWhom: "Hosts, guests and filmmakers",
    facts: [],
    next: "Safety checks for hosts and guests come first, before any booking is built.",
    clip: "soapfilm",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const activeProducts = products.filter((p) => p.stage !== "Parked");
export const parkedProducts = products.filter((p) => p.stage === "Parked");
