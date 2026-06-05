/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#18181b",
          slate: "#52525b",
          muted: "#71717a",
          accent: "#ea580c",
          "accent-dim": "#c2410c",
          sky: "#fdba74",
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(234, 88, 12, 0.08), 0 2px 12px rgba(24, 24, 27, 0.06)",
        glow: "0 0 22px rgba(234, 88, 12, 0.35), 0 8px 32px rgba(234, 88, 12, 0.15)",
        "accent-soft": "0 6px 22px rgba(234, 88, 12, 0.18), 0 2px 8px rgba(234, 88, 12, 0.1)",
        "accent-lift": "0 14px 40px rgba(234, 88, 12, 0.2), 0 4px 14px rgba(234, 88, 12, 0.12)",
        "accent-card": "0 10px 36px rgba(234, 88, 12, 0.12), 0 2px 10px rgba(24, 24, 27, 0.06)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(to right, rgba(24,24,27,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
