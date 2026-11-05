// Festival Town analytics for /admin/festival-town/. Server only: every key here is read from
// Vercel environment variables and never reaches the browser.
//
// Sources
//   Game play counts  Supabase "Workshop", table ft_events (game 1.0.3 on). FT_SUPABASE_SERVICE_KEY
//   Waitlist          Supabase "Workshop", table ft_waitlist.                FT_SUPABASE_SERVICE_KEY
//   Season 2 sales    Supabase "Festival Town", table purchases.             FT2_SUPABASE_URL, FT2_SUPABASE_SERVICE_KEY
//   Website traffic   Vercel Web Analytics REST API.                         VERCEL_ANALYTICS_TOKEN, VERCEL_PROJECT_ID, VERCEL_TEAM_ID
//
// Each loader returns { ok: false, reason } instead of throwing, so one missing key never blanks the page.
// No email address or other contact detail leaves this file: waitlist rows are reduced to counts here.

// Import this only from server components (the admin page). It holds no keys itself, only env reads.

export type Result<T> = { ok: true; data: T } | { ok: false; reason: "not_configured" | "error"; detail: string };

const TZ = "Europe/London";
const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

export function periodDays(dayCount: number, now = new Date()) {
  const days: string[] = [];
  for (let i = dayCount - 1; i >= 0; i--) days.push(dayKey(new Date(now.getTime() - i * 86400000)));
  return days;
}
/* the period is whole London days, today included; fetch from a little before the first one */
const fetchFrom = (days: number) => new Date(Date.now() - (days + 1) * 86400000).toISOString();
const inPeriod = (days: number) => { const set = new Set(periodDays(days)); return (iso: string) => set.has(dayKey(new Date(iso))); };

