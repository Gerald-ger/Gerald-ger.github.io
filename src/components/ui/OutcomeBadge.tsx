/** Outcomes that record taking part rather than winning get a quieter badge. */
const PARTICIPATION = new Set(["Participant", "Competed"]);

export function OutcomeBadge({ outcome }: { outcome: string }) {
  return PARTICIPATION.has(outcome) ? (
    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-muted">{outcome}</span>
  ) : (
    <span className="rounded-full bg-accent-fill px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-on-accent">{outcome}</span>
  );
}
