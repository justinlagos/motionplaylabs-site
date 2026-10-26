import type { Metadata } from "next";
import Link from "next/link";
import { NextBand, PlateHero } from "@/components/Clip";
import { notes, readingMinutes } from "@/content/notes";
import { pageClips } from "@/content/site";

export const metadata: Metadata = {
  title: "Lab notes",
  description: "Short notes on decisions we made building our products, and why.",
};

export default function LabNotesPage() {
  return (
    <div className="page">
      <PlateHero clip={pageClips.labNotes} title="Lab notes" line="Short notes on decisions we made building our products, and why." />
      <div className="wrap">
        <section className="block">
          <h2 className="visually-hidden">Notes</h2>
          <ul className="rows">
            {notes.map((n) => (
              <li className="row" key={n.slug}>
                <Link href={`/lab-notes/${n.slug}/`}>
                  <span className="row-text">
                    <span className="row-name">{n.title}</span> <span className="row-line">{n.line}</span>
                  </span>
                  <span className="row-meta">
                    {n.about.label}
                    <br />
                    {n.date}, {readingMinutes(n)} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <NextBand clip={notes[0].clip} href={`/lab-notes/${notes[0].slug}/`} kicker="Start reading" title={notes[0].title} line={notes[0].line} />
    </div>
  );
}
