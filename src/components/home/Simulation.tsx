"use client";

import { useEffect, useRef } from "react";
import type { SimMode } from "@/content/lenses";
import { createScene } from "@/sims";
import { runScene } from "@/sims/run";

/** A live model drawn on two stacked canvases (static base + animated layer). */
export function Simulation({ mode, flow = "right", className = "" }: { mode: SimMode; flow?: "right" | "up"; className?: string }) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const base = baseRef.current;
    const fx = fxRef.current;
    if (!base || !fx) return;
    return runScene(base, fx, createScene(mode, flow));
  }, [mode, flow]);

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <canvas ref={baseRef} className="absolute inset-0 size-full" />
      <canvas ref={fxRef} className="absolute inset-0 size-full" />
    </div>
  );
}
