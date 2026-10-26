import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legal, legalBySlug } from "@/content/legal";

export const dynamicParams = false;
export function generateStaticParams() {
  return legal.map((d) => ({ doc: d.slug }));
}

type P = { params: Promise<{ doc: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = legalBySlug((await params).doc);
  return d ? { title: d.title } : {};
}

export default async function LegalPage({ params }: P) {
  const d = legalBySlug((await params).doc);
  if (!d) notFound();
  return (
    <div className="page legal">
      <div className="wrap" style={{ paddingTop: 150 }}>
        <h1 className="scene-hero-title" style={{ textAlign: "left", fontSize: "clamp(32px, 1rem + 3vw, 60px)" }}>
          {d.title}
        </h1>
        {d.status && <p className="quiet">{d.status}</p>}
        {d.sections.map((s) => (
          <section className="block split" key={s.heading}>
            <h2>{s.heading}</h2>
            <div className="prose">
              {s.body.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
