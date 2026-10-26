import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pager } from "@/components/Pager";
import { SceneHero } from "@/components/SceneHero";
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
  return (
    <div className="page">
      <SceneHero scene={w.scene} kicker={w.owner} title={w.title} line={w.summary} />
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
          <ol className="steps">
            {w.decisions.map((d) => (
              <li key={d}>
                <span>{d}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="block split">
          <h2>What happened</h2>
          <ul className="list">
            {w.results.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        {w.links && (
          <section className="block split">
            <h2>See it</h2>
            <ul className="link-list">
              {w.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} rel="noopener">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="block">
          <Pager prev={{ href: "/work/", label: "Back to", title: "All work" }} next={{ href: `/work/${next.slug}/`, label: "Next case study", title: next.title }} />
          <div className="button-row" style={{ marginTop: 48 }}>
            <Link className="button is-solid" href="/contact/">
              Start a project
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
