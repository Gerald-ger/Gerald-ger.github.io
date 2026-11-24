"use client";

import { lensList } from "@/content/lenses";
import { useLens } from "./LensProvider";

/** The "View as" segmented control. `layout="wrap"` is used inside the mobile menu. */
export function LensSwitch({ layout = "row", onPick }: { layout?: "row" | "wrap"; onPick?: () => void }) {
  const { lens, setLens } = useLens();
  return (
    <div
      role="group"
      aria-label="View as"
      className={
        layout === "row"
          ? "flex gap-0.5 rounded-full bg-surface-2 p-1"
          : "grid grid-cols-2 gap-1.5 rounded-[22px] bg-surface-2 p-1.5 sm:grid-cols-3"
      }
    >
      {lensList.map((l) => {
        const active = l.id === lens;
        return (
          <button
            key={l.id}
            type="button"
            data-lens={l.id}
            aria-pressed={active}
            onClick={() => {
              setLens(l.id);
              onPick?.();
            }}
            className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-[background-color,color,transform] duration-300 active:scale-[0.97] ${
              active ? "bg-accent-fill text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
