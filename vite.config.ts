import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["img/icon-512.png"],
      manifest: {
        name: "PopcornTrail",
        short_name: "PopcornTrail",
        description: "Movie Tracker iOS App",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "img/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
