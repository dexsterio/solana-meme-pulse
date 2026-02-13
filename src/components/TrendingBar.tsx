import { useNavigate } from 'react-router-dom';
import { Token } from '@/data/mockTokens';
import { Flame } from 'lucide-react';

interface TrendingBarProps {
  tokens?: Token[];
}

const TrendingBar = ({ tokens = [] }: TrendingBarProps) => {
  const navigate = useNavigate();
  const trending = [...tokens]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 10);

  if (trending.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border overflow-x-auto">
      <div className="flex items-center gap-1 text-[13px] text-muted-foreground shrink-0">
        <Flame className="w-3.5 h-3.5 text-orange-500" />
        <span>Trending</span>
      </div>
      {trending.map((token, i) => (
        <button
          key={token.id}
          onClick={() => navigate(`/token/${token.id}`)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary hover:bg-accent transition-colors shrink-0"
        >
          <span className="text-[11px] text-muted-foreground">#{i + 1}</span>
          {token.logoUrl ? (
            <img src={token.logoUrl} alt={token.ticker} className="w-4 h-4 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span className="text-[14px]">🪙</span>
          )}
          <span className="text-[13px] font-medium text-foreground">{token.ticker}</span>
          <span className={`text-[12px] font-bold tracking-tight ${token.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(0)}%
          </span>
        </button>
      ))}
    </div>
  );
};

export default TrendingBar;
