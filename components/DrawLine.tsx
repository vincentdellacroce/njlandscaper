"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * A hairline rule that draws itself in when scrolled into view (horizontal by
 * default, or vertical). The always-sized parent is what's observed for in-view
 * (the inner bar is scaled, and a scaled-to-zero element can never report
 * "in view"). A faint static base line guarantees the divider is visible
 * even if the draw animation never runs.
 */
export default function DrawLine({
  className = "",
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  const reduce = useReducedMotion();
  const transition = { duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] as const };

  const bar: Variants = vertical
    ? { hidden: { scaleY: reduce ? 1 : 0 }, visible: { scaleY: 1, transition } }
    : { hidden: { scaleX: reduce ? 1 : 0 }, visible: { scaleX: 1, transition } };

  return (
    <motion.span
      aria-hidden="true"
      className={`relative block bg-hairline/50 ${vertical ? "w-px" : "h-px w-full"} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.span
        className={`absolute inset-0 bg-hairline ${vertical ? "origin-top" : "origin-left"}`}
        variants={bar}
      />
    </motion.span>
  );
}
