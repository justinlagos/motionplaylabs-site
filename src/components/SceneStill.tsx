"use client";

import { useEffect, useState } from "react";
import type { SceneId } from "@/lib/gl/shaders";
import { sceneStill } from "@/lib/gl/renderer";

/** A still frame of a placeholder scene, drawn once through a shared WebGL context. */
export function SceneStill({ scene, className, width = 480, height = 270 }: { scene: SceneId; className?: string; width?: number; height?: number }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    setSrc(sceneStill(scene, width, height));
  }, [scene, width, height]);
  return (
    <span className={`scene-still ${className ?? ""}`} data-scene={scene} aria-hidden="true">
      {src && <img src={src} alt="" width={width} height={height} />}
    </span>
  );
}
