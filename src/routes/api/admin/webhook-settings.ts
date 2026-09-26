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

export const Route = createFileRoute("/api/admin/webhook-settings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { authorizeWebhookAdmin, getWebhookSettings } = await import("@/lib/webhook-settings.server");
        if (!(await authorizeWebhookAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
        try {
          return Response.json({ settings: await getWebhookSettings() });
        } catch {
          return Response.json({ error: "Settings could not be loaded" }, { status: 503 });
        }
      },
      PUT: async ({ request }) => {
        const { authorizeWebhookAdmin, isAllowedWebhookUrl } = await import("@/lib/webhook-settings.server");
        if (!(await authorizeWebhookAdmin(request))) return Response.json({ error: "Unauthorized" }, { status: 401 });
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }
        const parsed = updateSchema.safeParse(raw);
        if (!parsed.success || parsed.data.settings.some((setting) => !isAllowedWebhookUrl(setting.url))) {
          return Response.json({ error: "Use a secure n8n.cloud URL and supported method." }, { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("webhook_settings").upsert(
          parsed.data.settings.map((setting) => ({ ...setting, label: setting.id === "feedback" ? "Feedback and contact submissions" : "Alternate feedback form", updated_at: new Date().toISOString() })),
          { onConflict: "id" },
        );
        if (error) {
          console.error("Unable to save webhook settings:", error.message);
          return Response.json({ error: "Settings could not be saved" }, { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});