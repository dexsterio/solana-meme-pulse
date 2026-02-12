import { useState } from 'react';
import { Search } from 'lucide-react';
import { mockTokens, formatNumber, formatCompact } from '@/data/mockTokens';

interface StatsBarProps {
  onSearch?: (address: string) => void;
}

const StatsBar = ({ onSearch }: StatsBarProps) => {
  const [searchValue, setSearchValue] = useState('');
  const totalVolume = mockTokens.reduce((sum, t) => sum + t.volume, 0);
  const totalTxns = mockTokens.reduce((sum, t) => sum + t.txns, 0);

  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-border">
      {/* Search */}
      <div className="flex items-center bg-secondary rounded border border-border min-w-[200px]">
        <Search className="w-3.5 h-3.5 text-muted-foreground ml-2" />
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.(searchValue)}
          className="bg-transparent px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
      </div>

      {/* 24H Volume box */}
      <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded bg-secondary">
        <span className="text-[11px] text-muted-foreground font-medium tracking-wide">24H VOLUME:</span>
        <span className="text-[13px] text-profit font-bold">{formatNumber(totalVolume)}</span>
      </div>

      {/* 24H Txns box */}
      <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded bg-secondary">
        <span className="text-[11px] text-muted-foreground font-medium tracking-wide">24H TXNS:</span>
        <span className="text-[13px] text-foreground font-bold">{totalTxns.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default StatsBar;
