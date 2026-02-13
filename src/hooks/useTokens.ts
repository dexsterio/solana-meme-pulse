import { useQuery } from '@tanstack/react-query';
import { fetchHotPools, fetchGainers, fetchLosers } from '@/services/dextoolsApi';
import { mockTokens, Token } from '@/data/mockTokens';
import { Category } from '@/components/TokenFilters';

function fetchByCategory(category: Category): Promise<Token[]> {
  switch (category) {
    case 'gainers':
      return fetchGainers();
    case 'trending':
    case 'top':
    case 'new':
    default:
      return fetchHotPools();
  }
}

export function useTokens(category: Category) {
  return useQuery<Token[]>({
    queryKey: ['tokens', category],
    queryFn: () => fetchByCategory(category),
    refetchInterval: 30000,
    staleTime: 15000,
    placeholderData: mockTokens,
    retry: 2,
    meta: {
      fallback: mockTokens,
    },
  });
}
