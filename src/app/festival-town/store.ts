"use client";

import { useSyncExternalStore } from "react";
import type { World } from "@/content/festival-town";

// The gifts a visitor has earned in the tasters on this page. Kept for the tab only
// (sessionStorage), so the festival square at the bottom shows what they brought.

type Id = World["id"];
const KEY = "ft-gifts";
const listeners = new Set<() => void>();
let gifts: Id[] | null = null;
const EMPTY: Id[] = [];

function load(): Id[] {
  if (gifts) return gifts;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    gifts = raw ? (JSON.parse(raw) as Id[]) : [];
  } catch {
    gifts = [];
  }
  return gifts;
}

export function earn(id: Id) {
  const now = load();
  if (now.includes(id)) return;
  gifts = [...now, id];
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(gifts));
  } catch {
    // storage blocked: the tray still works for this page view
  }
  listeners.forEach((l) => l());
}

export function resetGifts() {
  gifts = [];
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useGifts(): Id[] {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}
