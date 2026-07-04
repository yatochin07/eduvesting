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
      fontFamily: {
        sans: ["var(--font-plus)", "sans-serif"], // default
        inter: ["var(--font-inter)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        display: ["var(--font-plus)", "sans-serif"], // dipakai di heading (h1, h2, dst)
        body: ["var(--font-inter)", "sans-serif"],   // dipakai di body text
      },
      colors: {
        eduvesting: {
          light: "#a5b4fc",
          DEFAULT: "#6366f1",
          dark: "#3730a3",
        },
        // Token dari HTML lama — dipertahankan supaya className seperti
        // bg-base-900, text-accent-blue, dll tetap jalan selama migrasi.
        base: {
          950: "#07090f",
          900: "#0f1423",
          850: "#131928",
          800: "#1a2235",
          750: "#1e2840",
          700: "#253049",
        },
        accent: {
          blue: "#3b82f6",
          indigo: "#6366f1",
          violet: "#7c3aed",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
    },
  },
  plugins: [],
};

export default config;