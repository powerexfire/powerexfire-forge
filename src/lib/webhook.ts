// Webhook destinations stay server-side; the public site only calls these API paths.
const API_HOST = "https://powerexfire.lovable.app";
function apiUrl(path: string) {
  if (typeof window === "undefined") return path;
  return window.location.hostname.endsWith("lovable.app") || window.location.hostname === "localhost"
    ? path
    : `${API_HOST}${path}`;
}
export const FEEDBACK_FORM_FALLBACK_URL = apiUrl("/api/public/feedback-fallback");

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
    const response = await fetch(apiUrl("/api/public/feedback"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false };
    const result = await response.json() as { ok?: boolean };
    return { ok: result.ok === true };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
