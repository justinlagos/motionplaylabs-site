import type { Metadata } from "next";
import { PlateHero } from "@/components/Clip";
import { pageClips, site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell MotionPlay Labs about a design, product or training job.",
};

const next = [
  { name: "Justin reads it", line: "Every enquiry goes to him directly." },
  { name: "A reply by email", line: "With questions, or a time for a short call." },
  { name: "A one-page brief", line: "What we will make, by when, and how we will judge it. You sign it off before design starts." },
];

export default function ContactPage() {
  return (
    <div className="page">
      <PlateHero clip={pageClips.contact} title="Start a project" line="Tell us what you need. Every enquiry is read by Justin." />
      <div className="wrap">
        <section className="block split">
          <h2>Enquiry</h2>
          <ContactForm />
        </section>
        <section className="block">
          <div className="block-head">
            <h2>What happens next</h2>
          </div>
          <ol className="flow">
            {next.map((r, i) => (
              <li key={r.name}>
                <span className="flow-n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="flow-name">{r.name}</h3>
                <p className="flow-line">{r.line}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="block split">
          <h2>Or email</h2>
          <div className="prose">
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a> for briefs, tenders, press and anything else.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
