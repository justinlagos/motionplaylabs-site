import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextBand, PlateHero } from "@/components/Clip";
import { notes } from "@/content/notes";
import { productBySlug } from "@/content/products";
import { caseBySlug, work } from "@/content/work";

export const dynamicParams = false;
export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const w = caseBySlug((await params).slug);
  if (!w) return {};
  return { title: w.title, description: w.summary };
}

export default async function CasePage({ params }: P) {
  const w = caseBySlug((await params).slug);
  if (!w) notFound();
  const i = work.indexOf(w);
  const next = work[(i + 1) % work.length];
  const product = productBySlug(w.slug);
  const note = notes.find((n) => n.about.href === `/products/${w.slug}/` || (w.slug === "the-build-session" && n.about.href === "/school/"));
  return (
    <div className="page">
      <PlateHero clip={w.clip} kicker={w.owner} title={w.title} line={w.summary} />
      <div className="wrap">
        <section className="block split">
          <h2>At a glance</h2>
          <dl className="facts">
            <dt>Discipline</dt>
            <dd>{w.discipline}</dd>
            <dt>Market</dt>
            <dd>{w.market}</dd>
            <dt>Year</dt>
            <dd>{w.year}</dd>
            {w.credits.map((c) => (
              <div key={c.role} style={{ display: "contents" }}>
                <dt>{c.role}</dt>
                <dd>{c.name}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="block split">
          <h2>The problem</h2>
          <p className="lede">{w.problem}</p>
        </section>
        <section className="block split">
          <h2>What we decided</h2>
          <ol className="numbered">
            {w.decisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
        </section>
        <section className="block split">
          <h2>{w.resultsLabel ?? "What happened"}</h2>
          <ul className="list">
            {w.results.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <section className="block split">
          <h2>More</h2>
          <ul className="link-list">
            {w.links?.map((l) => (
              <li key={l.href}>
                <a href={l.href} rel="noopener">
                  {l.label}
                </a>
              </li>
            ))}
            {product && (
              <li>
                <Link href={`/products/${product.slug}/`}>{product.name}: stage and details</Link>
              </li>
            )}
            {note && (
              <li>
                <Link href={`/lab-notes/${note.slug}/`}>Lab note: {note.title}</Link>
              </li>
            )}
            <li>
              <Link href="/work/">All work</Link>
            </li>
            <li>
              <Link href="/contact/">Start a project</Link>
            </li>
          </ul>
        </section>
      </div>
      <NextBand clip={next.clip} href={`/work/${next.slug}/`} kicker="Next case study" title={next.title} line={next.summary} />
    </div>
  );
}
