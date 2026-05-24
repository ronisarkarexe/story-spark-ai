import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import noUnsanitized from "eslint-plugin-no-unsanitized";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["app/visualizer/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "no-unsanitized": noUnsanitized,
    },
    rules: {
      // Prevent DOM XSS regressions: avoid HTML parsing sinks in visualizers.
      // Covers `innerHTML`, `outerHTML`, `insertAdjacentHTML`, etc.
      "no-unsanitized/property": "error",
      "no-unsanitized/method": "error",
    },
  },
];

export default eslintConfig;
