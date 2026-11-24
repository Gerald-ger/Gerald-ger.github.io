"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import { isHomePath, lensFromPath, lensHomePath, type LensId } from "@/lib/lens";

type LensContextValue = { lens: LensId; setLens: (next: LensId) => void };

const LensContext = createContext<LensContextValue | null>(null);

/**
 * Holds the current "View as" lens. It starts from the URL (/finance/ -> finance), survives
 * client-side navigation, and on the home pages keeps the URL in step so the address bar
 * is always a shareable link to the current view.
 */
export function LensProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lens, setLensState] = useState<LensId>(() => lensFromPath(pathname));
  const [seenPath, setSeenPath] = useState(pathname);
  const lensRef = useRef(lens);
  useEffect(() => {
    lensRef.current = lens;
  }, [lens]);

  // Landing on a lens home page (link, back/forward) adopts that page's lens.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    if (isHomePath(pathname)) setLensState(lensFromPath(pathname));
  }

  const setLens = useCallback((next: LensId) => {
    if (next === lensRef.current) return;
    lensRef.current = next;
    const apply = () => {
      flushSync(() => setLensState(next));
      if (isHomePath(window.location.pathname)) {
        window.history.replaceState(null, "", lensHomePath(next) + window.location.hash);
      }
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition === "function" && !reduce) document.startViewTransition(apply);
    else apply();
  }, []);

  return <LensContext.Provider value={{ lens, setLens }}>{children}</LensContext.Provider>;
}

export function useLens(): LensContextValue {
  const ctx = useContext(LensContext);
  if (!ctx) throw new Error("useLens must be used inside <LensProvider>");
  return ctx;
}
