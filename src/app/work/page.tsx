import type { Metadata } from "next";
import Link from "next/link";
import { ClipThumb, PlateHero } from "@/components/Clip";
import { pageClips } from "@/content/site";
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
                  <ClipThumb id={w.clip} className="row-still" />
                  <span>
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
    </div>
  );
}
