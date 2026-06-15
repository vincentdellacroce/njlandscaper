"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { nav, site } from "@/lib/site";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-estate ${
        solid
          ? "border-b border-hairline bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-20 max-w-edge items-center justify-between px-6 lg:px-10"
        aria-label="Primary"
      >
        <a
          href="#top"
          className={`transition-colors duration-500 ${
            solid ? "text-ink" : "text-paper"
          }`}
          aria-label={`${site.name} — home`}
        >
          <Logo />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 lg:flex">
          <ul
            className={`flex items-center gap-9 font-sans text-[0.78rem] font-medium uppercase tracking-wide2 transition-colors duration-500 ${
              solid ? "text-graphite" : "text-paper/90"
            }`}
          >
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative inline-block py-1 transition-colors duration-300 hover:text-moss
                    after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-moss
                    after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn-primary">
            Request Consultation
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`relative z-50 flex h-11 w-11 items-center justify-center lg:hidden ${
            solid ? "text-ink" : "text-paper"
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </nav>
    </header>

    {/* Mobile menu panel — kept OUTSIDE the blurred header so its
        `fixed inset-0` resolves against the viewport, not the header
        (backdrop-filter on the header would otherwise clip it). */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-paper px-6 pt-28 lg:hidden transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-hairline">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-5 font-serif text-3xl text-ink transition-colors hover:text-forest"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="btn-primary mt-10 w-full"
        >
          Request Consultation
        </a>
        <div className="mt-auto py-10 font-sans text-sm text-muted">
          <a href={site.phoneHref} className="block hover:text-forest">
            {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="block hover:text-forest">
            {site.email}
          </a>
        </div>
      </div>
    </>
  );
}
