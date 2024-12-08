import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import fs from "fs";
// import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "create-redirects",
      writeBundle() {
        fs.writeFileSync(
          path.resolve(__dirname, "dist/_redirects"),
          "/* /index.html 200"
        );
      },
    },
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
    // ...(process.env.NODE_ENV === "development" ? [basicSsl()] : []),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
