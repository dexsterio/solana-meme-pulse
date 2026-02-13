import { useQuery } from '@tanstack/react-query';
import { fetchHotPools, fetchGainers, fetchLosers, fetchNewPairs } from '@/services/dextoolsApi';
import { Token } from '@/data/mockTokens';
import { Category } from '@/components/TokenFilters';

function fetchByCategory(category: Category): Promise<Token[]> {
  switch (category) {
    case 'gainers':
      return fetchGainers();
    case 'new':
      return fetchNewPairs();
    case 'trending':
    case 'top':
    default:
      return fetchHotPools();
  }
}

export function useTokens(category: Category) {
  return useQuery<Token[]>({
    queryKey: ['tokens', category],
    queryFn: () => fetchByCategory(category),
    refetchInterval: 120_000, // 2 min to stay within DexTools trial rate limits
    staleTime: 90_000,
    retry: (failureCount, error) => {
      // Never retry on rate limit errors
      if (error?.message?.includes('Rate limited')) return false;
      return failureCount < 1;
    },
    retryDelay: 15_000,
  });
}
