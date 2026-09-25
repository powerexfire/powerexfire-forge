CREATE TABLE public.webhook_settings (
  id text PRIMARY KEY,
  label text NOT NULL,
  url text NOT NULL,
  method text NOT NULL DEFAULT 'POST',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.webhook_settings TO service_role;
ALTER TABLE public.webhook_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.webhook_settings (id, label, url, method) VALUES
  ('feedback', 'Feedback and contact submissions', 'https://xacade.app.n8n.cloud/webhook/feedback', 'POST'),
  ('feedback_fallback', 'Alternate feedback form', 'https://xacade.app.n8n.cloud/form/cfcf4fd4-dba8-417c-ba04-19438a58409a', 'GET');