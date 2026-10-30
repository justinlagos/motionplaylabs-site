import type { Metadata } from "next";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/lilita-one/400.css";
import "./festival-town.css";
import "./landing.css";
import { TownExplorer, GameplayPreview, PlayEverywhere } from "./experience";
import { MotionToggle } from "@/components/MotionToggle";
import { festivalTown, heroes } from "@/content/festival-town";
import { site } from "@/content/site";
import { Bunting } from "./Bunting";
import { Character } from "./Character";
import { Film, JumpLink, MotionState, Pick, PlayLink, WaitlistForm } from "./client";

const title = "Festival Town: a story game where children learn by doing";
const description =
  "Help the town get ready for the festival with Ada, Tobi, Amina and Zizi. Five places, fifteen activities: counting, growing, coding, building and making. Free to play in the browser, nothing to install.";

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
  { question: "What age is Festival Town for?", answer: "The activities are designed for ages 4–7: numbers to ten, life cycles, simple coding sequences, shapes and patterns. Younger players may enjoy exploring alongside a grown-up." },
  { question: "Does my child need to be able to read?", answer: "Instructions and character dialogue are spoken in English. Zizi offers hints along the way. A grown-up can help with the first visit and any unfamiliar controls." },
  { question: "What do we need to play?", answer: "Play in a web browser on your phone, tablet, laptop or desktop with an internet connection. Use touch or a mouse, and turn phones sideways. Festival Town is also available on the Amazon Appstore; check the listing for compatible devices. The Google Play release is coming soon." },
  { question: "How long does a visit take?", answer: "Each of the five places has three activities and takes roughly ten minutes to explore. You can play one place at a time and come back for more." },
  { question: "Will progress be saved?", answer: "The browser game saves progress on the device and browser you use. Clearing browser storage can remove that progress, and it does not automatically transfer to another device." },
  { question: "Are there adverts or purchases?", answer: "The browser game is free to play, with no adverts or in-game purchases. Signing up for news on this page is optional and is not needed to play." },
];

