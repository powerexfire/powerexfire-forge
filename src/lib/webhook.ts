// Shared n8n webhook submission used by the feedback dialog and the contact form.
// n8n does not always send CORS headers, so a readable POST is attempted first and
// an opaque (no-cors) POST is used as a fallback — the payload still reaches n8n.
export const FEEDBACK_WEBHOOK_URL = "https://mibikef.app.n8n.cloud/webhook/feedback";
const FEEDBACK_WEBHOOK_METHOD = "POST" as const;

export async function submitToWebhook(
  payload: Record<string, unknown>,
  { timeoutMs = 12000 }: { timeoutMs?: number } = {},
): Promise<{ ok: boolean }> {
  const body = JSON.stringify({
    source: "powerexfire-website",
    submittedAt: new Date().toISOString(),
    pageUrl: typeof window === "undefined" ? undefined : window.location.href,
    ...payload,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(FEEDBACK_WEBHOOK_URL, {
      method: FEEDBACK_WEBHOOK_METHOD,
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });
    if (res.ok) return { ok: true };
    // 4xx/5xx from the webhook itself: retrying opaquely won't help.
    if (res.status >= 400) return { ok: false };
  } catch {
    // CORS / network failure — fall through to the opaque attempt.
  } finally {
    clearTimeout(timer);
  }

  try {
    await fetch(FEEDBACK_WEBHOOK_URL, {
      method: FEEDBACK_WEBHOOK_METHOD,
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body,
      keepalive: true,
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
