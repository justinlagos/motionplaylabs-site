"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { jumpToY, startSmoothScroll } from "@/lib/scroll";

/** Mounts inertial scrolling once for the whole site and starts each new page at the top. */
export function SmoothScroll() {
  const path = usePathname();
  useEffect(() => {
    if (path === "/festival-town" || path === "/festival-town/") return;
    return startSmoothScroll();
  }, [path]);
  useEffect(() => {
    if (!window.location.hash) jumpToY(0);
  }, [path]);
  return null;
}
