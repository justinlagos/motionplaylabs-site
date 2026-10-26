"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { Mark } from "./Mark";

function isCurrent(path: string, href: string) {
  if (href === "/") return path === "/" || path.startsWith("/method/");
  return path.startsWith(href);
}

export function Header() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className={`chrome${open ? " is-open" : ""}`}>
        <Link href="/" className="chrome-brand">
          <span className="wordmark">MotionPlay Labs</span>
        </Link>
        <p className="chrome-descriptor">
          <span>{site.descriptor[0]}</span>
          <span>{site.descriptor[1]}</span>
        </p>
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
        <Link href="/" className="chrome-mark" aria-hidden="true" tabIndex={-1}>
          <Mark />
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
