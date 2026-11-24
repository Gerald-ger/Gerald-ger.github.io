import { monoFont, rgba, type Palette, type Scene } from "./types";

// An illustration of the Auditable Valuation test suite: 809 backend and 252 frontend
// tests, run in parallel by a few workers per job, held for a moment, then run again.
// Counts are real; the timing is illustrative.

const GROUPS = [
  { label: "backend", count: 809, workers: 6 },
  { label: "frontend", count: 252, workers: 2 },
];
const TOTAL = GROUPS.reduce((n, g) => n + g.count, 0);

type Cell = { x: number; y: number };
type Worker = { group: number; cell: number; left: number };

export class TestsScene implements Scene {
  readonly fade = 0;
  readonly warmup = 0;

  private cells: Cell[] = [];
  private size = 6;
  private labels: { text: string; x: number; y: number }[] = [];
  private statusAt = { x: 0, y: 0 };
  private state = new Uint8Array(TOTAL);
  private next = [0, 0];
  private workers: Worker[] = [];
  private passed = 0;
  private hold = 0;
  private fadeOut = 1;

  resize(width: number, height: number, inset: number) {
    const xl = width * (inset + 0.06);
    const xr = width * 0.95;
    const yt = height * 0.17;
    const yb = height * 0.88;
    const rw = xr - xl;
    const rh = yb - yt;
    const labelH = 24;
    const groupGap = 20;
    let s = 16;
    let gap = 3;
    let cols = 1;
    for (; s >= 3; s--) {
      gap = s >= 7 ? 3 : 2;
      cols = Math.floor((rw + gap) / (s + gap));
      const rows = GROUPS.reduce((n, g) => n + Math.ceil(g.count / cols), 0);
      if (labelH * GROUPS.length + groupGap + rows * (s + gap) <= rh) break;
    }
    this.size = s;
    const gridW = cols * (s + gap) - gap;
    const x0 = xl + (rw - gridW) / 2;
    this.cells = [];
    this.labels = [];
    let y = yt;
    for (const g of GROUPS) {
      this.labels.push({ text: `${g.label}  ${g.count} tests`, x: x0, y });
      y += labelH;
      for (let i = 0; i < g.count; i++) {
        this.cells.push({ x: x0 + (i % cols) * (s + gap), y: y + Math.floor(i / cols) * (s + gap) });
      }
      y += Math.ceil(g.count / cols) * (s + gap) + groupGap;
    }
    this.statusAt = { x: x0 + gridW, y: yt };
    this.reset();
  }

  private offset(group: number) {
    return group === 0 ? 0 : GROUPS[0].count;
  }

  private reset() {
    this.state.fill(0);
    this.next = [0, 0];
    this.passed = 0;
    this.hold = 0;
    this.fadeOut = 1;
    this.workers = [];
    GROUPS.forEach((g, gi) => {
      for (let w = 0; w < g.workers; w++) this.workers.push({ group: gi, cell: -1, left: 0 });
    });
  }

  step(dt: number) {
    if (this.passed === TOTAL) {
      this.hold += dt;
      if (this.hold > 150) this.fadeOut -= 0.03 * dt;
      if (this.fadeOut <= 0) this.reset();
      return;
    }
    for (const w of this.workers) {
      if (w.cell >= 0) {
        w.left -= dt;
        if (w.left > 0) continue;
        this.state[w.cell] = 2;
        this.passed++;
        w.cell = -1;
      }
      const g = GROUPS[w.group];
      if (this.next[w.group] < g.count) {
        w.cell = this.offset(w.group) + this.next[w.group]++;
        this.state[w.cell] = 1;
        w.left = 1 + Math.random() * 7;
      }
    }
  }

  drawBase(ctx: CanvasRenderingContext2D, pal: Palette) {
    ctx.font = monoFont(pal);
    ctx.fillStyle = rgba(pal.muted, 1);
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    for (const l of this.labels) ctx.fillText(l.text, l.x, l.y);
  }

  private paintCells(ctx: CanvasRenderingContext2D, pal: Palette, allPassed: boolean) {
    const s = this.size;
    const r = Math.min(2, s / 4);
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(pal.ink, 0.18);
    ctx.beginPath();
    for (let i = 0; i < this.cells.length; i++) {
      if (!allPassed && this.state[i] === 0) ctx.roundRect(this.cells[i].x + 0.5, this.cells[i].y + 0.5, s - 1, s - 1, r);
    }
    ctx.stroke();
    for (const [st, alpha] of [
      [1, 0.45],
      [2, 0.9 * this.fadeOut],
    ] as const) {
      ctx.fillStyle = rgba(pal.accent, alpha);
      ctx.beginPath();
      for (let i = 0; i < this.cells.length; i++) {
        if ((allPassed && st === 2) || this.state[i] === st) ctx.roundRect(this.cells[i].x, this.cells[i].y, s, s, r);
      }
      ctx.fill();
    }
    if (!allPassed && this.fadeOut < 1) {
      ctx.strokeStyle = rgba(pal.ink, 0.18 * (1 - this.fadeOut));
      ctx.beginPath();
      for (let i = 0; i < this.cells.length; i++) {
        if (this.state[i] === 2) ctx.roundRect(this.cells[i].x + 0.5, this.cells[i].y + 0.5, s - 1, s - 1, r);
      }
      ctx.stroke();
    }
  }

  private paintStatus(ctx: CanvasRenderingContext2D, pal: Palette, text: string) {
    ctx.font = monoFont(pal);
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillStyle = rgba(pal.ink, 0.75);
    ctx.fillText(text, this.statusAt.x, this.statusAt.y);
    ctx.textAlign = "left";
  }

  draw(ctx: CanvasRenderingContext2D, pal: Palette) {
    this.paintCells(ctx, pal, false);
    const done = this.passed === TOTAL;
    this.paintStatus(ctx, pal, done ? "1,061 passed" : `passed ${this.passed.toLocaleString("en-US")} / 1,061`);
  }

  drawStatic(ctx: CanvasRenderingContext2D, pal: Palette) {
    this.paintCells(ctx, pal, true);
    this.paintStatus(ctx, pal, "1,061 passed");
  }
}
