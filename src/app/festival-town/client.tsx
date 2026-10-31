"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState } from "react";
import { consentText, festivalTown, schoolRoles } from "@/content/festival-town";
import { setPaused, useMotionPaused } from "@/lib/motion";

// Static previews have no server, so the form says so instead of pretending to send.
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

// Which ad brought this visitor: utm_source.utm_campaign.utm_content from the landing URL,
// kept for the tab only. Sent with Play clicks, store clicks and signups so results can be
// compared per ad. No cookies, nothing stored beyond this tab.
const SRC_KEY = "ft-src";
const clean = (v: string | null) =>
  (v || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 40);

export function adSource(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(SRC_KEY) || "";
  } catch {
    return "";
  }
}

function captureAdSource() {
  const q = new URLSearchParams(window.location.search);
  const parts = [clean(q.get("utm_source")), clean(q.get("utm_campaign")), clean(q.get("utm_content"))];
  if (!parts[0]) return;
  try {
    window.sessionStorage.setItem(SRC_KEY, parts.filter(Boolean).join("."));
  } catch {
    // storage blocked: clicks are still counted, just without the ad name
  }
}

/** Page root. Mirrors the site's motion switch onto the page so CSS can stop every loop. */
export function MotionState({ children }: { children: React.ReactNode }) {
  const paused = useMotionPaused();
  useEffect(captureAdSource, []);
  return (
    <div className="ftx" data-ft-motion={paused ? "paused" : "playing"}>
      {children}
    </div>
  );
}

export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.6-6.8a1 1 0 0 0 0-1.8L9.6 4.3C8.9 3.9 8 4.4 8 5.2z" />
  </svg>
);

/** The Play button: straight into the game, and the click is counted. */
export function PlayLink({ place, className = "ftx-btn", children = "Play free now" }: { place: string; className?: string; children?: React.ReactNode }) {
  return (
    <a className={className} href={festivalTown.playUrl} target="_blank" rel="noopener" onClick={() => track("ft_play_now", { place, src: adSource() })}>
      <PlayIcon />
      <span>{children}</span>
    </a>
  );
}

/** In-page link. Optionally tells the signup form which audience to show. */
export function JumpLink({ to, audience, className = "ftx-btn is-ghost", children }: { to: string; audience?: "parent" | "school"; className?: string; children: React.ReactNode }) {
  return (
    <a
      className={className}
      href={`#${to}`}
      onClick={(e) => {
        const el = document.getElementById(to);
        if (!el) return;
        e.preventDefault();
        if (audience) window.dispatchEvent(new CustomEvent("ft-audience", { detail: audience }));
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", `#${to}`);
        track("ft_jump", { to, audience: audience ?? "" });
      }}
    >
      {children}
    </a>
  );
}

/** Pause or play every looping animation on the page (WCAG 2.2.2). Compact is the round icon in the header. */
export function MotionSwitch({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const paused = useMotionPaused();
  const label = paused ? "Play motion" : "Pause motion";
  return (
    <button
      type="button"
      className={`ftx-motion${compact ? " is-compact" : ""} ${className}`}
      aria-pressed={paused}
      aria-label={compact ? "Pause motion" : undefined}
      title={compact ? label : undefined}
      onClick={() => setPaused(!paused)}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true">
        {paused ? <path d="M6 4.5v11l9-5.5z" fill="currentColor" /> : <path d="M5.5 4h3v12h-3zM11.5 4h3v12h-3z" fill="currentColor" />}
      </svg>
      {!compact && label}
    </button>
  );
}

/** Header that sits on the sky, then gets a solid backing once the page scrolls. */
export function TownHeader({ children }: { children: React.ReactNode }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className="ftx-header" data-solid={solid ? "yes" : "no"}>
      {children}
    </header>
  );
}

/**
 * The promotional film. Nothing loads until the viewer presses play. Phones get the 720p file.
 * Starts and completions are counted once per page view, with no personal data.
 */
