import { monoFont, rgba, type Palette, type Scene } from "./types";

// A two-stage DCF, drawn. Each dot is a cash flow born at its year (1 to 10) or in the
// terminal value, and drifts back towards "today". Its area is its value at the time it
// has reached, so it shrinks by (1 + WACC) for every year it travels: far-future flows
// arrive much smaller than they started. WACC 9.7% matches the Apple example in my app.

const WACC = 0.097;
const YEARS = 10;

type Flow = { t0: number; t: number; y0: number; cf: number; tv: boolean; wob: number };

export class DcfScene implements Scene {
  readonly fade = 0;
  readonly warmup = 0;

  private W = 0;
  private H = 0;
  private x0 = 0;
  private x1 = 0;
  private xTV = 0;
  private yTop = 0;
  private yBottom = 0;
  private yc = 0;
  private axisY = 0;
  private rb = 8;
  private pulse = 0;
  private flows: Flow[] = [];

  resize(width: number, height: number, inset: number) {
    this.W = width;
    this.H = height;
    this.x0 = width * (inset + 0.07);
    this.x1 = width * 0.82;
    this.xTV = width * 0.91;
    this.yTop = height * 0.14;
    this.yBottom = height * 0.78;
    this.yc = (this.yTop + this.yBottom) / 2;
    this.axisY = height * 0.86;
    this.rb = Math.max(4, Math.min(13, Math.min(width - this.x0, height) / 46));
    const n = Math.round(Math.min(160, Math.max(48, ((width - this.x0) * height) / 6500)));
    this.flows = Array.from({ length: n }, () => this.spawn({} as Flow, true));
  }

  private spawn(f: Flow, scatter = false): Flow {
    f.tv = Math.random() < 0.22;
    f.t0 = f.tv ? YEARS : 0.4 + Math.random() * (YEARS - 0.4);
    f.t = scatter ? Math.random() * f.t0 : f.t0;
    f.cf = f.tv ? 5 + Math.random() * 2 : Math.pow(1.06, f.t0) * (0.85 + Math.random() * 0.3);
    f.y0 = this.yTop + Math.random() * (this.yBottom - this.yTop);
    f.wob = Math.random() * Math.PI * 2;
    return f;
  }

  private xAt(f: Flow) {
    const k = f.t / YEARS;
    return this.x0 + (this.x1 - this.x0) * k + (f.tv ? (this.xTV - this.x1) * k : 0);
  }

  step(dt: number) {
    for (const f of this.flows) {
      f.t -= 0.015 * dt;
      f.wob += 0.02 * dt;
      if (f.t <= 0) {
        this.pulse = Math.min(1, this.pulse + (f.tv ? 0.22 : 0.08));
        this.spawn(f);
      }
    }
    this.pulse *= Math.pow(0.965, dt);
  }

  drawBase(ctx: CanvasRenderingContext2D, pal: Palette) {
    ctx.strokeStyle = rgba(pal.ink, 0.16);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x0, this.axisY);
    ctx.lineTo(this.xTV + 18, this.axisY);
    ctx.stroke();
    for (let year = 0; year <= YEARS; year++) {
      const x = this.x0 + ((this.x1 - this.x0) * year) / YEARS;
      ctx.beginPath();
      ctx.moveTo(x, this.axisY);
      ctx.lineTo(x, this.axisY + (year % 5 === 0 ? 7 : 4));
      ctx.stroke();
    }
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(this.x0, this.yTop - 10);
    ctx.lineTo(this.x0, this.axisY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = monoFont(pal);
    ctx.fillStyle = rgba(pal.muted, 1);
    ctx.textBaseline = "top";
    const labelY = this.axisY + 12;
    ctx.textAlign = "left";
    ctx.fillText("today", this.x0, labelY);
    ctx.textAlign = "center";
    ctx.fillText("year 5", this.x0 + (this.x1 - this.x0) / 2, labelY);
    ctx.fillText("year 10", this.x1, labelY);
    ctx.textAlign = "right";
    ctx.fillText("terminal", this.W * 0.97, labelY);
    ctx.textAlign = "left";
  }

  draw(ctx: CanvasRenderingContext2D, pal: Palette) {
    if (this.pulse > 0.01) {
      const g = ctx.createLinearGradient(this.x0 - 26, 0, this.x0 + 26, 0);
      g.addColorStop(0, rgba(pal.accent, 0));
      g.addColorStop(0.5, rgba(pal.accent, 0.22 * this.pulse));
      g.addColorStop(1, rgba(pal.accent, 0));
      ctx.fillStyle = g;
      ctx.fillRect(this.x0 - 26, this.yTop - 10, 52, this.axisY - this.yTop + 10);
    }
    for (const f of this.flows) {
      const discount = Math.pow(1 + WACC, -(f.t0 - f.t));
      const r = this.rb * Math.sqrt(f.cf * discount);
      const pull = 0.3 + 0.7 * (f.t / YEARS);
      const y = this.yc + (f.y0 - this.yc) * pull + Math.sin(f.wob) * 2;
      const x = this.xAt(f);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (f.tv) {
        ctx.fillStyle = rgba(pal.accent, 0.16);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = rgba(pal.accent, 0.9);
        ctx.stroke();
      } else {
        ctx.fillStyle = rgba(pal.accent, 0.8);
        ctx.fill();
      }
    }
  }
}
