import Reveal from "./Reveal";
import ImageReveal from "./ImageReveal";
import DrawLine from "./DrawLine";
import TiltCard from "./TiltCard";

const services = [
  {
    no: "01",
    title: "Landscape Design-Build",
    copy: "From the first hand-drawn concept to the final planting, we design and build complete grounds — gardens, grading, plantings, lighting, and irrigation — composed as one cohesive vision tailored to your home and its setting.",
    points: ["Master planning & 3D design", "Custom planting schemes", "Landscape lighting & irrigation"],
    img: "/photos/residential-landscaping-service_1B6TP9.webp",
    alt: "Modern home at dusk with a designed drought-tolerant front garden and warm landscape lighting",
  },
  {
    no: "02",
    title: "Hardscaping & Masonry",
    copy: "Bluestone terraces, dry-laid stone walls, custom pool surrounds, and bespoke outdoor living. Our masons work in natural stone and brick with the precision of a craft passed down — built to weather a lifetime of Jersey seasons.",
    points: ["Patios, terraces & walkways", "Stone walls & pillars", "Outdoor kitchens & fire features"],
    img: "/photos/maxresdefault.jpg",
    alt: "Tiered natural-stone retaining walls with curved planting beds full of colorful flowers",
  },
  {
    no: "03",
    title: "Maintenance & Estate Care",
    copy: "Discreet, white-glove stewardship that keeps your property immaculate year-round — fine gardening, seasonal color, pruning, lawn care, and proactive attention from a dedicated team that knows your grounds intimately.",
    points: ["Fine gardening & horticulture", "Seasonal programs & color", "Year-round estate stewardship"],
    img: "/photos/grass-220465_1280.webp",
    alt: "Immaculately striped lawn in front of an estate home with mature shrubs and flower beds",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden border-t border-hairline bg-gradient-to-b from-bone/70 via-paper to-bone/50 py-24 lg:py-36"
    >
      <div className="relative z-10 mx-auto max-w-edge px-6 lg:px-10">
        <Reveal className="mb-16 flex flex-col gap-6 lg:mb-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow">What We Do</span>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl lg:text-6xl">
              Three disciplines, <br className="hidden sm:block" />one standard.
            </h2>
          </div>
          <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-graphite">
            The people who design your project are the same ones who build it — and
            the ones who come back to care for it. We don&rsquo;t hand the work to
            crews we don&rsquo;t know; in our experience, that&rsquo;s the first
            thing that goes wrong.
          </p>
        </Reveal>

        <div className="flex flex-col">
          {services.map((s, i) => (
            <div key={s.no}>
              <DrawLine />
              <article
                className={`group/row grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-20 lg:py-20 ${
                  i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <TiltCard>
                    <ImageReveal
                      src={s.img}
                      alt={s.alt}
                      className="aspect-[4/3] w-full"
                      imageClassName="group-hover/row:scale-[1.04]"
                    />
                  </TiltCard>
                </div>
                <Reveal className="lg:px-2">
                  <span className="font-serif text-2xl text-sage transition-colors duration-500 ease-estate group-hover/row:text-moss">
                    {s.no}
                  </span>
                  <h3 className="mt-3 font-serif text-3xl font-medium text-ink lg:text-4xl">
                    <span className="relative inline-block transition-colors duration-500 ease-estate group-hover/row:text-forest after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-moss after:transition-all after:duration-500 after:ease-estate group-hover/row:after:w-full">
                      {s.title}
                    </span>
                  </h3>
                  <p className="mt-5 max-w-md font-sans text-[0.95rem] font-light leading-relaxed text-graphite">
                    {s.copy}
                  </p>
                  <ul className="mt-7 flex flex-col gap-3">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-3 font-sans text-sm text-ink"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
