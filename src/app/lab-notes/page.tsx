import type { Metadata } from "next";
import Link from "next/link";
import { PlateHero } from "@/components/Clip";
import { pageClips } from "@/content/site";

export const metadata: Metadata = {
  title: "Lab notes",
  description: "Build logs, method notes and what we learn working in the UK and Nigeria.",
};

export default function LabNotesPage() {
  return (
    <div className="page">
      <PlateHero clip={pageClips.labNotes} title="Lab notes" line="Build logs, method notes and what we learn working in the UK and Nigeria." />
      <div className="wrap">
        <section className="block split">
          <h2>Notes</h2>
          <div>
            <p className="empty">The first notes go up with the site launch. Until then, the case studies show how we work.</p>
            <div className="button-row" style={{ marginTop: 24 }}>
              <Link className="button" href="/work/">
                See the work
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
