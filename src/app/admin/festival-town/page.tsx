import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { adminAllowed } from "@/lib/admin-auth";
import { loadGame, loadSales, loadSite, loadWaitlist, type Count, type Result } from "@/lib/ft-analytics";
import { channels, channelsUpdated } from "@/content/ft-channels";
import "../admin.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Festival Town analytics", robots: { index: false, follow: false } };

const PERIODS = [7, 30, 90] as const;
type P = { searchParams: Promise<{ days?: string; test?: string }> };

const fmt = (n: number) => new Intl.NumberFormat("en-GB").format(Math.round(n));
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "–");
const mins = (ms: number | null) => (ms == null ? "–" : ms < 60000 ? `${Math.max(1, Math.round(ms / 1000))} s` : `${(ms / 60000).toFixed(ms < 600000 ? 1 : 0)} min`);
const money = (amount: number, currency: string) => {
  try { return new Intl.NumberFormat("en-GB", { style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: currency === "NGN" ? 0 : 2 }).format(amount / 100); } catch { return `${amount / 100} ${currency}`; }
};
const dayLabel = (d: string, long = false) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", long ? { weekday: "short", day: "numeric", month: "short" } : { day: "numeric", month: "short" });

/* ---------- small pieces ---------- */
function Stat({ label, value, note, source }: { label: string; value: string; note?: string; source: string }) {
  return (
    <div className="ad-stat">
      <p className="ad-stat-label">{label}</p>
      <p className="ad-stat-value">{value}</p>
      {note && <p className="ad-stat-note">{note}</p>}
      <p className="ad-src">{source}</p>
    </div>
  );
}

function Missing<T>({ r, what }: { r: Result<T>; what: string }) {
  if (r.ok) return null;
  return (
    <div className="ad-missing" role="status">
      <p><b>{r.reason === "not_configured" ? `${what}: not connected yet.` : `${what}: could not be read.`}</b></p>
      <p>{r.detail}</p>
    </div>
  );
}

