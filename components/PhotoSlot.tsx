import type { CSSProperties } from "react";

type PhotoSlotProps = {
  label: string;
  /** optional second line, e.g. orientation guidance */
  hint?: string;
  className?: string;
  /** dark variant for use under light text (e.g. hero) */
  tone?: "light" | "dark";
  style?: CSSProperties;
  rounded?: boolean;
};

/**
 * Labeled image placeholder.
 *
 *  ▸ TO ADD A REAL PHOTO: replace this component instance with
 *    <Image src="/photos/your-file.jpg" alt="..." fill className="object-cover" />
 *    (next/image) or a plain <img>. The wrapping element keeps the aspect ratio.
 */
export default function PhotoSlot({
  label,
  hint,
  className = "",
  tone = "light",
  style,
  rounded = false,
}: PhotoSlotProps) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        rounded ? "rounded-sm" : ""
      } ${className}`}
      style={{
        backgroundImage: dark
          ? "radial-gradient(120% 120% at 30% 20%, #2a4634 0%, #16261c 55%, #0e1a13 100%)"
          : "linear-gradient(135deg, #f4f2ec 0%, #e7e4db 100%)",
        ...style,
      }}
      aria-hidden="true"
    >
      {/* subtle inner frame */}
      <span
        className={`pointer-events-none absolute inset-3 border ${
          dark ? "border-white/15" : "border-ink/10"
        }`}
      />
      <span className="flex flex-col items-center gap-2 px-4 text-center">
        <svg
          viewBox="0 0 24 24"
          className={`h-7 w-7 ${dark ? "text-white/40" : "text-ink/25"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M3 16l5-4 4 3 3-2.5L21 17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className={`font-sans text-[0.62rem] font-semibold uppercase tracking-label ${
            dark ? "text-white/55" : "text-ink/40"
          }`}
        >
          {label}
        </span>
        {hint ? (
          <span
            className={`font-sans text-[0.6rem] tracking-wide2 ${
              dark ? "text-white/35" : "text-ink/30"
            }`}
          >
            {hint}
          </span>
        ) : null}
      </span>
    </div>
  );
}
