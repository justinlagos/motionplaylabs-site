import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pager } from "@/components/Pager";
import { SceneHero } from "@/components/SceneHero";
import { method, stepBySlug } from "@/content/method";

export const dynamicParams = false;
export function generateStaticParams() {
  return method.map((s) => ({ step: s.slug }));
}

type P = { params: Promise<{ step: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = stepBySlug((await params).step);
  if (!s) return {};
  return { title: `${s.numeral}. ${s.name}`, description: s.intro };
}

export default async function StepPage({ params }: P) {
  const s = stepBySlug((await params).step);
  if (!s) notFound();
  const i = method.indexOf(s);
  const prev = method[i - 1];
  const next = method[i + 1];
  return (
    <div className="page">
      <SceneHero scene={s.scene} kicker={`${s.numeral} of V`} title={s.name} line={`${s.line}.`} />
      <div className="wrap">
        <section className="block split">
          <h2>What it means</h2>
          <p className="lede">{s.intro}</p>
        </section>
        <section className="block split">
          <h2>What we do</h2>
          <ul className="list">
            {s.weDo.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section className="block split">
          <h2>What you get</h2>
          <ul className="list">
            {s.youGet.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
        <section className="block split">
          <h2>Where to see it</h2>
          <ul className="link-list">
            {s.seenIn.map((x) => (
              <li key={x.href}>
                <Link href={x.href}>{x.label}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="block">
          <Pager
            prev={prev ? { href: `/method/${prev.slug}/`, label: `Previous: ${prev.numeral}`, title: prev.name } : { href: "/", label: "Back to", title: "The film" }}
            next={next ? { href: `/method/${next.slug}/`, label: `Next: ${next.numeral}`, title: next.name } : { href: "/studio/", label: "Work with us", title: "Studio" }}
          />
        </section>
      </div>
    </div>
  );
}
