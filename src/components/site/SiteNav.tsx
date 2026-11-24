"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { isHomePath, lensHomePath } from "@/lib/lens";
import { LensSwitch } from "./LensSwitch";
import { useLens } from "./LensProvider";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav() {
  const pathname = usePathname();
  const { lens } = useLens();
  const [open, setOpen] = useState(false);
  const onHome = isHomePath(pathname);
  const home = lensHomePath(lens);

  const links = [
    { href: `${home}#work`, label: "Work", active: false },
    { href: "/timeline/", label: "Timeline", active: pathname?.startsWith("/timeline") ?? false },
    { href: "/about/", label: "About", active: pathname?.startsWith("/about") ?? false },
  ];

  // Close the menu on navigation and on Escape.
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-3.5 sm:px-3.5" style={{ viewTransitionName: "site-nav" }}>
      <nav
        aria-label="Main"
        className="glass mx-auto flex h-[62px] max-w-[1280px] items-center gap-4 rounded-full border border-line pr-2 pl-2.5 shadow-soft lg:gap-5"
      >
        <Link href={home} className="flex shrink-0 items-center gap-2.5 rounded-full pr-1 font-bold tracking-[-0.01em]">
          <span className="grid size-[42px] place-items-center rounded-full bg-ink text-[13px] font-black text-bg">{site.initials}</span>
          <span className="hidden sm:inline">{site.name}</span>
          <span lang="zh-Hant" className="hidden text-sm font-normal text-muted 2xl:inline">
            {site.chineseName}
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-[15px] font-medium text-muted xl:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={l.active ? "page" : undefined}
              className={`transition-colors hover:text-ink ${l.active ? "text-ink" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {onHome && (
            <div className="hidden md:block">
              <LensSwitch />
            </div>
          )}
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-surface text-[19px] xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden /> : <List aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="glass mx-auto mt-2 max-w-[1280px] rounded-[28px] border border-line p-3 shadow-soft xl:hidden"
        >
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex rounded-2xl px-4 py-3 text-lg font-bold tracking-[-0.02em] transition-colors hover:bg-surface-2"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {onHome && (
            <div className="mt-3 border-t border-line pt-3 md:hidden">
              <p className="px-2 pb-2 text-sm text-muted">View this page as</p>
              <LensSwitch layout="wrap" onPick={() => setOpen(false)} />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
