import { site } from "@/lib/site";

/**
 * Minimal estate sprig mark + serif wordmark.
 * Uses currentColor so it inverts cleanly over the hero and on white.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-8 w-8 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* central stem */}
        <path d="M20 35V11" />
        {/* leaf pairs */}
        <path d="M20 27c-4 0-7-2-8-6 4-1 7 1 8 6Z" />
        <path d="M20 27c4 0 7-2 8-6-4-1-7 1-8 6Z" />
        <path d="M20 19c-3.4 0-6-1.8-6.8-5.2 3.4-.8 6 1 6.8 5.2Z" />
        <path d="M20 19c3.4 0 6-1.8 6.8-5.2-3.4-.8-6 1-6.8 5.2Z" />
        {/* crown bud */}
        <path d="M20 12c-1.6-1.4-2-3.4-1-5.6 2.2.6 3 2.6 1 5.6Z" />
        <path d="M20 12c1.6-1.4 2-3.4 1-5.6-2.2.6-3 2.6-1 5.6Z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.35rem] font-semibold tracking-tight">
          Morris Estate
        </span>
        <span className="font-sans text-[0.55rem] font-medium uppercase tracking-label opacity-70">
          Landscapes
        </span>
      </span>
    </span>
  );
}
