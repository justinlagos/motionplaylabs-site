import type { Metadata } from "next";
import Link from "next/link";
import { PlateHero } from "@/components/Clip";
import { pageClips, site } from "@/content/site";

export const metadata: Metadata = {
  title: "School",
  description: "The Build Session: a live, hands-on session where you build a working tool with AI. Online, for the UK and Nigeria.",
};

export default function SchoolPage() {
  return (
    <div className="page">
      <PlateHero clip={pageClips.school} kicker="MotionPlay School" title="The Build Session" line="A live, hands-on session where you build a working tool with AI. ChatGPT for thinking, Claude for building.">
        <div className="button-row">
          <a className="button is-solid" href={site.schoolUrl}>
            Join the waitlist
          </a>
        </div>
      </PlateHero>
      <div className="wrap">
        <section className="block split">
          <h2>What happens</h2>
          <div className="prose">
            <p>You bring one real project. In a live online session you plan it with ChatGPT and build it with Claude, with help on the call as you go.</p>
            <p>Afterwards you keep a kit with the prompts and workflows from the session, and an assistant that answers your questions by email while you carry on.</p>
          </div>
        </section>
        <section className="block split">
          <h2>Who it is for</h2>
          <div className="prose">
            <p>Founders, freelancers and small teams in the UK and Nigeria who want to build their own tools, not only chat with AI. Beginners are welcome: you are placed by experience level when you apply.</p>
          </div>
        </section>
        <section className="block split">
          <h2>Format</h2>
          <dl className="facts">
            <dt>Where</dt>
            <dd>Online, live</dd>
            <dt>Group size</dt>
            <dd>Small: Founding Cohort 01 had 8 seats</dd>
            <dt>Pay in</dt>
            <dd>Pounds or naira</dd>
            <dt>After the session</dt>
            <dd>Kit, sign-in codes and email support for three weeks</dd>
          </dl>
        </section>
        <section className="block split">
          <h2>For teams</h2>
          <div>
            <div className="prose">
              <p>We run the session in-house for a company&apos;s own team, built around your work and your tools.</p>
            </div>
            <div className="button-row" style={{ marginTop: 24 }}>
              <Link className="button" href="/contact/">
                Ask about a team session
              </Link>
            </div>
          </div>
        </section>
        <section className="block split">
          <h2>So far</h2>
          <div className="prose">
            <p>
              Founding Cohort 01 ran on 24 October 2026. How we ran it is in the <Link href="/work/the-build-session/">case study</Link>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