function FilmVideo({ autoPlay = false }: { autoPlay?: boolean }) {
  const { src, srcSmall, captions, poster, title } = festivalTown.film;
  const ref = useRef<HTMLVideoElement>(null);
  const sent = useRef({ start: false, done: false });
  useEffect(() => {
    if (autoPlay) ref.current?.play().catch(() => undefined);
  }, [autoPlay]);
  return (
    <video
      ref={ref}
      poster={poster}
      controls
      playsInline
      preload="auto"
      aria-label={`Film: ${title}`}
      onPlay={() => {
        if (sent.current.start) return;
        sent.current.start = true;
        track("ft_video_start");
      }}
      onEnded={() => {
        if (sent.current.done) return;
        sent.current.done = true;
        track("ft_video_complete");
      }}
    >
      {srcSmall && <source src={srcSmall} type="video/mp4" media="(max-width: 900px)" />}
      <source src={src} type="video/mp4" />
      {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
    </video>
  );
}

/** "Watch the film" button that opens the film in a dialog. */
export function FilmButton({ className = "ftx-btn is-ghost", children = "Watch the film" }: { className?: string; children?: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  if (!festivalTown.film.src) return null;
  const close = () => {
    dialog.current?.close();
  };
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
          track("ft_film_open");
        }}
      >
        <span className="ftx-btn-ring" aria-hidden="true">
          <PlayIcon />
        </span>
        <span>{children}</span>
        <small>1 min 14</small>
      </button>
      <dialog
        ref={dialog}
        className="ftx-film-dialog"
        aria-label={festivalTown.film.title}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="ftx-film-frame">{open && <FilmVideo autoPlay />}</div>
        <p className="ftx-film-credit">{festivalTown.film.credit}</p>
        <button type="button" className="ftx-film-close" onClick={close}>
          Close
        </button>
      </dialog>
    </>
  );
}

/** The film inline: a poster with a play button until pressed. */
export function Film() {
  const { src, poster, posterSmall, title } = festivalTown.film;
  const [playing, setPlaying] = useState(false);
  if (!src) return null;
  return (
    <div className="ftx-player">
      {playing ? (
        <FilmVideo autoPlay />
      ) : (
        <>
          <img src={poster} srcSet={`${posterSmall} 900w, ${poster} 1600w`} sizes="(max-width: 900px) 100vw, 60vw" alt="" loading="lazy" decoding="async" width={1600} height={900} />
          <button type="button" className="ftx-player-play" onClick={() => setPlaying(true)} aria-label={`Play the film: ${title}`}>
            <span className="ftx-player-disc">
              <PlayIcon />
            </span>
            <span className="ftx-player-label">
              Watch the film
              <small>1 min 14</small>
            </span>
          </button>
        </>
      )}
    </div>
  );
}

type Audience = "parent" | "school";
type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string; duplicate?: boolean };

