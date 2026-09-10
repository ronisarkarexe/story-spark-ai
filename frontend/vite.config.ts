/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'android-chrome-192x192.png', 'android-chrome-512x512.png'],
      manifest: {
        name: 'Story Spark AI',
        short_name: 'StorySpark',
        description: 'Story Spark AI Application',
        theme_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Caches all static assets, ensuring index.css and tokens.css are reliably stored offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
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
            if (
              id.includes("recharts") ||
              id.includes("chart.js") ||
              id.includes("d3")
            ) {
              return "vendor-charts-d3";
            }
            if (id.includes("docx")) {
              return "vendor-docx";
            }
          }
        },
      },
    },
  },
});