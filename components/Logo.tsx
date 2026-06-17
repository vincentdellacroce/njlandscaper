import Image from "next/image";

/**
 * Brand logo (tree emblem) + serif wordmark.
 * The PNG is a single dark-green mark on transparency; over dark backgrounds
 * (the hero, the footer) pass `light` to render it white for contrast.
 */
export default function Logo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="Mowtrix High End Designs"
        width={40}
        height={41}
        priority
        className={`h-9 w-auto shrink-0 transition-[filter] duration-500 ease-estate ${
          light ? "[filter:brightness(0)_invert(1)]" : ""
        }`}
      />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.35rem] font-semibold tracking-tight">
          Mowtrix
        </span>
        <span className="font-sans text-[0.5rem] font-medium uppercase tracking-[0.2em] opacity-70">
          High End Designs
        </span>
      </span>
    </span>
  );
}
