import { useState } from "react";
import { Phone, MessageCircle, Bot, MessageSquareHeart } from "lucide-react";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { ChatWidget } from "@/components/ChatWidget";

export function FloatingActions() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label="Open AI assistant chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition hover:scale-105"
      >
        <Bot className="h-6 w-6" />
      </button>
      <a
        href="https://wa.me/919167752444"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.7_0.18_150)] text-white shadow-lg transition hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="tel:+919167752444"
        aria-label="Call now"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>

      <button
        type="button"
        onClick={() => setFeedbackOpen(true)}
        aria-label="Share your feedback"
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-lg transition hover:scale-105 hover:border-primary hover:text-primary"
      >
        <MessageSquareHeart className="h-5 w-5 text-primary" aria-hidden />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}