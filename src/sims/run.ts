import { parseColor, type Palette, type Scene } from "./types";

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const mono = css.getPropertyValue("--font-jetbrains-mono").trim();
  return {
    accent: parseColor(css.getPropertyValue("--accent") || "#e8512a"),
    ink: parseColor(css.getPropertyValue("--ink") || "#121417"),
    muted: parseColor(css.getPropertyValue("--muted") || "#5a606a"),
    mono: `${mono ? `${mono}, ` : ""}ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,
  };
}

/**
 * Runs a scene on two stacked canvases. Pauses when off-screen or when the tab is
 * hidden, recolours on theme change, and shows one still frame for reduced motion.
 * Returns a cleanup function.
 */
export function runScene(base: HTMLCanvasElement, fx: HTMLCanvasElement, scene: Scene): () => void {
  const bctx = base.getContext("2d");
  const fctx = fx.getContext("2d");
  if (!bctx || !fctx) return () => {};

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let palette = readPalette();
  let width = 0;
  let height = 0;
  let raf = 0;
  let last = 0;
  let visible = false;

  const paintBase = () => {
    bctx.clearRect(0, 0, width, height);
    scene.drawBase?.(bctx, palette);
  };

  const paintStill = () => {
    fctx.clearRect(0, 0, width, height);
    (scene.drawStatic ?? scene.draw).call(scene, fctx, palette);
  };

  const resize = () => {
    const rect = fx.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    for (const [canvas, ctx] of [
      [base, bctx],
      [fx, fctx],
    ] as const) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const inset = parseFloat(getComputedStyle(fx).getPropertyValue("--sim-inset")) || 0;
    scene.resize(width, height, inset);
    for (let i = 0; i < scene.warmup; i++) scene.step(1);
    paintBase();
    if (reduce) paintStill();
    else fctx.clearRect(0, 0, width, height);
  };

  const frame = (now: number) => {
    const dt = last ? Math.min(Math.max((now - last) / 16.667, 0.25), 3) : 1;
    last = now;
    scene.step(dt);
    if (scene.fade > 0) {
      fctx.globalCompositeOperation = "destination-out";
      fctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, scene.fade * dt)})`;
      fctx.fillRect(0, 0, width, height);
      fctx.globalCompositeOperation = "source-over";
    } else {
      fctx.clearRect(0, 0, width, height);
    }
    scene.draw(fctx, palette);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (reduce || raf || !width) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (visible) start();
  });
  resizeObserver.observe(fx);

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  intersection.observe(fx);

  const onVisibility = () => (document.hidden ? stop() : visible && start());
  document.addEventListener("visibilitychange", onVisibility);

  const themeObserver = new MutationObserver(() => {
    palette = readPalette();
    paintBase();
    if (reduce) paintStill();
    else fctx.clearRect(0, 0, width, height);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Canvas labels need the web font; repaint once it has loaded.
  let alive = true;
  document.fonts?.ready.then(() => {
    if (!alive || !width) return;
    palette = readPalette();
    paintBase();
    if (reduce) paintStill();
  });

  return () => {
    alive = false;
    stop();
    resizeObserver.disconnect();
    intersection.disconnect();
    themeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
