"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type Step = { no: string; title: string; copy: string };

const INK = [22, 32, 26]; // default card bg (#16201A)
const FAST = [78, 158, 108]; // lighter green at high cursor speed

/**
 * The four process cards. The card under the cursor tints green based on how
 * fast the cursor is moving — quick movement reads lighter; when it slows or
 * stops the colour decays smoothly back to the default ink (never snaps).
 */
export default function ProcessGrid({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hovered = useRef(-1);

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let v = 0; // smoothed cursor speed (0–1), decays over time
    let lastX = 0,
      lastY = 0,
      hasLast = false;
    const cur = steps.map(() => 0); // current tint per card

    const onMove = (e: MouseEvent) => {
      if (hasLast) {
        const d = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        v = Math.min(1, v + d / 55);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      hasLast = true;
    };

    const loop = () => {
      v *= 0.9; // speed decays → tint fades back when you slow/stop
      for (let i = 0; i < cur.length; i++) {
        const target = i === hovered.current ? v : 0;
        cur[i] += (target - cur[i]) * 0.15;
        const el = cardRefs.current[i];
        if (el) {
          const c = INK.map((b, k) => Math.round(b + (FAST[k] - b) * cur[i]));
          el.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`;
        }
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce, steps]);

  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-px sm:overflow-visible sm:border sm:border-white/10 sm:bg-white/10 sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
      {steps.map((s, i) => (
        <motion.div
          key={s.no}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onMouseEnter={() => (hovered.current = i)}
          onMouseLeave={() => {
            if (hovered.current === i) hovered.current = -1;
          }}
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reduce ? 0 : 0.85, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="group flex w-[80%] shrink-0 snap-center flex-col rounded-sm border border-white/10 bg-ink p-8 sm:w-auto sm:shrink sm:rounded-none sm:border-0 lg:p-10"
        >
          <span className="font-serif text-5xl font-light text-sage transition-colors duration-500 group-hover:text-paper">
            {s.no}
          </span>
          <h3 className="mt-6 font-serif text-2xl font-medium">{s.title}</h3>
          <p className="mt-4 font-sans text-sm font-light leading-relaxed text-paper/70 transition-colors duration-500 group-hover:text-paper/90">
            {s.copy}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
