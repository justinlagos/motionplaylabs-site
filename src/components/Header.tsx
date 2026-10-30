"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { watchChromeTone } from "@/lib/chrome-tone";
import { LogoHorizontal } from "./Logo";

function isCurrent(path: string, href: string) {
  if (href === "/") return path === "/" || path.startsWith("/method/");
  return path.startsWith(href);
}

export function Header() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  // Re-read the tone on every route change
  useEffect(() => watchChromeTone(), [path]);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (path === "/festival-town" || path === "/festival-town/") return null;

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className={`chrome${open ? " is-open" : ""}`}>
        <Link href="/" className="chrome-brand" aria-label="MotionPlay Labs, home">
          <LogoHorizontal className="chrome-logo" />
        </Link>
        <nav className="chrome-nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(path, item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="chrome-contact" href="/contact/" aria-current={path.startsWith("/contact") ? "page" : undefined}>
          Contact
        </Link>
        <button
          type="button"
          className="chrome-menu"
          aria-expanded={open}
          aria-controls="menu-panel"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <div id="menu-panel" className="menu-panel" hidden={!open}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(path, item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact/">Contact</Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
