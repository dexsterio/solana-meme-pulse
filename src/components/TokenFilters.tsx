import { useState } from 'react';
import { Filter, LayoutList, LayoutGrid, Clock, Flame, Trophy, TrendingUp, Sparkles, User, Rocket, Megaphone, Settings, ChevronDown } from 'lucide-react';

export type TimeFilter = '5m' | '1h' | '6h' | '24h';
export type Category = 'trending' | 'top' | 'gainers' | 'new';
export type RankBy = 'trending' | 'volume' | 'priceChange' | 'txns' | 'mcap';
export type ViewMode = 'list' | 'grid';

interface TokenFiltersProps {
  timeFilter: TimeFilter;
  setTimeFilter: (t: TimeFilter) => void;
  category: Category;
  setCategory: (c: Category) => void;
  rankBy: RankBy;
  setRankBy: (r: RankBy) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
}

const TokenFilters = ({
  timeFilter, setTimeFilter,
  category, setCategory,
  rankBy, setRankBy,
  viewMode, setViewMode,
}: TokenFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const timeOptions: TimeFilter[] = ['5m', '1h', '6h', '24h'];

  const timeLabel = {
    '5m': 'Last 5 minutes',
    '1h': 'Last hour',
    '6h': 'Last 6 hours',
    '24h': 'Last 24 hours',
  }[timeFilter];

  return (
    <div className="px-3 py-2 border-b border-border space-y-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Time period pill - green */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-profit/40 text-profit text-[13px]">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLabel}</span>
          <ChevronDown className="w-3 h-3" />
        </div>

        {/* Trending pill with embedded time toggles */}
        <div className="flex items-center rounded-full overflow-hidden border border-orange-500/30">
          <button
            onClick={() => setCategory('trending')}
            className={`flex items-center gap-1 px-3 py-1.5 text-[13px] transition-colors ${
              category === 'trending'
                ? 'bg-orange-500/15 text-orange-400'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Trending
          </button>
          <div className="flex items-center bg-secondary/80 border-l border-border">
            {timeOptions.map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-2 py-1.5 text-[12px] transition-colors ${
                  timeFilter === t
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Category buttons */}
        <button
          onClick={() => setCategory('top')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-[13px] transition-colors ${
            category === 'top' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Top
        </button>
        <button
          onClick={() => setCategory('gainers')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-[13px] transition-colors ${
            category === 'gainers' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Gainers
        </button>
        <button
          onClick={() => setCategory('new')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-[13px] transition-colors ${
            category === 'new' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          New Pairs
        </button>

        {/* Decorative buttons */}
        <button className="flex items-center gap-1 px-3 py-1.5 rounded text-[13px] text-muted-foreground hover:text-foreground">
          <User className="w-3.5 h-3.5" />
          Profile
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded text-[13px] text-muted-foreground hover:text-foreground">
          <Rocket className="w-3.5 h-3.5" />
          Boosted
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded text-[13px] text-muted-foreground hover:text-foreground">
          <Megaphone className="w-3.5 h-3.5" />
          Ads
        </button>

        <div className="flex-1" />

        {/* Rank by dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] text-muted-foreground">Rank by:</span>
          <div className="relative">
            <select
              value={rankBy}
              onChange={(e) => setRankBy(e.target.value as RankBy)}
              className="appearance-none bg-secondary text-foreground text-[13px] rounded border border-border px-3 py-1.5 pr-7 outline-none cursor-pointer"
            >
              <option value="trending">Trending {timeFilter.toUpperCase()}</option>
              <option value="volume">Volume</option>
              <option value="priceChange">Price Change</option>
              <option value="txns">Transactions</option>
              <option value="mcap">Market Cap</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 px-3 py-1.5 text-[13px] rounded transition-colors ${
            showFilters ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>

        {/* Customize */}
        <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] rounded bg-secondary text-muted-foreground hover:text-foreground">
          <Settings className="w-3.5 h-3.5" />
          Customize
        </button>

        {/* View toggle */}
        <div className="flex items-center bg-secondary rounded p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-sm transition-colors ${
              viewMode === 'list' ? 'bg-accent text-foreground' : 'text-muted-foreground'
            }`}
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-sm transition-colors ${
              viewMode === 'grid' ? 'bg-accent text-foreground' : 'text-muted-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4 p-3 bg-secondary rounded text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Min Volume:</span>
            <input type="text" placeholder="$0" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground text-[13px]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Min Liquidity:</span>
            <input type="text" placeholder="$0" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground text-[13px]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Min MCAP:</span>
            <input type="text" placeholder="$0" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground text-[13px]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Max Age:</span>
            <input type="text" placeholder="Any" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground text-[13px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenFilters;
