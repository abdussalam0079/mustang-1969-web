import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:        "#000000",
        surface1:  "#101010",
        surface2:  "#151515",
        text1:     "#F5F5F5",
        text2:     "#B8B8B8",
        muted:     "#858585",
        border:    "#2A2A2A",
        red:       "#E60000",
        "red-deep":"#990000",
      },
      fontFamily: {
        display:   ["Orbitron", "sans-serif"],
        body:      ["Inter", "sans-serif"],
        soft:      ["Manrope", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
