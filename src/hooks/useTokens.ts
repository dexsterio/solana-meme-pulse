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
    refetchInterval: 60000, // 60s to avoid rate limits
    staleTime: 30000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
