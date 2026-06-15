"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const services = [
  "Landscape Design-Build",
  "Hardscaping & Masonry",
  "Maintenance & Estate Care",
  "Not sure yet — advise me",
];

const inputBase =
  "w-full border-b border-white/25 bg-transparent pb-2.5 pt-1 font-sans text-[0.95rem] text-paper " +
  "placeholder:text-paper/35 transition-colors duration-300 focus:border-sage focus:outline-none";

const labelBase =
  "font-sans text-[0.68rem] font-semibold uppercase tracking-wide2 text-muted";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // ── Formspree path (real inbox submissions) ──
    if (site.formspreeId) {
      setStatus("submitting");
      try {
        const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          setStatus("success");
          form.reset();
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
      return;
    }

    // ── Fallback: open the visitor's email client, pre-filled ──
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const property = String(data.get("property") || "");
    const service = String(data.get("service") || "");
    const message = String(data.get("message") || "");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProperty: ${property}\nService of interest: ${service}\n\n${message}`
    );
    const subject = encodeURIComponent(`Consultation request — ${name}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("success");
  }

  return (
    <section
      id="contact"
      className="bg-ink bg-[radial-gradient(110%_90%_at_85%_0%,rgba(60,140,90,0.12),transparent_55%)] py-24 text-paper lg:py-36"
    >
      <div className="mx-auto grid max-w-edge gap-16 px-6 lg:grid-cols-12 lg:gap-20 lg:px-10">
        {/* Left: invitation + details */}
        <div className="lg:col-span-5">
          <Reveal>
            <span className="eyebrow text-sage">Begin</span>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-tight sm:text-5xl lg:text-[3.4rem]">
              Request a private consultation.
            </h2>
            <p className="mt-6 max-w-md font-sans text-[0.95rem] font-light leading-relaxed text-paper/70">
              Tell us a little about your property and what you have in mind. We
              accept a limited number of new projects each season to ensure every
              estate receives our full attention.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-12 space-y-7 border-t border-white/10 pt-10">
              <div>
                <dt className={`${labelBase} text-sage`}>Telephone</dt>
                <dd className="mt-2">
                  <a
                    href={site.phoneHref}
                    className="font-serif text-2xl text-paper transition-colors hover:text-sage"
                  >
                    {site.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={`${labelBase} text-sage`}>Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${site.email}`}
                    className="font-serif text-2xl text-paper transition-colors hover:text-sage"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={`${labelBase} text-sage`}>Studio</dt>
                <dd className="mt-2 font-sans text-sm font-light leading-relaxed text-paper/80">
                  {site.addressLine1}
                  <br />
                  {site.addressLine2}
                  <br />
                  <span className="text-paper/55">{site.hours}</span>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {/* Right: form */}
        <div className="lg:col-span-7">
          <Reveal delay={0.05}>
            {status === "success" ? (
              <div className="flex h-full min-h-[20rem] flex-col items-start justify-center border border-white/10 bg-white/[0.03] p-10">
                <svg viewBox="0 0 24 24" className="h-10 w-10 text-moss" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.5 2.5L16 9" />
                </svg>
                <h3 className="mt-6 font-serif text-3xl font-medium">Thank you.</h3>
                <p className="mt-3 max-w-md font-sans text-sm font-light text-paper/70">
                  Your request is on its way. A member of our team will be in touch
                  within one business day to arrange your consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className={labelBase}>
                    Full Name
                  </label>
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder="Jane Doe" className={inputBase} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className={labelBase}>
                    Email
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="jane@email.com" className={inputBase} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className={labelBase}>
                    Phone
                  </label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(973) 555-0000" className={inputBase} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="property" className={labelBase}>
                    Property Location
                  </label>
                  <input id="property" name="property" type="text" placeholder="Town, NJ" className={inputBase} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="service" className={labelBase}>
                    Service of Interest
                  </label>
                  <select id="service" name="service" defaultValue="" className={`${inputBase} cursor-pointer`}>
                    <option value="" disabled className="text-ink">
                      Select a service…
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s} className="text-ink">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="message" className={labelBase}>
                    Tell Us About Your Project
                  </label>
                  <textarea id="message" name="message" rows={4} placeholder="A few words about your property and what you envision…" className={`${inputBase} resize-none`} />
                </div>

                {status === "error" && (
                  <p className="sm:col-span-2 font-sans text-sm text-red-300" role="alert">
                    Something went wrong. Please try again or email us directly at {site.email}.
                  </p>
                )}

                <div className="sm:col-span-2 mt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-paper px-8 py-4 font-sans text-[0.78rem] font-semibold uppercase tracking-wide2 text-ink transition-colors duration-300 hover:bg-sage hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    {status === "submitting" ? "Sending…" : "Submit Request"}
                    {status !== "submitting" && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
