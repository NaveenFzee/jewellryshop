import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0D12",
          light: "#12151D",
          border: "#242A38",
        },
        champagne: {
          DEFAULT: "#C9A35B",
          light: "#E4C98A",
          dark: "#9C7C3E",
        },
        ivory: {
          DEFAULT: "#F8F4EA",
          dim: "#EFE8D8",
        },
        oxblood: {
          DEFAULT: "#6B1E2B",
          light: "#8C2E3D",
        },
        platinum: {
          DEFAULT: "#C7CBD1",
          dim: "#9CA1AA",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        label: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E4C98A 0%, #C9A35B 45%, #9C7C3E 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(201,163,91,0.18), transparent 60%)",
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(201,163,91,0.35), 0 8px 30px -8px rgba(201,163,91,0.25)",
        "gold-lg": "0 0 0 1px rgba(201,163,91,0.4), 0 20px 60px -15px rgba(201,163,91,0.35)",
      },
      keyframes: {
        "flip-up": {
          "0%": { transform: "rotateX(0deg)" },
          "50%": { transform: "rotateX(-90deg)", opacity: "0.4" },
          "100%": { transform: "rotateX(0deg)" },
        },
        drift: {
          "0%": { transform: "translate(0,0)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translate(var(--drift-x,20px),-120px)", opacity: "0" },
        },
      },
      animation: {
        "flip-up": "flip-up 0.5s ease-in-out",
        drift: "drift linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
