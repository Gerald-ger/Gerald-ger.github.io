"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { lenses } from "@/content/lenses";
import { projectBySlug, type Project } from "@/content/projects";
import { useLens } from "@/components/site/LensProvider";
import { ProjectCover } from "@/components/work/ProjectCover";
import type { LensId } from "@/lib/lens";

function Chip({ label, highlighted }: { label: string; highlighted: boolean }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-300 ${
        highlighted ? "border-accent-text text-accent-text" : "border-line text-muted"
      }`}
    >
      {label}
    </span>
  );
}

function ProjectPanel({ project: p, index, lens }: { project: Project; index: number; lens: LensId }) {
  return (
    <article
      className="stack-panel group relative grid overflow-hidden rounded-[28px] border border-line bg-surface shadow-soft lg:min-h-[min(540px,72vh)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]"
      style={{ "--i": index, viewTransitionName: `project-${p.slug}` } as React.CSSProperties}
    >
      <ProjectCover cover={p.cover} className="m-3 mb-0 h-64 rounded-2xl sm:h-80 lg:m-3.5 lg:mr-0 lg:h-auto" />
      <div className="flex flex-col gap-4 p-7 sm:p-9 lg:p-10">
        <div className="flex flex-wrap gap-1.5">
          {p.chips.map((c) => (
            <Chip key={c.label} label={c.label} highlighted={lens !== "all" && c.lens === lens} />
          ))}
          <Chip label={p.year} highlighted={false} />
        </div>
        <h3 className="text-[clamp(1.8rem,2.6vw,2.5rem)] leading-[1.05] font-bold tracking-[-0.035em]">{p.title}</h3>
        <p className="max-w-[48ch] leading-relaxed text-muted">{p.summary}</p>
        <dl className="mt-auto grid gap-3.5 border-t border-line pt-5">
          {p.stats.map((s) => (
            <div key={s.label} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-baseline gap-4">
              <dt className="col-start-2 row-start-1 text-[15px] leading-snug text-muted">{s.label}</dt>
              <dd className="col-start-1 row-start-1 font-mono text-lg leading-tight font-medium tracking-[-0.03em]">{s.value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={`/work/${p.slug}/`}
          className="inline-flex items-center gap-2 self-start font-bold text-accent-text after:absolute after:inset-0 after:content-['']"
        >
          Read the case study<span className="sr-only">: {p.title}</span>
          <ArrowRight size={16} weight="bold" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export function WorkStack() {
  const { lens } = useLens();
  const L = lenses[lens];
  const ordered = L.order.map((slug) => projectBySlug[slug]);

  return (
    <section id="work" className="mx-auto w-[min(1280px,calc(100%-2rem))] pb-[12vh]">
      <header className="mb-10 max-w-2xl">
        <h2 className="text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.02] font-bold tracking-[-0.04em]">Selected work</h2>
        <p className="mt-3 text-muted">
          Ordered for <b className="font-bold text-accent-text">{L.phrase}</b>. Each one opens into a full case study.
        </p>
      </header>
      {/* auto-rows-fr gives every panel the height of the tallest one. A pinned panel taller
          than the panels after it runs out of room before the stack ends and gets pushed up
          under the nav, so equal heights keep the whole stack pinned until the last panel. */}
      <div className="grid gap-6 lg:auto-rows-fr lg:gap-[5vh]">
        {ordered.map((p, i) => (
          <ProjectPanel key={p.slug} project={p} index={i} lens={lens} />
        ))}
      </div>
    </section>
  );
}
