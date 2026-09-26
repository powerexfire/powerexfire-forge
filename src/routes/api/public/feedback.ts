import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.record(z.string(), z.unknown()).refine((value) => Object.keys(value).length <= 30);
const ALLOWED_ORIGINS = new Set([
  "https://powerexfire.in",
  "https://www.powerexfire.in",
  "https://powerexfire.lovable.app",
  "http://localhost:8080",
]);
function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://powerexfire.in",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
function json(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

export const Route = createFileRoute("/api/public/feedback")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => new Response(null, { status: 204, headers: corsHeaders(request) }),
      POST: async ({ request }) => {
        const origin = request.headers.get("origin") ?? "";
        if (!ALLOWED_ORIGINS.has(origin)) return json(request, { ok: false, error: "Origin not allowed" }, 403);
        const length = Number(request.headers.get("content-length") ?? 0);
        if (length > 32_000) return json(request, { ok: false, error: "Request too large" }, 413);
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json(request, { ok: false, error: "Invalid request" }, 400);
        }
        const parsed = payloadSchema.safeParse(raw);
        if (!parsed.success) return json(request, { ok: false, error: "Invalid request" }, 400);

        const { findWebhookSetting, isAllowedWebhookUrl } = await import("@/lib/webhook-settings.server");
        const setting = await findWebhookSetting("feedback");
        if (!setting || !isAllowedWebhookUrl(setting.url)) {
          return json(request, { ok: false, error: "Delivery is not configured" }, 503);
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12_000);
        try {
          const target = new URL(setting.url);
          const method = setting.method;
          const init: RequestInit = { method, signal: controller.signal, redirect: "error" };
          if (method === "GET") {
            for (const [key, value] of Object.entries(parsed.data)) {
              target.searchParams.set(key, typeof value === "string" ? value : JSON.stringify(value));
            }
          } else {
            init.headers = { "Content-Type": "application/json" };
            init.body = JSON.stringify(parsed.data);
          }
          const upstream = await fetch(target, init);
          if (!upstream.ok) return json(request, { ok: false, error: "Delivery was rejected" }, 502);
          return json(request, { ok: true });
        } catch {
          return json(request, { ok: false, error: "Delivery service is unavailable" }, 502);
        } finally {
          clearTimeout(timer);
        }
      },
    },
  },
});