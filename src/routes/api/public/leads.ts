import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

// Public lead-backup endpoint. Every form submission is mirrored here so a
// lead is never lost when the external n8n webhook is unreachable.
const leadSchema = z.object({
  type: z.string().trim().max(60).optional(),
  name: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().trim().max(160).optional(),
  message: z.string().trim().max(2000).optional(),
  pageUrl: z.string().trim().max(500).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        // Reject oversized bodies before parsing.
        const length = Number(request.headers.get("content-length") ?? 0);
        if (length > 32_000) return json({ error: "Payload too large" }, 413);

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const parsed = leadSchema.safeParse(raw);
        if (!parsed.success) {
          return json({ error: "Invalid payload" }, 400);
        }

        const d = parsed.data;
        // Load the privileged client inside the handler so it never reaches the client bundle.
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("leads").insert({
          type: d.type ?? "quote-request",
          name: d.name ?? null,
          phone: d.phone ?? null,
          email: d.email ?? null,
          message: d.message ?? null,
          page_url: d.pageUrl ?? null,
          payload: d.payload ?? {},
        });

        if (error) {
          console.error("lead insert failed:", error.message);
          return json({ error: "Could not record lead" }, 500);
        }
        return json({ ok: true });
      },
    },
  },
});
