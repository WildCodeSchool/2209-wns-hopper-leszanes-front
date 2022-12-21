/* eslint-disable consistent-return */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      host: "localhost",
    },
  },
  build: {
    watch: {
      chokidar: {
        usePolling: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
                        @import 'src/assets/styles/variables.scss';
                        @import 'src/assets/styles/global.scss';
                      `,
      },
    },
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
  //     "@public": resolve(__dirname, "./public"),
  //   },
  // },
});