/* one series per chart; a hover title on every bar; the numbers are also in the table under it */
function Columns({ data, label, unit }: { data: { day: string; n: number }[]; label: string; unit: string }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  const total = data.reduce((t, d) => t + d.n, 0);
  const step = data.length > 31 ? 14 : data.length > 10 ? 7 : 1;
  return (
    <figure className="ad-chart" style={{ ["--n" as string]: data.length }}>
      <figcaption>
        <span>{label}</span>
        <span className="ad-quiet">{fmt(total)} in total</span>
      </figcaption>
      <div className="ad-cols" role="img" aria-label={`${label}, ${data.length} days, ${fmt(total)} in total`}>
        <span className="ad-max" aria-hidden="true">{fmt(max)}</span>
        {data.map((d) => (
          <span key={d.day} className="ad-col" title={`${dayLabel(d.day, true)}: ${fmt(d.n)} ${unit}`}>
            <i style={{ height: `${(d.n / max) * 100}%` }} className={d.n ? "" : "zero"} />
          </span>
        ))}
      </div>
      <div className="ad-axis" aria-hidden="true">
        {data.map((d, i) => <span key={d.day}>{(data.length - 1 - i) % step === 0 ? dayLabel(d.day) : ""}</span>)}
      </div>
      <details className="ad-table-toggle">
        <summary>Show as a table</summary>
        <table className="ad-table compact">
          <thead><tr><th>Day</th><th className="num">{unit[0].toUpperCase() + unit.slice(1)}</th></tr></thead>
          <tbody>{[...data].reverse().map((d) => <tr key={d.day}><td>{dayLabel(d.day, true)}</td><td className="num">{fmt(d.n)}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}

function BarList({ title, items, total, empty = "Nothing yet.", limit = 8 }: { title: string; items: Count[]; total?: number; empty?: string; limit?: number }) {
  const shown = items.slice(0, limit);
  const rest = items.slice(limit).reduce((t, c) => t + c.n, 0);
  if (rest) shown.push({ key: "_other", label: "Other", n: rest });
  const max = Math.max(1, ...shown.map((c) => c.n));
  const sum = total ?? items.reduce((t, c) => t + c.n, 0);
  return (
    <div className="ad-list">
      <h3>{title}</h3>
      {shown.length === 0 ? <p className="ad-quiet">{empty}</p> : (
        <ul>
          {shown.map((c) => (
            <li key={c.key} title={`${c.label}: ${fmt(c.n)} (${pct(c.n, sum)})`}>
              <span className="ad-l">{c.label}</span>
              <span className="ad-v">{fmt(c.n)} <em>{pct(c.n, sum)}</em></span>
              <span className="ad-bar"><i style={{ width: `${(c.n / max) * 100}%` }} /></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function FestivalTownAnalytics({ searchParams }: P) {
  if (!adminAllowed((await headers()).get("authorization"))) notFound();
  const sp = await searchParams;
  const days = PERIODS.includes(Number(sp.days) as (typeof PERIODS)[number]) ? Number(sp.days) : 30;
  const withTest = sp.test === "1";
  const [game, wait, sales, site] = await Promise.all([loadGame(days, withTest), loadWaitlist(days), loadSales(days), loadSite(days)]);
  const now = new Date().toLocaleString("en-GB", { timeZone: "Europe/London", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const g = game.ok ? game.data : null;
  const link = (d: number, t = withTest) => `?days=${d}${t ? "&test=1" : ""}`;

  /* the activity that most often ends early, once it has enough starts to mean something */
  const ranked = g ? g.activities.filter((a) => a.starts >= 5).sort((a, b) => a.finishes / a.starts - b.finishes / b.starts) : [];
  const hardest = ranked[0]?.id;

  return (
    <div className="page admin">
      <div className="wrap ad-top">
        <p className="ad-kicker">MotionPlay Labs · private</p>
        <h1 className="ad-title">Festival Town</h1>
        <div className="ad-bar-row">
          <nav className="ad-periods" aria-label="Period">
            {PERIODS.map((d) => <a key={d} href={link(d)} aria-current={d === days ? "page" : undefined}>{d} days</a>)}
          </nav>
          <p className="ad-quiet">
            Updated {now} London · <a href={link(days, !withTest)}>{withTest ? "Hide test plays" : "Include test plays"}</a>
          </p>
        </div>

        {/* ---------- headline ---------- */}
        <section className="ad-stats" aria-label="Headline numbers">
          <Stat label="Game sessions" value={g ? fmt(g.sessions) : "–"} note={g ? `${fmt(g.played)} pressed Play` : undefined} source="Game play counts" />
          <Stat label="Activities finished" value={g ? fmt(g.activitiesDone) : "–"} note={g ? `in ${fmt(g.finishedActivity)} sessions` : undefined} source="Game play counts" />
          <Stat label="Time per session" value={g ? mins(g.medianSessionMs) : "–"} note="median" source="Game play counts" />
          <Stat label="Coming back" value={g && g.returningShare != null ? pct(g.returningShare, 1) : "–"} note="sessions on a device that played before" source="Game play counts" />
          <Stat label="Waitlist" value={wait.ok ? fmt(wait.data.total) : "–"} note={wait.ok ? `${fmt(wait.data.inPeriod)} in the last ${days} days` : undefined} source="Supabase ft_waitlist" />
          <Stat label="Festival Night sales" value={sales.ok ? fmt(sales.data.live) : "–"} note={sales.ok ? `${fmt(sales.data.founders)} of 200 Founders` : undefined} source="Supabase purchases" />
        </section>

        {/* ---------- the game ---------- */}
        <section className="ad-sec">
          <div className="ad-sec-head">
            <h2>The game</h2>
            <p className="ad-quiet">Anonymous play counts from game 1.0.3 on. No device ID: a session is one launch of the game.{withTest ? " Test plays included." : ""}</p>
          </div>
          <Missing r={game} what="Game play counts" />
          {g && g.sessions === 0 && <p className="ad-empty">No plays counted in the last {days} days. Counts start when 1.0.3 is live on a channel; the stores and portals send none until their 1.0.3 builds are approved.</p>}
          {g && g.sessions > 0 && (
            <>
              <div className="ad-two">
                <Columns data={g.daily.map((d) => ({ day: d.day, n: d.sessions }))} label="Sessions per day" unit="sessions" />
                <Columns data={g.daily.map((d) => ({ day: d.day, n: d.done }))} label="Activities finished per day" unit="activities finished" />
              </div>

              <div className="ad-funnel">
                <h3>From opening to finishing</h3>
                <ol>
                  {g.funnel.map((f, i) => (
                    <li key={f.key} title={`${f.label}: ${fmt(f.n)} sessions`}>
                      <span className="ad-l">{f.label}</span>
                      <span className="ad-v">{fmt(f.n)} <em>{i === 0 ? "" : pct(f.n, g.funnel[0].n)}</em></span>
                      <span className="ad-bar"><i style={{ width: `${(f.n / Math.max(1, g.funnel[0].n)) * 100}%` }} /></span>
                    </li>
                  ))}
                </ol>
                <p className="ad-quiet">Share of sessions that opened the game. {fmt(g.festivalComplete)} sessions reached the finished festival.</p>
              </div>

              <div className="ad-grid">
                <BarList title="Where" items={g.channels} />
                <BarList title="Device" items={g.devices} />
                <BarList title="Country, from the device time zone" items={g.countries} />
                <BarList title="How they play" items={g.inputs} total={g.sessions} empty="No sessions have ended yet." />
                <BarList title="Friend picked" items={g.heroes} />
                <BarList title="Game version" items={g.versions} />
              </div>

              <div className="ad-acts">
                <h3>The fifteen activities</h3>
                <div className="ad-scroll">
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th>Activity</th><th className="num">Started</th><th className="num">Finished</th><th>Finish rate</th>
                        <th className="num">Left early</th><th className="num">Usual round left</th><th className="num">Time to finish</th>
                        <th className="num">Wrong tries</th><th className="num">Hints</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.activities.map((a, i) => (
                        <tr key={a.world + a.id} className={i % 3 === 0 ? "ad-world-start" : undefined}>
                          <td>
                            {i % 3 === 0 && <span className="ad-world">{a.worldName}</span>}
                            <b>{a.name}</b>{a.id === hardest && <span className="ad-tag">Ends early most</span>}
                            <span className="ad-skill">{a.skill}</span>
                          </td>
                          <td className="num">{fmt(a.starts)}</td>
                          <td className="num">{fmt(a.finishes)}</td>
                          <td>
                            <span className="ad-rate" title={`${a.name}: ${pct(a.finishes, a.starts)} of starts finished`}>
                              <span className="ad-bar"><i style={{ width: a.starts ? `${Math.min(100, (a.finishes / a.starts) * 100)}%` : "0" }} /></span>
                              <span>{pct(a.finishes, a.starts)}</span>
                            </span>
                          </td>
                          <td className="num">{fmt(a.quits)}</td>
                          <td className="num">{a.commonQuitRound ? `Round ${a.commonQuitRound}` : "–"}</td>
                          <td className="num">{mins(a.medianMs)}</td>
                          <td className="num">{a.triesPerFinish == null ? "–" : a.triesPerFinish.toFixed(1)}</td>
                          <td className="num">{a.hintsPerFinish == null ? "–" : a.hintsPerFinish.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="ad-quiet">Time to finish is the median for a full activity (three rounds). Wrong tries and hints are averages per finished activity. Replays count as starts and finishes.</p>
              </div>
            </>
          )}
        </section>

        {/* ---------- waitlist ---------- */}
        <section className="ad-sec">
          <div className="ad-sec-head">
            <h2>Waitlist</h2>
            <p className="ad-quiet">Sign-ups on motionplaylabs.com/festival-town. Counts only; addresses stay in Supabase.</p>
          </div>
          <Missing r={wait} what="Waitlist" />
          {wait.ok && (
            <div className="ad-two">
              <Columns data={wait.data.daily} label="Sign-ups per day" unit="sign-ups" />
              <div className="ad-grid tight">
                <BarList title="Who" items={[{ key: "parent", label: "Parents and carers", n: wait.data.parents }, { key: "school", label: "Schools", n: wait.data.schools }].filter((c) => c.n)} empty="No sign-ups yet." />
                <BarList title="Country" items={wait.data.countries} empty="No sign-ups yet." />
                {wait.data.internalLeftOut > 0 && <p className="ad-quiet">{wait.data.internalLeftOut} test sign-up{wait.data.internalLeftOut === 1 ? "" : "s"} from @motionplaylabs.com left out.</p>}
              </div>
            </div>
          )}
        </section>

        {/* ---------- sales ---------- */}
        <section className="ad-sec">
          <div className="ad-sec-head">
            <h2>Festival Night sales</h2>
            <p className="ad-quiet">The Season 2 pack: £2.99, ₦1,500 in Nigeria. Live payments only; refunds taken off.</p>
          </div>
          <Missing r={sales} what="Sales" />
          {sales.ok && (
            <div className="ad-stats small">
              <Stat label="Packs sold" value={fmt(sales.data.live)} note={`${fmt(sales.data.liveInPeriod)} in the last ${days} days`} source="Supabase purchases" />
              <Stat label="Founders" value={`${fmt(sales.data.founders)} / 200`} note={`${fmt(Math.max(0, 200 - sales.data.founders))} places left`} source="Supabase purchases" />
              {sales.data.revenue.length === 0
                ? <Stat label="Revenue" value="–" note="no live payments yet" source="Supabase purchases" />
                : sales.data.revenue.map((r) => <Stat key={r.currency} label={`Revenue, ${r.currency}`} value={money(r.amount, r.currency)} note="before Stripe fees" source="Supabase purchases" />)}
              <Stat label="Refunds" value={fmt(sales.data.refunds)} note={`${fmt(sales.data.test)} test payments not counted`} source="Supabase purchases" />
            </div>
          )}
        </section>

        {/* ---------- website ---------- */}
        <section className="ad-sec">
          <div className="ad-sec-head">
            <h2>Website</h2>
            <p className="ad-quiet">motionplaylabs.com, from Vercel Web Analytics (no cookies).</p>
          </div>
          <Missing r={site} what="Website traffic" />
          {site.ok && (
            <div className="ad-two">
              <Columns data={site.data.daily} label="Page views per day" unit="page views" />
              <div className="ad-grid tight">
                <BarList title="Festival Town actions" items={site.data.events} empty="No Festival Town events yet." limit={10} />
                <BarList title="Top pages" items={site.data.pages} />
                <BarList title="Country" items={site.data.countries} />
              </div>
            </div>
          )}
        </section>

        {/* ---------- channels ---------- */}
        <section className="ad-sec">
          <div className="ad-sec-head">
            <h2>Stores and portals</h2>
            <p className="ad-quiet">Status as of {channelsUpdated}. Installs and plays on these live in each console.</p>
          </div>
          <div className="ad-scroll">
            <table className="ad-table">
              <thead><tr><th>Where</th><th>Version</th><th>Status</th><th>Play counts</th><th className="num">Sessions</th><th>Console</th></tr></thead>
              <tbody>
                {channels.map((c) => {
                  const n = g?.channels.find((x) => x.key === c.ch)?.n || 0;
                  return (
                    <tr key={c.name}>
                      <td><b>{c.name}</b></td>
                      <td>{c.version || "–"}</td>
                      <td>{c.status}</td>
                      <td>{c.countsFrom ? `From ${c.countsFrom}` : "None yet"}</td>
                      <td className="num">{g ? fmt(n) : "–"}</td>
                      <td>{c.console ? <a href={c.console} target="_blank" rel="noopener noreferrer">Open</a> : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
