import { useNavigate } from 'react-router-dom';
import { Token, formatCompact } from '@/data/mockTokens';
import { FlameFilledIcon } from '@/components/icons/TablerIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrendingBarProps {
  tokens?: Token[];
}

const TrendingBar = ({ tokens = [] }: TrendingBarProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const trending = [...tokens].
  sort((a, b) => b.change24h - a.change24h).
  slice(0, 10);

  if (trending.length === 0) {
    return (
      <div className="flex items-center border-b border-border overflow-hidden">
        <div className="flex items-center gap-1 text-[13px] text-muted-foreground shrink-0 px-2 md:px-3 py-1.5 border-r border-border bg-[hsl(0,0%,14%)]">
          <FlameFilledIcon className="w-3.5 h-3.5" />
          <span className="font-medium">{isMobile ? 'Hot' : 'Trending'}</span>
        </div>
        <div className="flex-1 px-3 py-1.5">
          <span className="text-xs text-muted-foreground">Loading trending tokens...</span>
        </div>
      </div>);
  }

  const renderItems = (keyPrefix: string) =>
  trending.map((token, i) =>
  <button
    key={`${keyPrefix}-${token.id}`}
    onClick={() => navigate(`/token/${token.id}`)}
    className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 rounded bg-[hsl(0,0%,14%)] hover:bg-accent transition-colors shrink-0 border border-border/30">

        <span className={`text-[11px] font-medium ${i < 3 ? 'trending-gold' : 'text-muted-foreground'}`}>#{i + 1}</span>
        {token.logoUrl ?
    <img
      src={token.logoUrl}
      alt={token.ticker}
      className="w-4 h-4 md:w-5 md:h-5 rounded-full"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const fallback = e.currentTarget.nextElementSibling;
        if (fallback) (fallback as HTMLElement).style.display = 'flex';
      }} /> :
    null}
        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-primary/60 to-accent items-center justify-center text-[8px] text-foreground font-bold" style={{ display: token.logoUrl ? 'none' : 'flex' }}>
          {token.ticker?.charAt(0) || '?'}
        </div>
        <span
      className={`text-[12px] md:text-[13px] font-bold ${i < 3 ? 'trending-gold' : 'text-foreground'}`}>
          {token.ticker}
        </span>
        {!isMobile && (
          <span className="text-[11px] text-muted-foreground">
            ${formatCompact(token.mcap)}
          </span>
        )}
        <span className={`text-[11px] md:text-[12px] font-bold tracking-tight ${token.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
        </span>
      </button>
  );

  return (
    <div className="flex items-center border-b border-border overflow-hidden">
      {/* Trending label */}
      <div className="flex items-center gap-1 text-[13px] shrink-0 px-2 md:px-3 py-1.5 border-r border-border bg-[hsl(0,0%,14%)]">
        <FlameFilledIcon className="w-3.5 h-3.5" />
        <span className="font-medium text-foreground">{isMobile ? 'Hot' : 'Trending'}</span>
      </div>

      <div className="overflow-hidden flex-1">
        <div className="flex items-center gap-1.5 md:gap-2 py-1.5 animate-marquee hover:[animation-play-state:paused]">
          {renderItems('a')}
          {renderItems('b')}
        </div>
      </div>
    </div>);
};

export default TrendingBar;