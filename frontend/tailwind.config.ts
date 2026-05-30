/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./login.html",
    "./signup.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed": "#36003e",
        "tertiary-container": "#ec6a06",
        "surface-dim": "#101319",
        "outline-variant": "#494454",
        "on-primary-container": "#340080",
        "error": "#ffb4ab",
        "surface-bright": "#36393f",
        "surface": "#101319",
        "on-primary-fixed-variant": "#5516be",
        "tertiary-fixed-dim": "#ffb690",
        "on-tertiary": "#552100",
        "on-error-container": "#ffdad6",
        "secondary-container": "#ae05c6",
        "primary-container": "#a078ff",
        "surface-container-lowest": "#0b0e13",
        "outline": "#958ea0",
        "surface-container-high": "#272a30",
        "on-secondary-fixed-variant": "#7c008e",
        "primary": "#d0bcff",
        "on-primary": "#3c0091",
        "on-secondary-container": "#ffd8fd",
        "on-tertiary-fixed": "#341100",
        "on-error": "#690005",
        "primary-fixed": "#e9ddff",
        "surface-variant": "#32353b",
        "tertiary-fixed": "#ffdbca",
        "on-tertiary-fixed-variant": "#783200",
        "on-surface-variant": "#cbc3d7",
        "background": "#101319",
        "on-secondary": "#580065",
        "inverse-surface": "#e1e2ea",
        "inverse-on-surface": "#2d3036",
        "on-tertiary-container": "#4a1c00",
        "error-container": "#93000a",
        "inverse-primary": "#6d3bd7",
        "on-background": "#e1e2ea",
        "surface-tint": "#d0bcff",
        "surface-container-highest": "#32353b",
        "surface-container": "#1d2025",
        "on-primary-fixed": "#23005c",
        "secondary": "#fbabff",
        "tertiary": "#ffb690",
        "surface-container-low": "#191c21",
        "on-surface": "#e1e2ea",
        "primary-fixed-dim": "#d0bcff",
        "secondary-fixed-dim": "#fbabff",
        "secondary-fixed": "#ffd6fd"
      },
      fontFamily: {
        "body-md": ["Inter"],
        "display-lg": ["Inter"],
        "label-caps": ["Inter"],
        "headline-md": ["Inter"]
      },
      fontSize: {
        "body-md": ["15px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "display-lg": ["36px", {"lineHeight": "1.15", "letterSpacing": "-0.02em", "fontWeight": "800"}],
        "display-lg-mobile": ["26px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "800"}],
        "label-caps": ["11px", {"lineHeight": "1.0", "letterSpacing": "0.08em", "fontWeight": "600"}],
        "headline-md": ["18px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "700"}]
      }
    }
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/container-queries'),
  ],
}
