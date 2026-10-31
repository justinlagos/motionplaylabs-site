import type { Metadata } from "next";
import "@fontsource-variable/grandstander/wght.css";
import "@fontsource/andika/400.css";
import "@fontsource/andika/700.css";
import "./ft.css";
import { festivalTown, heroes, worlds } from "@/content/festival-town";
import { site } from "@/content/site";
import { Character } from "./Character";
import { Crew } from "./Crew";
import { Finale } from "./Finale";
import { Hero } from "./Hero";
import { Ribbons } from "./Ribbons";
import { Shape } from "./Shapes";
import { Playground, AdireMark } from "./Playground";
import { Film, JumpLink, MotionState, MotionSwitch, PlayLink, TownHeader, WaitlistForm } from "./client";

const title = "Festival Town: a free learning game for ages 4 to 7";
const description =
  "Help the town get ready for the festival with Ada, Tobi, Amina and Zizi. Five places, fifteen activities: counting, growing, coding, building and making. Free to play in the browser, no ads, nothing to install.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/festival-town/" },
  openGraph: {
    title,
    description,
    url: "/festival-town/",
    type: "website",
    images: [{ url: "/festival-town/og.jpg", width: 1200, height: 630, alt: "Ada, Tobi, Amina and Zizi in Festival Town" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/festival-town/og.jpg"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Festival Town",
  url: festivalTown.canonicalUrl,
  description,
  applicationCategory: "EducationalApplication",
  gamePlatform: ["Web browser", "Amazon Appstore"],
  operatingSystem: "Any",
  genre: ["Educational", "Adventure"],
  isAccessibleForFree: true,
  inLanguage: "en",
  typicalAgeRange: "4-7",
  audience: { "@type": "PeopleAudience", suggestedMinAge: 4, suggestedMaxAge: 7 },
  publisher: { "@type": "Organization", name: site.ukCompany.legalName, url: site.url },
  character: heroes.map((h) => ({ "@type": "Person", name: h.name })),
  ...(festivalTown.film.src
    ? {
        trailer: {
          "@type": "VideoObject",
          name: `Festival Town: ${festivalTown.film.title}`,
          description: festivalTown.film.body,
          thumbnailUrl: new URL(festivalTown.film.poster, site.url).toString(),
          contentUrl: new URL(festivalTown.film.src, site.url).toString(),
          uploadDate: festivalTown.film.uploadDate,
          duration: festivalTown.film.duration,
        },
      }
    : {}),
};

const faqs = [
  {
    question: "What age is Festival Town for?",
    answer: "The activities are pitched at ages 4 to 7: numbers to ten, life cycles, simple coding sequences, shapes and patterns. Younger children enjoy exploring alongside a grown-up.",
  },
  {
    question: "Does my child need to be able to read?",
    answer: "No. Instructions and character dialogue are spoken in English, and Zizi gives hints along the way. A grown-up can help with the first visit and any unfamiliar controls.",
  },
  {
    question: "What do we need to play?",
    answer:
      "A web browser on a phone, tablet, laptop or desktop, and an internet connection. Use touch or a mouse, and turn phones sideways. On a TV, it is on the Amazon Appstore; check the listing for compatible devices. The Google Play release is coming soon.",
  },
  { question: "How long does a visit take?", answer: "Each of the five places has three activities and takes about ten minutes. Play one place at a time and come back for the next." },
  {
    question: "Will progress be saved?",
    answer: "The browser game saves progress on the device and browser you use. Clearing browser storage can remove it, and it does not move to another device automatically.",
  },
  {
    question: "Are there adverts or purchases?",
    answer: "No. The browser game is free, with no adverts and no in-game purchases. Signing up for news on this page is optional and is not needed to play.",
  },
];

const rules: { s: "circle" | "star" | "tri"; h: string; p: string }[] = [
  { s: "circle", h: "Free, no account", p: "Open it in a browser and play. Nothing to install, nothing to sign up for." },
  { s: "star", h: "No ads, no purchases", p: "No adverts, no in-game shop, no buttons that ask for money." },
  { s: "tri", h: "No reading needed", p: "Every instruction is spoken in clear English, so children who can’t read yet can play on their own." },
  { s: "circle", h: "Mistakes are welcome", p: "A wrong tap brings a hint from Zizi, not a buzzer. Children try again until it clicks." },
  { s: "star", h: "Short visits", p: "About ten minutes per place. One place is a good after-school session." },
  { s: "tri", h: "Saves as you go", p: "Progress is kept in the browser you play in, so children pick up where they stopped." },
];

const shots: Record<string, string> = { market: "market-laptop", farm: "farm-laptop", tech: "tech-laptop", build: "build-laptop", adire: "adire-laptop" };

const DeviceIcon = ({ type }: { type: "web" | "tv" | "android" }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === "web" ? (
      <>
        <rect x="3" y="6" width="26" height="17" rx="3" />
        <path d="M10 27h12M16 23v4" />
      </>
    ) : type === "tv" ? (
      <>
        <rect x="2" y="5" width="28" height="18" rx="3" />
        <path d="M11 27h10" />
        <path d="M13 11v6l5-3z" fill="currentColor" />
      </>
    ) : (
      <>
        <rect x="9" y="3" width="14" height="26" rx="3.5" />
        <path d="M14 25h4" />
      </>
    )}
  </svg>
);

export default function FestivalTownPage() {
  return (
    <MotionState>
      <a className="ftx-skip" href="#try">
        Skip to the games
      </a>

      <TownHeader>
        <a href="#top" className="ftx-logo" aria-label="Festival Town, back to top">
          <img src="/festival-town/logo-600.webp" alt="Festival Town" width={600} height={437} />
        </a>
        <nav aria-label="Festival Town" className="ftx-nav">
          <a href="#try">Try it</a>
          <a href="#friends">The friends</a>
          <a href="#grown-ups">Grown-ups</a>
          <a href="#schools">Schools</a>
        </nav>
        <div className="ftx-header-end">
          <MotionSwitch compact />
          <PlayLink place="header" className="ftx-btn is-small">
            Play free
          </PlayLink>
        </div>
      </TownHeader>

      <Hero />

      <section className="ftx-try" id="try" aria-labelledby="ftx-try-h">
        <Ribbons />
        <div className="ftx-try-field" aria-hidden="true">
          <Shape kind="ring" className="tf-ring" />
          <Shape kind="star" className="tf-star" />
        </div>
        <div className="ftx-wrap">
          <header className="ftx-try-head">
            <h2 id="ftx-try-h" className="ftx-display">
              <span>Have a go</span> <span>right here</span>
            </h2>
            <div className="ftx-try-intro">
              <div className="ftx-try-zizi" aria-hidden="true">
                <Character id="zizi" pose="think" alt="" delay={1.2} />
              </div>
              <p className="ftx-lead">Five places in town need a hand before Saturday. Try a quick taster from each one. Finish it, and its gift goes to the festival square.</p>
            </div>
          </header>
          <Playground />
        </div>
      </section>

      <section className="ftx-friends" id="friends" aria-labelledby="ftx-crew-h">
        <div className="ftx-wrap">
          <Crew />
        </div>
      </section>

      <section className="ftx-grown" id="grown-ups" aria-labelledby="ftx-grown-h">
        <div className="ftx-adire-edge" aria-hidden="true" />
        <div className="ftx-wrap">
          <header className="ftx-grown-head">
            <h2 id="ftx-grown-h" className="ftx-h2">
              For grown-ups
            </h2>
            <p className="ftx-lead">
              Fifteen short activities across maths, science, technology and engineering, set in everyday places: a market, a farm, a phone shop, a building yard and a cloth workshop.
            </p>
          </header>

          <h3 className="ftx-h3">What they practise</h3>
          <ol className="ftx-trail">
            {worlds.map((w) => (
              <li key={w.id} style={{ "--tc": w.colour, "--td": w.dark } as React.CSSProperties}>
                <div className="ftx-trail-stop">
                  <figure className="ftx-trail-window">
                    <img src={`/festival-town/play/${shots[w.id]}.webp`} alt={`Real gameplay from ${w.name}`} width={1280} height={736} loading="lazy" />
                  </figure>
                  <span className="ftx-trail-letter" aria-hidden="true">
                    {w.letter}
                  </span>
                  <div className="ftx-trail-host" aria-hidden="true">
                    <Character id={w.host.id} pose="wave" alt="" />
                  </div>
                </div>
                <div className="ftx-trail-copy">
                  <p className="ftx-subject-tag">{w.subject}</p>
                  <h4>{w.name}</h4>
                  <p className="ftx-trail-host-name">with {w.host.name}</p>
                  <ul>
                    {w.activities.map((a) => (
                      <li key={a.name}>
                        <b>{a.name}.</b> {a.what}.
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <h3 className="ftx-h3">The house rules</h3>
          <ul className="ftx-quilt">
            {rules.map((r) => (
              <li key={r.h} className={`is-${r.s}`}>
                <AdireMark s={r.s} />
                <h4>{r.h}</h4>
                <p>{r.p}</p>
              </li>
            ))}
          </ul>

          <div className="ftx-film-block">
            <div className="ftx-film-copy">
              <h3 className="ftx-h3">See it in a minute</h3>
              <p>The characters at work in their places, real gameplay, and children playing on a phone, a tablet and a laptop.</p>
              <p className="ftx-fine">{festivalTown.film.credit}</p>
            </div>
            <Film />
          </div>

          <div className="ftx-faq">
            <h3 className="ftx-h3">Questions parents ask</h3>
            <div className="ftx-faq-amina" aria-hidden="true">
              <Character id="amina" pose="think" alt="" delay={1.4} />
            </div>
            {faqs.map((f) => (
              <details key={f.question}>
                <summary>
                  {f.question}
                  <span aria-hidden="true" />
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
            <p className="ftx-fine">
              Looking for the Android app’s data information? <a href="/legal/festival-town-privacy/">Read the Android privacy policy</a>.
            </p>
          </div>
        </div>
        <div className="ftx-adire-edge is-bottom" aria-hidden="true" />
      </section>

      <section className="ftx-screens" id="play-anywhere" aria-labelledby="ftx-screens-h">
        <div className="ftx-wrap ftx-screens-grid">
          <figure className="ftx-tv">
            <Shape kind="tri" className="tv-tri" />
            <Shape kind="dots" className="tv-dots" />
            <img
              src="/festival-town/scene/family-tv-1600.webp"
              srcSet="/festival-town/scene/family-tv-900.webp 900w, /festival-town/scene/family-tv-1600.webp 1600w"
              sizes="(max-width: 900px) 100vw, 60vw"
              alt="A mother and child on a sofa playing Festival Town on a television with the remote"
              width={1600}
              height={898}
              loading="lazy"
            />
            <figcaption>Illustrative family scene, created with AI.</figcaption>
          </figure>
          <div className="ftx-screens-copy">
            <h2 id="ftx-screens-h" className="ftx-h2">
              Big screen or small screen
            </h2>
            <p className="ftx-lead">Tap on a phone or tablet, click on a laptop, or settle in on the sofa with the TV remote.</p>
            <ul className="ftx-stores">
              <li>
                <a href={festivalTown.playUrl} target="_blank" rel="noopener" className="ftx-store">
                  <DeviceIcon type="web" />
                  <span>
                    <small>Play now, free</small>
                    <strong>In your web browser</strong>
                    <em>Phone, tablet, laptop and desktop</em>
                  </span>
                </a>
              </li>
              <li>
                <a href={festivalTown.amazonUrl} target="_blank" rel="noopener" className="ftx-store">
                  <DeviceIcon type="tv" />
                  <span>
                    <small>Available on</small>
                    <strong>Amazon Appstore</strong>
                    <em>Bring the adventure to your TV</em>
                  </span>
                </a>
              </li>
              <li>
                <div className="ftx-store is-soon">
                  <DeviceIcon type="android" />
                  <span>
                    <small>{festivalTown.googlePlayStatus}</small>
                    <strong>Google Play</strong>
                    <em>The Android release is in review</em>
                  </span>
                </div>
              </li>
            </ul>
            <p className="ftx-fine">Check the Amazon listing for compatible devices. Browser progress stays on the device you play on.</p>
          </div>
        </div>
      </section>

      <section className="ftx-schools" id="schools" aria-labelledby="ftx-schools-h">
        <div className="ftx-wrap ftx-schools-grid">
          <div className="ftx-schools-art">
            <Shape kind="sun" className="sc-sun" />
            <img src="/festival-town/play/town-tablet.webp" alt="The Festival Town map on a tablet, with the five places to visit" width={1024} height={706} loading="lazy" />
            <div className="ftx-schools-tobi" aria-hidden="true">
              <Character id="tobi" pose="point" alt="" delay={2} />
            </div>
          </div>
          <div>
            <h2 id="ftx-schools-h" className="ftx-h2">
              For schools and nurseries
            </h2>
            <p className="ftx-lead">Explore together on a classroom display, or take turns on a tablet. Start with one place and about ten minutes.</p>
            <p>Fifteen voiced activities across maths, science, technology and engineering. Open the browser game, choose a friend and play.</p>
            <p className="ftx-fine">Teacher notes, class management and progress tracking are not built yet. Join the school list to hear about pilots first.</p>
            <div className="ftx-row-actions">
              <JumpLink to="signup" audience="school" className="ftx-btn is-purple">
                <span>Join the school list</span>
              </JumpLink>
              <PlayLink place="schools" className="ftx-link">
                Try the game
              </PlayLink>
            </div>
          </div>
        </div>
      </section>

      <Finale />

      <section className="ftx-signup" id="signup" aria-labelledby="ftx-signup-h">
        <div className="ftx-wrap ftx-signup-grid">
          <div>
            <h2 id="ftx-signup-h" className="ftx-h2">
              Hear when new places open
            </h2>
            <p className="ftx-lead">The game is ready to play today. Leave an email for the occasional note about new adventures, activities and school pilots.</p>
            <p className="ftx-fine">A grown-up’s email is all we need. Signing up is optional and is not needed to play.</p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      <footer className="ftx-footer">
        <div className="ftx-wrap ftx-footer-grid">
          <div>
            <img className="ftx-footer-logo" src="/festival-town/logo-600.webp" alt="Festival Town" width={600} height={437} loading="lazy" />
            <a href="/" className="ftx-maker">
              Made by MotionPlay Labs
            </a>
          </div>
          <nav aria-label="Festival Town footer">
            <a href="#grown-ups">Parent questions</a>
            <a href="#schools">Schools</a>
            <a href="mailto:hello@motionplaylabs.com">Contact us</a>
            <a href="/legal/privacy/">Website privacy</a>
            <a href="/legal/festival-town-privacy/">Android privacy</a>
            <a href="/legal/credits/">Credits</a>
          </nav>
          <div className="ftx-footer-base">
            <small>
              {site.ukCompany.legalName}, company {site.ukCompany.number}
            </small>
            <MotionSwitch />
          </div>
        </div>
      </footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MotionState>
  );
}
