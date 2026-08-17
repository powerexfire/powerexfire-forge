import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, MessageSquareHeart, X } from "lucide-react";
import { submitToWebhook } from "@/lib/webhook";

type Errors = Partial<Record<"name" | "phone" | "email" | "feedback", string>>;

export function FeedbackDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const validate = () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please enter your full name.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) next.phone = "Enter a valid phone number (10-15 digits).";
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) next.email = "Enter a valid email address.";
    if (feedback.trim().length < 5) next.feedback = "Please share a little more detail.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (status === "sending" || !validate()) return;
    setStatus("sending");

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      feedback: feedback.trim(),
      type: "feedback" as const,
    };

    const { ok } = await submitToWebhook(payload);
    if (ok) {
      setStatus("success");
      return;
    }
    setStatus("idle");
    setSubmitError(
      "We couldn't send your feedback. Please check your connection and try again, or call +91 91677 52444.",
    );
  };

  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => {
      onClose();
      setName("");
      setPhone("");
      setEmail("");
      setFeedback("");
      setStatus("idle");
    }, 1800);
    return () => clearTimeout(t);
  }, [status, onClose]);

  const field =
    "mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="feedback-title" className="flex items-center gap-2 text-lg font-bold">
              <MessageSquareHeart className="h-5 w-5 text-primary" aria-hidden /> Share your feedback
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us how we did — we read every message.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback form"
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === "success" ? (
          <div className="py-10 text-center" role="status">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden />
            <p className="mt-4 text-lg font-semibold">Feedback submitted</p>
            <p className="mt-1 text-sm text-muted-foreground">Thank you for helping us improve!</p>
          </div>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="fb-name" className="text-sm font-medium">
                Your full name
              </label>
              <input
                id="fb-name"
                ref={firstFieldRef}
                className={field}
                value={name}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!errors.name}
                placeholder="e.g. Rajesh Mehta"
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="fb-phone" className="text-sm font-medium">
                Your phone / mobile no.
              </label>
              <input
                id="fb-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={field}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-invalid={!!errors.phone}
                placeholder="+91 91677 52444"
              />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="fb-email" className="text-sm font-medium">
                Your correct email
              </label>
              <input
                id="fb-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                placeholder="you@company.com"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="fb-message" className="text-sm font-medium">
                What&apos;s your feedback?
              </label>
              <textarea
                id="fb-message"
                rows={4}
                className={field}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                aria-invalid={!!errors.feedback}
                placeholder="Share your experience, suggestions or concerns…"
              />
              {errors.feedback && <p className="mt-1 text-xs text-destructive">{errors.feedback}</p>}
            </div>

            {submitError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {status === "sending" ? "Sending…" : "Submit feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}