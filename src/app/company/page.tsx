import type { Metadata } from "next";
import Link from "next/link";
import { NextBand, PlateHero } from "@/components/Clip";
import { Loop } from "@/components/Loop";
import { pageClips, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Company",
  description: "MotionPlay Labs: a design and product lab with companies in the UK and Nigeria.",
};

const principles = [
  ["Show the work.", "Case studies, products and numbers instead of adjectives."],
  ["Every job leaves something reusable.", "A template, a component, a prompt or a lesson."],
  ["One standard in both markets.", "The same standard in Lagos and London, priced for each market."],
  ["Children's safety comes first.", "On any product children use, safety and privacy come before growth."],
  ["Ship small, then improve.", "A first version goes out early and gets better with use."],
];

export default function CompanyPage() {
  return (
    <div className="page">
      <PlateHero clip={pageClips.company} title="Company" line="A design and product lab with companies in the UK and Nigeria." />
      <div className="wrap">
        <section className="block split">
          <h2>What we are</h2>
          <div>
            <p className="lede">We design for organisations, build our own products and teach people to build.</p>
            <div className="prose" style={{ marginTop: 28 }}>
              <p>
                The same <Link href="/#beat-method">five-step method</Link> runs all three. Each client job, product and class leaves something the next one can use.
              </p>
            </div>
          </div>
        </section>
        <section className="block split">
          <h2>How it fits together</h2>
          <div>
            <Loop />
            <dl className="facts loop-notes">
              <dt>Studio</dt>
              <dd>Paid design work for organisations. Each job leaves templates and components the next one starts from.</dd>
              <dt>Products</dt>
              <dd>Our own software and hardware, run on the same steps. What we learn building them goes into client work.</dd>
              <dt>School</dt>
              <dd>The workflows that worked, taught to people who want to build their own.</dd>
            </dl>
          </div>
        </section>
        <section className="block split">
          <h2>Founder</h2>
          <div className="prose">
            <p>
              <strong style={{ fontWeight: 500 }}>Justin Ukaegbu</strong>, founder and director.
            </p>
            <p>
              Brand and communication designer working across identity, event branding, editorial design and motion, with more than ten years in the industry, starting at WPP&apos;s 141 Worldwide in Lagos.
            </p>
            <p>MA Design in Graphic Design, first class. First degree in Computer Science and Education. He builds the company&apos;s products himself.</p>
          </div>
        </section>
        <section className="block split">
          <h2>How we work</h2>
          <ul className="list">
            {principles.map(([a, b]) => (
              <li key={a}>
                <strong style={{ fontWeight: 500 }}>{a}</strong> <span className="quiet">{b}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="block split">
          <h2>Companies</h2>
          <dl className="facts">
            <dt>United Kingdom</dt>
            <dd>
              {site.ukCompany.legalName}, registered in {site.ukCompany.jurisdiction}, company number {site.ukCompany.number}
            </dd>
            <dt>Nigeria</dt>
            <dd>{site.ngCompany ? `${site.ngCompany.legalName}, RC ${site.ngCompany.rc}` : "Incorporated in 2026"}</dd>
          </dl>
        </section>
        <section className="block split">
          <h2>Contact</h2>
          <div>
            <p className="lede">
              Briefs, tenders, partnerships and press: <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <div className="button-row" style={{ marginTop: 28 }}>
              <Link className="button" href="/procurement/">
                For procurement teams
              </Link>
            </div>
          </div>
        </section>
      </div>
      <NextBand clip={pageClips.contact} href="/contact/" kicker="Next" title="Start a project" line="Tell us what you need. The first step is a short call, then a one-page brief." />
    </div>
  );
}
