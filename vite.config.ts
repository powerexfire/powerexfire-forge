// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
const isGitHubPages = process.env.GITHUB_PAGES === "1";

export default defineConfig({
  ...(isGitHubPages ? { cloudflare: false } : {}),
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
      enabled: true,
      crawlLinks: true,
      autoStaticPathsDiscovery: true,
      failOnError: true,
    },
    // SPA fallback is intentionally disabled for GitHub Pages — the
    // prepare-github-pages script copies index.html to 404.html so GitHub
    // Pages serves the SPA shell for unknown paths.
    sitemap: {
      enabled: true,
      host: "https://powerexfire.in",
      outputPath: "sitemap.xml",
    },
  },
});
