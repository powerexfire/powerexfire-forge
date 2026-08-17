import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitToWebhook } from "@/lib/webhook";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Powerex Fire Protection System | Vasai, Mumbai" },
      { name: "description", content: "Get in touch with Powerex Fire Protection System. Call +91 91677 52444, WhatsApp, email sales@powerexfire.com or visit our Vasai East office." },
      { property: "og:title", content: "Contact Powerex Fire" },
      { property: "og:description", content: "Call, WhatsApp, email or visit us in Vasai East, Mumbai." },
      { property: "og:url", content: "https://powerexfire.lovable.app/contact" },
    ],
    links: [
      { rel: "canonical", href: "https://powerexfire.lovable.app/contact" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20).regex(/^[+\d\s\-()]+$/, "Invalid phone"),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Tell us a bit more").max(1000),
});

function Contact() {
  const [values, setValues] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof typeof values>(k: K, v: string) {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setSubmitError(null);
    const result = schema.safeParse(values);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");

    const { data } = result;
    // Record the inquiry first so nothing is lost if WhatsApp is blocked.
    const { ok } = await submitToWebhook({ ...data, type: "quote-request" });

    const text = [
      `New inquiry from ${data.name}`,
      `Phone: ${data.phone}`,
      ...(data.email ? [`Email: ${data.email}`] : []),
      `Message: ${data.message}`,
    ].join("\n");
    const win = window.open(
      `https://wa.me/919167752444?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );

    if (!ok && !win) {
      setStatus("idle");
      setSubmitError(
        "We couldn't send your request. Please call +91 91677 52444 or email sales@powerexfire.com.",
      );
      return;
    }
    setStatus("sent");
    setValues({ name: "", phone: "", email: "", message: "" });
  }

  return (
    <>
      <section className="bg-secondary py-16 text-secondary-foreground md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Talk to a fire safety expert.</h1>
          <p className="mt-3 max-w-2xl text-secondary-foreground/80">
            We respond quickly — by phone, WhatsApp or email. For emergencies, call us 24/7.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        {/* Contact info */}
        <div className="space-y-4">
          <a href="tel:+919167752444" className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary">
            <Phone className="mt-0.5 h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Call</p>
              <p className="text-lg font-semibold group-hover:text-primary">+91 91677 52444</p>
            </div>
          </a>
          <a href="https://wa.me/919167752444" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-primary">
            <MessageCircle className="mt-0.5 h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp</p>
              <p className="text-lg font-semibold group-hover:text-primary">Chat with us</p>
            </div>
          </a>
          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
            <Mail className="mt-0.5 h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
              <ul className="mt-1 space-y-0.5 text-sm">
                <li><a href="mailto:info@powerexfire.com" className="hover:text-primary">info@powerexfire.com</a></li>
                <li><a href="mailto:sales@powerexfire.com" className="hover:text-primary">sales@powerexfire.com</a></li>
                <li><a href="mailto:contact@powerexfire.com" className="hover:text-primary">contact@powerexfire.com</a></li>
                <li><a href="mailto:santoshyadav@powerexfire.com" className="hover:text-primary">santoshyadav@powerexfire.com</a></li>
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
            <MapPin className="mt-0.5 h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</p>
              <address className="mt-1 not-italic text-sm">
                G/201, Rashmi Garden, Evershine City,<br />
                Vasai East, Vasai-Virar City,<br />
                Mumbai, Maharashtra 401208
              </address>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title="Powerex Fire location map"
              src="https://www.google.com/maps?q=19.4100445,72.8368007&z=15&output=embed"
              width="100%"
              height="280"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} noValidate className="rounded-xl border border-border bg-card p-6 md:p-8" aria-labelledby="form-title">
          <h2 id="form-title" className="text-2xl font-bold">Request a quote</h2>
          <p className="mt-1 text-sm text-muted-foreground">We'll get back within one business day.</p>

          {status === "sent" && (
            <div role="status" className="mt-4 flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">Thanks — your request has been received.</p>
                <p className="text-muted-foreground">We also opened WhatsApp so you can send it directly. If it didn't open, call +91 91677 52444.</p>
              </div>
            </div>
          )}

          {submitError && (
            <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <div className="mt-6 grid gap-4">
            <Field id="name" label="Name" required error={errors.name}>
              <input id="name" autoComplete="name" required value={values.name} onChange={(e) => update("name", e.target.value)} className="input" />
            </Field>
            <Field id="phone" label="Phone" required error={errors.phone}>
              <input id="phone" type="tel" autoComplete="tel" inputMode="tel" required value={values.phone} onChange={(e) => update("phone", e.target.value)} className="input" />
            </Field>
            <Field id="email" label="Email (optional)" error={errors.email}>
              <input id="email" type="email" autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} className="input" />
            </Field>
            <Field id="message" label="How can we help?" required error={errors.message}>
              <textarea id="message" rows={4} required value={values.message} onChange={(e) => update("message", e.target.value)} className="input resize-y" />
            </Field>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Send className="h-4 w-4" aria-hidden />
              )}
              {status === "sending" ? "Sending…" : "Send request"}
            </button>
          </div>
        </form>
      </section>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus-visible {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 20%, transparent);
        }
      `}</style>
    </>
  );
}

function Field({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}