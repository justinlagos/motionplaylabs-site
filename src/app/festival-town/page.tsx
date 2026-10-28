import type { Metadata } from "next";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/lilita-one/400.css";
import "./festival-town.css";
import { MotionToggle } from "@/components/MotionToggle";
import { festivalGifts, festivalTown, heroes, parentPoints, schoolNext, schoolPoints, worlds } from "@/content/festival-town";
import { site } from "@/content/site";
import { Bunting } from "./Bunting";
import { Character, Host, Prop } from "./Character";
import { Film, HeroLand, JumpLink, MotionState, Path, Pick, PlayLink, WaitlistForm } from "./client";

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
  gamePlatform: ["Web browser"],
  operatingSystem: "Any",
  genre: ["Educational", "Adventure"],
  isAccessibleForFree: true,
  inLanguage: "en",
  typicalAgeRange: "4-7",
  audience: { "@type": "PeopleAudience", suggestedMinAge: 4, suggestedMaxAge: 7 },
  publisher: { "@type": "Organization", name: site.ukCompany.legalName, url: site.url },
  character: heroes.map((h) => ({ "@type": "Person", name: h.name })),
};

const scene = (id: string) => ({
  src: `/festival-town/scene/${id}-1600.webp`,
  srcSet: `/festival-town/scene/${id}-900.webp 900w, /festival-town/scene/${id}-1600.webp 1600w`,
});

