"use client";

import { useEffect, useRef, useState } from "react";

type RGB = [number, number, number];

type CueConfig = {
  enabled?: boolean;
  /** css rgba color of the cue dot */
  color?: string;
  /** base radius of the cue dot in px */
  size?: number;
};

type RootCanvasProps = {
  className?: string;
  /** colour at the thin growing tips */
  tipColor?: RGB;
  /** colour at the thick base near the seed */
  rootColor?: RGB;
  /** one click scatters attractors across the WHOLE white area and fills it */
  fill?: boolean;
  /** grid spacing (px) of fill attractors — smaller = denser roots */
  fillSpacing?: number;
  /** new branch tips created per frame — lower = slower fill */
  growthPerFrame?: number;
  attractionDistance?: number;
  killDistance?: number;
  segmentLength?: number;
  /** generations over which a branch tapers from thick base to thin tip */
  taperDepth?: number;
  /** max stroke width of the thickest roots (px) */
  maxWidth?: number;
  /** chance (0–1) a new branch node sprouts fine lateral rootlets */
  hairChance?: number;
  /** length of each rootlet segment (px) */
  hairLength?: number;
  /** max segments per rootlet */
  hairSegments?: number;
  /** distance (px) from the click over which lengths shrink to minLengthScale */
  lengthFalloff?: number;
  /** smallest length multiplier far from the click origin (0–1) */
  minLengthScale?: number;
  maxNodes?: number;
  maxAttractors?: number;
  /** local-scatter mode (only used when fill=false) */
  density?: number;
  spawnRadius?: number;
  excludeSelector?: string;
  excludePadding?: number;
  /** visual hover cue (no text) — set false to disable */
  cue?: CueConfig | false;
};

