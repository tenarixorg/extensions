import { defineConfig } from "vite";

export default defineConfig({
  mode: "production",
  root: "./src",
  build: {
    outDir: "../dist",
    lib: {
      entry: "index.ts",
      formats: ["cjs"],
    },
    sourcemap: false,
    minify: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
