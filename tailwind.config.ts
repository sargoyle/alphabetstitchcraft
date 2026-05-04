import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#07120f",
        moss: "#0c3b31",
        aura: "#10b981",
        glow: "#45f6bd",
        paper: "#f7f2e8",
        linen: "#eee3d0"
      }
    }
  },
  plugins: []
};

export default config;

