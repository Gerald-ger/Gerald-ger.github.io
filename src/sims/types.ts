export type RGB = [number, number, number];

export type Palette = {
  accent: RGB;
  ink: RGB;
  muted: RGB;
  /** Resolved font-family list for the mono face (next/font renames families). */
  mono: string;
};

/**
 * A simulation scene drawn on two stacked canvases: a static base layer
 * (redrawn on resize and theme change) and an animated layer.
 */
export interface Scene {
  /** Trail strength 0..1. 0 clears the animated layer every frame; higher values leave streaks. */
  readonly fade: number;
  /** Steps to pre-run after a resize, so the first frame is already in motion. */
  readonly warmup: number;
  /**
   * @param inset fraction of the canvas width hidden behind the hero's left fade
   *              (0 when the whole canvas is visible, e.g. on phones)
   */
  resize(width: number, height: number, inset: number): void;
  /** Advance the model. dt is in 60 fps frames (1 at 60 Hz, 0.5 at 120 Hz). */
  step(dt: number): void;
  draw(ctx: CanvasRenderingContext2D, p: Palette): void;
  drawBase?(ctx: CanvasRenderingContext2D, p: Palette): void;
  /** Single frame for prefers-reduced-motion. Falls back to draw(). */
  drawStatic?(ctx: CanvasRenderingContext2D, p: Palette): void;
}

export const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

export function parseColor(value: string): RGB {
  const v = value.trim();
  if (v.startsWith("#")) {
    const hex = v.length === 4 ? [...v.slice(1)].map((c) => c + c).join("") : v.slice(1, 7);
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = v.match(/[\d.]+/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [0, 0, 0];
}

export const monoFont = (p: Palette, size = 11, weight = 500) => `${weight} ${size}px ${p.mono}`;
