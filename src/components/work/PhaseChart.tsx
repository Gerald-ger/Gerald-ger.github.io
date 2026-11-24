import type { Phase } from "@/content/projects";

const MAX_MONTH = 48;
const TICKS = [0, 12, 24, 36, 48];

/**
 * Overlapping phases on a month axis. One hue, every bar labelled directly, so colour never
 * carries identity on its own. The phase cards on the same page are the table view.
 */
export function PhaseChart({ phases, compact = false }: { phases: Phase[]; compact?: boolean }) {
  const label = phases.map((p) => `${p.name}: months ${p.start} to ${p.end}`).join("; ");
  return (
    <div className="w-full" role="img" aria-label={`Timeline of the plan. ${label}.`}>
      <div className="relative">
        {/* recessive gridlines at each year */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {TICKS.map((t) => (
            <span key={t} className="absolute inset-y-0 w-px bg-line" style={{ left: `${(t / MAX_MONTH) * 100}%` }} />
          ))}
        </div>
        <div className={`relative grid ${compact ? "gap-3" : "gap-5"}`}>
          {phases.map((p) => (
            <div key={p.name} className="grid gap-1.5">
              <span className={`${compact ? "text-[13px]" : "text-sm"} font-medium text-ink`}>{p.name}</span>
              <div className={compact ? "relative h-7" : "relative h-9"}>
                <div
                  className="absolute inset-y-0 rounded-[4px] bg-accent-fill transition-[filter] duration-200 hover:brightness-110"
                  style={{ left: `${(p.start / MAX_MONTH) * 100}%`, width: `${((p.end - p.start) / MAX_MONTH) * 100}%` }}
                >
                  <span className="absolute inset-y-0 left-2.5 flex items-center font-mono text-[11px] whitespace-nowrap text-on-accent">
                    {p.start} to {p.end}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative mt-3 h-5 font-mono text-[11px] text-muted" aria-hidden>
        {TICKS.map((t) => (
          <span
            key={t}
            className="absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
            style={{ left: `${(t / MAX_MONTH) * 100}%` }}
          >
            {t === 0 ? "month 0" : t}
          </span>
        ))}
      </div>
    </div>
  );
}
