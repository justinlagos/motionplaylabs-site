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
  clip: ClipId;
};

export const products: Product[] = [
  {
    slug: "draw-in-the-air",
    name: "Draw in the Air",
    line: "Children aged 3 to 7 learn letters, numbers and shapes by drawing in the air in front of a webcam.",
    body: [
      "We trained children to sit still and tap glass. Draw in the Air turns the screen around: the camera follows a child's hand, and the movement is the lesson.",
      "It runs in the browser with nothing to install, follows the Early Years Foundation Stage, and has a Class Mode and a teacher dashboard for schools. A version that plugs into a television is in development.",
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
    clip: "pencil",
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
    clip: "pigment",
  },
  {
    slug: "art-director-studio",
    name: "Art Director Studio",
    line: "A design tool built for and used by designers in Nigeria.",
    body: [
      "Art Director Studio came first. Void Canvas is its successor, and the two are being brought together into one editor that can still be used in parts.",
    ],
    stage: "Launch",
    stageNote: "Live",
    markets: "Nigeria",
    forWhom: "Working designers",
    facts: [{ label: "Successor", value: "Void Canvas" }],
    link: { href: "https://artdirectorstudio.com", label: "Visit artdirectorstudio.com" },
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
    stageNote: "Working prototype with a live database",
    markets: "UK and Nigeria",
    forWhom: "Event organisers and promoters",
    facts: [
      { label: "Payments", value: "Cards in the UK, local rails in Nigeria" },
      { label: "Check-in", value: "Phone scanner that works offline" },
      { label: "For buyers", value: "Self-service transfers and refunds" },
    ],
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
    clip: "circuit",
  },
  {
    slug: "election-day-naija",
    name: "Election Day: Naija",
    line: "A browser 3D simulation of a fictional Nigerian election day.",
    body: [
      "Players move through a fictional election day across Lagos and Abuja, from the polling unit outward.",
    ],
    stage: "Prototype",
    markets: "Nigeria",
    forWhom: "Players in Nigeria and the diaspora",
    facts: [{ label: "Setting", value: "Lagos Mainland, Lagos Island, Abuja" }],
    clip: "inkclouds",
  },
  {
    slug: "life-stages",
    name: "Life-stages game (working title)",
    line: "One Nigerian life played in chapters, starting with NYSC camp.",
    body: [
      "A character's life told through the stages many Nigerians share. The first world is the NYSC orientation camp; an apprenticeship chapter follows.",
    ],
    stage: "Prototype",
    markets: "Nigeria",
    forWhom: "Players in Nigeria and the diaspora",
    facts: [{ label: "First chapter", value: "NYSC camp" }],
    clip: "dust",
  },
  {
    slug: "naijago",
    name: "NaijaGo",
    line: "Find and book experiences across Nigeria.",
    body: ["Designed in full. Build resumes after a quarterly review."],
    stage: "Parked",
    markets: "Nigeria",
    forWhom: "Visitors and residents",
    facts: [],
    clip: "droplets",
  },
  {
    slug: "kino",
    name: "Kino",
    line: "Film screenings in homes and venues, booked like a stay.",
    body: [
      "Hosts list their space, screen and food; guests book a seat. A second way for Nigerian filmmakers to reach paying audiences after or alongside cinema.",
    ],
    stage: "Parked",
    markets: "Nigeria first",
    forWhom: "Hosts, guests and filmmakers",
    facts: [],
    clip: "soapfilm",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const activeProducts = products.filter((p) => p.stage !== "Parked");
export const parkedProducts = products.filter((p) => p.stage === "Parked");
