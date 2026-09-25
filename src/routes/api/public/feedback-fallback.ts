import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/feedback-fallback")({
  server: {
    handlers: {
      GET: async () => {
        const { findWebhookSetting, isAllowedWebhookUrl } = await import("@/lib/webhook-settings.server");
        const setting = await findWebhookSetting("feedback_fallback");
        if (!setting || !isAllowedWebhookUrl(setting.url)) return new Response("Fallback form unavailable", { status: 503 });
        return new Response(null, { status: 302, headers: { Location: setting.url, "Cache-Control": "no-store" } });
      },
    },
  },
});