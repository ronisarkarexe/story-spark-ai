import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4001,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Restrict esbuild dep-scan to the main entry only.
    // This prevents broken lazy-loaded files (AudioPlayer, stories.component, etc.)
    // from crashing the pre-bundling step and blocking React from mounting.
    entries: ["src/main.tsx"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react/") ||
              id.includes("react-dom/") ||
              id.includes("react-router/") ||
              id.includes("react-router-dom/") ||
              id.includes("@reduxjs/") ||
              id.includes("react-redux/")
            ) {
              return "vendor-core";
            }
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("framer-motion")) return "vendor-framer-motion";
            if (id.includes("gsap")) return "vendor-gsap";
            if (id.includes("font-awesome") || id.includes("fortawesome")) return "vendor-font-awesome";
            if (id.includes("recharts") || id.includes("chart.js") || id.includes("d3")) return "vendor-charts-d3";
            if (id.includes("docx")) return "vendor-docx";
          }
        },
      },
    },
  },
});