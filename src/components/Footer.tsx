import Link from "next/link";
import { footageSources } from "@/content/legal";
import { footerNav, site } from "@/content/site";
import { LogoStacked } from "./Logo";

export function Footer() {
  return (
    <footer className="footer" data-tone="dark">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="footer-ask">Questions, briefs and tenders</p>
          <a className="footer-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        {footerNav.map((col) => (
          <nav key={col.title} aria-label={col.title} className="footer-col">
            <h2>{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <LogoStacked className="footer-logo" title="MotionPlay Labs" />
      <div className="footer-base">
        <p>
          {site.ukCompany.legalName}, registered in {site.ukCompany.jurisdiction}, company number {site.ukCompany.number}.
        </p>
        <p>
          {footageSources.length > 0 && <>Footage: {footageSources.join(", ")} contributors. </>}
          <Link href="/legal/credits/">Credits</Link>
        </p>
      </div>
    </footer>
  );
}
