import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap } from 'lucide-react';

import pumpfunLogo from '@/assets/pumpfun-logo.png';
import bonkLogo from '@/assets/bonk-logo.png';
import raydiumLogo from '@/assets/raydium-logo.png';
import meteoraLogo from '@/assets/meteora-logo.png';
import orcaLogo from '@/assets/orca-logo.png';

interface TokenGridProps {
  tokens: Token[];
}

const getExchangeLogo = (exchangeName?: string) => {
  if (!exchangeName) return null;
  const name = exchangeName.toLowerCase();
  if (name.includes('pump') || name.includes('pumpfun')) return { src: pumpfunLogo, alt: 'Pump.fun' };
  if (name.includes('bonk') || name.includes('letsbonk')) return { src: bonkLogo, alt: 'Bonk' };
  if (name.includes('raydium')) return { src: raydiumLogo, alt: 'Raydium' };
  if (name.includes('meteora')) return { src: meteoraLogo, alt: 'Meteora' };
  if (name.includes('orca')) return { src: orcaLogo, alt: 'Orca' };
  return null;
};

const TokenGrid = ({ tokens }: TokenGridProps) => {
  const navigate = useNavigate();

  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2">
        <p className="text-muted-foreground text-sm">No tokens found</p>
        <p className="text-muted-foreground/60 text-xs">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 min-[375px]:grid-cols-2 md:grid-cols-2 min-[900px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 lg:gap-4 p-2 md:p-3 lg:p-4 max-w-[1920px] mx-auto">
      {tokens.map((token) => {
        const exchange = getExchangeLogo(token.exchangeName);
        return (
          <div
            key={token.id}
            onClick={() => navigate(`/token/${token.id}`)}
            className="bg-[hsl(0,0%,14%)] border border-border rounded-xl p-3 md:p-5 group cursor-pointer hover:border-primary/40 hover:bg-[hsl(0,0%,16%)] transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            {/* Rank badge + Header */}
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="relative shrink-0">
                {token.logoUrl ? (
                  <>
                    <img
                      src={token.logoUrl}
                      alt={token.ticker}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover transition-transform duration-200 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }}
                    />
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary/60 to-accent items-center justify-center text-base font-bold text-foreground transition-transform duration-200 group-hover:scale-110 hidden">
                      {token.ticker?.charAt(0) || '?'}
                    </div>
                  </>
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary/60 to-accent flex items-center justify-center text-base font-bold text-foreground transition-transform duration-200 group-hover:scale-110">
                    {token.ticker?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold ${token.rank <= 5 ? 'text-[#e5a50a]' : 'text-muted-foreground'}`}>#{token.rank}</span>
                  <span className="font-semibold text-foreground text-[14px] md:text-[15px] truncate">{token.ticker}</span>
                  {exchange && (
                    <img src={exchange.src} alt={exchange.alt} className="w-4 h-4 shrink-0" />
                  )}
                  {token.boosts && (
                    <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                      <Zap className="w-3 h-3" />
                      {token.boosts}
                    </span>
                  )}
                </div>
                <span className="text-[11px] md:text-[12px] text-muted-foreground truncate block">{token.name}</span>
              </div>
            </div>

            {/* Price + 24h change */}
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-base md:text-lg font-bold text-foreground">{formatPrice(token.price)}</span>
              <div className={`flex items-center gap-1 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[12px] md:text-[13px] font-bold tracking-tight ${
                token.change24h >= 0
                  ? 'bg-[hsl(var(--profit)/0.18)] text-profit'
                  : 'bg-[hsl(var(--loss)/0.18)] text-loss'
              }`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-x-3 md:gap-x-4 gap-y-1 md:gap-y-1.5 mb-2 md:mb-3">
              {[
                { label: 'Vol', value: formatNumber(token.volume) },
                { label: 'MCap', value: formatNumber(token.mcap) },
                { label: 'Liq', value: formatNumber(token.liquidity) },
                { label: 'Age', value: token.age },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[11px] md:text-[12px] text-muted-foreground">{label}</span>
                  <span className="text-[12px] md:text-[13px] font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>

            {/* Time-frame changes */}
            <div className="flex gap-1 pt-2 border-t border-border/30">
              {[
                { label: '5m', val: token.change5m },
                { label: '1h', val: token.change1h },
                { label: '6h', val: token.change6h },
                { label: '24h', val: token.change24h },
              ].map(({ label, val }) => (
                <div key={label} className="flex-1 text-center">
                  <div className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
                  <div className={`text-[11px] md:text-[12px] font-bold tracking-tight px-1 md:px-1.5 py-0.5 rounded-lg ${
                    val >= 0
                      ? 'bg-[hsl(var(--profit)/0.15)] text-profit'
                      : 'bg-[hsl(var(--loss)/0.15)] text-loss'
                  }`}>
                    {val >= 0 ? '+' : ''}{val.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TokenGrid;