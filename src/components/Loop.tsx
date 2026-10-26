import Link from "next/link";
import type { CSSProperties } from "react";
import { method } from "@/content/method";

/**
 * The company on one ring: the five steps of the method, with Studio, Products and School inside.
 * The logo's dot travels the ring slowly; it stops for people who ask for reduced motion.
 */
export function Loop() {
  return (
    <figure className="loop">
      <div className="loop-ring" aria-hidden="true">
        <span className="loop-orbit" />
      </div>
      <ol className="loop-steps">
        {method.map((s, i) => (
          <li key={s.slug} style={{ "--a": `${-90 + i * 72}deg` } as CSSProperties}>
            <Link href={`/method/${s.slug}/`}>
              <span className="loop-numeral">{s.numeral}</span> {s.name}
            </Link>
          </li>
        ))}
      </ol>
      <p className="loop-core">
        <Link href="/studio/">Studio</Link>
        <Link href="/products/">Products</Link>
        <Link href="/school/">School</Link>
      </p>
      <figcaption className="visually-hidden">
        One method, five steps, runs the studio, the products and the school.
      </figcaption>
    </figure>
  );
}
