"use client";

import { useState } from "react";
import { site } from "@/content/site";

const kinds = ["Identity", "Campaign", "Report or publication", "Event", "Website", "Product", "Team session", "Something else"];
const budgets = ["Under £2,500", "£2,500 to £10,000", "£10,000 to £25,000", "More than £25,000", "Naira budget, details below", "Not sure yet"];
const timelines = ["Within a month", "In one to three months", "Later than that", "Not sure yet"];

// Static previews have no server, so the form says so instead of pretending to send.
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (PREVIEW) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "The message did not send.");
      form.reset();
      setStatus({ kind: "sent", message: "Sent. Justin will reply from hello@motionplaylabs.com." });
    } catch (err) {
      setStatus({
        kind: "error",
        message: `${err instanceof Error ? err.message : "The message did not send."} Email ${site.email} instead and nothing is lost.`,
      });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" required autoComplete="name" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" maxLength={200} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="organisation">Organisation</label>
        <input id="organisation" name="organisation" autoComplete="organization" maxLength={200} />
      </div>
      <fieldset className="field">
        <legend>What do you need?</legend>
        <div className="choices">
          {kinds.map((k, i) => (
            <label key={k}>
              <input type="radio" name="kind" value={k} required={i === 0} />
              {k}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-row">
        <div className="field">
          <label htmlFor="market">Market</label>
          <select id="market" name="market" defaultValue="UK">
            <option>UK</option>
            <option>Nigeria</option>
            <option>Both</option>
            <option>Somewhere else</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">Budget</label>
          <select id="budget" name="budget" defaultValue="Not sure yet">
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="timeline">When</label>
          <select id="timeline" name="timeline" defaultValue="Not sure yet">
            {timelines.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="link">Link to your current material (optional)</label>
          <input id="link" name="link" type="url" inputMode="url" placeholder="https://" maxLength={500} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Tell us about the job</label>
        <textarea id="message" name="message" required maxLength={5000} />
      </div>
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="company_site">Leave this empty</label>
        <input id="company_site" name="company_site" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="form-note">
        We use these details only to reply. See the <a href="/legal/privacy/">privacy notice</a>.
      </p>
      {PREVIEW ? (
        <p className="form-status">This preview does not send messages. Email {site.email}.</p>
      ) : (
        <p className={`form-status${status.kind === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
          {status.message}
        </p>
      )}
      <div>
        <button className="button is-solid" type="submit" disabled={PREVIEW || status.kind === "sending"}>
          {status.kind === "sending" ? "Sending" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
