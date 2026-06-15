import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper neutrals
        paper: "#FBFAF7",
        bone: "#F4F2EC",
        ink: "#16201A", // near-black with a green cast
        graphite: "#3A453E",
        muted: "#6B746D",
        hairline: "#E4E1D8",
        // Refined botanical greens (the small accents)
        forest: "#1F4D2E",
        moss: "#3C8C5A",
        sage: "#8AA791",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.28em",
        wide2: "0.16em",
      },
      maxWidth: {
        edge: "88rem",
      },
      transitionTimingFunction: {
        estate: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
