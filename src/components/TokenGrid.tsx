import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {tokens.map((token) => {
        const exchange = getExchangeLogo(token.exchangeName);
        return (
          <div
            key={token.id}
            onClick={() => navigate(`/token/${token.id}`)}
            className="bg-[hsl(var(--surface-2))] border border-border/50 rounded-xl p-5 group cursor-pointer hover:border-primary/40 hover:bg-[hsl(var(--surface-3))] transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Header: Logo + Name + DEX */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative shrink-0">
                {token.logoUrl ? (
                  <img
                    src={token.logoUrl}
                    alt={token.ticker}
                    className="w-12 h-12 rounded-lg object-cover transition-transform duration-200 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/60 to-accent flex items-center justify-center text-base font-bold text-foreground transition-transform duration-200 group-hover:scale-110">
                    {token.ticker?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground text-[15px] truncate">{token.name}</span>
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
                <span className="text-[13px] text-muted-foreground">{token.ticker}</span>
              </div>
            </div>

            {/* Price + 24h change */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-foreground">{formatNumber(token.mcap)}</span>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[13px] font-bold tracking-tight ${
                token.change24h >= 0
                  ? 'bg-[hsl(var(--profit)/0.18)] text-profit'
                  : 'bg-[hsl(var(--loss)/0.18)] text-loss'
              }`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
              {[
                { label: 'Vol', value: formatNumber(token.volume), tip: 'total traded value in USD' },
                { label: 'MCap', value: formatNumber(token.mcap), tip: 'market cap = price × total supply' },
                { label: 'Liq', value: formatNumber(token.liquidity), tip: 'available liquidity in the pool' },
                { label: 'Age', value: token.age, tip: 'time since token was created' },
              ].map(({ label, value, tip }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[12px] text-muted-foreground inline-flex items-center gap-0.5">{label} <InfoTooltip text={tip} iconSize={10} /></span>
                  <span className="text-[13px] font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>

            {/* Time-frame changes */}
            <div className="flex gap-1 pt-2 border-t border-border/30">
              {[
                { label: '5m', val: token.change5m },
                { label: '1h', val: token.change1h },
                { label: '6h', val: token.change6h },
              ].map(({ label, val }) => (
                <div key={label} className="flex-1 text-center">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
                  <div className={`text-[13px] font-bold tracking-tight px-2 py-1 rounded-lg ${
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
