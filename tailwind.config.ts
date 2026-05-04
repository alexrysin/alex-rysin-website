import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1C3879",
          light: "#2a4a9e",
          dark: "#142b5c",
        },
        "blue-mid": "#4A6FA5",
        olive: {
          DEFAULT: "#5A781E",
          light: "#6B8E23",
          dark: "#476016",
        },
      },
      fontFamily: {
        heebo: ["var(--font-heebo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
