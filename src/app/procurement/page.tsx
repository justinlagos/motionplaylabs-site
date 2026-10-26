import type { Metadata } from "next";
import { PlateHero } from "@/components/Clip";
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
        <section className="block split">
          <h2>On request</h2>
          <div className="prose">
            <p>Capability statement, references and past-performance details. Ask at the email address above.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
