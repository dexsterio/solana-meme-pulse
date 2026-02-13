
-- Cache table for DexTools API responses
CREATE TABLE public.api_cache (
  path TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 200,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS needed — this is only accessed by edge functions (service role)
-- But enable RLS and add a policy for the anon key to read (edge function uses anon)
ALTER TABLE public.api_cache ENABLE ROW LEVEL SECURITY;

-- Allow edge functions (anon role) full access
CREATE POLICY "Allow all access to api_cache" ON public.api_cache
  FOR ALL USING (true) WITH CHECK (true);

-- Index for cleanup queries
CREATE INDEX idx_api_cache_cached_at ON public.api_cache (cached_at);
