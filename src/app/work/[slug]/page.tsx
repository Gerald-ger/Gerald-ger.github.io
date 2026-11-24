import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, LockSimple } from "@phosphor-icons/react/ssr";
import { Simulation } from "@/components/home/Simulation";
import { BackToWork } from "@/components/work/BackToWork";
import { SectionBlock, slugify } from "@/components/work/Blocks";
import { ProjectCover } from "@/components/work/ProjectCover";
import { lenses, type SimMode } from "@/content/lenses";
import { projectBySlug, projects, type ProjectSlug } from "@/content/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function find(slug: string) {
  return projectBySlug[slug as ProjectSlug];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = find((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    alternates: { canonical: `/work/${p.slug}/` },
    openGraph: { url: `/work/${p.slug}/`, title: `${p.title} | Gerald Lai`, description: p.tagline },
  };
}

const SIM_CAPTION: Record<SimMode, string> = {
  dcf: lenses.finance.simCaption,
  packedBed: lenses.all.simCaption,
  reactor: lenses.chemical.simCaption,
  tests: lenses.software.simCaption,
};

export default async function CaseStudy({ params }: Props) {
  const p = find((await params).slug);
  if (!p) notFound();
  const index = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(index + 1) % projects.length];

  const meta = [
    { label: "Role", value: p.role },
    { label: "When", value: p.period },
    { label: "Context", value: p.context },
    ...(p.stack ? [{ label: "Tools", value: p.stack.join(", ") }] : []),
  ];

  return (
    <main id="main" className="pt-28 lg:pt-36">
      <div className="mx-auto w-[min(1280px,calc(100%-2rem))]">
        <BackToWork />
        <header className="mt-10 max-w-4xl">
          <div className="flex flex-wrap gap-1.5">
            {p.chips.map((c) => (
              <span key={c.label} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                {c.label}
              </span>
            ))}
          </div>
          <h1 className="rise mt-6 text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.98] font-bold tracking-[-0.045em] text-balance">
            {p.title}
          </h1>
          <p className="rise mt-6 max-w-[56ch] text-xl leading-relaxed text-muted" style={{ animationDelay: "80ms" }}>
            {p.tagline}
          </p>
        </header>

        <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-[13px] text-muted">{m.label}</dt>
              <dd className="mt-1 leading-snug">{m.value}</dd>
            </div>
          ))}
        </dl>

        {(p.links || p.codeNote) && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {p.links?.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                className={
                  i === 0
                    ? "inline-flex h-12 items-center gap-2 rounded-full bg-accent-fill px-5 font-bold text-on-accent transition-colors hover:bg-accent-fill-hover"
                    : "inline-flex h-12 items-center gap-2 rounded-full border border-line bg-surface px-5 font-bold transition-colors hover:border-muted"
                }
              >
                {l.label}
                <ArrowUpRight size={16} weight="bold" aria-hidden />
              </a>
            ))}
            {p.codeNote && (
              <p className="inline-flex items-center gap-2 text-[15px] text-muted">
                <LockSimple size={16} aria-hidden />
                {p.codeNote}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto mt-12 w-[min(1280px,calc(100%-2rem))]">
        {p.heroSim ? (
          <figure>
            <div className="relative h-[clamp(320px,56vh,600px)] overflow-hidden rounded-[28px] border border-line bg-surface">
              <Simulation mode={p.heroSim} className="size-full" />
            </div>
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-muted">{SIM_CAPTION[p.heroSim]}</figcaption>
          </figure>
        ) : (
          <ProjectCover cover={p.cover} className="h-[clamp(320px,56vh,600px)] overflow-hidden rounded-[28px] border border-line" />
        )}
      </div>

      <section aria-label="Key numbers" className="mx-auto mt-14 w-[min(1280px,calc(100%-2rem))]">
        <dl className="grid gap-8 sm:grid-cols-3">
          {p.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-3">
              <dt className="order-2 max-w-[30ch] text-[15px] leading-snug text-muted">{s.label}</dt>
              <dd className="order-1 font-mono text-[clamp(1.9rem,3.2vw,3rem)] leading-none font-medium tracking-[-0.045em]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto mt-20 grid w-[min(1280px,calc(100%-2rem))] gap-14 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="text-sm text-muted">On this page</p>
            <ul className="mt-4 grid gap-2.5 border-l border-line pl-4 text-[15px]">
              {p.sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${slugify(s.heading)}`} className="text-muted transition-colors hover:text-ink">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <article className="grid max-w-[52rem] gap-16">
          {p.sections.map((s) => (
            <SectionBlock key={s.heading} section={s} />
          ))}
          {p.credits && <p className="border-t border-line pt-6 text-sm text-muted">{p.credits}</p>}
        </article>
      </div>

      <div className="mx-auto mt-24 w-[min(1280px,calc(100%-2rem))]">
        <Link
          href={`/work/${next.slug}/`}
          className="group flex flex-wrap items-end justify-between gap-6 rounded-[28px] border border-line bg-surface p-8 transition-colors hover:border-muted sm:p-10"
        >
          <span>
            <span className="text-sm text-muted">Next project</span>
            <span className="mt-2 block text-[clamp(1.8rem,3.4vw,3rem)] leading-tight font-bold tracking-[-0.035em]">{next.title}</span>
          </span>
          <ArrowRight
            size={36}
            aria-hidden
            className="text-accent transition-transform duration-500 ease-out-expo group-hover:translate-x-2"
          />
        </Link>
      </div>
    </main>
  );
}
