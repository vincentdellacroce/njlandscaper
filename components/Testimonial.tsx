import Reveal from "./Reveal";

export default function Testimonial() {
  return (
    <section className="border-y border-hairline bg-gradient-to-b from-bone/65 via-bone/30 to-bone/65 py-24 lg:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <svg
            viewBox="0 0 24 24"
            className="mx-auto h-8 w-8 text-moss"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 1-3.5 3-4.5L9.5 6Zm9 0c-3 1.5-4.5 4-4.5 7v5h6v-6h-3c0-2 1-3.5 3-4.5L18.5 6Z" />
          </svg>
        </Reveal>
        <Reveal delay={0.05}>
          <blockquote className="mt-8 font-serif text-[1.7rem] font-light leading-[1.35] text-ink sm:text-3xl lg:text-[2.5rem]">
            &ldquo;They transformed our property into something we never imagined
            possible — and they&rsquo;ve kept it flawless ever since. In fifteen years
            we have never once considered another firm.&rdquo;
          </blockquote>
        </Reveal>
        <Reveal delay={0.1}>
          <figcaption className="mt-8 font-sans text-[0.72rem] font-semibold uppercase tracking-wide2 text-muted">
            Private Client · Mendham, NJ
            <span className="mt-3 block text-sage">Replace with a real testimonial</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
