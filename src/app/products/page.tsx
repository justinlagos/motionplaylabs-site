import type { Metadata } from "next";
import Link from "next/link";
import { NextBand, PlateHero } from "@/components/Clip";
import { StageMini, stageRank } from "@/components/StageTrack";
import { activeProducts, parkedProducts, products, stages } from "@/content/products";
import { pageClips } from "@/content/site";

export const metadata: Metadata = {
  title: "Products",
  description: "Software and hardware MotionPlay Labs builds and runs: Draw in the Air, Void Canvas, Pamiit, TollPilot and more.",
};

const criteria: Record<(typeof stages)[number], string> = {
  Explore: "Checking the problem with the people who have it.",
  Prototype: "A working version is being built and tested.",
  Pilot: "In use by a first group, with safety and data checks done.",
  Launch: "Open to anyone.",
  Scale: "It funds its own team, or becomes its own company.",
};

// Furthest along first; within a stage, the order in products.ts.
const ordered = [...activeProducts].sort((a, b) => stageRank(b.stage) - stageRank(a.stage));

export default function ProductsPage() {
  return (
    <div className="page">
      <PlateHero
        clip={pageClips.products}
        title="Products"
        line="Software and hardware we build and run ourselves. Each one starts as an experiment and has to earn its next stage."
      />
      <div className="wrap">
        <section className="block">
          <h2 className="visually-hidden">Products in development and live</h2>
          <ul className="rows">
            {ordered.map((p) => (
              <li className="row" key={p.slug}>
                <Link href={`/products/${p.slug}/`}>
                  <span className="row-text">
                    <span className="row-name">{p.name}</span> <span className="row-line">{p.line}</span>
                  </span>
                  <span className="row-meta">
                    <span className="row-stage">
                      <StageMini stage={p.stage} />
                      <span>{p.stage}</span>
                    </span>
                    {p.markets}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="block">
          <div className="block-head">
            <h2>How a product moves</h2>
            <p className="quiet">Every product starts as an experiment. It moves on when it is ready, and is parked when it is not.</p>
          </div>
          <ol className="stage-board">
            {stages.map((s, i) => {
              const here = products.filter((p) => p.stage === s);
              return (
                <li key={s}>
                  <span className="stage-board-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="stage-board-name">{s}</h3>
                  <p className="stage-board-test">{criteria[s]}</p>
                  <ul className="stage-board-now" aria-label={`At ${s} now`}>
                    {here.length ? (
                      here.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/products/${p.slug}/`}>{p.name}</Link>
                        </li>
                      ))
                    ) : (
                      <li className="quiet">None yet</li>
                    )}
                  </ul>
                </li>
              );
            })}
          </ol>
        </section>
        <section className="block split">
          <h2>Parked</h2>
          <div>
            <p className="prose quiet">Parked products keep their designs and code. We look at them again each quarter.</p>
            <ul className="rows is-compact" style={{ marginTop: 24 }}>
              {parkedProducts.map((p) => (
                <li className="row" key={p.slug}>
                  <Link href={`/products/${p.slug}/`}>
                    <span className="row-text">
                      <span className="row-name">{p.name}</span> <span className="row-line">{p.line}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <NextBand clip={pageClips.school} href="/school/" kicker="Next: School" title="School" line="The Build Session: build a working tool with AI, live, with help as you go." />
    </div>
  );
}
