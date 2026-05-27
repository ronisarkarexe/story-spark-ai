/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Source Sans 3"',
          '"Source Sans Pro"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        serif: ['"Source Serif 4"', '"Source Serif Pro"', "Georgia", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        udemy: {
          purple: "#a435f0",
          "purple-dark": "#7d2be0",
          "purple-light": "#c27cf7",
          yellow: "#f4c430",
          bg: "#ffffff",
          surface: "#f7f9fa",
          border: "#d1d7dc",
          text: "#1c1d1f",
          muted: "#6a6f73",
          "dark-bg": "#1c1d1f",
          "dark-surface": "#2d2f31",
          "dark-border": "#3e4143",
          "dark-text": "#f7f9fa",
          "dark-muted": "#9e9e9e",
        },
        surface: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
          950: "var(--color-neutral-950)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
          light: "var(--color-primary-light)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        muted: "var(--color-muted)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        btn: "var(--shadow-btn)",
        elevated: "var(--shadow-elevated)",
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        normal: "var(--motion-normal)",
        slow: "var(--motion-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      addUtilities({
        ".perspective-1000": { perspective: "1000px" },
        ".backface-hidden": { "backface-visibility": "hidden" },
        ".rotate-y-180": { transform: "rotateY(180deg)" },
        ".transform-style-3d": { "transform-style": "preserve-3d" },
      });
    },
  ],
};
