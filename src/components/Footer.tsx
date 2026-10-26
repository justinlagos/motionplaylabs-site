import Link from "next/link";
import { footerNav, site } from "@/content/site";
import { Mark } from "./Mark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Mark className="footer-mark" />
          <p>
            Questions, briefs and tenders:
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
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
      <p className="footer-legal">
        {site.ukCompany.legalName}, registered in {site.ukCompany.jurisdiction}, company number {site.ukCompany.number}.
      </p>
    </footer>
  );
}
