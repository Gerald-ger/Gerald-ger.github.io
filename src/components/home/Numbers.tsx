"use client";

import { lenses } from "@/content/lenses";
import { useLens } from "@/components/site/LensProvider";

/** Four headline numbers, chosen per lens. */
export function Numbers() {
  const { lens } = useLens();
  const stats = lenses[lens].stats;

  return (
    <section aria-label="In numbers" className="mx-auto w-[min(1280px,calc(100%-2rem))] py-16 lg:pt-20 lg:pb-28">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-8">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-3" style={{ viewTransitionName: `stat-${i}` }}>
            <dt className="order-2 max-w-[26ch] text-[15px] leading-snug text-muted">{s.label}</dt>
            <dd className="order-1 font-mono text-[clamp(2rem,3.4vw,3.2rem)] leading-none font-medium tracking-[-0.045em] text-ink">
              {s.value}
              {s.unit && <small className="ml-1.5 text-[0.42em] font-medium tracking-normal text-muted">{s.unit}</small>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
