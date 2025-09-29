import { defineConfig } from "vite";
import path from "node:path";
import { retend } from "retend/plugin";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./source") },
  },
  plugins: [retend()],
  optimizeDeps: {
    exclude: ["@livestore/adapter-web"],
  },
});
