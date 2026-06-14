// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";

// Magia: Detectamos si estamos subiendo a producción o desarrollando en local
const isProd = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  output: "static",

  image: {
    layout: "constrained",
  },
  imageService: "compile",
  integrations: [mdx(), sitemap(), react(), keystatic()],

  // Condición: Si es producción usamos Cloudflare, si es local usamos Node estándar
  adapter: isProd ? cloudflare() : undefined,

  vite: {
    optimizeDeps: {
      exclude: ["@keystatic/astro", "@cloudflare/unenv-preset"],
    },
  },
});
