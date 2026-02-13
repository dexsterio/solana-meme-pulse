import { Token, formatPrice, formatNumber, formatCompact } from '@/data/mockTokens';
import { Globe, Twitter, MessageCircle, Star, Bell, ExternalLink, Zap, Copy, ChevronDown } from 'lucide-react';
import SolanaIcon from '@/components/SolanaIcon';
import { toast } from 'sonner';
import { useState } from 'react';

interface TokenInfoPanelProps {
  token: Token;
  onBuyClick?: () => void;
  onSellClick?: () => void;
}

function formatPercent(val: number): string {
  const abs = Math.abs(val);
  const prefix = val >= 0 ? '+' : '';
  if (abs >= 100) return prefix + Math.round(val) + '%';
  if (abs >= 10) return prefix + val.toFixed(1) + '%';
  return prefix + val.toFixed(2) + '%';
}

function RatioBar({ buyValue, sellValue }: { buyValue: number; sellValue: number }) {
  const total = buyValue + sellValue;
  const buyPercent = total > 0 ? (buyValue / total) * 100 : 50;
  return (
    <div className="h-1 w-full flex rounded-full overflow-hidden bg-muted/20 my-1">
      <div className="bg-profit" style={{ width: `${buyPercent}%` }} />
      <div className="bg-loss" style={{ width: `${100 - buyPercent}%` }} />
    </div>
  );
}

