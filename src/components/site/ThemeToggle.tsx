"use client";

import { useEffect } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

export function ThemeToggle() {
  // Follow the system setting until the visitor picks a theme themselves.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("theme");
      } catch {}
      if (!saved) document.documentElement.setAttribute("data-theme", media.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", next);
    } catch {}
    const apply = () => root.setAttribute("data-theme", next);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition === "function" && !reduce) document.startViewTransition(apply);
    else apply();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-surface text-[19px] text-ink transition-transform duration-200 active:scale-95"
    >
      <Moon className="dark:hidden" weight="regular" aria-hidden />
      <Sun className="hidden dark:block" weight="regular" aria-hidden />
    </button>
  );
}
