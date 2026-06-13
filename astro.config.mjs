// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com", // Recuerda cambiar esto por tu dominio real

  // ¡ESTE ES EL CAMBIO CLAVE!
  output: "hybrid",

  image: {
    layout: "constrained",
  },
  // Optimiza con sharp en build (prerender); Cloudflare no ejecuta sharp en runtime.
  imageService: "compile",
  integrations: [mdx(), sitemap(), react(), keystatic()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
