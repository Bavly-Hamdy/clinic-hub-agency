import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#09090b",
          pure: "#000000",
          soft: "#121215",
          surface: "#18181c",
          border: "#27272a",
        },
        paper: {
          DEFAULT: "#f7f6f2",
          pure: "#ffffff",
          warm: "#f3f2ec",
          muted: "#e8e7e1",
        },
        brass: {
          DEFAULT: "#c5a059",
          deep: "#8f7032",
          soft: "#dfc78f",
          hairline: "rgba(197, 160, 89, 0.25)",
        },
        stone: {
          100: "#f4f4f2",
          200: "#e5e5e2",
          300: "#d4d4d0",
          400: "#a3a39e",
          500: "#73736c",
          600: "#52524d",
          700: "#3f3f3a",
          800: "#262624",
          900: "#171716",
        },
      },
      fontFamily: {
        display: ['"Reem Kufi"', '"Cairo"', "serif"],
        body: ['"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "76rem",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.04em",
        widest: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
