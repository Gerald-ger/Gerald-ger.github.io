import { rgba, type Palette, type Scene } from "./types";

// Gas parcels stream through a random packing. A parcel that touches the wetted packing
// is consumed (it stalls and fades); everything else slips through. That is what a
// transfer-limited column looks like (Damkohler >> 1): whatever reaches the biofilm
// reacts at once, so removal is set by how much gas reaches the surface.

type Sphere = { x: number; y: number; r: number };
type Parcel = { x: number; y: number; px: number; py: number; state: number; v: number };

export class PackedBedScene implements Scene {
  readonly fade = 0.085;
  readonly warmup = 160;

  private W = 0;
  private H = 0;
  private L = 0;
  private D = 0;
  private t = 0;
  private spheres: Sphere[] = [];
  private parcels: Parcel[] = [];

  constructor(
    private readonly dir: "right" | "up" = "right",
    private readonly opts = { density: 1 / 380, speed: 1.25, capture: 0.4, fill: 0.12 }
  ) {}

  private toCanvas(x: number, y: number): [number, number] {
    return this.dir === "up" ? [y, this.L - x] : [x, y];
  }

  resize(width: number, height: number) {
    this.W = width;
    this.H = height;
    this.L = this.dir === "up" ? height : width;
    this.D = this.dir === "up" ? width : height;
    this.layout();
    const n = Math.round(width * height * this.opts.density);
    this.parcels = Array.from({ length: n }, () => this.spawn({} as Parcel, true));
  }

  private layout() {
    const spheres: Sphere[] = [];
    const base = Math.max(11, Math.min(this.W, this.H) / 19);
    const target = this.L * this.D * this.opts.fill;
    let area = 0;
    for (let tries = 0; area < target && tries < 6000; tries++) {
      const r = base * (0.6 + Math.random() * 0.8);
      const x = this.L * 0.1 + Math.random() * this.L * 0.9;
      const y = r + Math.random() * (this.D - 2 * r);
      if (spheres.every((o) => (o.x - x) ** 2 + (o.y - y) ** 2 > (o.r + r + 14) ** 2)) {
        spheres.push({ x, y, r });
        area += Math.PI * r * r;
      }
    }
    this.spheres = spheres;
  }

  private spawn(p: Parcel, scatter = false): Parcel {
    p.x = scatter ? Math.random() * this.L : -Math.random() * 80;
    p.y = Math.random() * this.D;
    p.px = p.x;
    p.py = p.y;
    p.state = 0;
    p.v = 0.7 + Math.random() * 0.6;
    return p;
  }

  step(dt: number) {
    const { speed, capture } = this.opts;
    this.t += 0.012 * dt;
    for (const p of this.parcels) {
      p.px = p.x;
      p.py = p.y;
      if (p.state > 0) {
        p.state += 0.016 * dt;
        if (p.state > 1.5) this.spawn(p);
        continue;
      }
      let vx = speed * p.v;
      let vy = Math.sin(p.x * 0.011 + p.y * 0.017 + this.t * 2.2) * 0.34;
      for (const s of this.spheres) {
        const dx = p.x - s.x;
        const dy = p.y - s.y;
        const reach = s.r * 1.75;
        if (dx * dx + dy * dy > reach * reach) continue;
        const d = Math.hypot(dx, dy) || 1;
        const nx = dx / d;
        const ny = dy / d;
        let tx = -ny;
        let ty = nx;
        if (tx < 0) {
          tx = -tx;
          ty = -ty;
        }
        const w = 1 - d / reach;
        vx = vx * (1 - w) + tx * speed * p.v * w;
        vy = vy * (1 - w) + (ty * speed * p.v + ny * 0.55) * w;
        if (d < s.r + 1.5) {
          p.x = s.x + nx * (s.r + 1.5);
          p.y = s.y + ny * (s.r + 1.5);
          if (Math.random() < capture) p.state = 0.001;
        }
      }
      p.x += vx * dt;
      p.y += vy * dt;
      if (p.x > this.L + 14 || p.y < -14 || p.y > this.D + 14) this.spawn(p);
    }
  }

  drawBase(ctx: CanvasRenderingContext2D, pal: Palette) {
    for (const s of this.spheres) {
      const [cx, cy] = this.toCanvas(s.x, s.y);
      const g = ctx.createRadialGradient(cx - s.r * 0.35, cy - s.r * 0.35, s.r * 0.1, cx, cy, s.r);
      g.addColorStop(0, rgba(pal.ink, 0.1));
      g.addColorStop(1, rgba(pal.ink, 0.025));
      ctx.fillStyle = g;
      ctx.strokeStyle = rgba(pal.ink, 0.2);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  draw(ctx: CanvasRenderingContext2D, pal: Palette) {
    ctx.lineCap = "round";
    ctx.lineWidth = 1.7;
    ctx.strokeStyle = rgba(pal.accent, 0.95);
    ctx.beginPath();
    for (const p of this.parcels) {
      if (p.state > 0 || p.px < 0) continue;
      const [ax, ay] = this.toCanvas(p.px, p.py);
      const [bx, by] = this.toCanvas(p.x, p.y);
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
    for (const p of this.parcels) {
      if (p.state <= 0) continue;
      const [x, y] = this.toCanvas(p.x, p.y);
      ctx.fillStyle = rgba(pal.ink, Math.max(0, 0.5 * (1.5 - p.state)));
      ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
    }
  }

  drawStatic(ctx: CanvasRenderingContext2D, pal: Palette) {
    ctx.lineCap = "round";
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = rgba(pal.accent, 0.85);
    ctx.beginPath();
    for (const p of this.parcels) {
      if (p.state > 0) continue;
      const [ax, ay] = this.toCanvas(p.x - 10, p.y - Math.sin(p.x * 0.011) * 1.5);
      const [bx, by] = this.toCanvas(p.x, p.y);
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
  }
}
