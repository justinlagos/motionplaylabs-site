import type { Metadata } from "next";
import { NextBand, PlateHero } from "@/components/Clip";
import { pageClips, site } from "@/content/site";

export const metadata: Metadata = {
  title: "For procurement teams",
  description: "Vendor details for UN agencies, NGOs and public buyers working with MotionPlay Labs.",
};

const services = [
  "Graphic design and brand identity",
  "Layout and typesetting of reports and publications",
  "Policy briefs, case studies and technical documents",
  "Event branding and production files",
  "Motion graphics, photography and video",
  "Websites and digital content",
];

const process = [
  { name: "Send the documents", line: `RFQs, tenders and terms of reference to ${site.email}.` },
  { name: "We complete the forms", line: "Supplier forms, annexes, technical proposals and financial offers." },
  { name: "We work to your rules", line: "Your style guide, templates and review process." },
  { name: "We deliver the files", line: "Print-ready and digital files, with editable sources." },
];

const documents = [
  "Capability statement",
  "References and past-performance details",
  "Certificate of incorporation and company details",
  "Bank and payment details, on the buyer's own form",
];

export default function ProcurementPage() {
  return (
    <div className="page">
      <PlateHero clip={pageClips.procurement} title="For procurement teams" line="Vendor details for UN agencies, NGOs and public buyers." />
      <div className="wrap">
        <section className="block split">
          <h2>Vendor details</h2>
          <dl className="facts">
            <dt>Legal name</dt>
            <dd>{site.ukCompany.legalName}</dd>
            <dt>Company number</dt>
            <dd>
              {site.ukCompany.number}, registered in {site.ukCompany.jurisdiction}
            </dd>
            <dt>UN Global Marketplace</dt>
            <dd>Vendor {site.ungmVendor}</dd>
            <dt>Nigeria</dt>
            <dd>{site.ngCompany ? `${site.ngCompany.legalName}, RC ${site.ngCompany.rc}` : "Nigerian company incorporated in 2026; details on request"}</dd>
            <dt>Tenders and RFQs</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </dl>
        </section>
        <section className="block split">
          <h2>What we bid for</h2>
          <ul className="list">
            {services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section className="block">
          <div className="block-head">
            <h2>How we work with you</h2>
            <p className="quiet">The paperwork is part of the job.</p>
          </div>
          <ol className="flow is-four">
            {process.map((r, i) => (
              <li key={r.name}>
                <span className="flow-n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="flow-name">{r.name}</h3>
                <p className="flow-line">{r.line}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="block split">
          <h2>Documents on request</h2>
          <div>
            <ul className="list">
              {documents.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="prose quiet" style={{ marginTop: 20 }}>
              Ask at <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
        </section>
      </div>
      <NextBand clip={pageClips.contact} href="/contact/" kicker="Next" title="Start a project" line="Send a brief or an RFQ through the enquiry form, or by email." />
    </div>
  );
}