/* ---------- Supabase REST, paged ---------- */
async function selectAll<T>(base: string, key: string, table: string, query: string, cap = 100000): Promise<T[]> {
  const out: T[] = [];
  const page = 1000;
  for (let offset = 0; offset < cap; offset += page) {
    const res = await fetch(`${base}/rest/v1/${table}?${query}&limit=${page}&offset=${offset}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`${table}: ${res.status} ${(await res.text()).slice(0, 160)}`);
    const rows = (await res.json()) as T[];
    out.push(...rows);
    if (rows.length < page) break;
  }
  return out;
}

const workshop = () => ({
  url: process.env.FT_SUPABASE_URL || "https://imbhdffupsfehifcbdfb.supabase.co",
  key: process.env.FT_SUPABASE_SERVICE_KEY || "",
});

/* ---------- names ---------- */
export const WORLDS: { id: string; name: string; stops: { id: string; name: string; skill: string }[] }[] = [
  { id: "market", name: "Market Street", stops: [
    { id: "toys", name: "Toy stall", skill: "Counting to 10" },
    { id: "mango", name: "Mango stall", skill: "Counting out, checking, parts of a number" },
    { id: "puff", name: "Puff-puff", skill: "Sharing fairly, more and fewer" },
  ] },
  { id: "farm", name: "Grandma's Farm", stops: [
    { id: "grow", name: "Bean garden", skill: "What plants need" },
    { id: "cycle", name: "Life cycles", skill: "Life cycles in order" },
    { id: "feed", name: "Feeding time", skill: "What animals eat, living and not living" },
  ] },
  { id: "tech", name: "Computer Village", stops: [
    { id: "robot", name: "Code Bolt", skill: "Step-by-step instructions" },
    { id: "bug", name: "Fix the bug", skill: "Finding and fixing mistakes in code" },
    { id: "circuit", name: "Light it up", skill: "Simple circuits" },
  ] },
  { id: "build", name: "Builders' Yard", stops: [
    { id: "float", name: "Float or sink", skill: "Predicting, testing and sorting" },
    { id: "bridge", name: "Bridge builder", skill: "Measuring and fitting lengths" },
    { id: "strong", name: "Strong shapes", skill: "Height, and why triangles are strong" },
  ] },
  { id: "adire", name: "Adire Workshop", stops: [
    { id: "pattern", name: "Stamp the cloth", skill: "Repeating patterns" },
    { id: "measure", name: "Measure ribbons", skill: "Measuring length with units" },
    { id: "shapes", name: "Shape kites", skill: "Shapes, sides and symmetry" },
  ] },
];

export const CHANNEL_NAMES: Record<string, string> = {
  web: "Web game (Netlify)", site: "motionplaylabs.com", "app-android": "Android app", "app-firetv": "Fire TV app",
  "app-tizen": "Samsung TV app", "app-webos": "LG TV app", crazygames: "CrazyGames", gamedistribution: "GameDistribution",
  poki: "Poki", coolmath: "Coolmath Games", other: "Other websites", unknown: "Unknown",
};
export const DEVICE_NAMES: Record<string, string> = { phone: "Phone", tablet: "Tablet", computer: "Computer", tv: "TV", unknown: "Unknown" };
export const INPUT_NAMES: Record<string, string> = { touch: "Touch", mouse: "Mouse", keys: "Remote or keyboard", pad: "Game controller", none: "No input", unknown: "Unknown" };

/* the device's time zone stands in for country; zones not listed show as their region */
const ZONE_COUNTRY: Record<string, string> = {
  "Europe/London": "GB", "Europe/Belfast": "GB", "Europe/Dublin": "IE", "Africa/Lagos": "NG", "Africa/Accra": "GH",
  "Africa/Nairobi": "KE", "Africa/Johannesburg": "ZA", "Africa/Cairo": "EG", "Africa/Casablanca": "MA", "Africa/Abidjan": "CI",
  "Africa/Kampala": "UG", "Africa/Dar_es_Salaam": "TZ", "Africa/Kigali": "RW", "Africa/Douala": "CM", "Africa/Addis_Ababa": "ET",
  "Asia/Qatar": "QA", "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Kuwait": "KW", "Asia/Bahrain": "BH", "Asia/Muscat": "OM",
  "Asia/Amman": "JO", "Asia/Beirut": "LB", "Asia/Baghdad": "IQ", "Asia/Jerusalem": "IL", "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Singapore": "SG", "Asia/Manila": "PH", "Asia/Tokyo": "JP",
  "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Madrid": "ES", "Europe/Rome": "IT", "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE", "Europe/Lisbon": "PT", "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK",
  "Europe/Warsaw": "PL", "Europe/Istanbul": "TR", "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US", "Pacific/Honolulu": "US",
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA", "America/Halifax": "CA",
  "America/Sao_Paulo": "BR", "America/Mexico_City": "MX", "America/Jamaica": "JM", "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU", "Pacific/Auckland": "NZ",
};
const regionNames = (() => { try { return new Intl.DisplayNames(["en-GB"], { type: "region" }); } catch { return null; } })();
export function countryName(code: string) {
  if (!code) return "Unknown";
  if (code.includes("/")) return code.split("/")[0].replace("America", "Americas") + " (other)";
  try { return regionNames?.of(code) || code; } catch { return code; }
}
const zoneToCountry = (tz: string) => ZONE_COUNTRY[tz] || (tz ? tz.split("/")[0] + "/" : "");

/* ---------- game play counts ---------- */
type EventRow = { created_at: string; session_id: string | null; event: string; world: string | null; activity: string | null; props: Record<string, unknown> | null };

export type Count = { key: string; label: string; n: number };
export type ActivityStat = {
  world: string; worldName: string; id: string; name: string; skill: string;
  starts: number; finishes: number; quits: number; firstTimeFinishes: number;
  medianMs: number | null; triesPerFinish: number | null; hintsPerFinish: number | null; commonQuitRound: number | null;
};
export type GameStats = {
  rows: number; sessions: number; played: number; startedActivity: number; finishedActivity: number;
  activitiesDone: number; festivalComplete: number; medianSessionMs: number | null; returningShare: number | null;
  daily: { day: string; sessions: number; done: number }[];
  funnel: Count[]; channels: Count[]; devices: Count[]; countries: Count[]; inputs: Count[]; versions: Count[]; heroes: Count[];
  activities: ActivityStat[]; firstEventAt: string | null;
};

const median = (a: number[]) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const str = (v: unknown, d = "unknown") => (typeof v === "string" && v ? v : d);
function tally(values: string[], names?: Record<string, string>, nameOf?: (k: string) => string): Count[] {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) || 0) + 1);
  return [...m.entries()].map(([key, n]) => ({ key, n, label: nameOf ? nameOf(key) : names?.[key] || key })).sort((a, b) => b.n - a.n);
}

export async function loadGame(days: number, includeTest = false): Promise<Result<GameStats>> {
  const { url, key } = workshop();
  if (!key) return { ok: false, reason: "not_configured", detail: "Set FT_SUPABASE_SERVICE_KEY in Vercel (Supabase project Workshop, secret key)." };
  try {
    const rows = await selectAll<EventRow>(url, key, "ft_events", `select=created_at,session_id,event,world,activity,props&created_at=gte.${encodeURIComponent(fetchFrom(days))}&order=id.asc`);
    const within = inPeriod(days);
    const kept = rows.filter((r) => within(r.created_at) && (includeTest || !["dev", "preview"].includes(str(r.props?.ch, ""))));
    const S = new Map<string, { ev: EventRow[] }>();
    for (const r of kept) {
      const id = r.session_id || "none";
      if (!S.has(id)) S.set(id, { ev: [] });
      S.get(id)!.ev.push(r);
    }
    const sess = [...S.values()].map(({ ev }) => {
      const first = ev[0], p = first.props || {};
      const has = (e: string) => ev.some((x) => x.event === e);
      const end = ev.filter((x) => x.event === "session_end");
      const endMs = Math.max(0, ...end.map((x) => num(x.props?.ms)));
      const span = new Date(ev[ev.length - 1].created_at).getTime() - new Date(first.created_at).getTime();
      const open = ev.find((x) => x.event === "open");
      const input = end.length ? str(end[end.length - 1].props?.input, "none") : "unknown";
      return {
        day: dayKey(new Date(first.created_at)), ch: str(p.ch), dev: str(p.dev), tz: str(p.tz, ""), v: str(p.v),
        open: has("open"), play: has("play"), world: has("world_open"), start: has("activity_start"), done: has("activity_done"),
        fest: ev.some((x) => x.event === "festival" && x.props?.all === true),
        ret: open ? open.props?.ret === true : null, ms: endMs || span, hasEnd: endMs > 0,
        doneN: ev.filter((x) => x.event === "activity_done").length,
        input: input.split("+").filter(Boolean),
      };
    });
    const daysList = periodDays(days);
    const daily = daysList.map((day) => ({ day, sessions: 0, done: 0 }));
    const dayIdx = new Map(daysList.map((d, i) => [d, i]));
    for (const s of sess) { const i = dayIdx.get(s.day); if (i != null) daily[i].sessions++; }
    for (const r of kept) if (r.event === "activity_done") { const i = dayIdx.get(dayKey(new Date(r.created_at))); if (i != null) daily[i].done++; }

    const n = (f: (s: (typeof sess)[number]) => boolean) => sess.filter(f).length;
    const funnel: Count[] = [
      { key: "open", label: "Opened the game", n: n((s) => s.open) },
      { key: "play", label: "Pressed Play", n: n((s) => s.play) },
      { key: "world", label: "Went into a place", n: n((s) => s.world) },
      { key: "start", label: "Started an activity", n: n((s) => s.start) },
      { key: "done", label: "Finished an activity", n: n((s) => s.done) },
    ];

    const activities: ActivityStat[] = [];
    for (const W of WORLDS) for (const st of W.stops) {
      const ev = kept.filter((r) => r.world === W.id && r.activity === st.id);
      const fin = ev.filter((r) => r.event === "activity_done");
      const quits = ev.filter((r) => r.event === "activity_quit");
      const qr = tally(quits.map((q) => String(num(q.props?.round) + 1)));
      activities.push({
        world: W.id, worldName: W.name, id: st.id, name: st.name, skill: st.skill,
        starts: ev.filter((r) => r.event === "activity_start").length,
        finishes: fin.length, quits: quits.length,
        firstTimeFinishes: fin.filter((r) => r.props?.replay !== true).length,
        medianMs: median(fin.map((r) => num(r.props?.ms)).filter((x) => x > 0)),
        triesPerFinish: fin.length ? fin.reduce((t, r) => t + num(r.props?.misses), 0) / fin.length : null,
        hintsPerFinish: fin.length ? fin.reduce((t, r) => t + num(r.props?.hints), 0) / fin.length : null,
        commonQuitRound: qr.length ? Number(qr[0].key) : null,
      });
    }
    const opened = sess.filter((s) => s.ret !== null);
    return {
      ok: true,
      data: {
        rows: kept.length, sessions: sess.length, played: n((s) => s.play), startedActivity: n((s) => s.start), finishedActivity: n((s) => s.done),
        activitiesDone: kept.filter((r) => r.event === "activity_done").length, festivalComplete: n((s) => s.fest),
        medianSessionMs: median(sess.filter((s) => s.hasEnd).map((s) => s.ms)),
        returningShare: opened.length ? opened.filter((s) => s.ret).length / opened.length : null,
        daily, funnel,
        channels: tally(sess.map((s) => s.ch), CHANNEL_NAMES),
        devices: tally(sess.map((s) => s.dev), DEVICE_NAMES),
        countries: tally(sess.map((s) => zoneToCountry(s.tz)), undefined, countryName),
        inputs: tally(sess.flatMap((s) => (s.input.length ? s.input : ["unknown"])), INPUT_NAMES),
        versions: tally(sess.map((s) => s.v)),
        heroes: tally(kept.filter((r) => r.event === "pick").map((r) => str(r.props?.hero)), { ada: "Ada", tobi: "Tobi", amina: "Amina" }),
        activities, firstEventAt: kept[0]?.created_at || null,
      },
    };
  } catch (e) {
    return { ok: false, reason: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

/* ---------- waitlist ---------- */
type WaitRow = { created_at: string; audience: string | null; country: string | null; email: string | null };
export type WaitStats = { total: number; inPeriod: number; parents: number; schools: number; daily: { day: string; n: number }[]; countries: Count[]; internalLeftOut: number };

export async function loadWaitlist(days: number): Promise<Result<WaitStats>> {
  const { url, key } = workshop();
  if (!key) return { ok: false, reason: "not_configured", detail: "Set FT_SUPABASE_SERVICE_KEY in Vercel." };
  try {
    const rows = await selectAll<WaitRow>(url, key, "ft_waitlist", "select=created_at,audience,country,email&order=created_at.asc");
    // our own test sign-ups use @motionplaylabs.com addresses; the address itself goes no further than this line
    const internal = (r: WaitRow) => (r.email || "").toLowerCase().endsWith("@motionplaylabs.com");
    const real = rows.filter((r) => !internal(r)).map(({ created_at, audience, country }) => ({ created_at, audience, country }));
    const recent = real.filter((r) => inPeriod(days)(r.created_at));
    const daysList = periodDays(days);
    const per = new Map(daysList.map((d) => [d, 0]));
    for (const r of recent) { const d = dayKey(new Date(r.created_at)); if (per.has(d)) per.set(d, per.get(d)! + 1); }
    return {
      ok: true,
      data: {
        total: real.length, inPeriod: recent.length,
        parents: real.filter((r) => r.audience === "parent").length, schools: real.filter((r) => r.audience === "school").length,
        daily: daysList.map((day) => ({ day, n: per.get(day) || 0 })),
        countries: tally(real.map((r) => (r.country || "").trim() || "Not given")),
        internalLeftOut: rows.length - real.length,
      },
    };
  } catch (e) {
    return { ok: false, reason: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

/* ---------- Season 2 sales ---------- */
type SaleRow = { created_at: string; amount_total: number | null; currency: string | null; livemode: boolean; founder_no: number | null; refunded_at: string | null; source: string | null };
export type SalesStats = { live: number; liveInPeriod: number; refunds: number; test: number; revenue: { currency: string; amount: number }[]; founders: number; sources: Count[] };

export async function loadSales(days: number): Promise<Result<SalesStats>> {
  const url = process.env.FT2_SUPABASE_URL || "https://kilypriuivfeftdzhhon.supabase.co";
  const key = process.env.FT2_SUPABASE_SERVICE_KEY || "";
  if (!key) return { ok: false, reason: "not_configured", detail: "Set FT2_SUPABASE_SERVICE_KEY in Vercel (Supabase project Festival Town, secret key)." };
  try {
    const rows = await selectAll<SaleRow>(url, key, "purchases", "select=created_at,amount_total,currency,livemode,founder_no,refunded_at,source&order=created_at.asc");
    const live = rows.filter((r) => r.livemode);
    const kept = live.filter((r) => !r.refunded_at);
    const within = inPeriod(days);
    const rev = new Map<string, number>();
    for (const r of kept) { const c = (r.currency || "?").toUpperCase(); rev.set(c, (rev.get(c) || 0) + num(r.amount_total)); }
    return {
      ok: true,
      data: {
        live: kept.length, liveInPeriod: kept.filter((r) => within(r.created_at)).length,
        refunds: live.length - kept.length, test: rows.length - live.length,
        revenue: [...rev.entries()].map(([currency, amount]) => ({ currency, amount })),
        founders: kept.filter((r) => r.founder_no != null).length,
        sources: tally(kept.map((r) => r.source || "web")),
      },
    };
  } catch (e) {
    return { ok: false, reason: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

/* ---------- website traffic (Vercel Web Analytics) ---------- */
export type SiteStats = { views: number; daily: { day: string; n: number }[]; pages: Count[]; countries: Count[]; events: Count[] };

type VRow = Record<string, unknown>;
/* the aggregate endpoints return one row per group; the count sits in a numeric field */
const vcount = (r: VRow) => {
  for (const k of ["count", "total", "pageViews", "pageviews", "visits", "events", "value"]) if (typeof r[k] === "number") return r[k] as number;
  for (const v of Object.values(r)) if (typeof v === "number") return v;
  return 0;
};

export async function loadSite(days: number): Promise<Result<SiteStats>> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN, project = process.env.VERCEL_PROJECT_ID, team = process.env.VERCEL_TEAM_ID;
  if (!token || !project) return { ok: false, reason: "not_configured", detail: "Set VERCEL_ANALYTICS_TOKEN and VERCEL_PROJECT_ID (and VERCEL_TEAM_ID if the project is in a team) in Vercel." };
  const until = new Date(), since = new Date(fetchFrom(days));
  const get = async (kind: "visits" | "events", by: string[], limit: number, filter?: string) => {
    const q = new URLSearchParams({ projectId: project, since: since.toISOString(), until: until.toISOString(), limit: String(limit) });
    for (const b of by) q.append("by", b);
    if (team) q.set("teamId", team);
    if (filter) q.set("filter", filter);
    const res = await fetch(`https://api.vercel.com/v1/query/web-analytics/${kind}/aggregate?${q}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) throw new Error(`Vercel ${kind} ${by.join(",")}: ${res.status} ${(await res.text()).slice(0, 160)}`);
    const body = (await res.json()) as { data?: VRow[] };
    return Array.isArray(body.data) ? body.data : [];
  };
  try {
    const [byDay, byPath, byCountry, byEvent] = await Promise.all([
      get("visits", ["day"], 100),
      get("visits", ["requestPath"], 10),
      get("visits", ["country"], 10),
      get("events", ["eventName"], 20, "startswith(eventName, 'ft_')"),
    ]);
    const daysList = periodDays(days);
    const per = new Map(daysList.map((d) => [d, 0]));
    for (const r of byDay) { const t = typeof r.timestamp === "string" ? r.timestamp : ""; const d = t ? dayKey(new Date(t)) : ""; if (per.has(d)) per.set(d, per.get(d)! + vcount(r)); }
    const list = (rows: VRow[], field: string, nameOf?: (k: string) => string): Count[] =>
      rows.map((r) => { const k = String(r[field] ?? "Other"); return { key: k, label: nameOf ? nameOf(k) : k, n: vcount(r) }; }).sort((a, b) => b.n - a.n);
    const daily = daysList.map((day) => ({ day, n: per.get(day) || 0 }));
    return {
      ok: true,
      data: {
        views: daily.reduce((t, d) => t + d.n, 0), daily,
        pages: list(byPath, "requestPath"), countries: list(byCountry, "country", countryName), events: list(byEvent, "eventName", (k) => SITE_EVENTS[k] || k),
      },
    };
  } catch (e) {
    return { ok: false, reason: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

export const SITE_EVENTS: Record<string, string> = {
  ft_play_now: "Play button clicks", ft_waitlist: "Waitlist sign-ups", ft_video_start: "Film started", ft_video_complete: "Film watched to the end",
  ft_film_open: "Film opened", ft_pick: "Picked a friend on the page", ft_jump: "Jumped to a section", ft_taster_open: "Taster opened",
  ft_taster_go: "Taster played", ft_taster_win: "Taster finished",
};
