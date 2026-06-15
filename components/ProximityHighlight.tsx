"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Inline text that warms from forest → a brighter green as the cursor
 * approaches it, then eases back. A quiet, expensive cursor touch.
 */
export default function ProximityHighlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;

    const base = [31, 77, 46]; // forest
    const bright = [108, 178, 132]; // lifted green
    const radius = 360;
    let raf = 0;
    let running = false;
    let t = 0;
    let target = 0;

    const loop = () => {
      t += (target - t) * 0.1;
      const c = base.map((b, i) => Math.round(b + (bright[i] - b) * t));
      el.style.color = `rgb(${c[0]},${c[1]},${c[2]})`;
      if (Math.abs(target - t) > 0.005 || target > 0.005) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      target = Math.max(0, 1 - d / radius);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <span ref={ref} className={`text-forest ${className}`}>
      {children}
    </span>
  );
}
