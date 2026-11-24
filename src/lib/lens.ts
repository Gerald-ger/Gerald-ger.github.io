export const FIELD_LENSES = ["finance", "chemical", "environmental", "software"] as const;
export const LENS_IDS = ["all", ...FIELD_LENSES] as const;

export type FieldLens = (typeof FIELD_LENSES)[number];
export type LensId = (typeof LENS_IDS)[number];

export function isFieldLens(value: string | undefined | null): value is FieldLens {
  return !!value && (FIELD_LENSES as readonly string[]).includes(value);
}

/** The lens encoded in a pathname: "/finance/..." -> "finance", anything else -> "all". */
export function lensFromPath(pathname: string | null | undefined): LensId {
  const first = (pathname ?? "/").split("/").filter(Boolean)[0];
  return isFieldLens(first) ? first : "all";
}

/** Home URL for a lens. These are real, prerendered pages, so they can be shared. */
export function lensHomePath(lens: LensId): string {
  return lens === "all" ? "/" : `/${lens}/`;
}

/** True for "/" and the four lens home pages. */
export function isHomePath(pathname: string | null | undefined): boolean {
  const parts = (pathname ?? "/").split("/").filter(Boolean);
  return parts.length === 0 || (parts.length === 1 && isFieldLens(parts[0]));
}
