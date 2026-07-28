import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    settings: {
      react: { version: "19" }, // Avoids auto-detection crash
    },
    files: [
      "app/**/*.{js,jsx}",
      "components/**/*.{js,jsx}",
      "lib/**/*.{js,jsx}",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message:
            "Use TypeScript (.ts/.tsx) instead of JavaScript in app/, components/, and lib/.",
        },
      ],
    },
  },
]);

export default eslintConfig;
