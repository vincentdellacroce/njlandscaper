"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import PhotoSlot from "./PhotoSlot";
import RootCanvas from "./RootCanvas";

type Project = {
  title: string;
  cat: string;
  town: string;
  /** real photo (public path) — omit to show the placeholder slot */
  img?: string;
};

const projects: Project[] = [
  { title: "Hilltop Garden Estate", cat: "Design-Build", town: "Mendham", img: "/photos/morlet-estate-hilltop-house-lisiting-featured-sthelena.jpg" },
  { title: "Bluestone Terrace", cat: "Hardscaping", town: "Bernardsville", img: "/photos/patio-bluestone1.jpg" },
  { title: "Walled Pool Garden", cat: "Design-Build", town: "Far Hills", img: "/photos/1-12.jpeg" },
  { title: "Heritage Stone Walls", cat: "Masonry", town: "Harding", img: "/photos/CastStoneWall_HeroImage_2024.jpg" },
  { title: "Allée & Entry Court", cat: "Design-Build", town: "Chatham", img: "/photos/cupertino-city-hall-walkway.jpg" },
  { title: "Manor Grounds Care", cat: "Estate Care", town: "Morristown", img: "/photos/2023-07-21-09.30.29-scaled-1.jpg" },
];

export default function Portfolio() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="relative overflow-hidden bg-gradient-to-b from-paper via-paper to-bone/45 py-24 lg:py-36">
      {/* Interactive root-growth that lives in the white space behind the work */}
      <RootCanvas
        fillSpacing={18}
        attractionDistance={44}
        killDistance={5}
        segmentLength={3}
        maxAttractors={5200}
        maxNodes={32000}
        growthPerFrame={26}
        maxWidth={4}
      />
      <div className="relative z-10 mx-auto max-w-edge px-6 lg:px-10">
        <Reveal className="mb-14 flex flex-col gap-6 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow">Selected Work</span>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl lg:text-6xl">
              A portfolio of <br className="hidden sm:block" />enduring grounds.
            </h2>
          </div>
          <a href="#contact" className="btn-ghost group self-start lg:self-end">
            Start your project
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 ease-estate group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>

        {/* Mobile: edge-to-edge swipe gallery. Desktop: full-width column. */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-24 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {projects.map((p) => (
            <Reveal
              key={p.title}
              delay={0.05}
              className="group w-[82%] shrink-0 snap-center sm:w-[58%] lg:w-full lg:shrink"
            >
              {/* Only the photo is clickable — and the only place roots avoid */}
              <a href="#contact" data-root-exclude className="block cursor-pointer">
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm">
                  <motion.div
                    className="relative h-full w-full"
                    whileHover={reduce ? {} : { scale: 1.045 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {p.img ? (
                      <Image
                        src={p.img}
                        alt={`${p.title} — ${p.cat} project in ${p.town}, NJ`}
                        fill
                        sizes="(min-width: 1024px) 90vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <PhotoSlot
                        label={`${p.title} — ${p.cat}`}
                        hint="replace · project photo"
                        className="h-full w-full"
                      />
                    )}
                  </motion.div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </a>
              {/* Caption is not a link, so roots are free to grow through this strip */}
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-medium text-ink transition-colors duration-300 group-hover:text-forest lg:text-2xl">
                    {p.title}
                  </h3>
                  <span className="font-sans text-[0.7rem] uppercase tracking-wide2 text-muted">
                    {p.town}, NJ
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-hairline px-3 py-1 font-sans text-[0.6rem] font-semibold uppercase tracking-wide2 text-graphite">
                  {p.cat}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
