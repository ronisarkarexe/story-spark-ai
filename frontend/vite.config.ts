import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // ENABLE PWA IN DEVELOPMENT MODE
      devOptions: {
        enabled: true,
        type: "module",
      },
      // Files to cache immediately when the user visits the site
      includeAssets: [
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Story Spark AI",
        short_name: "StorySpark",
        description: "Turn your imagination into fully illustrated AI stories.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Story Spark AI Desktop View",
          },
          {
            src: "/screenshot-mobile.png",
            sizes: "750x1334",
            type: "image/png",
            label: "Story Spark AI Mobile View",
          },
        ],
      },
      workbox: {
        // Caching strategies for offline reading
        runtimeCaching: [
          {
            // 1. Cache API requests for Bookmarks and Posts
            // Uses NetworkFirst: Tries to get fresh data, falls back to cache if offline
            urlPattern: /\/api\/v1\/(bookmarks|post)/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "story-spark-api-cache",
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 2. Cache Story Images (Unsplash)
            // Uses CacheFirst: Loads instantly from cache, saving bandwidth
            urlPattern: /^https:\/\/(images|plus)\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "story-spark-image-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 4001,
  },
});
