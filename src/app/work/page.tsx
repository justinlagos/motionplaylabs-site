import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PlateHero } from "@/components/Clip";
import { pageClips, site } from "@/content/site";
import { work } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies from MotionPlay Labs: problem, decisions, result.",
};

export default function WorkPage() {
  return (
    <div className="page">
      <PlateHero
        clip={pageClips.work}
        title="Work"
        line="Each case study shows the problem, what we decided and what happened. Client work is added with each client's permission."
      />
      <div className="wrap">
        <section className="block">
          <h2 className="visually-hidden">Case studies</h2>
          <ul className="rows">
            {work.map((w) => (
              <li className="row" key={w.slug}>
                <Link href={`/work/${w.slug}/`}>
                  <span className="row-text">
                    <span className="row-name">{w.title}</span>{" "}
                    <span className="row-line">{w.summary}</span>
                  </span>
                  <span className="row-meta">
                    {w.discipline}
                    <br />
                    {w.market}, {w.year}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <CtaBand clip="inkdark" title="Start a project" line={`Tell us what you need on the enquiry form, or email ${site.email}. Every enquiry is read by Justin.`}>
        <div className="button-row">
          <Link className="button is-solid" href="/contact/">
            Send an enquiry
          </Link>
          <Link className="button" href="/studio/">
            How the studio works
          </Link>
        </div>
      </CtaBand>
    </div>
  );
}
