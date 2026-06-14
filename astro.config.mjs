// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://revistachelen.com",
  output: "static", // Esto es lo correcto ahora
  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),
  integrations: [mdx(), sitemap(), react(), keystatic()],
  vite: {
    optimizeDeps: {
      exclude: ["@keystatic/astro"],
    },
  },
});
