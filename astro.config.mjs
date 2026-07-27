// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://revistachelen.com",
  output: "server",
  redirects: {
    "/tema/filosofia-e-ideas": "/tema/teoria-e-ideas",
  },
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [mdx(), sitemap(), react()],
});
