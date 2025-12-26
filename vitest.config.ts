import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Mock Sentry to prevent import-in-the-middle hooks
      "@sentry/node": new URL("./src/__mocks__/sentry.ts", import.meta.url)
        .pathname,
      "import-in-the-middle": new URL(
        "./src/__mocks__/import-in-the-middle.ts",
        import.meta.url,
      ).pathname,
      // Mock pg database driver
      pg: new URL("./src/__mocks__/pg.ts", import.meta.url).pathname,
    },
  },
  test: {
    env: {
      NODE_ENV: "local",
    },
    server: {
      deps: {
        // Force inline all dependencies to bypass import-in-the-middle
        inline: true,
      },
    },
  },
});