export default function FestivalTownPage() {
  const zizi = heroes.find((h) => h.id === "zizi")!;
  return (
    <MotionState>
      {/* 1. Hero: the town rises out of the page */}
      <section className="ft-hero" aria-labelledby="ft-h1">
        <Bunting className="ft-hero-bunting" flags={26} sag={56} />
        <MotionToggle />
        <HeroLand>
          <img {...scene("bg_title")} sizes="100vw" alt="" width={1600} height={686} fetchPriority="high" />
        </HeroLand>
        <Prop id="sun" className="p-sun" />
        <Prop id="cloud" className="p-cloud" />
        <Prop id="cloud" className="p-cloud2" />
        <Prop id="kite" className="p-kite" />
        <div className="ft-hero-text">
          <img className="ft-hero-logo" src="/festival-town/logo.webp" alt="Festival Town. Help the town get ready." width={1200} height={874} fetchPriority="high" />
          <h1 id="ft-h1">
            A whole world of learning. <em>Ready to play.</em>
          </h1>
          <p className="ft-lead">
            The big street festival is on Saturday and the whole town needs a hand. Pick a friend, visit five places, and learn to count, grow, code, build and make by doing it.
          </p>
          <div className="ft-actions">
            <PlayLink place="hero" />
            <JumpLink to="waitlist">Join the waitlist</JumpLink>
          </div>
          <p className="ft-fine">Free, in the browser, on a phone, tablet or laptop. Nothing to install, no account, no adverts.</p>
        </div>
        <div className="ft-hero-cast" aria-hidden="true">
          <Character id="tobi" pose="point" alt="" className="c-tobi" delay={1.7} priority />
          <Character id="ada" pose="wave" alt="" className="c-ada" delay={0} priority />
          <Character id="amina" pose="cheer" alt="" className="c-amina" delay={3.1} priority />
          <Character id="zizi" pose="idle" alt="" className="c-zizi" delay={2.3} bob priority />
        </div>
      </section>

      {/* 2. Pick a friend */}
      <section className="ft-pickwrap ft-reveal" aria-label="Choose a friend">
        <Pick />
      </section>

      {/* 3. The town: five places on one road, then the festival */}
      <section className="ft-town" aria-labelledby="ft-town-h">
        <div className="ft-inner">
          <header className="ft-town-head ft-reveal">
            <p className="ft-kicker">Five places, one festival</p>
            <h2 id="ft-town-h">The whole town helps. Counting, growing, coding, building and making.</h2>
            <p className="ft-lead ft-muted">
              Each place is one subject with three activities. Finish them and that place sends something to the festival square.
            </p>
            <ul className="ft-verbs" aria-label="Subjects">
              {worlds.map((w) => (
                <li key={w.id} style={{ "--c": w.colour } as React.CSSProperties}>
                  <i aria-hidden="true">{w.letter}</i>
                  {w.verb}: {w.subject}
                </li>
              ))}
            </ul>
          </header>
          <Path>
            <ol className="ft-stops">
              {worlds.map((w, i) => (
                <li key={w.id} className="ft-stop ft-reveal" id={`world-${w.id}`} style={{ "--c": w.colour, "--c2": w.dark } as React.CSSProperties}>
                  <div className="ft-stop-art" aria-hidden="true">
                    <span className="ft-num">{i + 1}</span>
                    <div className="ft-ring">
                      <img {...scene(w.scene)} sizes="(max-width: 820px) 90vw, 520px" alt="" width={1600} height={686} loading="lazy" decoding="async" />
                    </div>
                    <Host id={w.host.id} name={w.host.name} />
                    <Character id={w.kid.id} pose={w.kid.pose} alt="" delay={i * 0.9} />
                    <Prop id={w.props[0]} className="p1" />
                    <Prop id={w.props[1]} className="p2" />
                    <Prop id={w.props[2]} className="p3" />
                  </div>
                  <div className="ft-stop-text">
                    <span className="ft-pill">
                      <i aria-hidden="true">{w.letter}</i>
                      <b>{w.name}</b>
                      <small>{w.subject}</small>
                    </span>
                    <p className="ft-verb">
                      {w.verb} <span>with {w.host.name}</span>
                    </p>
                    <p className="ft-muted">{w.intro}</p>
                    <ol className="ft-acts">
                      {w.activities.map((a, j) => (
                        <li key={a.name}>
                          <i aria-hidden="true">{j + 1}</i>
                          <div>
                            <b>{a.name}</b>
                            <span>{a.what}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="ft-with">For the festival: {w.gift}.</p>
                  </div>
                </li>
              ))}
            </ol>
          </Path>
        </div>

        <div className="ft-finish">
          <div className="ft-finish-land" aria-hidden="true">
            <img {...scene("bg_fest")} sizes="100vw" alt="" width={1600} height={686} loading="lazy" decoding="async" />
          </div>
          <div className="ft-inner ft-reveal">
            <div className="ft-bubble" style={{ "--c": zizi.colour } as React.CSSProperties}>
              <img src="/festival-town/portrait/zizi.webp" alt="" width={74} height={74} loading="lazy" />
              <div>
                <p className="ft-who">Zizi</p>
                <p className="ft-line">The whole town helped. Counting, growing, coding, building and making!</p>
              </div>
            </div>
            <h2>Everything is ready. It's festival time.</h2>
            <ul className="ft-gifts" aria-label="What the town brings to the festival">
              {festivalGifts.map((g) => (
                <li key={g.id}>
                  <img src={`/festival-town/prop/${g.id}.webp`} alt="" loading="lazy" decoding="async" />
                  <span>{g.name}</span>
                </li>
              ))}
            </ul>
            <div className="ft-finish-cast" aria-hidden="true">
              <Character id="tobi" pose="cheer" alt="" className="c-tobi" delay={0.5} />
              <Character id="ada" pose="cheer" alt="" className="c-ada" delay={1.9} />
              <Character id="amina" pose="cheer" alt="" className="c-amina" delay={3.3} />
              <Character id="zizi" pose="cheer" alt="" className="c-zizi" delay={2.7} bob />
            </div>
            <div className="ft-actions">
              <PlayLink place="finish" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. The real game on real screens */}
      <section className="ft-devices" aria-labelledby="ft-devices-h">
        <div className="ft-inner">
          <header className="ft-reveal">
            <p className="ft-kicker">See it played</p>
            <h2 id="ft-devices-h">{festivalTown.film.title}</h2>
            <p className="ft-lead ft-muted">
              These are screens from the game as it is today. It runs in the browser, so the same adventure fits a laptop, a tablet or a phone turned on its side.
            </p>
          </header>
          <div className="ft-screens">
            <figure className="ft-laptop ft-reveal">
              <div className="ft-screen">
                <img src="/festival-town/play/town-laptop.webp" alt="Festival Town on a laptop: the town, with Zizi welcoming Ada and the five places to visit" width={1280} height={736} loading="lazy" decoding="async" />
              </div>
              <div className="ft-base" aria-hidden="true" />
              <figcaption className="ft-screen-cap">The town, where every adventure starts. Tap a building to go there.</figcaption>
            </figure>
            <div className="ft-small-screens">
              <figure className="ft-tablet ft-reveal" style={{ "--delay": "120ms" } as React.CSSProperties}>
                <div className="ft-screen">
                  <img src="/festival-town/play/farm-tablet.webp" alt="Festival Town on a tablet: Grandma's bean garden, with a watering can and a droopy bean" width={1024} height={706} loading="lazy" decoding="async" />
                </div>
                <figcaption className="ft-screen-cap">Grandma's Farm on a tablet: the bean is thirsty.</figcaption>
              </figure>
              <figure className="ft-phone ft-reveal" style={{ "--delay": "240ms" } as React.CSSProperties}>
                <div className="ft-screen">
                  <img src="/festival-town/play/market-phone.webp" alt="Festival Town on a phone: Uncle Femi's toy stall, with four sleeping teddies to wake and count" width={844} height={335} loading="lazy" decoding="async" />
                </div>
                <figcaption className="ft-screen-cap">Market Street on a phone: wake the teddies, count as you go.</figcaption>
              </figure>
            </div>
          </div>
          <Film />
          <div className="ft-devices-foot ft-reveal">
            <p className="ft-muted">
              {festivalTown.film.src ? "Or skip the film and try it yourself." : "A short film of the characters in their worlds, and children playing, is in production."} One place takes about ten minutes.
            </p>
            <PlayLink place="devices" />
          </div>
        </div>
      </section>

      {/* 5. Grown-ups */}
      <section className="ft-grownups" aria-labelledby="ft-grownups-h">
        <div className="ft-inner">
          <header className="ft-reveal">
            <p className="ft-kicker">For parents and carers</p>
            <h2 id="ft-grownups-h">Made for curious kids. Built so grown-ups can relax.</h2>
            <p className="ft-lead ft-muted">What is in it, what it asks of a child, and what it does not do.</p>
            <div className="ft-grownups-cast" aria-hidden="true">
              <Character id="amina" pose="think" alt="" className="c-amina" delay={0.4} />
              <Character id="ada" pose="point" alt="" className="c-ada" delay={2.6} />
            </div>
          </header>
          <ol className="ft-stickers">
            {parentPoints.map((p, i) => (
              <li key={p.title} className="ft-sticker ft-reveal" style={{ "--r": `${(i % 3) - 1}deg`, "--delay": `${(i % 2) * 90}ms` } as React.CSSProperties}>
                <img src={`/festival-town/prop/${p.icon}.webp`} alt="" loading="lazy" decoding="async" />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Schools */}
      <section className="ft-schools" aria-labelledby="ft-schools-h" id="schools">
        <div className="ft-inner">
          <div className="ft-schools-text ft-reveal">
            <p className="ft-kicker">For schools and nurseries</p>
            <h2 id="ft-schools-h">Bring Festival Town to your class.</h2>
            <p className="ft-lead ft-muted">
              Three short, voiced activities in each of five places, which a class of four to seven year olds can run on tablets or a touchscreen display with no set-up.
            </p>
            <dl className="ft-facts">
              {schoolPoints.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            <p>{schoolNext}</p>
            <div className="ft-actions">
              <JumpLink to="waitlist" audience="school" className="ft-btn is-purple">
                Join the school waitlist
              </JumpLink>
              <PlayLink place="schools" className="ft-btn-2">
                Try it first
              </PlayLink>
            </div>
          </div>
          <div className="ft-schools-art ft-reveal" style={{ "--delay": "140ms" } as React.CSSProperties}>
            <figure className="ft-tablet">
              <div className="ft-screen">
                <img src="/festival-town/play/town-tablet.webp" alt="Festival Town on a classroom tablet, showing the town and its five places" width={1024} height={706} loading="lazy" decoding="async" />
              </div>
            </figure>
            <Character id="tobi" pose="point" alt="" delay={1.1} />
            <Host id="ngozi" name="Sister Ngozi" />
          </div>
        </div>
      </section>

      {/* 7. Waitlist, on the festival stage */}
      <section className="ft-stage" aria-labelledby="ft-waitlist-h" id="waitlist">
        <div className="ft-stage-land" aria-hidden="true">
          <img {...scene("bg_fest")} sizes="100vw" alt="" width={1600} height={686} loading="lazy" decoding="async" />
        </div>
        <Bunting className="ft-stage-bunting" flags={24} sag={48} />
        <div className="ft-inner">
          <div className="ft-stage-text ft-reveal">
            <div className="ft-stage-panel">
              <p className="ft-kicker">Waitlist</p>
              <h2 id="ft-waitlist-h">The adventure is just beginning.</h2>
              <p className="ft-lead">
                The game is live and free. The waitlist is for what comes next: new worlds, new activities and school pilots. One email when there is something to say.
              </p>
            </div>
            <div className="ft-stage-cast" aria-hidden="true">
              <Character id="tobi" pose="cheer" alt="" className="c-tobi" delay={0.8} />
              <Character id="zizi" pose="cheer" alt="" className="c-zizi" delay={2.2} bob />
              <Prop id="drum" className="p-drum" />
            </div>
          </div>
          <div className="ft-reveal" style={{ "--delay": "120ms" } as React.CSSProperties}>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* 8. Closing */}
      <section className="ft-close" aria-label="Play Festival Town">
        <div className="ft-inner ft-reveal">
          <h2>A whole world of learning. Ready to play.</h2>
          <div className="ft-actions">
            <PlayLink place="close" />
            <JumpLink to="waitlist">Join the waitlist</JumpLink>
          </div>
          <p className="ft-mpl">Festival Town is made by MotionPlay Labs.</p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MotionState>
  );
}
