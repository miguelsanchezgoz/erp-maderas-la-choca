import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        timber: {
          50: "#faf6f0",
          100: "#f4ece0",
          200: "#e8d6be",
          300: "#d8ba96",
          400: "#c69b6e",
          500: "#b5804f",
          600: "#9e6740",
          700: "#804f35",
          800: "#69412f",
          900: "#573729",
          950: "#321d15",
        },
        forest: {
          50: "#f1f8f4",
          100: "#def0e6",
          200: "#bee0ce",
          300: "#92c9ae",
          400: "#62ab89",
          500: "#3e8f6c",
          600: "#2e7255",
          700: "#265b45",
          800: "#214939",
          900: "#1d3d30",
          950: "#0d211a",
        },
        industrial: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        amberGold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
