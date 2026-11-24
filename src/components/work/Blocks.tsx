import type { Figure, Phase, Section, Step } from "@/content/projects";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const FRAME: Record<Figure["tone"], string> = {
  dark: "bg-well",
  light: "bg-surface-2",
  paper: "bg-paper",
};

export function FigureBlock({ figure: f }: { figure: Figure }) {
  const portrait = f.height > f.width;
  return (
    <figure className="mt-8">
      <div className={`overflow-hidden rounded-[24px] border border-line p-3 sm:p-5 ${FRAME[f.tone]}`}>
        <img
          src={f.src}
          alt={f.alt}
          width={f.width}
          height={f.height}
          loading="lazy"
          decoding="async"
          className={portrait ? "mx-auto h-auto max-h-[80vh] w-auto rounded-xl" : "h-auto w-full rounded-xl"}
        />
      </div>
      <figcaption className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">{f.caption}</figcaption>
    </figure>
  );
}

/** A short process, labelled by the verbs themselves rather than "step 1, 2, 3". */
export function StepsFlow({ steps }: { steps: Step[] }) {
  return (
    <ol className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-8">
      {steps.map((s) => (
        <li key={s.title} className="border-t-2 border-accent pt-4">
          <h3 className="text-lg font-bold tracking-[-0.02em]">{s.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function PhaseCards({ phases }: { phases: Phase[] }) {
  return (
    <ol className="mt-6 grid gap-3">
      {phases.map((p) => (
        <li key={p.name} className="grid gap-2 rounded-[24px] border border-line bg-surface p-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
          <div>
            <p className="font-bold tracking-[-0.01em]">{p.name}</p>
            <p className="mt-1 font-mono text-sm text-muted">
              months {p.start} to {p.end}
            </p>
          </div>
          <p className="leading-relaxed text-muted">{p.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function SectionBlock({ section: s }: { section: Section }) {
  return (
    <section id={slugify(s.heading)} className="scroll-mt-28">
      <h2 className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight font-bold tracking-[-0.03em]">{s.heading}</h2>
      {(s.body || s.bullets || s.after) && (
        <div className="prose-gl mt-5">
          {s.body?.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
          {s.bullets && (
            <ul>
              {s.bullets.map((b) => (
                <li key={b.slice(0, 32)}>{b}</li>
              ))}
            </ul>
          )}
          {s.after?.map((para) => <p key={para.slice(0, 32)} className="!mt-4">{para}</p>)}
        </div>
      )}
      {s.steps && <StepsFlow steps={s.steps} />}
      {s.phases && <PhaseCards phases={s.phases} />}
      {s.figures?.map((f) => <FigureBlock key={f.src + f.caption.slice(0, 12)} figure={f} />)}
    </section>
  );
}
