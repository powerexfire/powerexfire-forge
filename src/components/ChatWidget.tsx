import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the Powerex Fire assistant. Ask me about extinguishers, alarms, hydrant systems, AMC or safety training — or type your requirement and I'll guide you.",
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

// The site is also hosted statically (GitHub Pages), where no server route exists.
// In that case talk to the CORS-enabled public endpoint on the app host.
const API_HOST = "https://powerexfire.lovable.app";
function chatEndpoint() {
  if (typeof window === "undefined") return "/api/chat";
  return window.location.hostname.endsWith("lovable.app") || window.location.hostname === "localhost"
    ? "/api/chat"
    : `${API_HOST}/api/public/chat`;
}

function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export function ChatWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const handsFreeRef = useRef(false);

  useEffect(() => {
    setVoiceSupported(!!getRecognition());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    },
    [],
  );

  const speak = (text: string, onDone?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ""));
    utter.lang = "en-IN";
    utter.onend = () => onDone?.();
    utter.onerror = () => onDone?.();
    window.speechSynthesis.speak(utter);
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(chatEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? "The assistant is unavailable right now.");
      }
      const reply = data.reply;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (voiceReplies) {
        // Speak the answer, then resume listening so voice in + voice out work together.
        speak(reply, () => {
          if (handsFreeRef.current) startListening();
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const rec = getRecognition();
    if (!rec) return;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    recognitionRef.current = rec;
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const transcript = e.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) void send(transcript);
    };
    rec.onerror = () => {
      setListening(false);
      handsFreeRef.current = false;
      setError("Microphone access failed. Please allow mic permission and try again.");
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
      setListening(true);
      setVoiceReplies(true);
    } catch {
      setListening(false);
    }
  };

  const toggleMic = () => {
    if (listening || handsFreeRef.current) {
      handsFreeRef.current = false;
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    handsFreeRef.current = true;
    startListening();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-stretch justify-end bg-black/40 backdrop-blur-sm sm:inset-auto sm:bottom-24 sm:right-5 sm:bg-transparent sm:backdrop-blur-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Powerex AI assistant"
        className="flex h-full w-full flex-col border border-border bg-card shadow-2xl sm:h-[560px] sm:max-h-[80dvh] sm:w-[380px] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary px-4 py-3 text-secondary-foreground sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold">Powerex Assistant</p>
              <p className="text-xs text-secondary-foreground/80">AI-powered · replies instantly</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setVoiceReplies((v) => {
                  if (v) window.speechSynthesis?.cancel();
                  return !v;
                })
              }
              aria-label={voiceReplies ? "Turn off voice replies" : "Turn on voice replies"}
              aria-pressed={voiceReplies}
              className="rounded-md p-2 text-secondary-foreground/80 transition hover:bg-white/10 hover:text-secondary-foreground"
            >
              {voiceReplies ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="rounded-md p-2 text-secondary-foreground/80 transition hover:bg-white/10 hover:text-secondary-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <p
                className={
                  m.role === "user"
                    ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-foreground"
                }
              >
                {m.content}
              </p>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start" role="status" aria-live="polite">
              <p className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Thinking…
              </p>
            </div>
          )}
          {listening && (
            <p className="text-center text-xs font-medium text-primary" role="status">
              Listening… speak now
            </p>
          )}
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <form
          className="flex items-end gap-2 border-t border-border bg-card px-3 py-3 sm:rounded-b-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleMic}
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              className={
                listening
                  ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  : "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-input text-foreground transition hover:bg-muted"
              }
            >
              {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask about fire safety…"
            aria-label="Message"
            className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-input bg-background px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={loading || input.trim().length === 0}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}