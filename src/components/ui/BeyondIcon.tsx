import { Basketball, FilmSlate, PenNib, PersonSimpleRun, Wrench } from "@phosphor-icons/react/ssr";
import type { BeyondItem } from "@/content/about";

const ICONS = {
  run: PersonSimpleRun,
  basketball: Basketball,
  pen: PenNib,
  film: FilmSlate,
  wrench: Wrench,
} as const;

export function BeyondIcon({ name }: { name: BeyondItem["icon"] }) {
  const Icon = ICONS[name];
  return <Icon size={20} aria-hidden />;
}
