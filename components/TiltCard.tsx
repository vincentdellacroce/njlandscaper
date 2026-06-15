"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Subtle 3D tilt toward the cursor while hovering, easing back to flat on
 * leave. Tactile and distinctive without being gimmicky. Touch + reduced-motion
 * get a plain, static card.
 */
export default function TiltCard({
  children,
  className = "",
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const el = outer.current;
    const box = inner.current;
    if (!el || !box) return;

    let raf = 0;
    let running = false;
    let trx = 0,
      tryy = 0,
      crx = 0,
      cry = 0;

    const loop = () => {
      crx += (trx - crx) * 0.12;
      cry += (tryy - cry) * 0.12;
      box.style.transform = `perspective(900px) rotateX(${cry}deg) rotateY(${crx}deg)`;
      if (Math.abs(trx - crx) > 0.01 || Math.abs(tryy - cry) > 0.01) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      trx = px * max * 2;
      tryy = -py * max * 2;
      start();
    };
    const onLeave = () => {
      trx = 0;
      tryy = 0;
      start();
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce, max]);

  return (
    <div ref={outer} className={className}>
      <div
        ref={inner}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