type Node = { x: number; y: number; p: number; d: number };
type Attractor = { x: number; y: number; dead: boolean };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function RootCanvas({
  className = "",
  tipColor = [128, 162, 100],
  rootColor = [70, 92, 52],
  fill = true,
  fillSpacing = 30,
  growthPerFrame = 18,
  attractionDistance = 58,
  killDistance = 7,
  segmentLength = 4,
  taperDepth = 42,
  maxWidth = 5,
  hairChance = 0.22,
  hairLength = 2.6,
  hairSegments = 4,
  lengthFalloff = 850,
  minLengthScale = 0.4,
  maxNodes = 16000,
  maxAttractors = 2600,
  density = 80,
  spawnRadius = 150,
  excludeSelector = "[data-root-exclude]",
  excludePadding = 6,
  cue = {},
}: RootCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rootsRef = useRef<HTMLCanvasElement>(null);
  const cueRef = useRef<HTMLCanvasElement>(null);
  // Phones/touch devices: skip the whole feature (it's a hover/click flourish,
  // and this keeps mobile entirely free of its cost). Decided after mount to
  // avoid any SSR hydration mismatch.
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouch) {
      setEnabled(false);
      return;
    }

    const wrap = wrapRef.current;
    const section = wrap?.parentElement;
    const rootsCanvas = rootsRef.current;
    const cueCanvas = cueRef.current;
    if (!wrap || !section || !rootsCanvas || !cueCanvas) return;
    const rctx = rootsCanvas.getContext("2d");
    const cctx = cueCanvas.getContext("2d");
    if (!rctx || !cctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const cueObj: CueConfig | null = cue === false ? null : cue ?? {};
    const cueEnabled = cueObj !== null && (cueObj.enabled ?? true);
    const cueColor = cueObj?.color || "rgba(95,150,90,1)";
    const cueSize = cueObj?.size || 7;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let exclude: { x: number; y: number; w: number; h: number }[] = [];

    const nodes: Node[] = [];
    const attractors: Attractor[] = [];
    const hairs: { x1: number; y1: number; x2: number; y2: number; t: number }[] = [];
    let origin = { x: 0, y: 0 };
    let originSet = false;
    let filled = false;

    // length multiplier — 1 near the click origin, shrinking with distance
    const scaleFor = (x: number, y: number) => {
      if (!originSet) return 1;
      const d = Math.hypot(x - origin.x, y - origin.y);
      return lerp(1, minLengthScale, Math.min(1, d / lengthFalloff));
    };
    let growing = false;
    let hovering = false;
    let mouse = { x: -999, y: -999, valid: false };
    let raf = 0;
    let running = false;

    const cell = attractionDistance;
    const grid = new Map<string, number[]>();
    const addToGrid = (i: number) => {
      const k = `${Math.floor(nodes[i].x / cell)},${Math.floor(nodes[i].y / cell)}`;
      let arr = grid.get(k);
      if (!arr) grid.set(k, (arr = []));
      arr.push(i);
    };

    // ---- drawing ----------------------------------------------------------
    const colorFor = (t: number) =>
      `rgba(${Math.round(lerp(rootColor[0], tipColor[0], t))},${Math.round(
        lerp(rootColor[1], tipColor[1], t)
      )},${Math.round(lerp(rootColor[2], tipColor[2], t))},${(
        0.78 + t * 0.14
      ).toFixed(3)})`;

    const drawSegment = (i: number) => {
      const node = nodes[i];
      if (node.p < 0) return;
      const parent = nodes[node.p];
      const t = Math.min(1, node.d / taperDepth); // 0 base → 1 tip
      rctx.strokeStyle = colorFor(t);
      rctx.lineWidth = Math.max(0.5, maxWidth * (1 - t));
      rctx.beginPath();
      rctx.moveTo(parent.x, parent.y);
      rctx.lineTo(node.x, node.y);
      rctx.stroke();
    };
    const drawHair = (hh: { x1: number; y1: number; x2: number; y2: number; t: number }) => {
      rctx.strokeStyle = colorFor(hh.t);
      rctx.lineWidth = Math.max(0.4, maxWidth * (1 - hh.t) * 0.85);
      rctx.beginPath();
      rctx.moveTo(hh.x1, hh.y1);
      rctx.lineTo(hh.x2, hh.y2);
      rctx.stroke();
    };

    // sprout 1–2 fine, curling rootlets off a freshly-grown branch node
    const sprout = (idx: number) => {
      if (Math.random() > hairChance) return;
      const node = nodes[idx];
      const par = nodes[node.p];
      let dx = node.x - par.x;
      let dy = node.y - par.y;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const sc = scaleFor(node.x, node.y); // shorter rootlets farther from origin
      const segLen = hairLength * sc;
      const count = Math.random() < 0.32 ? 2 : 1;
      for (let c = 0; c < count; c++) {
        const side = Math.random() < 0.5 ? 1 : -1;
        // perpendicular to the branch, with a little forward lean
        let hx = -dy * side + dx * 0.35;
        let hy = dx * side + dy * 0.35;
        let hl = Math.hypot(hx, hy) || 1;
        hx /= hl;
        hy /= hl;
        let px = node.x;
        let py = node.y;
        const segs = 1 + Math.floor(Math.random() * Math.max(1, hairSegments * sc));
        for (let s = 0; s < segs; s++) {
          const ang = (Math.random() - 0.5) * 0.6; // gentle curl
          const rx = hx * Math.cos(ang) - hy * Math.sin(ang);
          const ry = hx * Math.sin(ang) + hy * Math.cos(ang);
          hx = rx;
          hy = ry;
          const ex = px + hx * segLen;
          const ey = py + hy * segLen;
          if (!isValid(ex, ey)) break;
          const t = Math.min(1, 0.8 + s * 0.05);
          const seg = { x1: px, y1: py, x2: ex, y2: ey, t };
          hairs.push(seg);
          drawHair(seg);
          px = ex;
          py = ey;
        }
      }
    };

    const redrawAll = () => {
      rctx.clearRect(0, 0, w, h);
      rctx.lineCap = "round";
      rctx.lineJoin = "round";
      for (let i = 0; i < nodes.length; i++) drawSegment(i);
      for (const hh of hairs) drawHair(hh);
    };

    // ---- geometry ---------------------------------------------------------
    const sizeCanvas = (c: HTMLCanvasElement, x: CanvasRenderingContext2D) => {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const measure = () => {
      const r = section.getBoundingClientRect();
      w = section.clientWidth;
      h = section.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeCanvas(rootsCanvas, rctx);
      sizeCanvas(cueCanvas, cctx);
      exclude = Array.from(
        section.querySelectorAll<HTMLElement>(excludeSelector)
      ).map((el) => {
        const er = el.getBoundingClientRect();
        return {
          x: er.left - r.left - excludePadding,
          y: er.top - r.top - excludePadding,
          w: er.width + excludePadding * 2,
          h: er.height + excludePadding * 2,
        };
      });
      redrawAll();
    };

    const inExcluded = (x: number, y: number) =>
      exclude.some(
        (e) => x >= e.x && x <= e.x + e.w && y >= e.y && y <= e.y + e.h
      );
    const isValid = (x: number, y: number) =>
      x >= 0 && x <= w && y >= 0 && y <= h && !inExcluded(x, y);

    // ---- seeding ----------------------------------------------------------
    const generateFill = () => {
      const pts: Attractor[] = [];
      const j = fillSpacing * 0.6;
      for (let y = fillSpacing / 2; y < h; y += fillSpacing) {
        for (let x = fillSpacing / 2; x < w; x += fillSpacing) {
          const px = x + (Math.random() - 0.5) * j;
          const py = y + (Math.random() - 0.5) * j;
          if (isValid(px, py)) pts.push({ x: px, y: py, dead: false });
        }
      }
      for (let i = pts.length - 1; i > 0; i--) {
        const k = (Math.random() * (i + 1)) | 0;
        [pts[i], pts[k]] = [pts[k], pts[i]];
      }
      if (pts.length > maxAttractors) pts.length = maxAttractors;
      for (const p of pts) attractors.push(p);
    };

    const scatterLocal = (x: number, y: number) => {
      let added = 0;
      let attempts = 0;
      while (added < density && attempts < density * 8 && attractors.length < maxAttractors) {
        attempts++;
        const a = Math.random() * Math.PI * 2;
        const rr = Math.sqrt(Math.random()) * spawnRadius;
        const ax = x + Math.cos(a) * rr;
        const ay = y + Math.sin(a) * rr;
        if (isValid(ax, ay)) {
          attractors.push({ x: ax, y: ay, dead: false });
          added++;
        }
      }
    };

    const addNode = (x: number, y: number, p: number, d: number) => {
      const idx = nodes.length;
      nodes.push({ x, y, p, d });
      addToGrid(idx);
      return idx;
    };

    const seed = (x: number, y: number) => {
      measure(); // refresh exclusion rects (work cards have settled by click time)
      if (!isValid(x, y)) return;
      if (!originSet) {
        origin = { x, y };
        originSet = true;
      }
      if (fill) {
        if (filled) return; // one click fills the whole space
        generateFill();
        filled = true;
      } else {
        scatterLocal(x, y);
      }
      addNode(x, y, -1, 0);
      growing = true;
      start();
    };

    // ---- space colonization (one capped step) -----------------------------
    const grow = (cap: number): boolean => {
      const n = nodes.length;
      const sx = new Float32Array(n);
      const sy = new Float32Array(n);
      const cnt = new Uint16Array(n);

      for (const a of attractors) {
        if (a.dead) continue;
        const cgx = Math.floor(a.x / cell);
        const cgy = Math.floor(a.y / cell);
        let best = -1;
        let bestD = attractionDistance;
        for (let gx = cgx - 1; gx <= cgx + 1; gx++) {
          for (let gy = cgy - 1; gy <= cgy + 1; gy++) {
            const arr = grid.get(`${gx},${gy}`);
            if (!arr) continue;
            for (const i of arr) {
              const d = Math.hypot(a.x - nodes[i].x, a.y - nodes[i].y);
              if (d < bestD) {
                bestD = d;
                best = i;
              }
            }
          }
        }
        if (best >= 0) {
          const dx = a.x - nodes[best].x;
          const dy = a.y - nodes[best].y;
          const d = Math.hypot(dx, dy) || 1;
          sx[best] += dx / d;
          sy[best] += dy / d;
          cnt[best]++;
        }
      }

      const infl: number[] = [];
      for (let i = 0; i < n; i++) if (cnt[i] > 0) infl.push(i);
      if (infl.length === 0) return false;
      for (let i = infl.length - 1; i > 0; i--) {
        const k = (Math.random() * (i + 1)) | 0;
        [infl[i], infl[k]] = [infl[k], infl[i]];
      }

      const take = Math.min(infl.length, cap);
      const fresh: number[] = [];
      for (let t = 0; t < take; t++) {
        if (nodes.length >= maxNodes) break;
        const i = infl[t];
        let dx = sx[i] / cnt[i] + (Math.random() - 0.5) * 0.35;
        let dy = sy[i] / cnt[i] + (Math.random() - 0.5) * 0.35;
        const d = Math.hypot(dx, dy) || 1;
        const segLen = segmentLength * scaleFor(nodes[i].x, nodes[i].y);
        const nx = nodes[i].x + (dx / d) * segLen;
        const ny = nodes[i].y + (dy / d) * segLen;
        if (!isValid(nx, ny)) continue;
        const idx = addNode(nx, ny, i, nodes[i].d + 1);
        fresh.push(idx);
        drawSegment(idx); // incremental: draw the new segment once
        sprout(idx); // fine lateral rootlets off this branch
      }

      const kill2 = killDistance * killDistance;
      for (const a of attractors) {
        if (a.dead) continue;
        for (const fi of fresh) {
          const dx = a.x - nodes[fi].x;
          const dy = a.y - nodes[fi].y;
          if (dx * dx + dy * dy < kill2) {
            a.dead = true;
            break;
          }
        }
      }
      return fresh.length > 0;
    };

    // ---- cue (separate canvas, cleared each frame) ------------------------
    let cuePhase = 0;
    const drawCue = () => {
      cctx.clearRect(0, 0, w, h);
      if (!(cueEnabled && hovering && mouse.valid)) return;
      const pulse = prefersReduced ? 0.5 : (Math.sin(cuePhase) + 1) / 2;
      cuePhase += 0.07;
      if (!prefersReduced) {
        const ring = cueSize + pulse * cueSize * 1.6;
        cctx.beginPath();
        cctx.arc(mouse.x, mouse.y, ring, 0, Math.PI * 2);
        cctx.strokeStyle = cueColor.replace(/[\d.]+\)$/, `${0.28 * (1 - pulse)})`);
        cctx.lineWidth = 1;
        cctx.stroke();
      }
      const dot = cueSize * (0.7 + pulse * 0.3);
      const grd = cctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, dot);
      grd.addColorStop(0, cueColor.replace(/[\d.]+\)$/, "0.55)"));
      grd.addColorStop(1, cueColor.replace(/[\d.]+\)$/, "0)"));
      cctx.fillStyle = grd;
      cctx.beginPath();
      cctx.arc(mouse.x, mouse.y, dot, 0, Math.PI * 2);
      cctx.fill();
    };

    // ---- loop -------------------------------------------------------------
    const frame = () => {
      if (growing) {
        const perFrame = prefersReduced ? growthPerFrame * 5 : growthPerFrame;
        if (!grow(perFrame)) {
          // Frontier stalled. The cards fragment the white space into pockets,
          // so a single origin can't reach them all. Plant a fresh seed in the
          // next unreached pocket (a still-live attractor) so growth continues
          // until the WHOLE white space is filled — all from the one click.
          const live = attractors.find((a) => !a.dead);
          if (live && nodes.length < maxNodes) addNode(live.x, live.y, -1, 0);
          else growing = false;
        }
      }
      drawCue();
      if (growing || (hovering && cueEnabled)) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        drawCue();
      }
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    // ---- pointer ----------------------------------------------------------
    const toLocal = (e: PointerEvent | MouseEvent) => {
      const r = rootsCanvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      mouse = { x: p.x, y: p.y, valid: isValid(p.x, p.y) };
      hovering = true;
      if (cueEnabled) start();
    };
    const onLeave = () => {
      hovering = false;
      mouse.valid = false;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const p = toLocal(e);
      if (isValid(p.x, p.y)) seed(p.x, p.y);
    };

    // ---- lifecycle --------------------------------------------------------
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(section);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    >
      <canvas ref={rootsRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={cueRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
