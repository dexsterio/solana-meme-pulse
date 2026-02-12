import { mockTokens, formatNumber, formatCompact } from '@/data/mockTokens';

const StatsBar = () => {
  const totalVolume = mockTokens.reduce((sum, t) => sum + t.volume, 0);
  const totalTxns = mockTokens.reduce((sum, t) => sum + t.txns, 0);

  return (
    <div className="flex items-center gap-6 px-4 py-2 border-b border-border text-xs">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">24H VOLUME:</span>
        <span className="text-profit font-semibold">{formatNumber(totalVolume)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">24H TXNS:</span>
        <span className="text-foreground font-semibold">{formatCompact(totalTxns)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">SHOWING:</span>
        <span className="text-foreground font-semibold">{mockTokens.length} tokens</span>
      </div>
    </div>
  );
};

export default StatsBar;
