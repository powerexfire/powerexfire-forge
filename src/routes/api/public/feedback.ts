import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.record(z.string(), z.unknown()).refine((value) => Object.keys(value).length <= 30);

export const Route = createFileRoute("/api/public/feedback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const length = Number(request.headers.get("content-length") ?? 0);
        if (length > 32_000) return Response.json({ ok: false, error: "Request too large" }, { status: 413 });
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
        }
        const parsed = payloadSchema.safeParse(raw);
        if (!parsed.success) return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });

        const { findWebhookSetting, isAllowedWebhookUrl } = await import("@/lib/webhook-settings.server");
        const setting = await findWebhookSetting("feedback");
        if (!setting || !isAllowedWebhookUrl(setting.url)) {
          return Response.json({ ok: false, error: "Delivery is not configured" }, { status: 503 });
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
          if (!upstream.ok) return Response.json({ ok: false, error: "Delivery was rejected" }, { status: 502 });
          return Response.json({ ok: true });
        } catch {
          return Response.json({ ok: false, error: "Delivery service is unavailable" }, { status: 502 });
        } finally {
          clearTimeout(timer);
        }
      },
    },
  },
});