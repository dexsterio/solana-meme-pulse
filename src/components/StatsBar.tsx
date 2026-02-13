import { Search, X } from 'lucide-react';
import { WorldIcon } from '@/components/icons/TablerIcons';
import { Token, formatNumber } from '@/data/mockTokens';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 border-b border-border flex-wrap">
      <div className={`flex items-center bg-[hsl(0,0%,16%)] rounded border border-border ${isMobile ? 'flex-1 min-w-0' : 'min-w-[180px]'}`}>
        <Search className="w-3.5 h-3.5 text-muted-foreground ml-2.5 shrink-0" />
        <input
          type="text"
          placeholder="Search token..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange?.(e.target.value);
          }}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.(searchQuery)}
          className="bg-transparent px-2 py-1.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none w-full min-w-0"
          aria-label="Search tokens"
        />
        {searchQuery && (
          <button
            onClick={() => { onSearchChange?.(''); onSearch?.(''); }}
            className="p-1 mr-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!isMobile && (
        <>
          <div className="flex items-center gap-2 px-4 py-1.5 border border-border rounded bg-[hsl(0,0%,16%)]">
            <span className="text-[13px] text-muted-foreground">24H VOLUME:</span>
            <span className="text-[15px] text-profit font-bold">{formatNumber(totalVolume)}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 border border-border rounded bg-[hsl(0,0%,16%)]">
            <span className="text-[13px] text-muted-foreground">24H TXNS:</span>
            <span className="text-[15px] text-foreground font-bold">{totalTxns.toLocaleString()}</span>
          </div>
        </>
      )}

      <button
        onClick={onCryptoMarketToggle}
        className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 border rounded text-[13px] font-medium transition-colors shrink-0 ${
          isCryptoMarket
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-[hsl(0,0%,16%)] text-muted-foreground border-border hover:text-foreground'
        }`}
      >
        <WorldIcon className="w-3.5 h-3.5" />
        {isMobile ? 'Market' : (isCryptoMarket ? 'Back to Memes' : 'Market View')}
      </button>
    </div>
  );
};

export default StatsBar;