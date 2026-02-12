import { useState, useMemo } from 'react';
import StatsBar from '@/components/StatsBar';
import TokenFilters, { TimeFilter, Category, RankBy, ViewMode } from '@/components/TokenFilters';
import TokenTable from '@/components/TokenTable';
import TokenGrid from '@/components/TokenGrid';
import TrendingBar from '@/components/TrendingBar';
import { mockTokens } from '@/data/mockTokens';

const Index = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [category, setCategory] = useState<Category>('trending');
  const [rankBy, setRankBy] = useState<RankBy>('trending');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const sortedTokens = useMemo(() => {
    let tokens = [...mockTokens];

    // Category filter
    if (category === 'gainers') {
      tokens = tokens.filter((t) => t.change24h > 0);
    } else if (category === 'new') {
      tokens = tokens.filter((t) => {
        const age = t.age;
        return age.includes('m') || age.includes('h');
      });
    }

    // Sort
    switch (rankBy) {
      case 'volume':
        tokens.sort((a, b) => b.volume - a.volume);
        break;
      case 'priceChange':
        tokens.sort((a, b) => b.change24h - a.change24h);
        break;
      case 'txns':
        tokens.sort((a, b) => b.txns - a.txns);
        break;
      case 'mcap':
        tokens.sort((a, b) => b.mcap - a.mcap);
        break;
      default:
        // trending = default rank
        break;
    }

    return tokens;
  }, [category, rankBy]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TrendingBar />
      <StatsBar onSearch={(addr) => console.log('Search:', addr)} />
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
        {viewMode === 'list' ? (
          <TokenTable tokens={sortedTokens} />
        ) : (
          <TokenGrid tokens={sortedTokens} />
        )}
      </div>
    </div>
  );
};

export default Index;
