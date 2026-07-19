/// <reference types="vitest" />
import { defineConfig } from "vite";

import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
/// <reference types="vitest" />

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
  },


    globals: true,
    environment: "jsdom",
  },

  environment: "jsdom",
  globals: true,
},


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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Group core React / Redux packages on critical path
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
            if (id.includes("lucide-react")) {
              return "vendor-lucide";
            }
            if (id.includes("framer-motion")) {
              return "vendor-framer-motion";
            }
            if (id.includes("gsap")) {
              return "vendor-gsap";
            }
            if (id.includes("font-awesome") || id.includes("fortawesome")) {
              return "vendor-font-awesome";
            }
            // Group charts and d3 together (loaded lazily)
            if (
              id.includes("recharts") ||
              id.includes("chart.js") ||
              id.includes("d3")
            ) {
              return "vendor-charts-d3";
            }
            // Group docx library (loaded lazily)
            if (id.includes("docx")) {
              return "vendor-docx";
            }
            // Allow other small modules to be split naturally
          }
        },
      },
    },
  },
});