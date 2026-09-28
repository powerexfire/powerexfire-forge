import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const updateSchema = z.object({
  settings: z.array(z.object({
    id: z.enum(["feedback", "feedback_fallback"]),
    url: z.string().url().max(1000),
    method: z.enum(["GET", "POST", "PUT", "PATCH"]),
  })).length(2),
}).superRefine((value, context) => {
  const ids = value.settings.map((setting) => setting.id);
  if (new Set(ids).size !== 2) context.addIssue({ code: "custom", message: "Each setting must appear once." });
  if (value.settings.some((setting) => setting.id === "feedback" && setting.method !== "POST")) {
    context.addIssue({ code: "custom", message: "Feedback submissions must use POST." });
  }
  if (value.settings.some((setting) => setting.id === "feedback_fallback" && setting.method !== "GET")) {
    context.addIssue({ code: "custom", message: "The alternate form must use GET." });
  }
});
const settingSchema = z.object({
  id: z.enum(["feedback", "feedback_fallback"]),
  url: z.string().url().max(1000),
  method: z.enum(["GET", "POST", "PUT", "PATCH"]),
});
const adminRequestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("read"), accessToken: z.string().min(1).max(8192) }),
  z.object({ action: z.literal("save"), accessToken: z.string().min(1).max(8192), settings: z.array(settingSchema).length(2) }),
]);
const ALLOWED_ORIGINS = new Set([
  "https://powerexfire.in",
  "https://www.powerexfire.in",
  "https://powerexfire.lovable.app",
  "https://id-preview--e0e3e7f0-fb76-4db3-b7a5-abbceda91ce7.lovable.app",
  "http://localhost:8080",
]);
function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://powerexfire.in",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}
function json(request: Request, body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

export const Route = createFileRoute("/api/admin/webhook-settings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!ALLOWED_ORIGINS.has(request.headers.get("origin") ?? "")) return json(request, { error: "Origin not allowed" }, 403);
        const contentLength = Number(request.headers.get("content-length") ?? 0);
        if (Number.isFinite(contentLength) && contentLength > 24_000) return json(request, { error: "Request too large" }, 413);
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json(request, { error: "Invalid request" }, 400);
        }
        const parsed = adminRequestSchema.safeParse(raw);
        if (!parsed.success) return json(request, { error: "Invalid request" }, 400);
        const { authorizeWebhookAdmin, isAllowedWebhookUrl } = await import("@/lib/webhook-settings.server");
        if (!(await authorizeWebhookAdmin(request, parsed.data.accessToken))) return json(request, { error: "Unauthorized" }, 401);
        if (parsed.data.action === "read") {
          const { getWebhookSettings } = await import("@/lib/webhook-settings.server");
          try {
            return json(request, { settings: await getWebhookSettings() });
          } catch {
            return json(request, { error: "Settings could not be loaded" }, 503);
          }
        }
        const save = updateSchema.safeParse({ settings: parsed.data.settings });
        if (!save.success || save.data.settings.some((setting) => !isAllowedWebhookUrl(setting.url))) {
          return json(request, { error: "Use a secure n8n.cloud URL and supported method." }, 400);
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("webhook_settings").upsert(
          save.data.settings.map((setting) => ({ ...setting, label: setting.id === "feedback" ? "Feedback and contact submissions" : "Alternate feedback form", updated_at: new Date().toISOString() })),
          { onConflict: "id" },
        );
        if (error) {
          console.error("Unable to save webhook settings:", error.message);
          return json(request, { error: "Settings could not be saved" }, 500);
        }
        return json(request, { ok: true });
      },
    },
  },
});