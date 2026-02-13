import { Search } from 'lucide-react';
import { WorldIcon } from '@/components/icons/TablerIcons';
import { Token, formatNumber } from '@/data/mockTokens';


interface StatsBarProps {
  tokens?: Token[];
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isCryptoMarket?: boolean;
  onCryptoMarketToggle?: () => void;
}

const StatsBar = ({ tokens = [], onSearch, searchQuery = '', onSearchChange, isCryptoMarket = false, onCryptoMarketToggle }: StatsBarProps) => {
  const totalVolume = tokens.reduce((sum, t) => sum + t.volume, 0);
  const totalTxns = tokens.reduce((sum, t) => sum + t.txns, 0);

  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-border">
      <div className="flex items-center bg-secondary rounded border border-border min-w-[180px]">
        <Search className="w-3.5 h-3.5 text-muted-foreground ml-2.5" />
        <input
          type="text"
          placeholder="Search token..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange?.(e.target.value);
          }}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.(searchQuery)}
          className="bg-transparent px-2 py-1.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-2 px-4 py-1.5 border border-border rounded bg-secondary">
        <span className="text-[13px] text-muted-foreground">24H VOLUME:</span>
        <span className="text-[15px] text-profit font-bold">{formatNumber(totalVolume)}</span>
      </div>

      <div className="flex items-center gap-2 px-4 py-1.5 border border-border rounded bg-secondary">
        <span className="text-[13px] text-muted-foreground">24H TXNS:</span>
        <span className="text-[15px] text-foreground font-bold">{totalTxns.toLocaleString()}</span>
      </div>

      <button
        onClick={onCryptoMarketToggle}
        className={`flex items-center gap-1.5 px-4 py-1.5 border rounded text-[13px] font-medium transition-colors ${
          isCryptoMarket
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
        }`}
      >
        <WorldIcon className="w-3.5 h-3.5" />
        {isCryptoMarket ? 'Meme Zone' : 'Market View'}
      </button>
    </div>
  );
};

export default StatsBar;
