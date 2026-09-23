CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'quote-request',
  name text,
  phone text,
  email text,
  message text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  page_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Only the app's server (service role) writes and reads leads; no public access.
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- No policies: RLS denies anon/authenticated access; service role bypasses RLS.