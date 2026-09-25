import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, LogIn, LogOut, Save, ShieldCheck, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Setting = { id: "feedback" | "feedback_fallback"; label: string; url: string; method: string; updated_at?: string };
const ADMIN_EMAIL = "powerexfire2026@gmail.com";

export const Route = createFileRoute("/admin/webhooks")({
  head: () => ({
    meta: [
      { title: "Private Webhook Settings | Powerex Fire" },
      { name: "description", content: "Private administrator settings." },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Private Webhook Settings" },
      { property: "og:description", content: "Private administrator settings." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WebhookSettingsPage,
});

function WebhookSettingsPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    void loadSettings();
  }, [signedIn]);

  async function loadSettings() {
    setBusy(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Please sign in again.");
      const response = await fetch("/api/admin/webhook-settings", { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (!response.ok) throw new Error(response.status === 401 ? "This account is not authorized to manage these settings." : result.error ?? "Could not load settings.");
      setSettings(result.settings as Setting[]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load settings.");
    } finally {
      setBusy(false);
    }
  }

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL) throw new Error("Use the authorized administrator email address.");
      if (signup) {
        const { error: signUpError } = await supabase.auth.signUp({ email: ADMIN_EMAIL, password, options: { emailRedirectTo: window.location.origin + "/admin/webhooks" } });
        if (signUpError) throw signUpError;
        setNotice("Check the administrator inbox to confirm the account, then sign in.");
        setSignup(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
        if (signInError) throw signInError;
        setSignedIn(true);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Please sign in again.");
      const response = await fetch("/api/admin/webhook-settings", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settings.map(({ id, url, method }) => ({ id, url, method })) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save settings.");
      setNotice("Webhook settings saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save settings.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSignedIn(false);
    setSettings([]);
    setNotice("");
  }

  return (
    <div className="min-h-dvh bg-muted/50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground"><Webhook className="h-5 w-5" /></div>
            <div><p className="text-xs font-semibold uppercase text-muted-foreground">Powerex Fire · Private</p><h1 className="text-xl font-bold">Webhook settings</h1></div>
          </div>
          {signedIn && <Button variant="outline" size="sm" onClick={() => void signOut()}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>}
        </div>

        {!signedIn ? (
          <form onSubmit={signIn} className="mx-auto mt-12 max-w-md space-y-5 border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-primary"><ShieldCheck className="h-5 w-5" /><h2 className="font-semibold">Administrator sign-in</h2></div>
            <p className="text-sm text-muted-foreground">Access is limited to the authorized Powerex Fire administrator account.</p>
            <label className="block space-y-1.5 text-sm font-medium">Email<Input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label className="block space-y-1.5 text-sm font-medium">Password<Input type="password" autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            {notice && <p className="text-sm text-primary" role="status">{notice}</p>}
            <Button type="submit" className="w-full" disabled={busy}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}{signup ? "Create admin account" : "Sign in"}</Button>
            <button type="button" onClick={() => { setSignup((current) => !current); setError(""); setNotice(""); }} className="w-full text-sm text-muted-foreground underline underline-offset-4">
              {signup ? "Already registered? Sign in" : "First visit? Create the authorized admin account"}
            </button>
          </form>
        ) : (
          <form onSubmit={saveSettings} className="mt-8 space-y-5">
            <p className="text-sm text-muted-foreground">These destinations are stored privately and only used by the server when delivering form submissions.</p>
            {settings.map((setting) => (
              <section key={setting.id} className="space-y-4 border border-border bg-card p-5">
                <h2 className="font-semibold">{setting.label}</h2>
                <label className="block space-y-1.5 text-sm font-medium">Destination URL<Input type="url" required value={setting.url} onChange={(event) => setSettings((current) => current.map((item) => item.id === setting.id ? { ...item, url: event.target.value } : item))} /></label>
                <label className="block space-y-1.5 text-sm font-medium">Method<select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={setting.method} onChange={(event) => setSettings((current) => current.map((item) => item.id === setting.id ? { ...item, method: event.target.value } : item))}><option>POST</option><option>GET</option><option>PUT</option><option>PATCH</option></select></label>
              </section>
            ))}
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            {notice && <p className="flex items-center gap-2 text-sm text-primary" role="status"><Check className="h-4 w-4" />{notice}</p>}
            <Button type="submit" disabled={busy || settings.length !== 2}>{busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save settings</Button>
          </form>
        )}
      </div>
    </div>
  );
}