import type { Metadata } from "next";
import "@fontsource/lilita-one/400.css";
import "./data-room.css";
import { dataRoom, statusLabel } from "@/content/data-room";
import { site } from "@/content/site";

// Unlisted: shared by link with schools and partners. Kept out of search and the sitemap;
// next.config.ts also sends X-Robots-Tag: noindex for the PDFs in this folder.
export const metadata: Metadata = {
  title: dataRoom.title,
  description: "Documents for the Festival Town school licence in Nigeria.",
  robots: { index: false, follow: false },
};

const external = (href: string) => /^https?:\/\//.test(href);

export default function DataRoomPage() {
  return (
    <div className="dr">
      <section className="dr-band" data-tone="dark">
        <div className="wrap dr-head">
          <div className="dr-head-text">
            <p className="dr-eyebrow">MotionPlay Labs Ltd · Nigeria and UK</p>
            <h1 className="dr-title">{dataRoom.title}</h1>
            <p className="dr-lead">{dataRoom.lead}</p>
            <p className="dr-meta">
              <span>
                <b>Updated</b> {dataRoom.updated}
              </span>
              <span>
                <b>Access</b> Shared by link
              </span>
            </p>
          </div>
          <img className="dr-logo" src="/festival-town/logo-600.webp" width={600} height={437} alt="Festival Town: help the town get ready" />
        </div>
        <div className="wrap">
          <img
            className="dr-town"
            src="/festival-town/scene/bg_title-1600.webp"
            width={1600}
            height={686}
            alt="Festival Town in 3D: the Computer Village, Market Street, the Adire Workshop, Grandma's Farm and the Builders' Yard around a green"
          />
        </div>
      </section>

      <div className="wrap dr-body" data-tone="light">
        <dl className="dr-glance" aria-label="Festival Town at a glance">
          {dataRoom.glance.map((g) => (
            <div key={g.label}>
              <dt>{g.label}</dt>
              <dd>{g.value}</dd>
            </div>
          ))}
        </dl>

        {dataRoom.parts.map((part) => (
          <section className="dr-part" id={part.id} key={part.id} aria-labelledby={`h-${part.id}`}>
            <div className="dr-part-head">
              <span className="dr-part-no">{part.no}</span>
              <h2 id={`h-${part.id}`}>{part.title}</h2>
            </div>
            <ol className="dr-rows">
              {part.items.map((it) => {
                const inner = (
                  <>
                    <span className="dr-no">{it.no}</span>
                    <span className="dr-main">
                      <span className="dr-item-title">{it.title}</span>
                      <span className="dr-desc">{it.desc}</span>
                    </span>
                    <span className="dr-kind">{it.kind}</span>
                    <span className={`dr-status is-${it.status}`}>{statusLabel[it.status]}</span>
                    <span className="dr-go" aria-hidden="true">
                      {it.href ? (it.href.endsWith(".pdf") ? "↓" : "↗") : ""}
                    </span>
                  </>
                );
                return (
                  <li key={it.no}>
                    {it.href ? (
                      <a
                        className="dr-row"
                        href={it.href}
                        {...(external(it.href) || it.href.endsWith(".pdf") ? { target: "_blank", rel: "noopener" } : {})}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="dr-row is-pending">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}

        <section className="dr-contact" aria-labelledby="h-contact">
          <div>
            <h2 id="h-contact">Questions or a school visit</h2>
            <p>Justin Ukaegbu, Founder and Director, MotionPlay Labs.</p>
          </div>
          <ul>
            <li>
              <span>Email</span>
              <a href="mailto:justin@motionplaylabs.com">justin@motionplaylabs.com</a>
            </li>
            <li>
              <span>Phone</span>
              <a href="tel:+447577627621">+44 7577 627621</a>
            </li>
          </ul>
        </section>

        <div className="dr-foot">
          <p>
            {site.ukCompany.legalName}, registered in {site.ukCompany.jurisdiction}, company {site.ukCompany.number}, 66 Paul Street, London EC2A 4NA.
          </p>
          {site.ngCompany && (
            <p>
              {site.ngCompany.legalName}, registered in Nigeria with the Corporate Affairs Commission, RC {site.ngCompany.rc}, Lekki, Lagos.
            </p>
          )}
          <p>Documents marked Draft may change before signing.</p>
        </div>
      </div>
    </div>
  );
}
