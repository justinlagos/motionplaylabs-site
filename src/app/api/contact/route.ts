import { NextResponse } from "next/server";

// Sends an enquiry to the studio inbox through Resend (motionplaylabs.com is verified there).
// TODO: also write each enquiry to the MPL HQ pipeline table once that database exists.

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many messages from this connection. Try again in ten minutes." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "The form data could not be read." }, { status: 400 });
  }

  // Honeypot: real people never fill this field.
  if (str(body.company_site, 200)) return NextResponse.json({ ok: true });

  const f = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    organisation: str(body.organisation, 200),
    kind: str(body.kind, 60),
    market: str(body.market, 40),
    budget: str(body.budget, 60),
    timeline: str(body.timeline, 60),
    link: str(body.link, 500),
    message: str(body.message, 5000),
  };

  if (!f.name || !f.message) return NextResponse.json({ error: "Add your name and a short description of the job." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return NextResponse.json({ error: "Check the email address." }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "The form is not connected yet." }, { status: 503 });

  const to = process.env.CONTACT_TO || "hello@motionplaylabs.com";
  const from = process.env.CONTACT_FROM || "MotionPlay Labs <hello@motionplaylabs.com>";
  const rows = Object.entries(f)
    .filter(([k]) => k !== "message")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td>${esc(v || "-")}</td></tr>`)
    .join("");
  const html = `<table>${rows}</table><p style="white-space:pre-wrap">${esc(f.message)}</p>`;
  const text = `${Object.entries(f).map(([k, v]) => `${k}: ${v || "-"}`).join("\n")}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: f.email,
      subject: `Enquiry: ${f.kind || "General"} from ${f.name}${f.organisation ? `, ${f.organisation}` : ""}`,
      html,
      text,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "The message did not send." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
