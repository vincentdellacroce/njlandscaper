import Logo from "./Logo";
import { nav, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-edge px-6 lg:px-10">
        <div className="grid gap-12 border-t border-white/10 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-paper">
              <Logo />
            </div>
            <p className="mt-6 max-w-xs font-sans text-sm font-light leading-relaxed text-paper/60">
              Luxury landscape design-build, masonry, and estate care for {site.region}.
            </p>
          </div>

          <div className="lg:col-span-3">
            <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-label text-sage">
              Explore
            </span>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-sans text-sm text-paper/70 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-label text-sage">
              Contact
            </span>
            <ul className="mt-5 space-y-3 font-sans text-sm text-paper/70">
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-paper">
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-paper">
                  {site.email}
                </a>
              </li>
              <li className="text-paper/60">
                {site.addressLine1}, {site.addressLine2}
              </li>
            </ul>
            <div className="mt-6 flex gap-4">
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-paper/70 transition-colors hover:border-sage hover:text-sage"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                </svg>
              </a>
              <a
                href={site.social.houzz}
                aria-label="Houzz"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 font-sans text-xs font-bold text-paper/70 transition-colors hover:border-sage hover:text-sage"
              >
                Hz
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-paper/50">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-sans text-xs text-paper/40">
            Licensed &amp; insured · NJ Home Improvement Contractor
          </p>
        </div>
      </div>
    </footer>
  );
}
