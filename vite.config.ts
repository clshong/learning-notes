import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VueJsx()],
  server: {
    open: true,
    port: 8080,
    host: "0.0.0.0",
  },
});
