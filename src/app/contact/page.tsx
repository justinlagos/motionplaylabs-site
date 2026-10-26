import type { Metadata } from "next";
import { SceneHero } from "@/components/SceneHero";
import { pageScenes, site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell MotionPlay Labs about a design, product or training job.",
};

export default function ContactPage() {
  return (
    <div className="page">
      <SceneHero scene={pageScenes.contact} title="Start a project" line="Tell us what you need. Every enquiry is read by Justin." />
      <div className="wrap">
        <section className="block split">
          <h2>Enquiry</h2>
          <ContactForm />
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
