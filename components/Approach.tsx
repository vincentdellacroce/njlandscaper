import Reveal from "./Reveal";
import CursorGlow from "./CursorGlow";
import ProcessGrid from "./ProcessGrid";

const steps = [
  {
    no: "01",
    title: "Consultation",
    copy: "We walk your property together, listen to how you live, and assess the land — its light, grade, soil, and sightlines.",
  },
  {
    no: "02",
    title: "Design",
    copy: "You receive a considered master plan with detailed drawings, material palettes, and planting schemes — refined until it feels inevitable.",
  },
  {
    no: "03",
    title: "Build",
    copy: "Our in-house craftsmen and horticulturists execute every detail on schedule, with daily care and clear communication throughout.",
  },
  {
    no: "04",
    title: "Stewardship",
    copy: "We remain — tending, refining, and protecting your investment season after season so the landscape only grows more beautiful.",
  },
];

export default function Approach() {
  return (
    <section
      id="approach"
      className="relative overflow-hidden bg-ink bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(60,140,90,0.10),transparent_55%)] py-24 text-paper lg:py-36"
    >
      <CursorGlow
        size={640}
        color="rgba(34,82,52,0.85)"
        blend="screen"
        lerp={0.05}
      />
      <div className="relative z-10 mx-auto max-w-edge px-6 lg:px-10">
        <Reveal className="mb-16 max-w-2xl lg:mb-24">
          <span className="eyebrow text-sage">The Process</span>
          <h2 className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
            A measured approach, <br className="hidden sm:block" />
            from first walk to lasting care.
          </h2>
        </Reveal>

        <ProcessGrid steps={steps} />
      </div>
    </section>
  );
}
