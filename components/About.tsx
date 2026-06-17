import Reveal from "./Reveal";
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero";
import { site } from "@/lib/site";

export default function About() {
  return (
    <section id="about" className="bg-gradient-to-b from-bone/45 via-paper to-paper py-24 lg:py-36">
      <div className="mx-auto grid max-w-edge gap-14 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
        <div className="lg:col-span-5">
          <SmoothScrollHero
            desktopImage="/photos/our-story-crew.webp"
            mobileImage="/photos/our-story-crew.webp"
            alt="The Mowtrix High End Designs crew on site with the company truck and trailer"
            initialClipPercentage={25}
            finalClipPercentage={75}
            className="aspect-[3/4] w-full lg:sticky lg:top-28"
          />
        </div>

        <div className="lg:col-span-7 lg:pt-6">
          <Reveal>
            <span className="eyebrow">Our Story</span>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              A family practice, rooted in Morris County.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 font-sans text-[0.95rem] font-light leading-relaxed text-graphite">
              <p>
                Mowtrix High End Designs began with a single wheelbarrow and an
                unwavering belief that the grounds of a home deserve the same
                artistry as its architecture. Three generations later, that belief
                still guides every project we take on.
              </p>
              <p>
                We keep our roster intentionally small. Each estate is led personally
                by a principal, executed by craftsmen we have worked alongside for
                years, and tended long after the last stone is set. It is why our
                clients stay with us for decades — and why their neighbors call next.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 border-t border-hairline pt-8">
              <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-label text-muted">
                Proudly serving
              </span>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {site.serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="flex items-center gap-2 font-serif text-lg text-ink"
                  >
                    <span className="h-1 w-1 rounded-full bg-moss" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
