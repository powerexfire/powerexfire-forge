// Shared n8n webhook submission used by the feedback dialog and the contact form.
// n8n does not always send CORS headers, so a readable POST is attempted first and
// an opaque (no-cors) POST is used as a fallback — the payload still reaches n8n.
export const FEEDBACK_WEBHOOK_URL = "https://xacade.app.n8n.cloud/webhook/feedback";
// Hosted n8n form users can fall back to when automated submission fails.
export const FEEDBACK_FORM_FALLBACK_URL =
  "https://xacade.app.n8n.cloud/form/cfcf4fd4-dba8-417c-ba04-19438a58409a";
const FEEDBACK_WEBHOOK_METHOD = "POST" as const;

// The site is also hosted statically (GitHub Pages), where no server route exists.
// In that case mirror leads to the CORS-enabled endpoint on the app host.
const LEADS_API_HOST = "https://powerexfire.lovable.app";
function leadsEndpoint() {
  if (typeof window === "undefined") return "/api/public/leads";
  return window.location.hostname.endsWith("lovable.app") || window.location.hostname === "localhost"
    ? "/api/public/leads"
    : `${LEADS_API_HOST}/api/public/leads`;
}

// Best-effort backup: store the inquiry in the app's own database so no lead
// is lost when the external webhook is down. Never throws, never blocks UX.
export async function recordLeadBackup(
  payload: Record<string, unknown>,
  { timeoutMs = 8000 }: { timeoutMs?: number } = {},
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(leadsEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "powerexfire-website",
        submittedAt: new Date().toISOString(),
        pageUrl: typeof window === "undefined" ? undefined : window.location.href,
        ...payload,
      }),
      signal: controller.signal,
      keepalive: true,
    });
  } catch {
    // Backup only — n8n delivery is the primary path.
  } finally {
    clearTimeout(timer);
  }
}

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

  // Mirror every submission into the app's own database, whatever happens with n8n.
  void recordLeadBackup(payload);

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
