-- ============================================================================
-- API CACHE TABLE
-- ============================================================================
-- Portable DDL — works on any PostgreSQL database.
-- Used by dextools-proxy and coingecko-proxy to cache API responses.
--
-- The "path" column serves as the cache key:
--   - For DexTools: the API path, e.g. "/ranking/solana/hotpools"
--   - For CoinGecko: a custom key, e.g. "coingecko-markets-p1-pp100"
--   - For 429 cooldown markers: "__429__<original_path>"
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_cache (
  path       TEXT PRIMARY KEY,
  body       TEXT NOT NULL,
  status     INTEGER NOT NULL DEFAULT 200,
  cached_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for cleanup queries (optional — helps if you want to purge old entries)
CREATE INDEX IF NOT EXISTS idx_api_cache_cached_at ON api_cache (cached_at);
