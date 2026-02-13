import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenGridProps {
  tokens: Token[];
}

const TokenGrid = ({ tokens }: TokenGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
      {tokens.map((token) => (
        <div
          key={token.id}
          onClick={() => navigate(`/token/${token.id}`)}
          className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all hover:bg-accent/30"
        >
          <div className="flex items-center gap-3 mb-3">
            {token.logoUrl ? (
              <img src={token.logoUrl} alt={token.ticker} className="w-10 h-10 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent flex items-center justify-center text-sm font-bold text-foreground">
                {token.ticker?.charAt(0) || '?'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground text-sm">{token.name}</span>
                {token.boosts && (
                  <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                    <Zap className="w-3 h-3" />
                    {token.boosts}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{token.ticker}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-mono font-semibold text-foreground">{formatPrice(token.price)}</span>
              <div className={`flex items-center gap-1 text-xs font-medium ${token.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                {token.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vol</span>
                <span className="text-foreground">{formatNumber(token.volume)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">MCap</span>
                <span className="text-foreground">{formatNumber(token.mcap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liq</span>
                <span className="text-foreground">{formatNumber(token.liquidity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="text-foreground">{token.age}</span>
              </div>
            </div>

            <div className="flex gap-1 pt-1">
              {[
                { label: '5m', val: token.change5m },
                { label: '1h', val: token.change1h },
                { label: '6h', val: token.change6h },
              ].map(({ label, val }) => (
                <div key={label} className="flex-1 text-center">
                  <div className="text-[9px] text-muted-foreground mb-0.5">{label}</div>
                  <div className={`text-[10px] font-mono ${val >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {val >= 0 ? '+' : ''}{val.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenGrid;
