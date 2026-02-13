import { useNavigate } from 'react-router-dom';
import { Token, formatCompact } from '@/data/mockTokens';
import { FlameFilledIcon } from '@/components/icons/TablerIcons';


interface TrendingBarProps {
  tokens?: Token[];
}

const TrendingBar = ({ tokens = [] }: TrendingBarProps) => {
  const navigate = useNavigate();
  const trending = [...tokens]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 10);

  if (trending.length === 0) return null;

  const renderItems = (keyPrefix: string) =>
    trending.map((token, i) => (
      <button
        key={`${keyPrefix}-${token.id}`}
        onClick={() => navigate(`/token/${token.id}`)}
        className="flex items-center gap-2 px-3 py-1 rounded bg-secondary hover:bg-accent transition-colors shrink-0"
      >
        <span className="text-[11px] text-muted-foreground font-medium">#{i + 1}</span>
        {token.logoUrl ? (
          <img src={token.logoUrl} alt={token.ticker} className="w-5 h-5 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <span className="text-[16px]">🪙</span>
        )}
        <span
          className={`text-[13px] font-bold ${i < 3 ? 'trending-gold' : 'text-foreground'}`}
        >
          {token.ticker}
        </span>
        <span className="text-[11px] text-muted-foreground">
          ${formatCompact(token.mcap)}
        </span>
        <span className={`text-[12px] font-bold tracking-tight ${token.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
        </span>
      </button>
    ));

  return (
    <div className="flex items-center border-b border-border overflow-hidden">
      <div className="flex items-center gap-1 text-[13px] text-muted-foreground shrink-0 px-3 py-1.5 border-r border-border bg-secondary/50">
        <FlameFilledIcon className="w-3.5 h-3.5" />
        <span className="font-medium">Trending</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex items-center gap-2 py-1.5 animate-marquee hover:[animation-play-state:paused]">
          {renderItems('a')}
          {renderItems('b')}
        </div>
      </div>
    </div>
  );
};

export default TrendingBar;
