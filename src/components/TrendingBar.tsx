import { useNavigate } from 'react-router-dom';
import { mockTokens } from '@/data/mockTokens';
import { Flame } from 'lucide-react';

const TrendingBar = () => {
  const navigate = useNavigate();
  const trending = [...mockTokens]
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 10);

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border overflow-x-auto">
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Flame className="w-3.5 h-3.5 text-orange-500" />
        <span>Trending</span>
      </div>
      {trending.map((token, i) => (
        <button
          key={token.id}
          onClick={() => navigate(`/token/${token.id}`)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary hover:bg-accent transition-colors shrink-0"
        >
          <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
          <span className="text-sm">{token.logo}</span>
          <span className="text-xs font-medium text-foreground">{token.ticker}</span>
          <span className={`text-[10px] font-mono ${token.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(0)}%
          </span>
        </button>
      ))}
    </div>
  );
};

export default TrendingBar;
