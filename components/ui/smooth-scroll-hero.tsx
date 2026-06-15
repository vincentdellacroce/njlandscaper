"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export interface SmoothScrollHeroProps {
  /** image shown on >= md screens */
  desktopImage: string;
  /** image shown on < md screens */
  mobileImage: string;
  /** alt text for the photo */
  alt?: string;
  /** clip inset (%) when the frame first enters view @default 25 */
  initialClipPercentage?: number;
  /** clip inset (%) when fully revealed (animates toward 100) @default 75 */
  finalClipPercentage?: number;
  /** how far the image starts zoomed in (1.35 = 135%) @default 1.35 */
  zoomFrom?: number;
  /** sizing / aspect utility classes for the frame @default "aspect-[3/4] w-full" */
  className?: string;
}

/**
 * A section-scoped smooth-scroll reveal. As the frame passes through the
 * viewport, a clip-path window opens out from the centre while the photo eases
 * from a slight zoom to its resting size.
 *
 * Adapted from a full-page, global-scroll hero into a contained, in-flow
 * picture so it can live *inside* a section (e.g. "Our Story") without taking
 * over the page. The reveal is driven by this element's own scroll progress
 * (`useScroll({ target })`) rather than a fixed pixel `scrollHeight`.
 * Respects prefers-reduced-motion.
 */
export default function SmoothScrollHero({
  desktopImage,
  mobileImage,
  alt = "",
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  zoomFrom = 1.35,
  className = "aspect-[3/4] w-full",
}: SmoothScrollHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Open the clip window over the first ~60% of the pass-through, then hold.
  const clipStart = useTransform(
    scrollYProgress,
    [0, 0.6],
    [initialClipPercentage, 0]
  );
  const clipEnd = useTransform(
    scrollYProgress,
    [0, 0.6],
    [finalClipPercentage, 100]
  );
  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`;
  const scale = useTransform(scrollYProgress, [0, 1], [zoomFrom, 1]);

  const fullClip = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-sm bg-bone ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: reduce ? fullClip : clipPath, willChange: "clip-path" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ scale: reduce ? 1 : scale, willChange: "transform" }}
        >
          {/* Mobile */}
          <Image
            src={mobileImage}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover object-center md:hidden"
          />
          {/* Desktop */}
          <Image
            src={desktopImage}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="hidden object-cover object-center md:block"
          />
        </motion.div>
      </motion.div>
      {/* subtle inner hairline frame to match the site's image treatment */}
      <span className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-ink/10" />
    </div>
  );
}
