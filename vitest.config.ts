// import { resolve } from "path";
/* eslint-disable import/no-unresolved */
import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
  // resolve: {
  //   alias: {
  //     "@": resolve(__dirname, "./src"),
  //     "@components": resolve(__dirname, "./src/components"),
  //     "@views": resolve(__dirname, "./src/views"),
  //     "@utils": resolve(__dirname, "./src/utils"),
  //     "@hooks": resolve(__dirname, "./src/hooks"),
  //     "@assets": resolve(__dirname, "./src/assets"),
  //     "@types": resolve(__dirname, "./src/types"),
  //     "@test": resolve(__dirname, "./src/test"),
  //     "@public": resolve(__dirname, "./public"),
  //   },
  // },
});
