import Link from "next/link";

type L = { href: string; label: string; title: string } | null;

export function Pager({ prev, next }: { prev: L; next: L }) {
  return (
    <nav className="pager" aria-label="More">
      {prev && (
        <Link href={prev.href} className="prev">
          <span>{prev.label}</span>
          <span>{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link href={next.href} className="next">
          <span>{next.label}</span>
          <span>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
