// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Two deploy targets share this config:
// - Default (Lovable / Cloudflare Workers): keep the Nitro Cloudflare preset
//   the base config provides, and SSR pages at runtime. Prerender is OFF here
//   because the Cloudflare Worker output (dist/server/index.mjs) cannot be
//   served by the Node preview server TanStack spins up for prerender.
// - GitHub Pages static (GITHUB_PAGES=1): disable the Cloudflare preset so
//   the Node preset writes dist/server/server.js, then prerender every route
//   into static HTML for GitHub Pages.
const isGithubPages = process.env.GITHUB_PAGES === "1";

export default defineConfig({
  ...(isGithubPages ? { nitro: false } : {}),
  tanstackStart: {
    server: { entry: "server" },
    pages: [
      { path: "/" },
      { path: "/about" },
      { path: "/services" },
      { path: "/contact" },
      { path: "/guides/fire-suppression-systems" },
    ],
    prerender: {
      enabled: isGithubPages,
      crawlLinks: true,
      autoStaticPathsDiscovery: true,
      failOnError: true,
    },
    sitemap: {
      enabled: true,
      host: "https://powerexfire.lovable.app",
      outputPath: "sitemap.xml",
    },
  },
});
