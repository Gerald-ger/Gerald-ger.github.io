import type { Metadata } from "next";
import { DownloadSimple } from "@phosphor-icons/react/ssr";
import { aboutStory, beyondWork, courseGroups, currentCourses, education, languages, skillGroups } from "@/content/about";
import { cvFiles, site, type CvKey } from "@/content/site";
import { BeyondIcon } from "@/components/ui/BeyondIcon";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Gerald Lai: Chemical and Environmental Engineering at HKUST with an Extended Major in AI and a Minor in Business. Education, grades, skills and life beyond work.",
  alternates: { canonical: "/about/" },
  openGraph: { url: "/about/", title: "About | Gerald Lai" },
};

const sectionTitle = "text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.05] font-bold tracking-[-0.04em]";

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto w-[min(1280px,calc(100%-2rem))] pt-32 pb-12 lg:pt-40">
      <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <h1 className="rise text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.95] font-bold tracking-[-0.05em]">
          About
          <span lang="zh-Hant" className="mt-3 block text-[0.45em] font-medium tracking-normal text-muted">
            {site.chineseName}
          </span>
        </h1>
        <div className="rise grid gap-5 text-lg leading-relaxed text-muted" style={{ animationDelay: "80ms" }}>
          {aboutStory.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </header>

      <section aria-labelledby="education" className="mt-28">
        <Reveal>
          <h2 id="education" className={sectionTitle}>
            Education
          </h2>
          <div className="mt-8 grid gap-6 rounded-[28px] border border-line bg-surface p-7 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <p className="text-sm text-muted">{education.period}</p>
              <p className="mt-2 text-2xl leading-snug font-bold tracking-[-0.02em]">{education.school}</p>
              <p className="mt-2 text-lg">{education.degree}</p>
              <p className="text-muted">{education.extras}</p>
              <ul className="mt-6 grid gap-2 text-muted">
                {education.honours.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-[0.7em] h-0.5 w-2 shrink-0 rounded bg-accent" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between gap-6 rounded-[20px] bg-surface-2 p-6">
              <p className="text-sm text-muted">Cumulative GPA</p>
              <p className="font-mono text-[clamp(3rem,6vw,4.6rem)] leading-none font-medium tracking-[-0.05em]">
                {education.cgpa}
                <small className="ml-2 text-[0.35em] tracking-normal text-muted">/ {education.cgpaScale}</small>
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {courseGroups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.06}>
              <div className="h-full rounded-[28px] border border-line bg-surface p-7 sm:p-8">
                <h3 className="font-bold">{g.title}</h3>
                <ul className="mt-5 grid gap-4">
                  {g.courses.map((c) => (
                    <li key={c.code} className="flex items-start justify-between gap-4">
                      <span>
                        <span className="block leading-snug">{c.name}</span>
                        <span className="font-mono text-xs text-muted">{c.code}</span>
                      </span>
                      <span className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-sm">{c.grade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-muted">
          <span className="font-medium text-ink">This term:</span> {currentCourses.join(", ")}.
        </p>
      </section>

      <section aria-labelledby="skills" className="mt-28">
        <Reveal>
          <h2 id="skills" className={sectionTitle}>
            Skills
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.06}>
              <h3 className="border-t-2 border-accent pt-4 font-bold">{g.title}</h3>
              <ul className="mt-4 grid gap-2.5 text-muted">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <h3 className="font-bold">Languages</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {languages.map((l) => (
              <li key={l.name} className="rounded-full border border-line bg-surface px-4 py-2 text-[15px]">
                {l.name} <span className="text-muted">{l.level}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="beyond" className="mt-28">
        <Reveal>
          <h2 id="beyond" className={sectionTitle}>
            Beyond work
          </h2>
        </Reveal>
        <Reveal>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {beyondWork.map((b, i) => (
              <li
                key={b.title}
                className={`flex h-full gap-5 rounded-[24px] border border-line bg-surface p-6 ${
                  i === beyondWork.length - 1 && beyondWork.length % 2 ? "md:col-span-2" : ""
                }`}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-2 text-accent-text">
                  <BeyondIcon name={b.icon} />
                </span>
                <span>
                  <span className="block text-lg font-bold tracking-[-0.01em]">{b.title}</span>
                  <span className="mt-1 block leading-relaxed text-muted">{b.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="cv" className="mt-28">
        <Reveal>
          <h2 id="cv" className={sectionTitle}>
            CV
          </h2>
          <p className="mt-4 max-w-[56ch] text-muted">Three versions of the same record, each ordered for a different kind of role.</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {(Object.keys(cvFiles) as CvKey[]).map((k) => (
              <li key={k}>
                <a
                  href={cvFiles[k].href}
                  download
                  className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-5 font-bold transition-colors hover:border-muted"
                >
                  <DownloadSimple size={18} aria-hidden />
                  {cvFiles[k].label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </main>
  );
}
