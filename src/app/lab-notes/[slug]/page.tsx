import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NextBand } from "@/components/Clip";
import { noteBySlug, notes, readingMinutes } from "@/content/notes";

export const dynamicParams = false;
export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const n = noteBySlug((await params).slug);
  if (!n) return {};
  return { title: n.title, description: n.line };
}

export default async function NotePage({ params }: P) {
  const n = noteBySlug((await params).slug);
  if (!n) notFound();
  const next = notes[(notes.indexOf(n) + 1) % notes.length];
  return (
    <div className="page">
      <header className="wrap page-top note-top">
        <p className="plate-hero-kicker">
          <Link href="/lab-notes/">Lab notes</Link>
        </p>
        <h1 className="page-title">{n.title}</h1>
        <p className="note-line">{n.line}</p>
      </header>
      <div className="wrap">
        <article className="block note">
          <dl className="note-meta">
            <dt>Published</dt>
            <dd>{n.date}</dd>
            <dt>About</dt>
            <dd>
              <Link href={n.about.href}>{n.about.label}</Link>
            </dd>
            <dt>Reading time</dt>
            <dd>{readingMinutes(n)} min</dd>
          </dl>
          <div className="note-body">
            {n.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </article>
      </div>
      <NextBand clip={next.clip} href={`/lab-notes/${next.slug}/`} kicker="Next note" title={next.title} line={next.line} />
    </div>
  );
}
