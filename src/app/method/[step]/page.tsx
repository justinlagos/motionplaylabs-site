import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextBand, PlateHero } from "@/components/Clip";
import { Numeral } from "@/components/Numeral";
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
  const next = method[i + 1];
  return (
    <div className="page">
      <PlateHero
        clip={s.clip}
        mark={<Numeral value={s.numeral} className="hero-numeral" />}
        kicker={`Step ${i + 1} of ${method.length}`}
        title={s.name}
        line={`${s.line}.`}
      />
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
      </div>
      {next ? (
        <NextBand clip={next.clip} href={`/method/${next.slug}/`} kicker={`Next step: ${next.numeral}`} title={next.name} line={`${next.line}.`} />
      ) : (
        <NextBand clip="soapfilm" href="/studio/" kicker="Work with us" title="Studio" line="Identity, campaigns, publications, events and websites, run on these five steps." />
      )}
    </div>
  );
}
