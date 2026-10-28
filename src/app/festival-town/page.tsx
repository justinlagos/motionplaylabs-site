import type { Metadata } from "next";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/lilita-one/400.css";
import "./festival-town.css";
import { MotionToggle } from "@/components/MotionToggle";
import { festivalTown, heroes, parentPoints, schoolNext, schoolPoints, worlds } from "@/content/festival-town";
import { site } from "@/content/site";
import { Character, Host, Prop, Scene } from "./Character";
import { Film, JumpLink, MotionState, PlayLink, WaitlistForm } from "./client";

const title = "Festival Town: a story game where children learn by doing";
const description =
  "Help the town get ready for the festival with Ada, Tobi, Amina and Zizi. Five worlds, fifteen activities: counting, growing, coding, building and making. Free to play in the browser, nothing to install.";

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

export default function FestivalTownPage() {
  return (
    <MotionState>
      {/* 1. Hero */}
      <section className="ft-hero" aria-labelledby="ft-h1">
        <MotionToggle />
        <div className="ft-hero-inner">
          <div className="ft-hero-text">
            <img className="ft-hero-logo" src="/festival-town/logo.webp" alt="Festival Town. Help the town get ready." width={1200} height={874} fetchPriority="high" />
            <h1 id="ft-h1">
              A whole world of learning. <em>Ready to play.</em>
            </h1>
            <p className="ft-lead">
              The big street festival is on Saturday and the whole town needs a hand. Children pick a friend, visit five places, and learn to count, grow, code, build and make by doing it.
            </p>
            <div className="ft-actions">
              <PlayLink place="hero" />
              <JumpLink to="waitlist">Join the waitlist</JumpLink>
            </div>
            <p className="ft-fine">Free to play in the browser on a phone, tablet or laptop. Nothing to install, no account, no adverts.</p>
          </div>
          <div className="ft-hero-stage" aria-hidden="true">
            <div className="ft-hero-scene">
              <img
                src="/festival-town/scene/bg_title-1600.webp"
                srcSet="/festival-town/scene/bg_title-900.webp 900w, /festival-town/scene/bg_title-1600.webp 1600w"
                sizes="(max-width: 900px) 110vw, 60vw"
                alt=""
                width={1600}
                height={686}
                fetchPriority="high"
              />
            </div>
            <Prop id="mango" className="p-mango" />
            <Prop id="cloud" className="p-cloud" />
            <Prop id="bulb_on" className="p-bulb" />
            <Prop id="kite" className="p-kite" />
            <div className="ft-hero-cast">
              <Character id="ada" pose="wave" alt="" className="c-ada" delay={0} priority />
              <Character id="tobi" pose="point" alt="" className="c-tobi" delay={1.7} priority />
              <Character id="amina" pose="cheer" alt="" className="c-amina" delay={3.1} priority />
              <Character id="zizi" pose="idle" alt="" className="c-zizi" delay={2.3} bob priority />
            </div>
          </div>
        </div>
        <div className="ft-hero-ground" aria-hidden="true" />
      </section>

      {/* 2. Characters */}
      <section className="ft-cast" aria-labelledby="ft-cast-h">
        <div className="ft-inner">
          <header>
            <p className="ft-kicker">Who you play with</p>
            <h2 id="ft-cast-h">Three friends to choose from, and Zizi.</h2>
            <p className="ft-lead ft-muted">Pick Ada, Tobi or Amina and play as them. Zizi comes along whoever you choose.</p>
          </header>
          <ul className="ft-cast-grid">
            {heroes.map((h, i) => {
              const pose = h.id === "ada" ? "point" : h.id === "tobi" ? "cheer" : h.id === "amina" ? "think" : "wave";
              return (
                <li key={h.id} className={`ft-friend is-${h.id}`} style={{ "--c": h.colour } as React.CSSProperties}>
                  <p className="ft-says">{h.says}</p>
                  <Character id={h.id} pose={pose} alt={`${h.name}`} delay={i * 1.3} bob={h.id === "zizi"} />
                  <h3>{h.name}</h3>
                  <p className="ft-role">{h.role}</p>
                  <p>{h.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 3. Worlds */}
      <section className="ft-worlds" aria-labelledby="ft-worlds-h">
        <div className="ft-inner">
          <header>
            <p className="ft-kicker">Five places, one festival</p>
            <h2 id="ft-worlds-h">The whole town helps. Counting, growing, coding, building and making.</h2>
            <p className="ft-lead ft-muted">
              Each place is one subject with three activities. Finish them and that place sends something to the festival square: a drum, sunflowers, fairy lights, a stage, bunting.
            </p>
            <ul className="ft-verbs" aria-label="Subjects">
              {worlds.map((w) => (
                <li key={w.id} style={{ "--c": w.colour } as React.CSSProperties}>
                  {w.verb}
                </li>
              ))}
            </ul>
          </header>
          <ol className="ft-path">
            {worlds.map((w, i) => (
              <li key={w.id} className="ft-world" id={`world-${w.id}`} style={{ "--c": w.colour, "--c2": w.dark } as React.CSSProperties}>
                <div className="ft-world-art" aria-hidden="true">
                  <Scene id={w.scene} alt="" className="is-ground" />
                  <Host id={w.host.id} name={w.host.name} />
                  <Character id={w.kid.id} pose={w.kid.pose} alt="" delay={i * 0.9} />
                  <Prop id={w.props[0]} className="p1" />
                  <Prop id={w.props[1]} className="p2" />
                  <Prop id={w.props[2]} className="p3" />
                </div>
                <div className="ft-world-text">
                  <span className="ft-stamp" aria-label={`${w.subject}`}>
                    {w.letter}
                  </span>
                  <p className="ft-verb">
                    {i + 1}. {w.verb}: {w.subject}
                  </p>
                  <h3>{w.name}</h3>
                  <p>{w.intro}</p>
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
                  <p className="ft-host-line">With {w.host.name}.</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Film */}
      <section className="ft-film" aria-labelledby="ft-film-h">
        <div className="ft-inner">
          <header>
            <p className="ft-kicker">See it played</p>
            <h2 id="ft-film-h">{festivalTown.film.title}</h2>
            <p className="ft-lead ft-muted">{festivalTown.film.body}</p>
          </header>
          <Film />
          <div className="ft-film-foot">
            <p className="ft-muted">Or skip the film and try it yourself. It takes about ten minutes to finish one place.</p>
            <PlayLink place="film" />
          </div>
        </div>
      </section>

      {/* 5. Parents */}
      <section className="ft-parents" aria-labelledby="ft-parents-h">
        <div className="ft-inner">
          <header>
            <p className="ft-kicker">For parents and carers</p>
            <h2 id="ft-parents-h">Made for curious kids. Built so grown-ups can relax.</h2>
            <p className="ft-lead ft-muted">What is in it, what it asks of a child, and what it does not do.</p>
            <div className="ft-parents-scene" aria-hidden="true">
              <Character id="amina" pose="think" alt="" className="c-amina" delay={0.4} />
              <Character id="ada" pose="cheer" alt="" className="c-ada" delay={2.6} />
              <Prop id="chick" className="p-chick" />
            </div>
          </header>
          <ol className="ft-points">
            {parentPoints.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Schools */}
      <section className="ft-schools" aria-labelledby="ft-schools-h" id="schools">
        <div className="ft-inner">
          <div className="ft-schools-text">
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
              <JumpLink to="waitlist" audience="school" className="ft-btn">
                Join the school waitlist
              </JumpLink>
              <PlayLink place="schools" className="ft-btn-2">
                Try it first
              </PlayLink>
            </div>
          </div>
          <div className="ft-schools-art" aria-hidden="true">
            <Scene id="bg_tech" alt="" className="is-blob" />
            <Host id="ngozi" name="Sister Ngozi" />
            <Character id="tobi" pose="point" alt="" delay={1.1} />
          </div>
        </div>
      </section>

      {/* 7. Waitlist */}
      <section className="ft-waitlist" aria-labelledby="ft-waitlist-h" id="waitlist">
        <div className="ft-inner">
          <header>
            <p className="ft-kicker">Waitlist</p>
            <h2 id="ft-waitlist-h">The adventure is just beginning.</h2>
            <p className="ft-lead ft-muted">
              The game is live and free. The waitlist is for what comes next: new worlds, new activities, and school pilots. One email when there is something to say.
            </p>
            <div className="ft-waitlist-cast" aria-hidden="true">
              <Character id="tobi" pose="cheer" alt="" className="c-tobi" delay={0.8} />
              <Character id="zizi" pose="cheer" alt="" className="c-zizi" delay={2.2} bob />
              <Prop id="drum" className="p-drum" />
            </div>
          </header>
          <WaitlistForm />
        </div>
      </section>

      {/* 8. Closing line */}
      <section className="ft-close" aria-label="Play Festival Town">
        <div className="ft-inner">
          <h2>A whole world of learning. Ready to play.</h2>
          <div className="ft-actions">
            <PlayLink place="close" className="ft-btn is-yellow" />
            <JumpLink to="waitlist">Join the waitlist</JumpLink>
          </div>
          <p className="ft-mpl">Festival Town is made by MotionPlay Labs.</p>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </MotionState>
  );
}
