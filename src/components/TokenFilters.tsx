import { useState } from 'react';
import { Filter, LayoutList, LayoutGrid, Clock, Trophy, TrendingUp, Sparkles, Settings, ChevronDown } from 'lucide-react';
import { FlameFilledIcon } from '@/components/icons/TablerIcons';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

export type TimeFilter = '5m' | '1h' | '6h' | '24h';
export type Category = 'trending' | 'top' | 'gainers' | 'new';
export type RankBy = 'trending' | 'volume' | 'priceChange' | 'txns' | 'mcap';
export type ViewMode = 'list' | 'grid';

export interface FilterValues {
  minVolume: string;
  minLiquidity: string;
  minMcap: string;
  maxAge: string;
}

interface TokenFiltersProps {
  timeFilter: TimeFilter;
  setTimeFilter: (t: TimeFilter) => void;
  category: Category;
  setCategory: (c: Category) => void;
  rankBy: RankBy;
  setRankBy: (r: RankBy) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  filterValues?: FilterValues;
  onFilterChange?: (filters: FilterValues) => void;
}

const TokenFilters = ({
  timeFilter, setTimeFilter,
  category, setCategory,
  rankBy, setRankBy,
  viewMode, setViewMode,
  filterValues,
  onFilterChange,
}: TokenFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const filters = filterValues || { minVolume: '', minLiquidity: '', minMcap: '', maxAge: '' };
  const isMobile = useIsMobile();

  const timeOptions: TimeFilter[] = ['5m', '1h', '6h', '24h'];

  const updateFilter = (key: keyof FilterValues, value: string) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    onFilterChange?.({ ...filters, [key]: value });
  };

  return (
    <div className="px-2 md:px-3 py-1.5 border-b border-border">
      <div className="flex items-center gap-1.5 min-w-0 whitespace-nowrap overflow-x-auto scrollbar-hide">
        {/* Trending pill with embedded time toggles */}
        <div className="flex items-center rounded-full overflow-hidden border border-orange-500/30">
          <button
            onClick={() => setCategory('trending')}
            className={`flex items-center gap-1 px-2 md:px-3 py-1.5 text-[12px] md:text-[13px] transition-colors ${
            category === 'trending' ?
            'bg-orange-500/15 text-orange-400' :
            'bg-[hsl(0,0%,16%)] text-muted-foreground hover:text-foreground'}`}
          >
            <FlameFilledIcon className="w-3.5 h-3.5" />
            {!isMobile && 'Trending'}
          </button>
          <div className="flex items-center bg-[hsl(0,0%,14%)] border-l border-border">
            {timeOptions.map((t) =>
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-1.5 md:px-2 py-1.5 text-[11px] md:text-[12px] transition-colors ${
              timeFilter === t ?
              'text-foreground bg-accent' :
              'text-muted-foreground hover:text-foreground'}`}
            >
              {t.toUpperCase()}
            </button>
            )}
          </div>
        </div>

        {/* Category buttons */}
        <button
          onClick={() => setCategory('top')}
          className={`flex items-center gap-1 px-2 md:px-3 py-1.5 rounded text-[12px] md:text-[13px] transition-colors ${
          category === 'top' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Trophy className="w-3.5 h-3.5" />
          {!isMobile && 'Top'}
        </button>
        <button
          onClick={() => setCategory('gainers')}
          className={`flex items-center gap-1 px-2 md:px-3 py-1.5 rounded text-[12px] md:text-[13px] transition-colors ${
          category === 'gainers' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {!isMobile && 'Gainers'}
        </button>
        <button
          onClick={() => setCategory('new')}
          className={`flex items-center gap-1 px-2 md:px-3 py-1.5 rounded text-[12px] md:text-[13px] transition-colors ${
          category === 'new' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {!isMobile && 'New Pairs'}
        </button>

        <div className="flex-1" />

        {/* Rank by dropdown - hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center gap-1.5">
            <label htmlFor="rank-by-select" className="text-[13px] text-muted-foreground">Rank by:</label>
            <div className="relative">
              <select
                id="rank-by-select"
                value={rankBy}
                onChange={(e) => setRankBy(e.target.value as RankBy)}
                className="appearance-none bg-[hsl(0,0%,16%)] text-foreground text-[13px] rounded border border-border px-3 py-1.5 pr-7 outline-none cursor-pointer focus:ring-1 focus:ring-ring"
                aria-label="Rank tokens by"
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
        )}

        {/* Filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 px-2 md:px-3 py-1.5 text-[12px] md:text-[13px] rounded transition-colors ${
          showFilters ? 'bg-primary text-primary-foreground' : 'bg-[hsl(0,0%,16%)] text-muted-foreground hover:text-foreground border border-border'}`}
        >
          <Filter className="w-3.5 h-3.5" />
          {!isMobile && 'Filters'}
        </button>

        {/* Customize - hidden on mobile */}
        {!isMobile && (
          <button
            onClick={() => toast.info('Column customization coming soon')}
            className="flex items-center gap-1 px-3 py-1.5 text-[13px] rounded bg-[hsl(0,0%,16%)] text-muted-foreground hover:text-foreground border border-border"
          >
            <Settings className="w-3.5 h-3.5" />
            Customize
          </button>
        )}

        {/* View toggle */}
        <div className="flex items-center bg-[hsl(0,0%,16%)] rounded p-0.5 border border-border">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-sm transition-colors ${
            viewMode === 'list' ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
            aria-label="List view"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-sm transition-colors ${
            viewMode === 'grid' ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilters &&
      <div className={`flex ${isMobile ? 'flex-wrap' : 'items-center'} gap-3 md:gap-4 p-3 bg-[hsl(0,0%,14%)] rounded border border-border mt-1.5 text-[13px]`}>
          <div className="flex items-center gap-2">
            <label htmlFor="filter-volume" className="text-muted-foreground text-[12px] md:text-[13px]">Min Vol:</label>
            <input
              id="filter-volume"
              type="text"
              inputMode="numeric"
              placeholder="$0"
              value={filters.minVolume}
              onChange={(e) => updateFilter('minVolume', e.target.value)}
              className="w-16 md:w-20 bg-[hsl(0,0%,16%)] border border-border rounded px-2 py-1 text-foreground text-[13px] outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filter-liquidity" className="text-muted-foreground text-[12px] md:text-[13px]">Min Liq:</label>
            <input
              id="filter-liquidity"
              type="text"
              inputMode="numeric"
              placeholder="$0"
              value={filters.minLiquidity}
              onChange={(e) => updateFilter('minLiquidity', e.target.value)}
              className="w-16 md:w-20 bg-[hsl(0,0%,16%)] border border-border rounded px-2 py-1 text-foreground text-[13px] outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filter-mcap" className="text-muted-foreground text-[12px] md:text-[13px]">Min MCap:</label>
            <input
              id="filter-mcap"
              type="text"
              inputMode="numeric"
              placeholder="$0"
              value={filters.minMcap}
              onChange={(e) => updateFilter('minMcap', e.target.value)}
              className="w-16 md:w-20 bg-[hsl(0,0%,16%)] border border-border rounded px-2 py-1 text-foreground text-[13px] outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filter-age" className="text-muted-foreground text-[12px] md:text-[13px]">Max Age:</label>
            <input
              id="filter-age"
              type="text"
              placeholder="Any"
              value={filters.maxAge}
              onChange={(e) => onFilterChange?.({ ...filters, maxAge: e.target.value })}
              className="w-16 md:w-20 bg-[hsl(0,0%,16%)] border border-border rounded px-2 py-1 text-foreground text-[13px] outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      }
    </div>);
};

export default TokenFilters;