import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

// 1. Detectamos si el comando que se está ejecutando es "dev"
const isDev = process.argv.includes("dev");

export default defineConfig({
  site: "https://revistachelen.com",
  output: "server", // o "hybrid" dependiendo de tu caso

  integrations: [react(), keystatic(), mdx(), sitemap()],

  // 2. Solo aplicamos el adaptador si NO estamos en local
  adapter: isDev
    ? undefined
    : cloudflare({
        imageService: "passthrough",
        // (y cualquier otra configuración de cloudflare que tengas aquí)
      }),
});
