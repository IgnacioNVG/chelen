// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://revistachelen.com",
  output: "static", // Esto es lo correcto ahora
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  integrations: [mdx(), sitemap(), react()],
  vite: {
    optimizeDeps: {
      exclude: ["@keystatic/astro"],
    },
  },
});
