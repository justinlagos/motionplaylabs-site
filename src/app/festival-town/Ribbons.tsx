import { worlds } from "@/content/festival-town";
import { AdireMark } from "./Playground";

// Two festival ribbons crossing between the arrival and the tasters: what children do, and where.
// Decorative (the same words are in the page), so hidden from screen readers. Pausable like every loop.

const marks = ["circle", "star", "tri"] as const;

function Track({ words }: { words: string[] }) {
  const run = (k: string) => (
    <span className="ftx-ribbon-run" key={k}>
      {words.map((w, i) => (
        <span key={`${k}-${w}`} className="ftx-ribbon-item">
          {w}
          <AdireMark s={marks[i % 3]} />
        </span>
      ))}
    </span>
  );
  return <div className="ftx-ribbon-track">{[run("a"), run("b"), run("c")]}</div>;
}

export function Ribbons() {
  return (
    <div className="ftx-ribbons" aria-hidden="true">
      <div className="ftx-ribbon is-back">
        <Track words={worlds.map((w) => w.name)} />
      </div>
      <div className="ftx-ribbon is-front">
        <Track words={["Count", "Grow", "Code", "Build", "Make", "Celebrate"]} />
      </div>
    </div>
  );
}
