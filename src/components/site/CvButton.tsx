"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CaretDown, DownloadSimple } from "@phosphor-icons/react";
import { lenses } from "@/content/lenses";
import { cvFiles, type CvKey } from "@/content/site";
import { useLens } from "./LensProvider";

const SHORT: Record<CvKey, string> = { finance: "Finance", chemical: "Chem Eng", environmental: "Env Eng" };

export const primaryButton =
  "inline-flex h-[52px] items-center gap-2.5 whitespace-nowrap rounded-full bg-accent-fill px-6 font-bold text-on-accent shadow-[0_14px_28px_-14px_rgb(207_67_29/0.7)] transition-[background-color,transform] duration-200 hover:bg-accent-fill-hover active:translate-y-px active:scale-[0.98]";

/** Downloads the CV that matches the current lens, or offers all versions under "All". */
export function CvButton() {
  const { lens } = useLens();
  const choice = lenses[lens].cv;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (choice !== "menu") {
    const file = cvFiles[choice];
    return (
      <a href={file.href} download className={primaryButton}>
        <DownloadSimple size={18} weight="bold" aria-hidden />
        Download CV
        <span className="rounded-full bg-on-accent/15 px-2 py-0.5 text-xs font-medium">{SHORT[choice]}</span>
      </a>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        className={`${primaryButton} cursor-pointer`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <DownloadSimple size={18} weight="bold" aria-hidden />
        Download CV
        <CaretDown size={14} weight="bold" aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-30 mt-2 w-[min(19rem,calc(100vw-2rem))] rounded-3xl border border-line bg-surface p-2 shadow-soft"
        >
          <p className="px-4 pt-2 pb-1 text-sm text-muted">Pick the version for your role</p>
          {(Object.keys(cvFiles) as CvKey[]).map((key) => (
            <a
              key={key}
              role="menuitem"
              href={cvFiles[key].href}
              download
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 font-medium text-ink transition-colors hover:bg-surface-2"
            >
              {cvFiles[key].label}
              <span className="font-mono text-xs text-muted">PDF</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