export default function FestivalTownPage() {
  return (
    <MotionState>
      <a className="ft-skip" href="#adventure">Skip to the adventure</a>
      <header className="ft-nav">
        <a href="#adventure" className="ft-nav-brand" aria-label="Festival Town, back to top"><img src="/festival-town/logo-600.webp" alt="Festival Town" width={600} height={437} /></a>
        <nav aria-label="Festival Town"><a href="#explore">The adventure</a><a href="#play-anywhere">Ways to play</a><a href="#parents">Grown-ups</a></nav>
        <a href="#play-anywhere" className="ft-btn">Let’s play <span aria-hidden="true">↗</span></a>
      </header>

      <section className="ft-arrival" id="adventure" aria-labelledby="ft-h1">
        <div className="ft-inner ft-arrival-grid">
          <div className="ft-arrival-copy">
            <p className="ft-kicker">A little adventure for big imaginations · Ages 4–7</p>
            <h1 id="ft-h1">Little adventures.<br /><em>A whole world of discovery.</em></h1>
            <p className="ft-lead">A playful learning adventure for ages 4–7, set in a colourful Nigerian town. Count, grow, code and help the festival come to life.</p>
            <div className="ft-actions"><PlayLink place="hero">Play free on the web</PlayLink><a className="ft-text-link" href="#play-anywhere">Find your screen <span aria-hidden="true">↗</span></a></div>
          </div>
          <div className="ft-arrival-art">
            <img className="ft-arrival-land" src="/festival-town/scene/bg_title-1600.webp" srcSet="/festival-town/scene/bg_title-900.webp 900w, /festival-town/scene/bg_title-1600.webp 1600w" sizes="100vw" alt="A colourful Nigerian town getting ready for a street festival" width={1600} height={686} fetchPriority="high" />
            <Bunting className="ft-arrival-bunting" flags={24} sag={50} height={100} />
            <div className="ft-arrival-cast" aria-hidden="true">
              <Character id="tobi" pose="point" alt="" className="c-tobi" priority />
              <Character id="ada" pose="wave" alt="" className="c-ada" priority delay={1.5} />
              <Character id="amina" pose="cheer" alt="" className="c-amina" priority delay={2.7} />
              <Character id="zizi" pose="cheer" alt="" className="c-zizi" priority bob delay={3.2} />
            </div>
          </div>
        </div>
        <div className="ft-arrival-base ft-inner"><span>Rooted in Nigeria. Made for curious minds, everywhere.</span><MotionToggle /></div>
      </section>
      <div className="ft-facts" aria-label="Inside Festival Town"><span><b>5</b> places to explore</span><span><b>15</b> hands-on activities</span><span><b>4</b> STEM subjects</span><span><b>1</b> big celebration</span></div>

      <section className="ft-proof ft-section" id="gameplay" aria-labelledby="ft-gameplay-h">
        <div className="ft-inner ft-proof-grid">
          <div className="ft-section-copy"><p className="ft-kicker">This is how discovery happens</p><h2 id="ft-gameplay-h">A little try.<br />A big “I did it!”</h2><p className="ft-lead ft-muted">Put the arrows in order. See what floats. Find the next stamp in the pattern. Every small action helps the town get ready.</p><ol className="ft-play-steps"><li><b>01</b><span>Try an idea</span></li><li><b>02</b><span>See what happens</span></li><li><b>03</b><span>Have another go</span></li></ol><a className="ft-text-link" href="#explore">Find their first adventure <span aria-hidden="true">↓</span></a></div>
          <figure className="ft-proof-screen"><GameplayPreview /><figcaption>Real gameplay: coding, floating and patterns. Preview has no sound.</figcaption></figure>
        </div>
      </section>

      <section className="ft-explore ft-section" id="explore" aria-labelledby="ft-town-h">
        <div className="ft-inner"><header className="ft-section-heading"><div><p className="ft-kicker">Five places. One festival.</p><h2 id="ft-town-h">Where shall we go first?</h2></div><p>From Mama Bisi’s market to Aunty Kemi’s Adire workshop, every neighbour has something to share. Choose a place to take a look.</p></header><TownExplorer /></div>
      </section>

      <section className="ft-pickwrap ft-friends" id="friends" aria-label="Meet your friends"><Pick /></section>

      <PlayEverywhere />

      <section className="ft-parent-section ft-section" id="parents" aria-labelledby="ft-parents-h">
        <div className="ft-inner"><header className="ft-section-heading"><div><p className="ft-kicker">A little reassurance for grown-ups</p><h2 id="ft-parents-h">Room to try.<br />Space to grow.</h2></div><p>Maths, science, technology and engineering, woven into everyday adventures. With a friendly voice to help along the way.</p></header>
          <div className="ft-parent-benefits">
            <article><img src="/festival-town/prop/mango.webp" alt="" width={80} height={80} loading="lazy" /><h3>Learning they can do</h3><p>Count real objects in the story, test an idea and spot what changes. Fifteen activities across five places.</p></article>
            <article><img src="/festival-town/prop/bulb_on.webp" alt="" width={80} height={80} loading="lazy" /><h3>Another go is welcome</h3><p>A wrong tap brings a hint. Zizi helps children find the next step, with spoken instructions in English.</p></article>
            <article><img src="/festival-town/prop/key.webp" alt="" width={80} height={80} loading="lazy" /><h3>Easy to get started</h3><p>Free browser play. No account, no adverts and no in-game purchases. Progress stays in the browser you play in.</p></article>
          </div>
          <div className="ft-parent-details"><div className="ft-faq"><h3>A few things you might be wondering</h3>{faqs.map(f => <details key={f.question}><summary>{f.question}<span aria-hidden="true">+</span></summary><p>{f.answer}</p></details>)}<p className="ft-policy-note">Looking for the Android app’s data information? <a href="/legal/festival-town-privacy/">Read the Android privacy policy</a>.</p></div>
            <div className="ft-film-card"><p className="ft-kicker">Meet the world</p><h3>Big adventures.<br />Little discoveries.</h3><Film /><p className="ft-film-cap">{festivalTown.film.credit}</p></div>
          </div>
        </div>
      </section>

      <section className="ft-class-section ft-section" id="schools" aria-labelledby="ft-school-h"><div className="ft-inner ft-class-grid"><div className="ft-class-art"><img src="/festival-town/play/town-tablet.webp" alt="The Festival Town game map, with five places for a class to explore" width={1024} height={706} loading="lazy" /><Character id="tobi" pose="point" alt="" /></div><div className="ft-section-copy"><p className="ft-kicker">For schools and nurseries</p><h2 id="ft-school-h">A whole town.<br />A class full of ideas.</h2><p className="ft-lead">Explore together on a classroom display, or take turns on a tablet. Start with one place and about ten minutes.</p><p>15 voiced activities across maths, science, technology and engineering. Open the browser game, choose a friend and play.</p><p className="ft-muted">Teacher notes, class management and progress dashboards are not available yet. Join the school list for news about future pilots and tools.</p><div className="ft-actions"><JumpLink to="waitlist" audience="school" className="ft-btn is-purple">Join the school list</JumpLink><PlayLink place="schools" className="ft-text-link">Try the game</PlayLink></div></div></div></section>

      <section className="ft-celebrate" aria-labelledby="ft-festival-h"><img className="ft-celebrate-land" src="/festival-town/scene/bg_fest-1600.webp" alt="" width={1600} height={686} loading="lazy" /><Bunting flags={28} sag={25} height={80} /><div className="ft-inner"><div className="ft-celebrate-copy"><p className="ft-kicker">Every little helper makes a difference</p><h2 id="ft-festival-h">The town is waiting.<br />Let’s make it a festival.</h2><PlayLink place="celebration">Let’s play, it’s free</PlayLink></div><div className="ft-celebrate-cast" aria-hidden="true"><Character id="tobi" pose="cheer" alt="" delay={0.7} /><Character id="ada" pose="cheer" alt="" delay={1.9} /><Character id="amina" pose="cheer" alt="" delay={3.3} /><Character id="zizi" pose="cheer" alt="" bob /></div></div></section>

      <section className="ft-updates ft-section" id="waitlist" aria-labelledby="ft-updates-h"><div className="ft-inner ft-updates-grid"><div className="ft-section-copy"><p className="ft-kicker">For the next adventure</p><h2 id="ft-updates-h">Good things<br />are growing.</h2><p className="ft-lead">The game is ready to play today. Get occasional emails about new adventures, activities and school pilots.</p><p className="ft-muted">A grown-up’s email is all we need for game updates. Signing up is optional.</p><img className="ft-updates-sprout" src="/festival-town/prop/pl_plant.webp" alt="" width={150} height={150} loading="lazy" /></div><WaitlistForm /></div></section>

      <footer className="ft-footer"><div className="ft-inner"><div><a href="/" className="ft-maker">Made by MotionPlay Labs <span aria-hidden="true">↗</span></a><p>Playful worlds. Curious minds.</p></div><nav aria-label="Festival Town footer"><a href="#parents">Parent questions</a><a href="#schools">Schools</a><a href="mailto:hello@motionplaylabs.com">Contact us</a><a href="/legal/privacy/">Website privacy</a><a href="/legal/festival-town-privacy/">Android privacy</a><a href="/legal/credits/">Credits</a></nav><small>{site.ukCompany.legalName} · Company {site.ukCompany.number}</small></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MotionState>
  );
}
