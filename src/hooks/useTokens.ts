/**
 * ============================================================================
 * TOKEN DATA HOOK
 * ============================================================================
 * MIGRATION: This hook orchestrates data fetching with a fallback strategy:
 *   Primary: DexScreener (free, no proxy needed)
 *   Fallback: DexTools (via your proxy at ENDPOINTS.DEXTOOLS_PROXY)
 *
 * The 'new' category is handled by PumpPortal WebSocket (see usePumpPortalNewTokens).
 *
 * Data flow:
 *   useTokens(category) → fetchByCategory → DexScreener || DexTools → Token[]
 * ============================================================================
 */
import { useQuery } from '@tanstack/react-query';
import {
  fetchTrendingTokens,
  fetchGainersDexScreener,
  fetchNewPairsDexScreener,
  fetchTopByVolume,
} from '@/services/dexscreenerApi';
import { fetchHotPools, fetchGainers, fetchNewPairs } from '@/services/dextoolsApi';
import { Token } from '@/data/mockTokens';
import { Category } from '@/components/TokenFilters';

// Try DexScreener first (free, no key), fall back to DexTools
async function fetchWithFallback(
  primary: () => Promise<Token[]>,
  fallback: () => Promise<Token[]>,
): Promise<Token[]> {
  try {
    return await primary();
  } catch (e) {
    console.warn('Primary API failed, trying fallback:', e);
    return await fallback();
  }
}

function fetchByCategory(category: Category): Promise<Token[]> {
  switch (category) {
    case 'gainers':
      return fetchWithFallback(fetchGainersDexScreener, fetchGainers);
    case 'new':
      // Handled by PumpPortal WebSocket — return empty
      return Promise.resolve([]);
    case 'top':
      return fetchWithFallback(fetchTopByVolume, fetchHotPools);
    case 'trending':
    default:
      return fetchWithFallback(fetchTrendingTokens, fetchHotPools);
  }
}

export function useTokens(category: Category) {
  return useQuery<Token[]>({
    queryKey: ['tokens', category],
    queryFn: () => fetchByCategory(category),
    refetchInterval: 60_000,  // 1 min — DexScreener is free
    staleTime: 30_000,        // 30s
    retry: 2,
    retryDelay: 5_000,
  });
}
