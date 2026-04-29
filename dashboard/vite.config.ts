import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the project site under /<repo-name>/.
// Override at build time with VITE_BASE=/ for custom-domain hosting.
const base = process.env.VITE_BASE ?? "/lumivara-site/";

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
