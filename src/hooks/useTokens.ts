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
    refetchInterval: 180_000, // 3 min — server cache handles freshness
    staleTime: 120_000,       // 2 min — matches server cache TTL
    retry: (failureCount, error) => {
      if (error?.message?.includes('Rate limited')) return false;
      return failureCount < 1;
    },
    retryDelay: 30_000, // 30s before retry
  });
}
