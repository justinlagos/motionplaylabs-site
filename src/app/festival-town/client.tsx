"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState } from "react";
import { consentText, festivalTown, heroes, schoolRoles } from "@/content/festival-town";
import { useMotionPaused } from "@/lib/motion";
import { scrollToY } from "@/lib/scroll";
import { Character } from "./Character";

// Static previews have no server, so the form says so instead of pretending to send.
const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";

/** Mirrors the site's "Pause motion" switch onto the page, and runs the reveal observer. */
export function MotionState({ children }: { children: React.ReactNode }) {
  const paused = useMotionPaused();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".ft-reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="ft ft-redesign" data-ft-motion={paused ? "paused" : "playing"}>
      {children}
    </div>
  );
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

/** The Play button: straight into the game, and the click is counted. */
export function PlayLink({ place, className = "ft-btn", children = "Play now" }: { place: string; className?: string; children?: React.ReactNode }) {
  return (
    <a className={className} href={festivalTown.playUrl} target="_blank" rel="noopener" onClick={() => track("ft_play_now", { place })}>
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
        const top = el.getBoundingClientRect().top + window.scrollY - 60;
        scrollToY(top, 1);
        history.replaceState(null, "", `#${to}`);
        track("ft_jump", { to, audience: audience ?? "" });
      }}
    >
      {children}
    </a>
  );
}

type Kid = "ada" | "tobi" | "amina";

/** The game's own pick screen, on the page: tap a friend and they step forward with their line. */
export function Pick() {
  const [kid, setKid] = useState<Kid>("ada");
  const [swap, setSwap] = useState(0);
  const kids = heroes.filter((h) => h.id !== "zizi");
  const chosen = heroes.find((h) => h.id === kid)!;
  const zizi = heroes.find((h) => h.id === "zizi")!;

  const choose = (id: Kid) => {
    if (id === kid) return;
    setKid(id);
    setSwap((n) => n + 1);
    track("ft_pick", { kid: id });
  };

  return (
    <div className="ft-inner">
      <div className="ft-pick-left">
        <div className="ft-bubble" style={{ "--c": zizi.colour } as React.CSSProperties}>
          <img src="/festival-town/portrait/zizi.webp" alt="" width={74} height={74} />
          <div>
            <p className="ft-who">Zizi</p>
            <p className="ft-line">Meet your adventure crew. Tap a friend.</p>
          </div>
        </div>
        <h2>A friend for every adventure.</h2>
        <div className="ft-picks" role="group" aria-label="Choose a friend">
          {kids.map((h) => (
            <button
              key={h.id}
              type="button"
              className="ft-pick"
              aria-pressed={kid === h.id}
              onClick={() => choose(h.id as Kid)}
              style={{ "--c": h.colour } as React.CSSProperties}
            >
              <img src={`/festival-town/portrait/${h.id}.webp`} alt="" width={150} height={150} loading="lazy" />
              <span>{h.name}</span>
            </button>
          ))}
        </div>
        <p className="ft-lead ft-muted">{chosen.body}</p>
        <div className="ft-actions">
          <PlayLink place="pick" className="ft-btn is-purple">
            Choose your friend in the game
          </PlayLink>
        </div>
      </div>
      <div className="ft-pick-stage" aria-live="polite">
        <div className="ft-pick-ground" aria-hidden="true" />
        <div className="ft-bubble" style={{ "--c": chosen.colour } as React.CSSProperties}>
          <img src={`/festival-town/portrait/${chosen.id}.webp`} alt="" width={74} height={74} />
          <div>
            <p className="ft-who">{chosen.name}</p>
            <p className="ft-line">{chosen.says}</p>
          </div>
        </div>
        <Character key={`${kid}-${swap}`} id={kid} pose="wave" alt={`${chosen.name}, waving`} className={`c-hero${swap ? " is-swap" : ""}`} delay={0.6} />
        <Character id="zizi" pose="idle" alt="Zizi" className="c-zizi" delay={2.4} bob />
      </div>
    </div>
  );
}

