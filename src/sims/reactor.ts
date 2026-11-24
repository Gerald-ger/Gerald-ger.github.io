import { monoFont, rgba, type Palette, type Scene } from "./types";

// RedBird's reactor, drawn. MnO2 catalyst lands on the surface and slowly sinks while
// hydrogen peroxide decomposes on it: oxygen bubbles rise and heat is released where the
// catalyst is. The thermoelectric modules sit in the floor, so they only see heat that
// reaches the bottom. Hot, depleted liquid stays near the surface unless mixed, which is
// the problem the real simulator models layer by layer.

type Catalyst = { x: number; y: number; vy: number; act: number; size: number };
type Bubble = { x: number; y: number; r: number; vy: number; wob: number };

export class ReactorScene implements Scene {
  readonly fade = 0;
  readonly warmup = 240;

  private W = 0;
  private H = 0;
  private xl = 0;
  private xr = 0;
  private ys = 0;
  private yf = 0;
  private cats: Catalyst[] = [];
  private bubbles: Bubble[] = [];
  private floorHeat = 0;

  resize(width: number, height: number, inset: number) {
    this.W = width;
    this.H = height;
    this.xl = width * (inset + 0.06);
    this.xr = width * 0.95;
    this.ys = height * 0.2;
    this.yf = height * 0.8;
    const n = Math.round(Math.min(16, Math.max(8, (this.xr - this.xl) / 48)));
    this.cats = Array.from({ length: n }, () => this.spawnCat({} as Catalyst, true));
    this.bubbles = [];
  }

  private spawnCat(c: Catalyst, scatter = false): Catalyst {
    c.x = this.xl + 16 + Math.random() * (this.xr - this.xl - 32);
    c.y = scatter ? this.ys + 4 + Math.random() * (this.yf - this.ys) * 0.7 : this.ys + 3 + Math.random() * 8;
    c.vy = 0.05 + Math.random() * 0.1;
    c.act = scatter ? 0.3 + Math.random() * 0.7 : 1;
    c.size = 2 + Math.random() * 1.6;
    return c;
  }

  step(dt: number) {
    let target = 0;
    for (const c of this.cats) {
      c.y += c.vy * dt;
      c.act -= 0.0018 * dt;
      if (c.act <= 0 || c.y > this.yf - 8) this.spawnCat(c);
      if (this.bubbles.length < 700 && Math.random() < c.act * 0.5 * dt) {
        this.bubbles.push({
          x: c.x + (Math.random() - 0.5) * 10,
          y: c.y - 2,
          r: 1 + Math.random() * 1.6,
          vy: -(0.55 + Math.random() * 0.9),
          wob: Math.random() * Math.PI * 2,
        });
      }
      target += c.act * ((c.y - this.ys) / (this.yf - this.ys));
    }
    target /= Math.max(1, this.cats.length) * 0.35;
    this.floorHeat += (Math.min(1, target) - this.floorHeat) * 0.05 * dt;
    for (const b of this.bubbles) {
      b.y += b.vy * dt;
      b.x += Math.sin(b.y * 0.045 + b.wob) * 0.3 * dt;
      b.r += 0.003 * dt;
    }
    this.bubbles = this.bubbles.filter((b) => b.y > this.ys + b.r);
  }

  private plates() {
    const w = (this.xr - this.xl) * 0.22;
    return [this.xl + (this.xr - this.xl) * 0.2, this.xl + (this.xr - this.xl) * 0.58].map((x) => ({ x, w }));
  }

  drawBase(ctx: CanvasRenderingContext2D, pal: Palette) {
    ctx.strokeStyle = rgba(pal.ink, 0.14);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.xl, this.ys - 26);
    ctx.lineTo(this.xl, this.yf);
    ctx.lineTo(this.xr, this.yf);
    ctx.lineTo(this.xr, this.ys - 26);
    ctx.stroke();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = rgba(pal.ink, 0.24);
    ctx.beginPath();
    ctx.moveTo(this.xl, this.ys);
    ctx.lineTo(this.xr, this.ys);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = monoFont(pal);
    ctx.fillStyle = rgba(pal.muted, 1);
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText("H₂O₂ solution, MnO₂ catalyst", this.xl + 12, this.ys - 8);
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    for (const p of this.plates()) ctx.fillText("thermoelectric", p.x + p.w / 2, this.yf + 14);
    ctx.textAlign = "left";
    ctx.fillText("ice water below", this.xl + 12, this.yf + 34);
  }

  draw(ctx: CanvasRenderingContext2D, pal: Palette) {
    const strat = ctx.createLinearGradient(0, this.ys, 0, this.ys + (this.yf - this.ys) * 0.55);
    strat.addColorStop(0, rgba(pal.accent, 0.16));
    strat.addColorStop(1, rgba(pal.accent, 0));
    ctx.fillStyle = strat;
    ctx.fillRect(this.xl, this.ys, this.xr - this.xl, this.yf - this.ys);

    for (const c of this.cats) {
      if (c.act < 0.05) continue;
      const R = 30 + 22 * c.act;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, R);
      g.addColorStop(0, rgba(pal.accent, 0.24 * c.act));
      g.addColorStop(1, rgba(pal.accent, 0));
      ctx.fillStyle = g;
      ctx.fillRect(c.x - R, c.y - R, R * 2, R * 2);
    }

    ctx.lineWidth = 1.1;
    ctx.strokeStyle = rgba(pal.accent, 0.85);
    ctx.beginPath();
    for (const b of this.bubbles) {
      ctx.moveTo(b.x + b.r, b.y);
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    }
    ctx.stroke();

    ctx.fillStyle = rgba(pal.ink, 0.8);
    for (const c of this.cats) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of this.plates()) {
      ctx.fillStyle = rgba(pal.accent, 0.2 + 0.7 * this.floorHeat);
      ctx.beginPath();
      ctx.roundRect(p.x, this.yf - 9, p.w, 9, 3);
      ctx.fill();
    }
  }
}
