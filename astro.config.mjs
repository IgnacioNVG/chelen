// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
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
  adapter: cloudflare({
    imageService: "compile",
  }),

  // ¡NUEVO: Instrucciones para que Vite no rompa la compilación!
  vite: {
    optimizeDeps: {
      // Excluimos Keystatic y el preset de Cloudflare de la pre-optimización
      exclude: ["@keystatic/astro", "@cloudflare/unenv-preset"],
    },
  },
});
