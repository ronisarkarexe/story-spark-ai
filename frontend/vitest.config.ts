import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
  },
  resolve: {
    alias: {
      "lodash.debounce": path.resolve(__dirname, "src/utils/__mocks__/lodash.debounce.ts"),
    },
  },
});