const TokenInfoPanel = ({ token, onBuyClick, onSellClick }: TokenInfoPanelProps) => {
  const [descExpanded, setDescExpanded] = useState(false);
  const buys = token.buys24h ?? Math.round(token.txns * 0.55);
  const sells = token.sells24h ?? (token.txns - buys);
  const buyVolume = token.buyVolume24h ?? token.volume * 0.58;
  const sellVolume = token.sellVolume24h ?? (token.volume - buyVolume);
  const buyers = Math.round(buys * 0.6);
  const sellers = Math.round(sells * 0.6);

  const hasSocials = token.twitter || token.telegram || token.website;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-y-auto text-xs">
      {/* Token identity header - left aligned */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          {token.logoUrl ? (
            <img src={token.logoUrl} alt={token.name} className="w-10 h-10 rounded-full shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; const fb = e.currentTarget.nextElementSibling; if (fb) (fb as HTMLElement).style.display = 'flex'; }} />
          ) : null}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent items-center justify-center text-sm text-foreground font-bold shrink-0" style={{ display: token.logoUrl ? 'none' : 'flex' }}>
            {token.ticker?.charAt(0) || '?'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground text-sm truncate">{token.name}</span>
              <span className="text-muted-foreground text-xs">({token.ticker})</span>
              <button
                onClick={() => copyToClipboard(token.id || '', 'Token address')}
                className="p-0.5 rounded hover:bg-accent text-muted-foreground shrink-0"
                aria-label="Copy token address"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground flex-wrap">
              <SolanaIcon size={10} />
              <span>Solana</span>
              <span className="text-muted-foreground/50">&gt;</span>
              <span>{token.exchangeName || 'Raydium'}</span>
              {token.age && (() => {
                const ageStr = token.age;
                const isYoung = ageStr.endsWith('h') || ageStr.endsWith('m') || ageStr.endsWith('s');
                return (
                  <span className="flex items-center gap-0.5">
                    {isYoung && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#26a269" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4.711 17.875c-.534 -1.339 -1.35 -4.178 .129 -6.47c1.415 -2.193 3.769 -3.608 5.099 -4.278l-5.229 10.748l.001 0" />
                        <path d="M19.715 12.508c-.54 3.409 -2.094 6.156 -4.155 7.348c-4.069 2.353 -8.144 .45 -9.297 -.188c.877 -1.436 4.433 -7.22 6.882 -10.591c2.714 -3.737 5.864 -5.978 6.565 -6.077c0 .201 .03 .55 .071 1.03c.144 1.709 .443 5.264 -.066 8.478" />
                      </svg>
                    )}
                    <span className={isYoung ? 'text-[#26a269] font-bold' : 'text-muted-foreground'}>{ageStr}</span>
                  </span>
                );
              })()}
              {token.rank > 0 && (
                <span className={`font-bold text-[11px] ${token.rank <= 5 ? 'text-[#e5a50a]' : 'text-foreground'}`}>#{token.rank}</span>
              )}
              {token.boosts && token.boosts > 0 && (
                <span className="px-1.5 py-0 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5" /> {token.boosts}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banner / Header Image + overlapping social buttons */}
      <div className="border-b border-border">
        {/* Banner - wide rectangle ~5:2 aspect ratio like reference */}
        <div className="w-full overflow-hidden relative" style={{ aspectRatio: '5 / 2' }}>
          {token.headerImage ? (
            <img src={token.headerImage} alt={`${token.name} banner`} className="w-full h-full object-cover" />
          ) : token.logoUrl ? (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(140,60%,20%)] to-[hsl(160,40%,10%)] flex items-center justify-center">
              <img src={token.logoUrl} alt={token.name} className="w-16 h-16 rounded-full opacity-80" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(0,0%,14%)] to-[hsl(0,0%,10%)] flex items-center justify-center">
              <span className="text-3xl font-bold text-muted-foreground/30">{token.ticker?.charAt(0) || '?'}</span>
            </div>
          )}
        </div>

        {/* Token description */}
        {token.description && (
          <div className="py-1.5">
            <p className={`text-[11px] text-muted-foreground leading-relaxed ${!descExpanded ? 'line-clamp-2' : ''}`}>
              {token.description}
            </p>
            {token.description.length > 80 && (
              <button onClick={() => setDescExpanded(!descExpanded)} className="text-[10px] text-primary hover:underline mt-0.5">
                {descExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Social buttons - overlapping banner bottom edge */}
        {hasSocials && (
          <div className="flex gap-2 -mt-4 relative z-10 pb-3 px-4">
            {token.website && (
              <a href={token.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-[hsl(0,0%,16%)] backdrop-blur-sm text-foreground hover:bg-accent transition-colors text-xs font-medium border border-border">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            {token.twitter && (
              <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-[hsl(0,0%,16%)] backdrop-blur-sm text-foreground hover:bg-accent transition-colors text-xs font-medium border border-border">
                <Twitter className="w-3.5 h-3.5" /> Twitter
              </a>
            )}
            <button className="p-2 rounded-md bg-[hsl(0,0%,16%)] backdrop-blur-sm text-muted-foreground hover:bg-accent transition-colors border border-border shrink-0">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {!hasSocials && <div className="pb-3" />}
      </div>

      {/* Price USD + Price SOL side by side */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[hsl(0,0%,16%)] rounded-md p-2.5 text-center border border-border">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Price USD</div>
            <div className="text-sm font-bold tracking-tight text-foreground">{formatPrice(token.price)}</div>
          </div>
          <div className="bg-[hsl(0,0%,16%)] rounded-md p-2.5 text-center border border-border">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Price SOL</div>
            <div className="text-sm font-bold tracking-tight text-foreground flex items-center justify-center gap-1">
              {(token.priceSOL ?? 0).toFixed(8)} <SolanaIcon size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Liquidity / FDV / MKT CAP row */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'LIQUIDITY', value: formatNumber(token.liquidity), icon: true },
            { label: 'FDV', value: token.fdv ? formatNumber(token.fdv) : '—' },
            { label: 'MKT CAP', value: formatNumber(token.mcap) },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-[hsl(0,0%,16%)] rounded-md p-2 text-center border border-border">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
              <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                {value}
                {icon && (token.liquidityLocked !== false ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#26a269" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v.5" />
                    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                    <path d="M15 19l2 2l4 -4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a51d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -6" />
                    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M8 11v-5a4 4 0 0 1 8 0" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price changes 5M / 1H / 6H / 24H */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: '5M', val: token.change5m },
            { label: '1H', val: token.change1h },
            { label: '6H', val: token.change6h },
            { label: '24H', val: token.change24h },
          ].map(({ label, val }) => (
            <div
              key={label}
              className={`rounded-md p-2 text-center border ${
                label === '24H' ? 'border-primary/40 bg-primary/10' : 'border-border bg-[hsl(0,0%,16%)]'
              }`}
            >
              <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
              <div className={`text-xs font-bold tracking-tight ${(val ?? 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                {formatPercent(val ?? 0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TXNS / Volume / Makers with ratio bars */}
      <div className="px-4 py-3 border-b border-border space-y-3">
        {/* TXNS row */}
        <div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">TXNS</div>
              <div className="text-sm font-bold text-foreground">{formatCompact(token.txns)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">BUYS</div>
              <div className="text-sm font-bold text-profit">{formatCompact(buys)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase">SELLS</div>
              <div className="text-sm font-bold text-loss">{formatCompact(sells)}</div>
            </div>
          </div>
          <RatioBar buyValue={buys} sellValue={sells} />
        </div>

        {/* Volume row */}
        <div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">VOLUME</div>
              <div className="text-sm font-bold text-foreground">{formatNumber(token.volume)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">BUY VOL</div>
              <div className="text-sm font-bold text-profit">{formatNumber(buyVolume)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase">SELL VOL</div>
              <div className="text-sm font-bold text-loss">{formatNumber(sellVolume)}</div>
            </div>
          </div>
          <RatioBar buyValue={buyVolume} sellValue={sellVolume} />
        </div>

        {/* Makers row */}
        <div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">MAKERS</div>
              <div className="text-sm font-bold text-foreground">{formatCompact(token.makers)}</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase">BUYERS</div>
              <div className="text-sm font-bold text-profit">{formatCompact(buyers)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground uppercase">SELLERS</div>
              <div className="text-sm font-bold text-loss">{formatCompact(sellers)}</div>
            </div>
          </div>
          <RatioBar buyValue={buyers} sellValue={sellers} />
        </div>
      </div>

      {/* Watchlist + Alerts + Buy/Sell */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => toast.info('Watchlist coming soon')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium bg-[hsl(0,0%,16%)] text-foreground rounded-md border border-border hover:bg-accent transition-colors"
            aria-label="Add to watchlist"
          >
            <Star className="w-3.5 h-3.5" /> Watchlist
          </button>
          <button
            onClick={() => toast.info('Alerts coming soon')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium bg-[hsl(0,0%,16%)] text-foreground rounded-md border border-border hover:bg-accent transition-colors"
            aria-label="Set price alert"
          >
            <Bell className="w-3.5 h-3.5" /> Alerts
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={onBuyClick} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold bg-profit/20 text-profit rounded-md border border-profit/30 hover:bg-profit/30 transition-colors">
            <div className="w-2 h-2 rounded-full bg-profit" /> Buy
          </button>
          <button onClick={onSellClick} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold bg-loss/20 text-loss rounded-md border border-loss/30 hover:bg-loss/30 transition-colors">
            <div className="w-2 h-2 rounded-full bg-loss" /> Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoPanel;
