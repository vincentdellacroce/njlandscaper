"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A soft green glow that trails the cursor, confined to its parent section.
 * Drop as the FIRST child of a `relative` section; give the section's content
 * wrapper `relative z-10` so it sits above the glow.
 *
 *  tone="dark"  → additive halo (for ink backgrounds)
 *  tone="light" → multiply tint (for paper/bone backgrounds)
 *
 * Skips touch devices and respects prefers-reduced-motion.
 */
export default function CursorGlow({
  tone = "dark",
  size = 540,
  color,
  blend,
  lerp = 0.12,
}: {
  tone?: "dark" | "light";
  size?: number;
  /** override the radial inner color */
  color?: string;
  /** override the blend mode */
  blend?: "screen" | "multiply" | "normal";
  /** trailing factor 0–1 (lower = more lag) */
  lerp?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip touch

    const wrap = wrapRef.current;
    const blob = blobRef.current;
    const section = wrap?.parentElement;
    if (!wrap || !blob || !section) return;

    let raf = 0;
    let running = false;
    let inited = false;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;

    const loop = () => {
      cx += (tx - cx) * lerp;
      cy += (ty - cy) * lerp;
      blob.style.transform = `translate3d(${cx - size / 2}px, ${cy - size / 2}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!inited) {
        inited = true;
        cx = tx;
        cy = ty;
      }
      blob.style.opacity = "1";
      start();
    };
    const onLeave = () => {
      blob.style.opacity = "0";
      stop();
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      stop();
    };
  }, [reduce, size, lerp]);

  const dark = tone === "dark";
  const resolvedBlend = blend ?? (dark ? "screen" : "multiply");
  const resolvedColor =
    color ??
    (dark
      ? "rgba(76,160,106,0.30)"
      : "rgba(60,140,90,0.20)");

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        ref={blobRef}
        className="absolute left-0 top-0 rounded-full blur-2xl"
        style={{
          width: size,
          height: size,
          opacity: 0,
          transition: "opacity 0.6s ease",
          willChange: "transform",
          mixBlendMode: resolvedBlend,
          background: `radial-gradient(circle, ${resolvedColor} 0%, transparent 62%)`,
        }}
      />
    </div>
  );
}
