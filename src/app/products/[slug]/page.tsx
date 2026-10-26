import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextBand, PlateHero } from "@/components/Clip";
import { StageTrack } from "@/components/StageTrack";
import { notes } from "@/content/notes";
import { productBySlug, products } from "@/content/products";
import { work } from "@/content/work";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = productBySlug((await params).slug);
  if (!p) return {};
  return { title: p.name, description: p.line };
}

export default async function ProductPage({ params }: P) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  const caseStudy = work.find((w) => w.slug === p.slug);
  const note = notes.find((n) => n.about.href === `/products/${p.slug}/`);
  const next = products[(products.indexOf(p) + 1) % products.length];
  return (
    <div className="page">
      <PlateHero clip={p.clip} kicker={p.markets} title={p.name} line={p.line}>
        {p.link && (
          <div className="button-row">
            <a className="button" href={p.link.href} rel="noopener">
              {p.link.label}
            </a>
          </div>
        )}
      </PlateHero>
      <div className="wrap">
        <section className="block split">
          <h2>What it is</h2>
          <div className="prose">
            {p.body.map((b, i) => (
              <p key={b} className={i === 0 ? "prose-lead" : undefined}>
                {b}
              </p>
            ))}
          </div>
        </section>
        <section className="block split">
          <h2>Stage</h2>
          <div>
            <StageTrack stage={p.stage} />
            <p className="stage-note">
              <strong>{p.stage}.</strong> {p.stageNote ? `${p.stageNote}.` : p.stage === "Parked" ? "Designs and code are kept; we look at it again each quarter." : ""}
            </p>
          </div>
        </section>
        {(p.facts.length > 0 || p.forWhom) && (
          <section className="block split">
            <h2>Details</h2>
            <dl className="facts">
              <dt>For</dt>
              <dd>{p.forWhom}</dd>
              <dt>Markets</dt>
              <dd>{p.markets}</dd>
              {p.facts.map((f) => (
                <div key={f.label} style={{ display: "contents" }}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <section className="block split">
          <h2>Next</h2>
          <p className="lede">{p.next}</p>
        </section>
        <section className="block split">
          <h2>More</h2>
          <ul className="link-list">
            {caseStudy && (
              <li>
                <Link href={`/work/${caseStudy.slug}/`}>Read the case study</Link>
              </li>
            )}
            {note && (
              <li>
                <Link href={`/lab-notes/${note.slug}/`}>Lab note: {note.title}</Link>
              </li>
            )}
            <li>
              <Link href="/products/">All products</Link>
            </li>
            <li>
              <Link href="/contact/">Talk to us about {p.name}</Link>
            </li>
          </ul>
        </section>
      </div>
      <NextBand clip={next.clip} href={`/products/${next.slug}/`} kicker="Next product" title={next.name} line={next.line} />
    </div>
  );
}
