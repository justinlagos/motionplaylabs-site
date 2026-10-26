import type { Metadata } from "next";
import Link from "next/link";
import { SceneHero } from "@/components/SceneHero";
import { SceneStill } from "@/components/SceneStill";
import { activeProducts, parkedProducts } from "@/content/products";
import { pageScenes } from "@/content/site";

export const metadata: Metadata = {
  title: "Products",
  description: "Software and hardware MotionPlay Labs builds and runs: Draw in the Air, Void Canvas, Pamiit, TollPilot and more.",
};

export default function ProductsPage() {
  return (
    <div className="page">
      <SceneHero
        scene={pageScenes.products}
        title="Products"
        line="Software and hardware we build and run ourselves. Each one starts as an experiment and has to earn its next stage."
      />
      <div className="wrap">
        <section className="block">
          <h2 className="visually-hidden">Products in development and live</h2>
          <ul className="rows">
            {activeProducts.map((p) => (
              <li className="row" key={p.slug}>
                <Link href={`/products/${p.slug}/`}>
                  <SceneStill scene={p.scene} className="row-still" />
                  <span>
                    <span className="row-name">{p.name}</span>
                    <span className="row-line">{p.line}</span>
                  </span>
                  <span className="row-meta">
                    <span className="stage-pill">{p.stage}</span>
                    <br />
                    {p.markets}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="block split">
          <h2>Parked</h2>
          <div>
            <p className="prose quiet" style={{ marginTop: 0 }}>
              Parked products keep their designs and code. We look at them again each quarter.
            </p>
            <ul className="list" style={{ marginTop: 18 }}>
              {parkedProducts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}/`}>{p.name}</Link>. <span className="quiet">{p.line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="block split">
          <h2>How a product moves</h2>
          <ol className="steps">
            <li>
              <span>
                <strong>Explore.</strong> <span className="quiet">Ten people who would use it confirm the problem.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Prototype.</strong> <span className="quiet">Five real people use it without help.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Pilot.</strong> <span className="quiet">They come back, pay or sign up; safety and data checks are done.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Launch.</strong> <span className="quiet">Paying users and one way of finding more at a known cost.</span>
              </span>
            </li>
            <li>
              <span>
                <strong>Scale.</strong> <span className="quiet">It funds its own team, or becomes its own company.</span>
              </span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
