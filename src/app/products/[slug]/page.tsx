import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SceneHero } from "@/components/SceneHero";
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
  return (
    <div className="page">
      <SceneHero scene={p.scene} kicker={`Stage: ${p.stage}`} title={p.name} line={p.line}>
        {p.link && (
          <div className="button-row">
            <a className="button" href={p.link.href} rel="noopener">
              {p.link.label}
            </a>
          </div>
        )}
      </SceneHero>
      <div className="wrap">
        <section className="block split">
          <h2>What it is</h2>
          <div className="prose">
            {p.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </div>
        </section>
        <section className="block split">
          <h2>Details</h2>
          <dl className="facts">
            <dt>Stage</dt>
            <dd>
              {p.stage}
              {p.stageNote ? `. ${p.stageNote}.` : ""}
            </dd>
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
        <section className="block split">
          <h2>More</h2>
          <ul className="link-list">
            {caseStudy && (
              <li>
                <Link href={`/work/${caseStudy.slug}/`}>Read the case study</Link>
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
    </div>
  );
}
