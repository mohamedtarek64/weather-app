import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    open: true,
  },
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "@weather-icons": resolve(rootDir, "src/icons/weather"),
    },
  },
});
