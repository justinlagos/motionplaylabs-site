import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PlateHero } from "@/components/Clip";
import { method } from "@/content/method";
import { pageClips, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Studio",
  description: "Identity, campaigns, publications, events and websites for organisations in the UK and Nigeria.",
};

const makes = [
  { name: "Brand and identity", items: ["Identity systems", "Guidelines and brand books", "Templates your team uses every day"] },
  { name: "Campaigns and content", items: ["Campaign platforms", "Social, ads and email", "The assets behind them"] },
  { name: "Reports and publications", items: ["Annual and impact reports", "Policy briefs and case studies", "Decks and long documents", "UN and NGO publications"] },
  { name: "Events and motion", items: ["Event identity and booths", "Screen loops and logo reveals", "Photography and video"] },
  { name: "Websites and product design", items: ["Marketing sites and landing pages", "App interfaces", "Designed and built"] },
];

const ways = [
  { name: "A project", price: "From £2,500 or ₦400,000", line: "One job with a fixed scope, price and date, from brief to handover." },
  { name: "A retainer", price: "From £1,800 or ₦450,000 a month", line: "A set number of days each month for steady work. At least three months." },
  { name: "Team training", price: "Priced per team", line: "The Build Session, run in-house around your team's own work and tools." },
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
        <section className="block">
          <div className="block-head">
            <h2>What we make</h2>
          </div>
          <ul className="disciplines">
            {makes.map((m) => (
              <li key={m.name}>
                <h3 className="discipline-name">{m.name}</h3>
                <ul className="discipline-items">
                  {m.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
        <section className="block">
          <div className="block-head">
            <h2>How a job runs</h2>
            <p className="quiet">The same five steps every time, so you know what comes next and what you receive at each one.</p>
          </div>
          <ol className="flow is-five">
            {method.map((m) => (
              <li key={m.slug}>
                <Link className="flow-link" href={`/method/${m.slug}/`}>
                  <span className="flow-n">{m.numeral}</span>
                  <h3 className="flow-name">{m.name}</h3>
                  <p className="flow-line">{m.youGet[0]}.</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <section className="block">
          <div className="block-head">
            <h2>Ways to work</h2>
          </div>
          <ul className="ways">
            {ways.map((w) => (
              <li key={w.name}>
                <h3 className="way-name">{w.name}</h3>
                <p className="way-price">{w.price}</p>
                <p className="way-line">{w.line}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="block split">
          <h2>Retainers</h2>
          <div>
            <table className="price-table">
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
      </div>
      <CtaBand clip="soapfilm" title="Start a project" line={`Tell us what you need on the enquiry form, or email ${site.email}. Every enquiry is read by Justin.`}>
        <div className="button-row">
          <Link className="button is-solid" href="/contact/">
            Send an enquiry
          </Link>
          <Link className="button" href="/work/">
            See the work
          </Link>
        </div>
      </CtaBand>
    </div>
  );
}
