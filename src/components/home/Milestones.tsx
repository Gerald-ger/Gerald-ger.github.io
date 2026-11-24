"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { timeline } from "@/content/timeline";
import { useLens } from "@/components/site/LensProvider";
import { OutcomeBadge } from "@/components/ui/OutcomeBadge";

/** A swipeable strip of recent highlights, filtered by the current lens. */
export function Milestones() {
  const { lens } = useLens();
  const scroller = useRef<HTMLOListElement>(null);

  const all = timeline.filter((e) => e.highlight);
  const forLens = all.filter((e) => lens === "all" || e.lenses === "all" || e.lenses.includes(lens));
  const items = (forLens.length >= 3 ? forLens : all).slice(0, 6);

  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 680), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="milestones-title" className="py-20 lg:py-28">
      <div className="mx-auto flex w-[min(1280px,calc(100%-2rem))] flex-wrap items-end justify-between gap-6">
        <h2 id="milestones-title" className="text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.02] font-bold tracking-[-0.04em]">
          Recent milestones
        </h2>
        <div className="flex items-center gap-2">
          <Link href="/timeline/" className="mr-2 inline-flex items-center gap-2 font-bold text-accent-text">
            Full timeline <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll milestones left"
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-surface transition-transform active:scale-95"
          >
            <CaretLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll milestones right"
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-surface transition-transform active:scale-95"
          >
            <CaretRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      <ol
        ref={scroller}
        className="snap-strip mt-10 flex gap-4 overflow-x-auto pb-2"
        style={{ paddingInline: "max(1rem, calc((100vw - 1280px) / 2))", scrollPaddingInline: "max(1rem, calc((100vw - 1280px) / 2))" }}
      >
        {items.map((e) => {
          const card = (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-muted">{e.dateLabel}</span>
                {e.outcome && <OutcomeBadge outcome={e.outcome} />}
              </div>
              <h3 className="mt-8 text-xl leading-tight font-bold tracking-[-0.02em]">{e.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{e.org}</p>
              {e.text && <p className="mt-4 text-[15px] leading-relaxed text-muted">{e.text}</p>}
            </>
          );
          return (
            <li key={e.id} className="w-[min(21rem,82vw)] shrink-0">
              {e.href ? (
                <Link
                  href={e.href}
                  className="flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-muted"
                >
                  {card}
                </Link>
              ) : (
                <div className="flex h-full flex-col rounded-[24px] border border-line bg-surface p-6">{card}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
