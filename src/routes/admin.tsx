import { createFileRoute } from "@tanstack/react-router";
import { WebhookSettingsPage } from "./admin.webhooks";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Private Admin | Powerex Fire" },
      { name: "description", content: "Private administrator access." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: "Private Admin | Powerex Fire" },
      { property: "og:description", content: "Private administrator access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WebhookSettingsPage,
});