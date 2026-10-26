import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PlateHero } from "@/components/Clip";
import { pageClips, site } from "@/content/site";

export const metadata: Metadata = {
  title: "School",
  description: "The Build Session: a live, hands-on session where you build a working tool with AI. Online, for the UK and Nigeria.",
};

const runs = [
  { name: "Apply", line: "Tell us about the tool you want to build and how much you have built before." },
  { name: "Get placed", line: "You are placed by experience level, so the group moves at the right pace." },
  { name: "Pay", line: "A payment link in pounds or naira. Your seat is confirmed when payment lands." },
  { name: "Prepare", line: "Prep emails, the call link and reminders arrive before the day." },
  { name: "Build, live", line: "Plan with ChatGPT and build with Claude, with help on the call as you go." },
  { name: "Keep going", line: "A kit with the prompts and workflows, and an assistant that answers by email for three weeks." },
];

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
          <div>
            <p className="lede">You bring one real project and leave with a working tool.</p>
            <div className="prose" style={{ marginTop: 28 }}>
              <p>In a live online session you plan the project with ChatGPT and build it with Claude, with help on the call as you go. Afterwards you keep the prompts and workflows from the session, and an assistant that answers your questions by email while you carry on.</p>
            </div>
          </div>
        </section>
        <section className="block">
          <div className="block-head">
            <h2>How it runs</h2>
            <p className="quiet">From application to the weeks after the session.</p>
          </div>
          <ol className="flow">
            {runs.map((r, i) => (
              <li key={r.name}>
                <span className="flow-n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="flow-name">{r.name}</h3>
                <p className="flow-line">{r.line}</p>
              </li>
            ))}
          </ol>
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
            <dd>Small. Founding Cohort 01 had 8 seats.</dd>
            <dt>Pay in</dt>
            <dd>Pounds or naira</dd>
            <dt>After the session</dt>
            <dd>Kit, sign-in codes and email support for three weeks</dd>
          </dl>
        </section>
        <section className="block split">
          <h2>So far</h2>
          <div>
            <dl className="facts">
              <dt>Founding Cohort 01</dt>
              <dd>Saturday 24 October 2026</dd>
              <dt>Seats</dt>
              <dd>8</dd>
              <dt>Price</dt>
              <dd>£50 or ₦85,000 a seat</dd>
              <dt>Support</dt>
              <dd>Kit support runs to 14 November 2026</dd>
            </dl>
            <p className="prose quiet" style={{ marginTop: 20 }}>
              How we ran it is in the <Link href="/work/the-build-session/">case study</Link> and a <Link href="/lab-notes/a-paid-workshop-run-by-one-person/">lab note</Link>.
            </p>
          </div>
        </section>
      </div>
      <CtaBand clip="soapfilm" title="For teams" line="We run the session in-house for a company's own team, built around your work and your tools.">
        <div className="button-row">
          <Link className="button is-solid" href="/contact/">
            Ask about a team session
          </Link>
          <a className="button" href={site.schoolUrl}>
            Join the waitlist
          </a>
        </div>
      </CtaBand>
    </div>
  );
}
