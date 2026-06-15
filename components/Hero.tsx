"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;
const lines = ["Timeless landscapes", "for distinguished", "New Jersey estates"];

export default function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  // `done` = the intro has finished and the supplementing content is shown
  const [done, setDone] = useState(false);

  // Reduced-motion users skip the cinematic intro entirely.
  useEffect(() => {
    if (reduce) setDone(true);
  }, [reduce]);

  // Safety net: reveal content even if autoplay is blocked or the video stalls.
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setDone(true), 11000);
    return () => clearTimeout(t);
  }, [reduce]);

  // If the visitor scrolls before the intro ends, reveal content immediately.
  useEffect(() => {
    if (done) return;
    const onScroll = () => window.scrollY > 40 && setDone(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  // Adaptive quality: capable devices on good connections get the sharp
  // native-720p master; constrained devices (data-saver, slow network, or
  // low memory) get the lighter 480p encode.
  useEffect(() => {
    if (reduce) return;
    const v = videoRef.current;
    if (!v) return;

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const c = nav.connection;
    const slowNet = c?.effectiveType
      ? ["slow-2g", "2g", "3g"].includes(c.effectiveType)
      : false;
    const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;
    const light = Boolean(c?.saveData) || slowNet || lowMem;

    // Guarantee the element is *actually* muted + inline before play().
    // React's JSX `muted` attribute does NOT reliably set the DOM property,
    // and mobile browsers (iOS Safari especially) block autoplay of a video
    // that isn't truly muted — which made the hero appear frozen on phones.
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");

    v.src = light ? "/video/hero-light.mp4" : "/video/hero.mp4";
    v.load();
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    // Retry once the data is ready (covers slower mobile connections).
    v.addEventListener("canplay", tryPlay, { once: true });
  }, [reduce]);

  function skip() {
    const v = videoRef.current;
    if (v && Number.isFinite(v.duration)) {
      v.pause();
      v.currentTime = v.duration; // jump to the final logo frame
    }
    setDone(true);
  }

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      {/* Cinematic intro video → holds on the mowed-grass logo.
          src is set adaptively in useEffect (high vs light tier). */}
      {!reduce ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          poster="/video/hero-start.jpg"
          onEnded={() => setDone(true)}
          aria-label="Aerial flight over a Morris Estate Landscapes garden, resolving on the tree emblem mowed into the lawn"
        />
      ) : (
        /* Reduced-motion: show the final logo frame, no playback */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/video/hero-end.jpg"
          alt="The Morris Estate Landscapes tree emblem mowed into a manicured estate lawn"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Top scrim — keeps the navigation legible over the bright lawn */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-transparent" />
      {/* Bottom scrim — fades in with the content for headline legibility */}
      <motion.div
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 1.1, ease }}
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent"
      />

      {/* Supplementing content (revealed once the intro resolves on the logo) */}
      <div className="relative z-10 mx-auto flex h-full max-w-edge flex-col justify-end px-6 pb-20 lg:px-10 lg:pb-28">
        <motion.span
          initial={false}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 16 }}
          transition={{ duration: 0.8, ease, delay: done ? 0.05 : 0 }}
          className={`eyebrow mb-6 flex items-center gap-3 !text-paper [text-shadow:_0_1px_10px_rgba(0,0,0,0.5)] ${
            done ? "" : "pointer-events-none"
          }`}
        >
          <span className="h-px w-8 bg-moss" />
          {site.region}
        </motion.span>

        <h1 className="max-w-4xl font-serif text-[2.7rem] font-medium leading-[1.07] text-paper [text-shadow:_0_2px_24px_rgba(10,18,12,0.45)] sm:text-6xl lg:text-[5.25rem]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
              <motion.span
                className="block"
                initial={false}
                animate={{ y: done ? 0 : "110%" }}
                transition={{ duration: 0.9, ease, delay: done ? 0.15 + i * 0.1 : 0 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={false}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 16 }}
          transition={{ duration: 0.8, ease, delay: done ? 0.5 : 0 }}
          className={`mt-7 max-w-xl font-sans text-base font-light leading-relaxed text-paper/85 ${
            done ? "" : "pointer-events-none"
          }`}
        >
          Design-build, masonry, and meticulous estate care — crafted for the most
          discerning properties across Morris County and the surrounding hills.
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 16 }}
          transition={{ duration: 0.8, ease, delay: done ? 0.65 : 0 }}
          className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center ${
            done ? "" : "pointer-events-none"
          }`}
        >
          <a href="#contact" className="btn-primary">
            Request a Consultation
          </a>
          <a
            href="#work"
            className="group inline-flex items-center gap-2 font-sans text-[0.78rem] font-semibold uppercase tracking-wide2 text-paper transition-colors duration-300 hover:text-sage"
          >
            View Our Work
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 ease-estate group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Skip control — only while the intro is playing */}
      <motion.button
        type="button"
        onClick={skip}
        animate={{ opacity: done ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className={`absolute bottom-7 right-6 z-20 flex items-center gap-2 font-sans text-[0.62rem] uppercase tracking-label text-paper/70 transition-colors hover:text-paper lg:right-10 ${
          done ? "pointer-events-none" : ""
        }`}
      >
        Skip Intro
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 4l8 8-8 8M14 4v16" />
        </svg>
      </motion.button>

      {/* Scroll cue — appears once content is revealed */}
      <motion.div
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ delay: done ? 1 : 0, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <motion.span
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 font-sans text-[0.6rem] uppercase tracking-label text-paper/70"
        >
          Scroll
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </motion.span>
      </motion.div>
    </section>
  );
}
