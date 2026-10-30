import { NextResponse } from "next/server";
import { consentText } from "@/content/festival-town";

// Festival Town waitlist. Stores the lead in Supabase (table ft_waitlist, insert-only through the
// publishable key, so this route can never read it back) and sends a welcome email through Resend.
// Parents and schools are one table with an `audience` column; (email, audience) is unique.

const SUPABASE_URL = process.env.FT_SUPABASE_URL || "https://imbhdffupsfehifcbdfb.supabase.co";
const SUPABASE_KEY = process.env.FT_SUPABASE_KEY || "sb_publishable_72d5o8iR-PD3jvL83XBvkA_HGy66fZA";

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Audience = "parent" | "school";

function welcome(audience: Audience, name: string) {
  const hi = name ? `Hi ${name},` : "Hi,";
  const play = "https://festival-town.netlify.app/";
  const page = "https://motionplaylabs.com/festival-town/";
  if (audience === "school") {
    const text = `${hi}

Thanks for joining the Festival Town school list.

Festival Town is live now: five places, three voiced activities in each, covering counting, growing, coding, building and making. It runs in any browser with nothing to install: ${play}

Teacher notes, class sets and a way to see how a class is getting on are not built yet. You are on the list, so you will hear first when they are, and when we run school pilots.

If you would like to talk about a pilot before then, reply to this email.

Justin Ukaegbu
MotionPlay Labs
${page}

You asked for these emails on ${page}. To stop them, reply with "unsubscribe".`;
    return { subject: "Festival Town for schools: you're on the list", text, html: toHtml(text) };
  }
  const text = `${hi}

Thanks for signing up for Festival Town updates.

The game is free and live now. Choose Ada, Tobi or Amina and help the town get ready for the festival: ${play}

It works on a phone, tablet or laptop in the browser. There is no account and nothing to install, and progress is saved on the device you play on.

You will get one email when a new world is ready, and not much otherwise.

Justin Ukaegbu
MotionPlay Labs
${page}

You asked for these emails on ${page}. To stop them, reply with "unsubscribe".`;
  return { subject: "Welcome to Festival Town", text, html: toHtml(text) };
}

function toHtml(text: string) {
  const paras = text.split("\n\n").map((p) => `<p style="margin:0 0 16px">${esc(p).replace(/\n/g, "<br>")}</p>`);
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#2b1b2e;max-width:560px">${paras.join("")}</div>`.replace(
    /(https:\/\/[^\s<]+)/g,
    '<a href="$1" style="color:#6a35d9">$1</a>',
  );
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many sign-ups from this connection. Try again in ten minutes." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "The form data could not be read." }, { status: 400 });
  }

  // Honeypot: real people never fill this field.
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const audience = body.audience === "school" ? "school" : body.audience === "parent" ? "parent" : null;
  if (!audience) return NextResponse.json({ error: "Choose parent or school." }, { status: 400 });

  const email = str(body.email, 200).toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Check the email address." }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ error: "Tick the box so we can email you." }, { status: 400 });

  const row = {
    audience,
    email,
    first_name: null,
    child_age: null,
    school_name: audience === "school" ? str(body.school_name, 160) || null : null,
    contact_name: audience === "school" ? str(body.contact_name, 120) || null : null,
    country: audience === "school" ? str(body.country, 80) || null : null,
    role: audience === "school" ? str(body.role, 80) || null : null,
    consent: true,
    consent_text: consentText[audience],
    source: "motionplaylabs.com/festival-town",
  };
  if (audience === "school" && !row.school_name) return NextResponse.json({ error: "Add the school's name." }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/ft_waitlist`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (res.status === 409) {
    // Already on the list for this audience. Say so, send nothing twice.
    return NextResponse.json({ ok: true, duplicate: true });
  }
  if (!res.ok) {
    return NextResponse.json({ error: "The sign-up did not save. Try again in a minute." }, { status: 502 });
  }

  // Welcome email and a note to the studio. The sign-up is already saved, so a mail failure is not an error for the visitor.
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const from = process.env.FT_FROM || "Festival Town <hello@motionplaylabs.com>";
    const notify = process.env.FT_NOTIFY || process.env.CONTACT_TO || "hello@motionplaylabs.com";
    const w = welcome(audience, row.first_name || row.contact_name || "");
    const headers = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
    await Promise.allSettled([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({ from, to: [email], subject: w.subject, text: w.text, html: w.html, tags: [{ name: "product", value: "festival-town" }, { name: "audience", value: audience }] }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({
          from,
          to: [notify],
          reply_to: email,
          subject: `Festival Town waitlist: ${audience === "school" ? `school, ${row.school_name}` : "parent"}`,
          text: Object.entries(row)
            .filter(([, v]) => v !== null && v !== false)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n"),
        }),
      }),
    ]);
  }

  return NextResponse.json({ ok: true });
}
