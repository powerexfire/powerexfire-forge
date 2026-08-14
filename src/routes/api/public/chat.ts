import { createFileRoute } from "@tanstack/react-router";
import { handleChatRequest } from "@/lib/chat-reply.server";

// Public, CORS-enabled chat endpoint so the statically hosted site
// (GitHub Pages / custom domain) can reach the assistant.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => handleChatRequest(request, cors),
    },
  },
});
