"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Briefcase, Code, GraduationCap, Medal, Trophy } from "@phosphor-icons/react";
import { ENTRY_TYPE_LABEL, timeline, type EntryType, type TimelineEntry } from "@/content/timeline";
import { LensSwitch } from "@/components/site/LensSwitch";
import { useLens } from "@/components/site/LensProvider";
import { OutcomeBadge } from "@/components/ui/OutcomeBadge";

const TYPE_ICON: Record<EntryType, typeof Code> = {
  project: Code,
  work: Briefcase,
  competition: Trophy,
  award: Medal,
  education: GraduationCap,
};

function Entry({ e }: { e: TimelineEntry }) {
  const Icon = TYPE_ICON[e.type];
  return (
    <article className="grid gap-5 rounded-[24px] border border-line bg-surface p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-7">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon size={16} aria-hidden />
            {ENTRY_TYPE_LABEL[e.type]}
          </span>
          <span className="font-mono text-xs">{e.dateLabel}</span>
          {e.outcome && <OutcomeBadge outcome={e.outcome} />}
        </div>
        <h3 className="mt-3 text-xl leading-snug font-bold tracking-[-0.02em]">{e.title}</h3>
        <p className="mt-1 text-muted">{e.org}</p>
        {e.text && <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">{e.text}</p>}
        {e.href && (
          <Link href={e.href} className="mt-4 inline-flex items-center gap-2 font-bold text-accent-text">
            Read the case study <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
        )}
      </div>
      {e.image && (
        <img
          src={e.image.src}
          alt={e.image.alt}
          width={e.image.width}
          height={e.image.height}
          loading="lazy"
          decoding="async"
          className="h-44 w-36 rounded-2xl object-cover"
        />
      )}
    </article>
  );
}

export function TimelineView() {
  const { lens } = useLens();
  const reduce = useReducedMotion();
  const visible = timeline.filter((e) => lens === "all" || e.lenses === "all" || e.lenses.includes(lens));

  const years = new Map<string, TimelineEntry[]>();
  for (const e of visible) {
    const y = e.date.slice(0, 4);
    years.set(y, [...(years.get(y) ?? []), e]);
  }

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <LensSwitch />
        <p className="text-sm text-muted" aria-live="polite">
          Showing {visible.length} of {timeline.length}
        </p>
      </div>

      <div className="mt-14 grid gap-16">
        {[...years.entries()].map(([year, items]) => (
          <section key={year} aria-labelledby={`year-${year}`} className="grid gap-6 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-10">
            <h2
              id={`year-${year}`}
              className="font-mono text-3xl font-medium tracking-[-0.05em] lg:sticky lg:top-28 lg:self-start"
            >
              {year}
            </h2>
            <ol className="grid gap-4 border-l border-line pl-5 sm:pl-8">
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((e) => (
                  <motion.li
                    key={e.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Entry e={e} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </section>
        ))}
      </div>
    </>
  );
}
