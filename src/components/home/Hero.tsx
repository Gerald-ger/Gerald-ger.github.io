"use client";

import { AnimatePresence, motion } from "motion/react";
import { EnvelopeSimple } from "@phosphor-icons/react";
import { lenses } from "@/content/lenses";
import { site } from "@/content/site";
import { CvButton } from "@/components/site/CvButton";
import { useLens } from "@/components/site/LensProvider";
import { Simulation } from "./Simulation";

export const ghostButton =
  "inline-flex h-[52px] items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface px-6 font-bold text-ink transition-[border-color,transform] duration-200 hover:border-muted active:translate-y-px active:scale-[0.98]";

function FadingSim({ mode, flow }: { mode: (typeof lenses)["all"]["sim"]; flow?: "right" | "up" }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={mode}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Simulation mode={mode} flow={flow} className="size-full" />
      </motion.div>
    </AnimatePresence>
  );
}

export function Hero() {
  const { lens } = useLens();
  const L = lenses[lens];

  return (
    <section className="relative isolate overflow-hidden lg:min-h-[100dvh]">
      {/* Desktop: one large live model on the right, fading into the page. */}
      <div className="hero-visual absolute inset-y-0 right-0 hidden w-[66%] bg-bg lg:block">
        <FadingSim mode={L.sim} />
      </div>

      <div className="relative mx-auto flex w-[min(1280px,calc(100%-2rem))] flex-col justify-center pt-32 pb-14 lg:min-h-[100dvh] lg:pt-24 lg:pb-24">
        <div className="max-w-[42rem]">
          <p className="rise text-[15px] text-muted">
            <b className="font-bold text-ink">{site.name}</b>, {site.year} at HKUST
          </p>
          <h1
            className="rise mt-5 max-w-[17ch] text-[clamp(2.6rem,4.8vw,4.8rem)] leading-[0.99] font-bold tracking-[-0.045em] text-balance"
            style={{ viewTransitionName: "hero-headline", animationDelay: "70ms" }}
          >
            {L.headline}
          </h1>
          <p
            className="rise mt-6 max-w-[44ch] text-[1.15rem] leading-relaxed text-muted"
            style={{ viewTransitionName: "hero-sub", animationDelay: "140ms" }}
          >
            {L.sub}
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "210ms" }}>
            <CvButton />
            <a href={`mailto:${site.email}`} className={ghostButton}>
              <EnvelopeSimple size={18} aria-hidden />
              Email me
            </a>
          </div>
        </div>

        {/* Phones and tablets: the model sits below the copy. */}
        <figure className="rise mt-12 lg:hidden" style={{ animationDelay: "280ms" }}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-line bg-surface">
            <FadingSim mode={L.sim} />
          </div>
          <figcaption className="mt-3 font-mono text-xs leading-relaxed text-muted">{L.simCaption}</figcaption>
        </figure>
      </div>

      <p className="glass absolute right-6 bottom-6 hidden max-w-[60ch] rounded-2xl border border-line px-4 py-2.5 font-mono text-xs leading-relaxed text-muted lg:block">
        {L.simCaption}
      </p>
    </section>
  );
}
