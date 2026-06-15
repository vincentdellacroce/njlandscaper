"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type ImageRevealProps = {
  src: string;
  alt: string;
  sizes?: string;
  /** aspect + rounding utility classes for the frame */
  className?: string;
  priority?: boolean;
  /** extra classes on the <img> (e.g. to zoom on an ancestor's hover) */
  imageClassName?: string;
};

/**
 * Editorial image reveal: the photo fades in while settling from a slight zoom
 * (a restrained Ken-Burns), then eases a touch further on hover. Uses only
 * opacity/transform so it can never leave the image stuck hidden.
 */
export default function ImageReveal({
  src,
  alt,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className = "",
  priority = false,
  imageClassName = "",
}: ImageRevealProps) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className={`group relative overflow-hidden rounded-sm bg-bone ${className}`}>
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, scale: reduce ? 1 : 1.12 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: reduce ? 0 : 1.3, ease }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover transition-transform duration-[900ms] ease-estate group-hover:scale-[1.04] ${imageClassName}`}
        />
      </motion.div>
      {/* hairline inner frame — subtle luxury edge */}
      <span className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-ink/10" />
    </div>
  );
}
