import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'dist/public',
  resolve: {
    alias: {
      "@src": "/src",
    },
  },
});
