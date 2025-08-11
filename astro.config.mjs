// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid", "math"],
    },
  },

  adapter: cloudflare(),
});