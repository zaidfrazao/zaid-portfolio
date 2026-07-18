import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mirror the tsconfig `@/*` -> `src/*` path alias so tests import like app code.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // jsdom gives components a DOM; globals expose describe/it/expect without imports.
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Co-located specs, per docs/TESTING_STRATEGY.md.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/**/*.d.ts",
        // Root layout is exercised end-to-end (Playwright), not in unit tests.
        "src/app/layout.tsx",
      ],
      // 70% floor per the Testing Strategy. Kept soft locally so a quick
      // `test:coverage` doesn't fail mid-development; hard in CI (PORT-4), where
      // `CI` is always set, so a PR below the floor fails the build.
      thresholds: process.env.CI
        ? { lines: 70, branches: 70, functions: 70, statements: 70 }
        : undefined,
    },
  },
});
