// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://revistachelen.com",
  output: "static",
  image: {
    layout: "constrained",
  },
  integrations: [mdx(), sitemap(), react(), keystatic()],

  // Vite mantiene la configuración necesaria para Keystatic
  vite: {
    optimizeDeps: {
      exclude: ["@keystatic/astro"],
    },
  },
});
