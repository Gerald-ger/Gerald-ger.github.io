import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { aboutShort, beyondWork } from "@/content/about";
import { site } from "@/content/site";
import { BeyondIcon } from "@/components/ui/BeyondIcon";
import { Reveal } from "@/components/ui/Reveal";

export function AboutTeaser() {
  return (
    <section
      aria-labelledby="about-title"
      className="mx-auto grid w-[min(1280px,calc(100%-2rem))] gap-12 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20 lg:py-28"
    >
      <Reveal>
        <h2 id="about-title" className="text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.02] font-bold tracking-[-0.04em]">
          About me <span lang="zh-Hant" className="font-medium text-muted">{site.chineseName}</span>
        </h2>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">{aboutShort}</p>
        <Link href="/about/" className="mt-8 inline-flex items-center gap-2 font-bold text-accent-text">
          More about me, grades and skills <ArrowRight size={16} weight="bold" aria-hidden />
        </Link>
      </Reveal>
      <Reveal delay={0.08}>
        <h3 className="text-sm font-medium text-muted">Beyond work</h3>
        <ul className="mt-4 grid gap-2">
          {beyondWork.map((b) => (
            <li key={b.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-accent-text">
                <BeyondIcon name={b.icon} />
              </span>
              <span>
                <span className="block font-bold">{b.title}</span>
                <span className="mt-0.5 block text-[15px] leading-relaxed text-muted">{b.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
