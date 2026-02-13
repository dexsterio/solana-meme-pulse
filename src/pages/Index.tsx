import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StatsBar from '@/components/StatsBar';
import TokenFilters, { TimeFilter, Category, RankBy, ViewMode } from '@/components/TokenFilters';
import TokenTable from '@/components/TokenTable';
import TokenGrid from '@/components/TokenGrid';
import TrendingBar from '@/components/TrendingBar';
import { useTokens } from '@/hooks/useTokens';
import { usePumpPortalNewTokens } from '@/hooks/usePumpPortalNewTokens';
import { fetchCryptoMarket } from '@/services/coingeckoApi';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const queryClient = useQueryClient();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [category, setCategory] = useState<Category>('trending');
  const [rankBy, setRankBy] = useState<RankBy>('trending');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isCryptoMarket, setIsCryptoMarket] = useState(false);

  const { data: apiTokens = [], isLoading: apiLoading, isError: apiError, error: apiErrorObj } = useTokens(category);
  const { tokens: newPairTokens, isConnected: wsConnected } = usePumpPortalNewTokens();

  const { data: cryptoTokens = [], isLoading: cryptoLoading, isError: cryptoError } = useQuery({
    queryKey: ['cryptoMarket'],
    queryFn: () => fetchCryptoMarket(3),
    enabled: isCryptoMarket,
    staleTime: 60_000,
  });

  // Determine data source
  const isNewCategory = !isCryptoMarket && category === 'new';
  const tokens = isCryptoMarket
    ? cryptoTokens
    : isNewCategory
      ? newPairTokens
      : apiTokens;
  const isLoading = isCryptoMarket
    ? cryptoLoading
    : isNewCategory
      ? (!wsConnected && newPairTokens.length === 0)
      : apiLoading;
  const isError = isCryptoMarket ? cryptoError : isNewCategory ? false : apiError;
  const error = isCryptoMarket ? null : isNewCategory ? null : apiErrorObj;

  const sortedTokens = useMemo(() => {
    let list = [...tokens];

    switch (rankBy) {
      case 'volume':
        list.sort((a, b) => b.volume - a.volume);
        break;
      case 'priceChange':
        list.sort((a, b) => b.change24h - a.change24h);
        break;
      case 'txns':
        list.sort((a, b) => b.txns - a.txns);
        break;
      case 'mcap':
        list.sort((a, b) => b.mcap - a.mcap);
        break;
      default:
        break;
    }

    return list;
  }, [tokens, rankBy]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TrendingBar tokens={isCryptoMarket ? cryptoTokens : apiTokens} />
      <StatsBar
        tokens={tokens}
        onSearch={(addr) => console.log('Search:', addr)}
        isCryptoMarket={isCryptoMarket}
        onCryptoMarketToggle={() => setIsCryptoMarket(!isCryptoMarket)}
      />
      {!isCryptoMarket && (
        <TokenFilters
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          category={category}
          setCategory={setCategory}
          rankBy={rankBy}
          setRankBy={setRankBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      )}
      <div className="flex-1 overflow-auto">
        {!isCryptoMarket && isNewCategory && wsConnected && tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-profit opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-profit"></span>
              </span>
              <p className="text-muted-foreground text-sm">Listening for new tokens...</p>
            </div>
            <p className="text-muted-foreground/60 text-xs">Only tokens with logos are shown</p>
          </div>
        ) : isLoading && tokens.length === 0 ? (
          <div className="space-y-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-border/30">
                <Skeleton className="w-6 h-4" />
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-24 h-4" />
                <div className="flex-1" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        ) : isError && tokens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <p className="text-loss text-sm">
              {error?.message?.includes('Rate limited')
                ? 'DexTools API rate limited — trial plan limit reached.'
                : 'Failed to load data.'}
            </p>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: isCryptoMarket ? ['cryptoMarket'] : ['tokens', category] })}
              className="px-4 py-2 text-xs rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Retry now
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <TokenTable tokens={sortedTokens} isCryptoMarket={isCryptoMarket} />
        ) : (
          <TokenGrid tokens={sortedTokens} />
        )}
      </div>
    </div>
  );
};

export default Index;
