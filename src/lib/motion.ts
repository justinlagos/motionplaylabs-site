"use client";

import { useSyncExternalStore } from "react";

// One switch for all moving footage on the site (WCAG 2.2.2: pause, stop, hide).
// Defaults to paused for people who ask their system for reduced motion.

const KEY = "mpl-motion";
type Listener = () => void;
const listeners = new Set<Listener>();
let paused: boolean | null = null;

function initial(): boolean {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "paused") return true;
    if (saved === "playing") return false;
  } catch {
    // storage blocked: fall through to the system setting
  }
  return prefersReducedMotion();
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isPaused(): boolean {
  if (paused === null) paused = initial();
  return paused;
}

export function setPaused(value: boolean) {
  paused = value;
  try {
    window.localStorage.setItem(KEY, value ? "paused" : "playing");
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, isPaused, () => false);
}
