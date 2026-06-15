import Reveal from "./Reveal";
import DrawLine from "./DrawLine";
import CountUp from "./CountUp";
import CursorGlow from "./CursorGlow";
import ProximityHighlight from "./ProximityHighlight";

const stats = [
  { value: "25+", label: "Years Cultivating Estates" },
  { value: "300+", label: "Properties Designed & Built" },
  { value: "8", label: "Morris County Townships" },
  { value: "100%", label: "Referral & Repeat Clientele" },
];

export default function Intro() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <CursorGlow tone="light" />
      <div className="relative z-10 mx-auto grid max-w-edge gap-14 px-6 lg:grid-cols-12 lg:px-10">
        <Reveal className="lg:col-span-2">
          <span className="eyebrow">Our Ethos</span>
          <DrawLine vertical className="mt-6 hidden h-20 lg:block" />
        </Reveal>
        <div className="lg:col-span-10">
          <Reveal>
            <p className="font-serif text-[1.75rem] font-light leading-[1.32] text-ink sm:text-[2.3rem] lg:text-[2.7rem]">
              A good landscape never asks to be noticed — you just feel something
              ease the moment you turn into the drive. We&rsquo;ve looked after
              properties around Morris County for three generations now, and the
              lesson that stuck is a quiet one:{" "}
              <ProximityHighlight>the details nobody points to are the
              ones that make a place feel finished.</ProximityHighlight>{" "}
              That&rsquo;s the part we lose sleep over.
            </p>
          </Reveal>

          <div className="mt-16">
            <DrawLine />
            <div className="grid grid-cols-2 gap-y-10 pt-12 lg:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1} className="pr-6">
                  <CountUp
                    value={s.value}
                    className="block font-serif text-4xl font-medium text-ink lg:text-5xl"
                  />
                  <div className="mt-2 font-sans text-[0.7rem] font-medium uppercase tracking-wide2 text-muted">
                    {s.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
