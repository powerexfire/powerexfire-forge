import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "powerexfire2026@gmail.com";
const DEFAULT_SETTINGS = [
  { id: "feedback", label: "Feedback and contact submissions", url: "https://xacade.app.n8n.cloud/webhook/feedback", method: "POST" },
  { id: "feedback_fallback", label: "Alternate feedback form", url: "https://xacade.app.n8n.cloud/form/cfcf4fd4-dba8-417c-ba04-19438a58409a", method: "GET" },
] as const;

function createUserClient(token: string) {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Authentication service is unavailable");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function authorizeWebhookAdmin(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;

  const userClient = createUserClient(token);
  const { data, error } = await userClient.auth.getUser(token);
  const user = data.user;
  if (error || !user || user.email?.toLowerCase() !== ADMIN_EMAIL || !user.email_confirmed_at) return null;

  // Bootstrap the single explicitly authorized, email-verified admin account.
  // No request-provided user ID or role is ever trusted for this grant.
  const { error: grantError } = await supabaseAdmin.from("user_roles").upsert(
    { user_id: user.id, role: "admin" },
    { onConflict: "user_id,role", ignoreDuplicates: true },
  );
  if (grantError) {
    console.error("Unable to grant webhook admin role:", grantError.message);
    return null;
  }

  const { data: isAdmin, error: roleError } = await userClient.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });
  if (roleError || !isAdmin) return null;
  return { userId: user.id };
}

export async function getWebhookSettings() {
  const { data, error } = await supabaseAdmin.from("webhook_settings").select("id,label,url,method,updated_at");
  if (error) throw new Error("Webhook settings are unavailable");
  const saved = new Map((data ?? []).map((setting) => [setting.id, setting]));
  return DEFAULT_SETTINGS.map((setting) => ({ ...setting, ...saved.get(setting.id) }));
}

export async function findWebhookSetting(id: string) {
  const { data, error } = await supabaseAdmin
    .from("webhook_settings")
    .select("id,label,url,method")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS.find((setting) => setting.id === id) ?? null;
  return data;
}

export function isAllowedWebhookUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "n8n.cloud" || url.hostname.endsWith(".n8n.cloud"));
  } catch {
    return false;
  }
}