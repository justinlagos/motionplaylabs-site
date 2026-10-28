"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState } from "react";
import { ageRanges, consentText, festivalTown, schoolRoles } from "@/content/festival-town";
import { useMotionPaused } from "@/lib/motion";
import { scrollToY } from "@/lib/scroll";

// Static previews have no server, so the form says so instead of pretending to send.
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

/** Mirrors the site's "Pause motion" switch onto the page so blinks and drifting props stop too. */
export function MotionState({ children }: { children: React.ReactNode }) {
  const paused = useMotionPaused();
  return (
    <div className="ft" data-ft-motion={paused ? "paused" : "playing"}>
      {children}
    </div>
  );
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

/** The Play button: goes straight into the game, and counts the click. */
export function PlayLink({ place, className = "ft-btn", children = "Play now" }: { place: string; className?: string; children?: React.ReactNode }) {
  return (
    <a
      className={className}
      href={festivalTown.playUrl}
      target="_blank"
      rel="noopener"
      onClick={() => track("ft_play_now", { place })}
    >
      <PlayIcon />
      {children}
    </a>
  );
}

/** An in-page link that scrolls under the inertial scroller instead of fighting it. */
export function JumpLink({ to, audience, className = "ft-btn-2", children }: { to: string; audience?: "parent" | "school"; className?: string; children: React.ReactNode }) {
  return (
    <a
      className={className}
      href={`#${to}`}
      onClick={(e) => {
        const el = document.getElementById(to);
        if (!el) return;
        e.preventDefault();
        if (audience) window.dispatchEvent(new CustomEvent("ft-audience", { detail: audience }));
        const top = el.getBoundingClientRect().top + window.scrollY - 72;
        scrollToY(top, 1);
        history.replaceState(null, "", `#${to}`);
        track("ft_jump", { to, audience: audience ?? "" });
      }}
    >
      {children}
    </a>
  );
}

/** The promotional film. Without a src it shows the poster and says the film is coming. */
export function Film() {
  const { src, poster, posterSmall, title } = festivalTown.film;
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const paused = useMotionPaused();

  useEffect(() => {
    if (playing && ref.current) ref.current.play().catch(() => setPlaying(false));
  }, [playing]);

  if (!src) {
    return (
      <div className="ft-player" aria-label={`${title} (film in production)`}>
        <img src={poster} srcSet={`${posterSmall} 900w, ${poster} 1600w`} sizes="(max-width: 900px) 100vw, 1360px" alt="The festival square in Festival Town, with the stage set up" loading="lazy" decoding="async" />
        <span className="ft-player-soon">Film in production</span>
      </div>
    );
  }

  return (
    <div className="ft-player">
      {playing ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          onPlay={() => track("ft_video_start")}
          onEnded={() => track("ft_video_complete")}
        />
      ) : (
        <>
          <img src={poster} srcSet={`${posterSmall} 900w, ${poster} 1600w`} sizes="(max-width: 900px) 100vw, 1360px" alt="" loading="lazy" decoding="async" />
          <button type="button" className="ft-player-play" onClick={() => setPlaying(true)} aria-label={`Play the film: ${title}`}>
            <span>
              <PlayIcon />
            </span>
          </button>
          {paused && <span className="ft-player-soon">Motion is paused</span>}
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
    const onPick = (e: Event) => {
      const a = (e as CustomEvent<Audience>).detail;
      if (a === "parent" || a === "school") setAudience(a);
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
        body: JSON.stringify({ ...data, audience, consent, consent_text: consentText[audience] }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; duplicate?: boolean };
      if (!res.ok) throw new Error(body.error || "That did not go through.");
      form.reset();
      setConsent(false);
      track("ft_waitlist", { audience, duplicate: body.duplicate ? "yes" : "no" });
      setStatus({ kind: "sent", duplicate: !!body.duplicate });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "That did not go through." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="ft-form" role="status">
        <div className="ft-done">
          <h3>{status.duplicate ? "You're already on the list" : audience === "school" ? "You're on the school list" : "You're on the list"}</h3>
          <p>
            {status.duplicate
              ? "That address is already signed up, so nothing has changed. The welcome email went out the first time."
              : audience === "school"
                ? "A welcome email is on its way. We will write when there is something for schools: pilots first, then class tools."
                : "A welcome email is on its way. You will hear from us when a new world is ready, and not much otherwise."}
          </p>
          <PlayLink place="waitlist-done" className="ft-btn is-yellow">
            Play while you wait
          </PlayLink>
        </div>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="ft-form" onSubmit={onSubmit}>
      <div className="ft-seg" role="group" aria-label="I am a">
        <button type="button" aria-pressed={audience === "parent"} onClick={() => setAudience("parent")}>
          Parent or carer
        </button>
        <button type="button" aria-pressed={audience === "school"} onClick={() => setAudience("school")}>
          School
        </button>
      </div>

      {audience === "parent" ? (
        <>
          <div className="ft-field">
            <label htmlFor="ft-email">
              Email<small>required</small>
            </label>
            <input id="ft-email" name="email" type="email" required autoComplete="email" maxLength={200} inputMode="email" />
          </div>
          <div className="ft-row">
            <div className="ft-field">
              <label htmlFor="ft-first">
                First name<small>optional</small>
              </label>
              <input id="ft-first" name="first_name" autoComplete="given-name" maxLength={80} />
            </div>
            <div className="ft-field">
              <label htmlFor="ft-age">
                Child's age<small>optional</small>
              </label>
              <select id="ft-age" name="child_age" defaultValue="">
                <option value="">Choose</option>
                {ageRanges.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="ft-row">
            <div className="ft-field">
              <label htmlFor="ft-semail">
                Contact email<small>required</small>
              </label>
              <input id="ft-semail" name="email" type="email" required autoComplete="email" maxLength={200} inputMode="email" />
            </div>
            <div className="ft-field">
              <label htmlFor="ft-school">
                School<small>required</small>
              </label>
              <input id="ft-school" name="school_name" required autoComplete="organization" maxLength={160} />
            </div>
          </div>
          <div className="ft-row">
            <div className="ft-field">
              <label htmlFor="ft-contact">
                Your name<small>optional</small>
              </label>
              <input id="ft-contact" name="contact_name" autoComplete="name" maxLength={120} />
            </div>
            <div className="ft-field">
              <label htmlFor="ft-country">
                Country or city<small>optional</small>
              </label>
              <input id="ft-country" name="country" autoComplete="country-name" maxLength={80} />
            </div>
          </div>
          <div className="ft-field">
            <label htmlFor="ft-role">
              Your role<small>optional</small>
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

      <label className="ft-hp" aria-hidden="true">
        Leave this empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="ft-consent">
        <input type="checkbox" name="consent_box" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{consentText[audience]}</span>
      </label>

      <div className="ft-actions">
        <button type="submit" className="ft-btn" disabled={sending}>
          {sending ? "Sending" : audience === "school" ? "Join the school waitlist" : "Join the waitlist"}
        </button>
      </div>

      <p className={`ft-status${status.kind === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
        {status.kind === "error" ? status.message : ""}
      </p>

      <p className="ft-privacy">
        We keep your email and the details above, nothing about your child, and we do not pass them on. Every email has an unsubscribe link, and you can ask us to delete your details at hello@motionplaylabs.com.
      </p>
    </form>
  );
}