/**
 * The promotional film. Without a src nothing renders; the device captures stand in.
 * Nothing loads until the viewer presses play. Phones get the 720p file.
 * Starts and completions are counted once per page view, with no personal data.
 */
export function Film() {
  const { src, srcSmall, captions, poster, posterSmall, title } = festivalTown.film;
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const sent = useRef({ start: false, done: false });

  useEffect(() => {
    if (playing && ref.current) ref.current.play().catch(() => undefined);
  }, [playing]);

  if (!src) return null;

  const onPlay = () => {
    if (sent.current.start) return;
    sent.current.start = true;
    track("ft_video_start");
  };
  const onEnded = () => {
    if (sent.current.done) return;
    sent.current.done = true;
    track("ft_video_complete");
  };

  return (
    <div className="ft-player">
      {playing ? (
        <video ref={ref} poster={poster} controls playsInline preload="auto" onPlay={onPlay} onEnded={onEnded} aria-label={`Film: ${title}`}>
          {srcSmall && <source src={srcSmall} type="video/mp4" media="(max-width: 900px)" />}
          <source src={src} type="video/mp4" />
          {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
        </video>
      ) : (
        <>
          <img src={poster} srcSet={`${posterSmall} 900w, ${poster} 1600w`} sizes="(max-width: 900px) 100vw, 1360px" alt="" loading="lazy" decoding="async" />
          <button type="button" className="ft-player-play" onClick={() => setPlaying(true)} aria-label={`Play the film: ${title}`}>
            <span>
              <PlayIcon />
            </span>
            <em>
              Watch the film
              <small>1 min 14</small>
            </em>
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

  useEffect(() => { setConsent(false); setStatus({ kind: "idle" }); }, [audience]);

  useEffect(() => {
    const onPick = (e: Event) => {
      const a = (e as CustomEvent<Audience>).detail;
      if (a === "parent" || a === "school") { setAudience(a); setStatus({ kind: "idle" }); }
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
      <div className="ft-board" role="status">
        <span className="ft-board-ribbon">You're in</span>
        <div className="ft-done">
          <h3>{status.duplicate ? "You're already on the list" : audience === "school" ? "You're on the school list" : "You're on the list"}</h3>
          <p>
            {status.duplicate
              ? "That address is already signed up, so nothing has changed. No extra signup is needed."
              : audience === "school"
                ? "Thanks for signing up. We will write when there is something for schools: pilots first, then class tools."
                : "Thanks for signing up. You will hear from us when a new world is ready, and not much otherwise."}
          </p>
          <PlayLink place="waitlist-done">Play Festival Town</PlayLink>
        </div>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="ft-board" onSubmit={onSubmit}>
      <span className="ft-board-ribbon">{audience === "school" ? "School news & pilots" : "Get new adventures"}</span>
      <div className="ft-seg" role="group" aria-label="I am a">
        <button type="button" disabled={sending} aria-pressed={audience === "parent"} onClick={() => setAudience("parent")}>
          Parent or carer
        </button>
        <button type="button" disabled={sending} aria-pressed={audience === "school"} onClick={() => setAudience("school")}>
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
        <button type="submit" className="ft-btn is-purple" disabled={sending}>
          {sending ? "Sending" : audience === "school" ? "Join the school list" : "Keep me updated"}
        </button>
      </div>

      <p className={`ft-status${status.kind === "error" ? " is-error" : ""}`} role="status" aria-live="polite">
        {status.kind === "error" ? status.message : ""}
      </p>

      <p className="ft-privacy">
        We use the details you submit to send the updates you choose. Signups are stored with Supabase and emails are sent through Resend. We do not ask for children’s details. To unsubscribe, reply to an email or contact hello@motionplaylabs.com. You can also ask us to delete your details. <a href="/legal/privacy/">Website privacy notice</a>.
      </p>
    </form>
  );
}
