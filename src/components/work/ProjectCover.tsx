import { TOWNGAS_PHASES, type Cover } from "@/content/projects";
import { PhaseChart } from "./PhaseChart";

/**
 * The visual for a project: a real screenshot or figure, or a typographic panel when the
 * work has no public visuals (internal tools, strategy decks).
 */
export function ProjectCover({ cover, className = "" }: { cover: Cover; className?: string }) {
  switch (cover.kind) {
    case "shot": {
      const f = cover.figure;
      return (
        <div className={`relative overflow-hidden pt-7 pl-7 ${f.tone === "dark" ? "bg-well" : "bg-surface-2"} ${className}`}>
          <img
            src={f.src}
            alt={f.alt}
            width={f.width}
            height={f.height}
            loading="lazy"
            decoding="async"
            className="h-[112%] w-auto max-w-none origin-top-left rounded-tl-[10px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]"
          />
        </div>
      );
    }
    case "figure": {
      const f = cover.figure;
      return (
        <div className={`grid place-items-center bg-paper p-5 sm:p-7 ${className}`}>
          <img src={f.src} alt={f.alt} width={f.width} height={f.height} loading="lazy" decoding="async" className="h-auto max-h-full w-full rounded-md object-contain" />
        </div>
      );
    }
    case "number":
      return (
        <div className={`flex flex-col justify-end bg-surface-2 p-8 ${className}`}>
          <span className="text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.85] font-black tracking-[-0.055em] text-accent">{cover.value}</span>
          <span className="mt-4 max-w-[30ch] text-muted">{cover.caption}</span>
        </div>
      );
    case "equation":
      return (
        <div className={`flex flex-col justify-end bg-surface-2 p-8 ${className}`}>
          <span className="text-[clamp(2rem,3.6vw,3.4rem)] leading-none font-black tracking-[-0.03em] text-accent">{cover.value}</span>
          <span className="mt-4 max-w-[34ch] text-muted">{cover.caption}</span>
        </div>
      );
    case "phases":
      return (
        <div className={`flex flex-col justify-center bg-surface-2 p-7 sm:p-9 ${className}`}>
          <PhaseChart phases={TOWNGAS_PHASES} compact />
        </div>
      );
  }
}
