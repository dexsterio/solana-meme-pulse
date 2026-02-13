import { useState, useMemo } from 'react';
import StatsBar from '@/components/StatsBar';
import TokenFilters, { TimeFilter, Category, RankBy, ViewMode } from '@/components/TokenFilters';
import TokenTable from '@/components/TokenTable';
import TokenGrid from '@/components/TokenGrid';
import TrendingBar from '@/components/TrendingBar';
import { useTokens } from '@/hooks/useTokens';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [category, setCategory] = useState<Category>('trending');
  const [rankBy, setRankBy] = useState<RankBy>('trending');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { data: tokens = [], isLoading, isError } = useTokens(category);

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
      <TrendingBar tokens={tokens} />
      <StatsBar tokens={tokens} onSearch={(addr) => console.log('Search:', addr)} />
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
      <div className="flex-1 overflow-auto">
        {isLoading && tokens.length === 0 ? (
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
          <div className="flex items-center justify-center h-40 text-loss text-sm">
            Failed to load data from DexTools API. Check console for details.
          </div>
        ) : viewMode === 'list' ? (
          <TokenTable tokens={sortedTokens} />
        ) : (
          <TokenGrid tokens={sortedTokens} />
        )}
      </div>
    </div>
  );
};

export default Index;
