import { createFileRoute } from "@tanstack/react-router";

const SITE = "https://powerexfire.lovable.app/";
const SITEMAP = "https://powerexfire.lovable.app/sitemap.xml";
const GW = "https://connector-gateway.lovable.dev/google_search_console";

function headers() {
  const lovable = process.env.LOVABLE_API_KEY;
  const gsc = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovable || !gsc) {
    throw new Error(
      "Missing LOVABLE_API_KEY or GOOGLE_SEARCH_CONSOLE_API_KEY — link the Google Search Console connector.",
    );
  }
  return {
    Authorization: `Bearer ${lovable}`,
    "X-Connection-Api-Key": gsc,
    "Content-Type": "application/json",
  } as Record<string, string>;
}

async function json(res: Response) {
  const text = await res.text();
  try {
    return { status: res.status, body: text ? JSON.parse(text) : null };
  } catch {
    return { status: res.status, body: text };
  }
}

/**
 * Public GSC setup endpoint. Requires a shared secret in the `token` query
 * param that matches process.env.GSC_SETUP_TOKEN so it can't be triggered by
 * random crawlers. Idempotent — safe to call repeatedly.
 */
export const Route = createFileRoute("/api/public/gsc-setup")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        const expected = process.env.GSC_SETUP_TOKEN;
        if (!expected || !token || token !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const h = headers();
        const steps: Array<{ step: string; status: number; body: unknown }> = [];

        // 1. Verify site ownership via META tag (already deployed in __root.tsx).
        const verify = await fetch(
          `${GW}/siteVerification/v1/webResource?verificationMethod=META`,
          {
            method: "POST",
            headers: h,
            body: JSON.stringify({ site: { identifier: SITE, type: "SITE" } }),
          },
        );
        steps.push({ step: "verify", ...(await json(verify)) });

        // 2. Add the site to Search Console (PUT is idempotent).
        const encoded = encodeURIComponent(SITE);
        const add = await fetch(`${GW}/webmasters/v3/sites/${encoded}`, {
          method: "PUT",
          headers: h,
        });
        steps.push({ step: "addSite", status: add.status, body: await add.text() });

        // 3. Submit the sitemap.
        const smEncoded = encodeURIComponent(SITEMAP);
        const submit = await fetch(
          `${GW}/webmasters/v3/sites/${encoded}/sitemaps/${smEncoded}`,
          { method: "PUT", headers: h },
        );
        steps.push({ step: "submitSitemap", status: submit.status, body: await submit.text() });

        return new Response(JSON.stringify({ ok: true, steps }, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});