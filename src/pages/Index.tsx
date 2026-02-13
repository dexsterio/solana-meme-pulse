import { useState, useMemo } from 'react';
import StatsBar from '@/components/StatsBar';
import TokenFilters, { TimeFilter, Category, RankBy, ViewMode } from '@/components/TokenFilters';
import TokenTable from '@/components/TokenTable';
import TokenGrid from '@/components/TokenGrid';
import TrendingBar from '@/components/TrendingBar';
import { useTokens } from '@/hooks/useTokens';

const Index = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [category, setCategory] = useState<Category>('trending');
  const [rankBy, setRankBy] = useState<RankBy>('trending');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { data: tokens = [], isLoading, isError } = useTokens(category);

  const sortedTokens = useMemo(() => {
    let list = [...tokens];

    if (category === 'gainers') {
      list = list.filter((t) => t.change24h > 0);
    } else if (category === 'new') {
      list = list.filter((t) => {
        const age = t.age;
        return age.includes('m') || age.includes('h');
      });
    }

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
  }, [tokens, category, rankBy]);

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
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            Loading live data...
          </div>
        ) : isError && tokens.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-loss text-sm">
            Failed to load data. Showing mock data.
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
