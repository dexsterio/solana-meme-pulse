import { Token, formatPrice, formatNumber, formatCompact } from '@/data/mockTokens';
import { Globe, Twitter, MessageCircle, Star, Bell, ExternalLink, Zap, Copy, Shield } from 'lucide-react';

interface TokenInfoPanelProps {
  token: Token;
}

const TokenInfoPanel = ({ token }: TokenInfoPanelProps) => {
  const buys = token.buys24h ?? Math.round(token.txns * 0.55);
  const sells = token.sells24h ?? (token.txns - buys);
  const buyVolume = token.buyVolume24h ?? token.volume * 0.58;
  const sellVolume = token.sellVolume24h ?? (token.volume - buyVolume);
  const buyers = Math.round(buys * 0.6);
  const sellers = Math.round(sells * 0.6);

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-y-auto text-xs">
      {/* Token name row */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          {token.logoUrl ? (
            <img src={token.logoUrl} alt={token.name} className="w-7 h-7 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span className="text-2xl">🪙</span>
          )}
          <span className="font-bold text-foreground text-sm">{token.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-1 rounded hover:bg-accent text-muted-foreground"><Copy className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Ticker / SOL / badges */}
      <div className="px-4 py-2 border-b border-border text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-semibold text-foreground">{token.ticker}</span>
          <Copy className="w-3 h-3 text-muted-foreground cursor-pointer" />
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">SOL</span>
          {token.boosts && (
            <span className="text-yellow-500 text-[10px] flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> {token.boosts}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">🟣 Solana</span>
          <span>&gt;</span>
          <span>{token.exchangeName || 'Raydium'}</span>
        </div>
      </div>

      {/* Social buttons */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex gap-2">
          {token.twitter && (
            <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-secondary text-foreground hover:bg-accent transition-colors text-xs font-medium">
              <Twitter className="w-3.5 h-3.5" /> Twitter
            </a>
          )}
          {token.telegram && (
            <a href={token.telegram} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-secondary text-foreground hover:bg-accent transition-colors text-xs font-medium">
              <MessageCircle className="w-3.5 h-3.5" /> Telegram
            </a>
          )}
          {token.website && (
            <a href={token.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-secondary text-foreground hover:bg-accent transition-colors text-xs font-medium">
              <Globe className="w-3.5 h-3.5" /> Website
            </a>
          )}
        </div>
      </div>

      {/* Price USD + Price SOL side by side */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-secondary rounded-md p-2.5 text-center border border-border">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Price USD</div>
            <div className="text-sm font-bold font-mono text-foreground">{formatPrice(token.price)}</div>
          </div>
          <div className="bg-secondary rounded-md p-2.5 text-center border border-border">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Price</div>
            <div className="text-sm font-bold font-mono text-foreground">{token.priceSOL.toFixed(8)} SOL</div>
          </div>
        </div>
      </div>

      {/* Liquidity / FDV / MKT CAP row */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'LIQUIDITY', value: formatNumber(token.liquidity), icon: true },
            { label: 'FDV', value: formatNumber(token.fdv) },
            { label: 'MKT CAP', value: formatNumber(token.mcap) },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-secondary rounded-md p-2 text-center border border-border">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
              <div className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                {value}
                {icon && <Shield className="w-3 h-3 text-profit" />}
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
                label === '24H' ? 'border-primary/40 bg-primary/10' : 'border-border bg-secondary'
              }`}
            >
              <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
              <div className={`text-xs font-bold font-mono ${val >= 0 ? 'text-profit' : 'text-loss'}`}>
                {val.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TXNS / BUYS / SELLS row */}
      <div className="px-4 py-3 border-b border-border space-y-3">
        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">TXNS</div>
            <div className="text-sm font-bold text-foreground">{formatCompact(token.txns)}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">BUYS</div>
            <div className="text-sm font-bold text-foreground">{formatCompact(buys)}</div>
            <div className="h-1 rounded bg-profit/60 mt-1" />
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase">SELLS</div>
            <div className="text-sm font-bold text-foreground">{formatCompact(sells)}</div>
            <div className="h-1 rounded bg-loss/60 mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">VOLUME</div>
            <div className="text-sm font-bold text-foreground">{formatNumber(token.volume)}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">BUY VOL</div>
            <div className="text-sm font-bold text-foreground">{formatNumber(buyVolume)}</div>
            <div className="h-1 rounded bg-profit/60 mt-1" />
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase">SELL VOL</div>
            <div className="text-sm font-bold text-foreground">{formatNumber(sellVolume)}</div>
            <div className="h-1 rounded bg-loss/60 mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 items-end">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">MAKERS</div>
            <div className="text-sm font-bold text-foreground">{formatCompact(token.makers)}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">BUYERS</div>
            <div className="text-sm font-bold text-foreground">{formatCompact(buyers)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase">SELLERS</div>
            <div className="text-sm font-bold text-foreground">{formatCompact(sellers)}</div>
          </div>
        </div>
      </div>

      {/* Watchlist + Alerts */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium bg-secondary text-foreground rounded-md border border-border hover:bg-accent transition-colors">
            <Star className="w-3.5 h-3.5" /> Watchlist
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium bg-secondary text-foreground rounded-md border border-border hover:bg-accent transition-colors">
            <Bell className="w-3.5 h-3.5" /> Alerts
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold bg-profit/20 text-profit rounded-md border border-profit/30 hover:bg-profit/30 transition-colors">
            🟢 Buy
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold bg-loss/20 text-loss rounded-md border border-loss/30 hover:bg-loss/30 transition-colors">
            🔴 Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoPanel;
