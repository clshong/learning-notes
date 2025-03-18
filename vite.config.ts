import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VueJsx(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    external: [".js", ".ts", ".vue", ".tsx", ".jsx"],
  },
  server: {
    open: true,
    port: 8080,
    host: "0.0.0.0",
  },
});