/** One form, two audiences. Posts to /api/festival-town/waitlist/, which stores the lead and sends the welcome email. */
export function WaitlistForm({ initial = "parent" }: { initial?: Audience }) {
  const [audience, setAudience] = useState<Audience>(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(false);
    setStatus({ kind: "idle" });
  }, [audience]);

  useEffect(() => {
    const onPick = (e: Event) => {
      const a = (e as CustomEvent<Audience>).detail;
      if (a === "parent" || a === "school") {
        setAudience(a);
        setStatus({ kind: "idle" });
      }
    };
    window.addEventListener("ft-audience", onPick);
    if (window.location.hash === "#waitlist-school") setAudience("school");
    return () => window.removeEventListener("ft-audience", onPick);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (PREVIEW) {
      setStatus({ kind: "error", message: "This is a preview build: the form is not connected." });
      return;
    }
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/festival-town/waitlist/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, audience, consent, consent_text: consentText[audience], src: adSource() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; duplicate?: boolean };
      if (!res.ok) throw new Error(body.error || "That did not go through. Try again in a minute.");
      form.reset();
      setConsent(false);
      track("ft_waitlist", { audience, src: adSource() });
      setStatus({ kind: "sent", duplicate: !!body.duplicate });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "That did not go through. Try again in a minute." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="ftx-form is-done" role="status">
        <img className="ftx-form-sprout" src="/festival-town/prop/pl_flower.webp" alt="" width={142} height={197} loading="lazy" />
        <h3>{status.duplicate ? "You're already on the list" : audience === "school" ? "You're on the school list" : "You're on the list"}</h3>
        <p>
          {status.duplicate
            ? "That address is already signed up, so nothing has changed."
            : audience === "school"
              ? "We will write when there is something for schools: pilots first, then class tools."
              : "You will hear from us when a new world is ready, and not much otherwise."}
        </p>
        <PlayLink place="waitlist-done">Play Festival Town</PlayLink>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="ftx-form" onSubmit={onSubmit} noValidate={false}>
      <div className="ftx-seg" role="group" aria-label="I am a">
        <button type="button" disabled={sending} aria-pressed={audience === "parent"} onClick={() => setAudience("parent")}>
          Parent or carer
        </button>
        <button type="button" disabled={sending} aria-pressed={audience === "school"} onClick={() => setAudience("school")}>
          School or nursery
        </button>
      </div>

      {audience === "parent" ? (
        <div className="ftx-field">
          <label htmlFor="ft-email">Your email</label>
          <input id="ft-email" name="email" type="email" required autoComplete="email" maxLength={200} inputMode="email" placeholder="you@example.com" />
        </div>
      ) : (
        <>
          <div className="ftx-row">
            <div className="ftx-field">
              <label htmlFor="ft-semail">Contact email</label>
              <input id="ft-semail" name="email" type="email" required autoComplete="email" maxLength={200} inputMode="email" />
            </div>
            <div className="ftx-field">
              <label htmlFor="ft-school">School name</label>
              <input id="ft-school" name="school_name" required autoComplete="organization" maxLength={160} />
            </div>
          </div>
          <div className="ftx-row">
            <div className="ftx-field">
              <label htmlFor="ft-contact">
                Your name <small>optional</small>
              </label>
              <input id="ft-contact" name="contact_name" autoComplete="name" maxLength={120} />
            </div>
            <div className="ftx-field">
              <label htmlFor="ft-country">
                Country or city <small>optional</small>
              </label>
              <input id="ft-country" name="country" autoComplete="country-name" maxLength={80} />
            </div>
          </div>
          <div className="ftx-field">
            <label htmlFor="ft-role">
              Your role <small>optional</small>
            </label>
            <select id="ft-role" name="role" defaultValue="">
              <option value="">Choose</option>
              {schoolRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <label className="ftx-hp" aria-hidden="true">
        Leave this empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="ftx-consent">
        <input type="checkbox" name="consent_box" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{consentText[audience]}</span>
      </label>

      <button type="submit" className="ftx-btn is-purple ftx-form-submit" disabled={sending}>
        <span>{sending ? "Sending…" : audience === "school" ? "Join the school list" : "Send me new adventures"}</span>
      </button>

      <p className={`ftx-status${status.kind === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
        {status.kind === "error" ? status.message : ""}
      </p>

      <p className="ftx-privacy">
        Signups are stored with Supabase and emails are sent through Resend. We never ask for children’s details. Reply to any email or write to hello@motionplaylabs.com to unsubscribe or have your
        details deleted. <a href="/legal/privacy/">Website privacy notice</a>.
      </p>
    </form>
  );
}

/** A store badge or link that counts the click (and which ad brought the visitor). */
export function StoreLink({ href, store, className, label, children }: { href: string; store: string; className: string; label?: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className} aria-label={label} onClick={() => track("ft_store", { store, src: adSource() })}>
      {children}
    </a>
  );
}
