// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

const isCloudflare =
  process.env.CF_PAGES || process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://revistachelen.com",
  output: "static",

  // AQUÍ ESTÁ LA CORRECCIÓN:
  // Si es Cloudflare, usa tu configuración. Si es local, usa undefined.
  adapter: isCloudflare
    ? cloudflare({
        imageService: "compile",
        prerenderEnvironment: "node",
      })
    : undefined,

  integrations: [mdx(), sitemap(), react(), keystatic()],
  vite: {
    optimizeDeps: {
      exclude: ["@keystatic/astro"],
    },
  },
});
