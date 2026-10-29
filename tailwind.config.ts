import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#101312",
          50: "#F4F6F3",
          100: "#E7EAE4",
          200: "#CDD3CA",
          300: "#A7B0A3",
          400: "#778373",
          500: "#566252",
          600: "#3F4A3C",
          700: "#2C352A",
          800: "#1C231B",
          900: "#101312",
        },
        lime: {
          DEFAULT: "#C8F560",
          50: "#F7FDE8",
          100: "#EDFBC8",
          200: "#DDF79B",
          300: "#C8F560",
          400: "#AEDC3B",
          500: "#8FBC22",
          600: "#6D9418",
        },
        cream: "#F6F7F1",
        clay: "#F0E9DF",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-unbounded)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        soft: "0 24px 60px -30px rgba(16, 19, 18, 0.35)",
        card: "0 18px 40px -24px rgba(16, 19, 18, 0.28)",
        lime: "0 18px 40px -18px rgba(174, 220, 59, 0.55)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.7)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.6s ease both",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
