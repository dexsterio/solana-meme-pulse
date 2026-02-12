import { useState } from 'react';
import { Filter, LayoutList, LayoutGrid } from 'lucide-react';

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
  const categories: { key: Category; label: string }[] = [
    { key: 'trending', label: 'Trending' },
    { key: 'top', label: 'Top' },
    { key: 'gainers', label: 'Gainers' },
    { key: 'new', label: 'New Pairs' },
  ];

  return (
    <div className="px-4 py-2 border-b border-border space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Time filters */}
        <div className="flex items-center bg-secondary rounded-md p-0.5">
          {timeOptions.map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                timeFilter === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                category === c.key
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Rank by */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rank by:</span>
          <select
            value={rankBy}
            onChange={(e) => setRankBy(e.target.value as RankBy)}
            className="bg-secondary text-foreground text-xs rounded-md border border-border px-2 py-1.5 outline-none"
          >
            <option value="trending">Trending {timeFilter.toUpperCase()}</option>
            <option value="volume">Volume</option>
            <option value="priceChange">Price Change</option>
            <option value="txns">Transactions</option>
            <option value="mcap">Market Cap</option>
          </select>
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            showFilters ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>

        {/* View toggle */}
        <div className="flex items-center bg-secondary rounded-md p-0.5">
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

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="flex items-center gap-4 p-3 bg-secondary rounded-md text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Min Volume:</span>
            <input type="text" placeholder="$0" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Min Liquidity:</span>
            <input type="text" placeholder="$0" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Min MCAP:</span>
            <input type="text" placeholder="$0" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Max Age:</span>
            <input type="text" placeholder="Any" className="w-20 bg-background border border-border rounded px-2 py-1 text-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenFilters;
