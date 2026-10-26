import type { ClipId } from "./footage";

// TODO(review): drafts written from decisions already made on each product. Justin reads and
// approves each one before launch; until then they are only in the preview.

export type Note = {
  slug: string;
  title: string;
  /** One line for the index and the page description. */
  line: string;
  date: string;
  about: { label: string; href: string };
  clip: ClipId;
  body: string[];
};

export const notes: Note[] = [
  {
    slug: "sit-still-and-tap-glass",
    title: "We trained children to sit still and tap glass",
    line: "Why Draw in the Air uses a webcam, and what it changes in a classroom.",
    date: "October 2026",
    about: { label: "Draw in the Air", href: "/products/draw-in-the-air/" },
    clip: "inkdrops",
    body: [
      "Most screen time for children aged 3 to 7 asks them to sit still and tap glass. At that age a lot of learning is physical: tracing, pointing, drawing big shapes with the whole arm.",
      "Draw in the Air turns the screen around. A webcam follows the child's hand, and the movement is the lesson. Draw the letter in the air and it appears on the screen.",
      "Three decisions shaped it. It runs in the browser, so a school can try it with nothing to install. It follows the Early Years Foundation Stage, so a teacher can map it to what they already teach. And Class Mode, with a teacher dashboard, lets one teacher run it with a whole class.",
      "It is approved on the Chrome Web Store and running in a pilot at a UK primary school. Next is a pilot in Lagos, and a television version: a small computer that plugs into a TV.",
    ],
  },
  {
    slug: "held-before-it-is-paid-for",
    title: "A ticket is held before it is paid for",
    line: "How Pamiit makes sure an event cannot sell the same seat twice.",
    date: "October 2026",
    about: { label: "Pamiit", href: "/products/pamiit/" },
    clip: "milkdrop",
    body: [
      "Overselling is the worst thing a ticketing system can do. Two people pay for the last seat, one of them is turned away at the door, and the organiser takes the blame.",
      "It happens in the gap between choosing a ticket and paying for it. Two buyers start checkout at the same moment, both see one seat left, and both pay.",
      "Pamiit closes the gap. When a buyer starts checkout, the ticket is reserved for them, and nobody else can buy it while they pay. If the payment does not land, the reservation is released and the ticket goes back on sale.",
      "The protection is part of the live database, and it has been tested. The same thinking sets the price: the buyer sees the all-in price before checkout, so the number they agree to is the number they pay.",
    ],
  },
  {
    slug: "the-map-waits-for-the-data",
    title: "The map waits for the data",
    line: "Election Day: Naija is fiction. Its polling-unit finder is not.",
    date: "October 2026",
    about: { label: "Election Day: Naija", href: "/products/election-day-naija/" },
    clip: "inkclouds",
    body: [
      "Election Day: Naija is a game about a fictional election day. Its polling-unit finder is not fiction. It points to real places, and someone may use it to decide where to go.",
      "So the finder has one rule: it does not go live until the data is right.",
      "Right means three checks. The imported records add up to INEC's published totals. No polling unit appears twice. Every unit sits in the ward it is listed under.",
      "If a check fails, the finder stays off and the rest of the game ships without it. A game can be late. A wrong address on election day sends someone to the wrong place.",
    ],
  },
  {
    slug: "a-paid-workshop-run-by-one-person",
    title: "A paid workshop, run by one person",
    line: "What we automated so the teaching could have all the attention.",
    date: "October 2026",
    about: { label: "The Build Session", href: "/school/" },
    clip: "dust",
    body: [
      "Founding Cohort 01 of The Build Session ran on 24 October 2026: eight seats, paid for in pounds or naira, taught live online by one person.",
      "The teaching needed full attention, so everything around it runs on its own.",
      "Applications are sorted by experience level as they arrive, and the ones that need a person to look at them are flagged, not guessed. Each accepted applicant gets a payment link in their own currency, and the seat is confirmed when payment lands, not when the link is sent. Prep emails, the call link and reminders go out on a schedule.",
      "After the session, everyone keeps a kit with the prompts and workflows, sign-in codes, and an assistant that answers their questions by email for three weeks.",
      "The next cohort runs on the same system. The waitlist is open.",
    ],
  },
];

export const noteBySlug = (slug: string) => notes.find((n) => n.slug === slug);

/** Rough reading time, at 220 words a minute. */
export const readingMinutes = (n: Note) => Math.max(1, Math.round(n.body.join(" ").split(/\s+/).length / 220));
