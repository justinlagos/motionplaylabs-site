import type { Metadata } from "next";
import Link from "next/link";
import { PlateBand, PlateHero } from "@/components/Clip";
import { pageClips } from "@/content/site";

export const metadata: Metadata = {
  title: "Studio",
  description: "Identity, campaigns, publications, events and websites for organisations in the UK and Nigeria.",
};

const makes = [
  { name: "Brand and identity", line: "Identity systems, guidelines, brand books and the templates your team uses every day." },
  { name: "Campaigns and content", line: "Campaign platforms, social, ads, email and the assets behind them." },
  { name: "Reports and publications", line: "Annual and impact reports, policy briefs, decks and long documents, including UN and NGO publications." },
  { name: "Events and motion", line: "Event identity, booths, screen loops, logo reveals, photography and video." },
  { name: "Websites and product design", line: "Marketing sites, landing pages and app interfaces, designed and built." },
];

// TODO(D5): prices are the proposals in the playbook; confirm before launch.
const retainers = [
  { name: "Desk", what: "Up to 4 production days a month", uk: "£1,800 a month", ng: "₦450,000 a month" },
  { name: "Partner", what: "Up to 9 days a month and a monthly creative review", uk: "£3,800 a month", ng: "₦1,000,000 a month" },
  { name: "Embedded", what: "Up to 18 days a month, priority turnaround, motion included", uk: "£7,500 a month", ng: "On request" },
];

export default function StudioPage() {
  return (
    <div className="page">
      <PlateHero
        clip={pageClips.studio}
        title="Studio"
        line="Identity, campaigns, publications, events and websites for organisations in the UK and Nigeria."
      />
      <div className="wrap">
        <section className="block split">
          <h2>What we do</h2>
          <div>
            <p className="lede">We design for companies, NGOs, development agencies and foundations, and we build what we design.</p>
            <div className="prose" style={{ marginTop: 28 }}>
              <p>
                Every job runs through the same <Link href="/">five steps</Link>, so you know what comes next and what you will receive at
                each one.
              </p>
            </div>
          </div>
        </section>
        <section className="block split">
          <h2>What we make</h2>
          <ul className="list">
            {makes.map((m) => (
              <li key={m.name}>
                <strong style={{ fontWeight: 500 }}>{m.name}.</strong> <span className="quiet">{m.line}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="block split">
          <h2>How a job runs</h2>
          <ol className="steps">
            <li>
              <span>
                <strong>Research.</strong> <span className="quiet">A one-page brief you sign off before design starts.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Design.</strong> <span className="quiet">Routes tested on your real content, reviewed in rounds with a written list of changes.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Build.</strong> <span className="quiet">The finished thing in its real medium: code, print-ready files or fabrication drawings.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Launch.</strong> <span className="quiet">Release plan and assets, then a short report on what people did.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Teach.</strong> <span className="quiet">Templates and a handover, so your team can carry on without us.</span>
              </span>
            </li>
          </ol>
        </section>
        <PlateBand clip="soapfilm" />
        <section className="block split">
          <h2>Prices</h2>
          <div>
            <div className="prose">
              <p>Projects start at £2,500 in the UK and ₦400,000 in Nigeria. For steady work, a retainer gives you a set number of days each month at a fixed price.</p>
            </div>
            <table className="price-table" style={{ marginTop: 24 }}>
              <thead>
                <tr>
                  <th scope="col">Retainer</th>
                  <th scope="col">What it covers</th>
                  <th scope="col">UK</th>
                  <th scope="col">Nigeria</th>
                </tr>
              </thead>
              <tbody>
                {retainers.map((r) => (
                  <tr key={r.name}>
                    <td>{r.name}</td>
                    <td className="quiet">{r.what}</td>
                    <td>{r.uk}</td>
                    <td>{r.ng}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="form-note" style={{ marginTop: 14 }}>
              Retainers run for at least three months. UK prices exclude VAT where it applies.
            </p>
          </div>
        </section>
        <section className="block split">
          <h2>Buying through procurement</h2>
          <div className="prose">
            <p>
              We are registered as a vendor on the UN Global Marketplace and bid on design, layout and publication work. Vendor details are on the{" "}
              <Link href="/procurement/">procurement page</Link>.
            </p>
          </div>
        </section>
        <section className="block split">
          <h2>Start</h2>
          <div className="button-row">
            <Link className="button is-solid" href="/contact/">
              Start a project
            </Link>
            <Link className="button" href="/work/">
              See the work
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
