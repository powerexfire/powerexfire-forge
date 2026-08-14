import { createFileRoute } from "@tanstack/react-router";
import { handleChatRequest } from "@/lib/chat-reply.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => handleChatRequest(request),
    },
  },
});
