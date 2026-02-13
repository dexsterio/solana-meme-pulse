import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StatsBar from '@/components/StatsBar';
import TokenFilters, { TimeFilter, Category, RankBy, ViewMode, FilterValues } from '@/components/TokenFilters';
import TokenTable from '@/components/TokenTable';
import TokenGrid from '@/components/TokenGrid';
import TrendingBar from '@/components/TrendingBar';
import MarketSentimentBar from '@/components/MarketSentimentBar';
import ViralBar from '@/components/ViralBar';
import { useTokens } from '@/hooks/useTokens';
import { usePumpPortalNewTokens } from '@/hooks/usePumpPortalNewTokens';
import { useViralClusters } from '@/hooks/useViralClusters';
import { fetchCryptoMarket, fetchCryptoGlobal } from '@/services/coingeckoApi';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const queryClient = useQueryClient();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [category, setCategory] = useState<Category>('trending');
  const [rankBy, setRankBy] = useState<RankBy>('trending');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isCryptoMarket, setIsCryptoMarket] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState<FilterValues>({ minVolume: '', minLiquidity: '', minMcap: '', maxAge: '' });

  useEffect(() => { document.title = 'SolScope — Solana Token Screener'; }, []);

  const { data: apiTokens = [], isLoading: apiLoading, isError: apiError, error: apiErrorObj } = useTokens(category);
  const { tokens: newPairTokens, isConnected: wsConnected } = usePumpPortalNewTokens();
  const { clusters, selectedCluster, setSelectedCluster, clearSelection, selectedTokens, viralSortBy, setViralSortBy } = useViralClusters();

  const { data: cryptoTokens = [], isLoading: cryptoLoading, isError: cryptoError } = useQuery({
    queryKey: ['cryptoMarket'],
    queryFn: () => fetchCryptoMarket(3),
    enabled: isCryptoMarket,
    staleTime: 60_000,
  });

  const { data: globalData, isLoading: globalLoading } = useQuery({
    queryKey: ['cryptoGlobal'],
    queryFn: fetchCryptoGlobal,
    enabled: isCryptoMarket,
    staleTime: 120_000,
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

  const isViralView = selectedCluster !== null;

  const sortedTokens = useMemo(() => {
    if (isViralView) return selectedTokens;

    let list = [...tokens];

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.ticker.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q)
      );
    }

    // Apply numeric filters
    const minVol = parseFloat(filterValues.minVolume);
    const minLiq = parseFloat(filterValues.minLiquidity);
    const minMcap = parseFloat(filterValues.minMcap);
    if (!isNaN(minVol) && minVol > 0) list = list.filter(t => t.volume >= minVol);
    if (!isNaN(minLiq) && minLiq > 0) list = list.filter(t => t.liquidity >= minLiq);
    if (!isNaN(minMcap) && minMcap > 0) list = list.filter(t => t.mcap >= minMcap);

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
  }, [tokens, rankBy, searchQuery, isViralView, selectedTokens, filterValues]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TrendingBar tokens={isCryptoMarket ? cryptoTokens : apiTokens} />
      <StatsBar
        tokens={tokens}
        onSearch={(q) => setSearchQuery(q)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isCryptoMarket={isCryptoMarket}
        onCryptoMarketToggle={() => setIsCryptoMarket(!isCryptoMarket)}
      />
      {!isCryptoMarket && !isViralView && (
        <TokenFilters
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          category={category}
          setCategory={setCategory}
          rankBy={rankBy}
          setRankBy={setRankBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterValues={filterValues}
          onFilterChange={setFilterValues}
        />
      )}
      {isCryptoMarket && <MarketSentimentBar data={globalData} isLoading={globalLoading} />}
      {!isCryptoMarket && (
         <ViralBar
           clusters={clusters}
           selectedCluster={selectedCluster}
           onSelect={setSelectedCluster}
           onClear={clearSelection}
           viralSortBy={viralSortBy}
           onViralSortChange={setViralSortBy}
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
                ? 'DexTools API rate limited — try again.'
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
          <TokenTable
            tokens={sortedTokens}
            isCryptoMarket={isCryptoMarket}
            ogTokenId={isViralView ? clusters.find(c => c.name === selectedCluster)?.ogToken?.id : null}
            topTokenId={isViralView ? clusters.find(c => c.name === selectedCluster)?.topToken?.id : null}
            showCreatedColumn={isViralView}
          />
        ) : (
          <TokenGrid tokens={sortedTokens} />
        )}
      </div>
    </div>
  );
};

export default Index;
