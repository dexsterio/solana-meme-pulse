import { Token, formatPrice, formatNumber, formatCompact } from '@/data/mockTokens';
import { Globe, Twitter, MessageCircle, Star, Bell, ExternalLink } from 'lucide-react';

interface TokenInfoPanelProps {
  token: Token;
}

const TokenInfoPanel = ({ token }: TokenInfoPanelProps) => {
  const buys = Math.round(token.txns * 0.55);
  const sells = token.txns - buys;
  const buyVolume = token.volume * 0.58;
  const sellVolume = token.volume - buyVolume;
  const buyers = Math.round(token.makers * 0.52);
  const sellers = token.makers - buyers;

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-y-auto">
      {/* Token header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-5xl">{token.logo}</span>
          <div>
            <h2 className="text-lg font-bold text-foreground">{token.name}</h2>
            <span className="text-sm text-muted-foreground">{token.ticker} / SOL</span>
          </div>
        </div>
        <div className="flex gap-2">
          {token.website && (
            <a href={token.website} className="p-1.5 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          )}
          {token.twitter && (
            <a href={token.twitter} className="p-1.5 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {token.telegram && (
            <a href={token.telegram} className="p-1.5 rounded bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="p-4 border-b border-border">
        <div className="text-2xl font-bold font-mono text-foreground">{formatPrice(token.price)}</div>
        <div className="text-xs text-muted-foreground mt-1">{token.priceSOL.toFixed(10)} SOL</div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-border space-y-2">
        {[
          { label: 'Liquidity', value: formatNumber(token.liquidity) },
          { label: 'FDV', value: formatNumber(token.fdv) },
          { label: 'Market Cap', value: formatNumber(token.mcap) },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-foreground font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Price changes */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: '5M', val: token.change5m },
            { label: '1H', val: token.change1h },
            { label: '6H', val: token.change6h },
            { label: '24H', val: token.change24h },
          ].map(({ label, val }) => (
            <div key={label}>
              <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
              <div className={`text-xs font-mono font-medium ${val >= 0 ? 'text-profit' : 'text-loss'}`}>
                {val >= 0 ? '+' : ''}{val.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trading data */}
      <div className="p-4 border-b border-border space-y-3">
        {/* TXNS */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">TXNS</span>
            <span className="text-foreground">{formatCompact(token.txns)}</span>
          </div>
          <div className="flex gap-1 h-2 rounded overflow-hidden">
            <div className="bg-profit/60 rounded" style={{ width: `${(buys / token.txns) * 100}%` }} />
            <div className="bg-loss/60 rounded" style={{ width: `${(sells / token.txns) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] mt-1">
            <span className="text-profit">Buys: {formatCompact(buys)}</span>
            <span className="text-loss">Sells: {formatCompact(sells)}</span>
          </div>
        </div>

        {/* Volume */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Volume</span>
            <span className="text-foreground">{formatNumber(token.volume)}</span>
          </div>
          <div className="flex gap-1 h-2 rounded overflow-hidden">
            <div className="bg-profit/60 rounded" style={{ width: `${(buyVolume / token.volume) * 100}%` }} />
            <div className="bg-loss/60 rounded" style={{ width: `${(sellVolume / token.volume) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] mt-1">
            <span className="text-profit">Buy: {formatNumber(buyVolume)}</span>
            <span className="text-loss">Sell: {formatNumber(sellVolume)}</span>
          </div>
        </div>

        {/* Makers */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Makers</span>
            <span className="text-foreground">{formatCompact(token.makers)}</span>
          </div>
          <div className="flex gap-1 h-2 rounded overflow-hidden">
            <div className="bg-profit/60 rounded" style={{ width: `${(buyers / token.makers) * 100}%` }} />
            <div className="bg-loss/60 rounded" style={{ width: `${(sellers / token.makers) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] mt-1">
            <span className="text-profit">Buyers: {formatCompact(buyers)}</span>
            <span className="text-loss">Sellers: {formatCompact(sellers)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-secondary text-foreground rounded-md hover:bg-accent transition-colors">
            <Star className="w-3.5 h-3.5" /> Watchlist
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-secondary text-foreground rounded-md hover:bg-accent transition-colors">
            <Bell className="w-3.5 h-3.5" /> Alerts
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2.5 text-xs font-semibold bg-profit text-white rounded-md hover:bg-profit/90 transition-colors">
            Buy
          </button>
          <button className="flex-1 px-3 py-2.5 text-xs font-semibold bg-loss text-white rounded-md hover:bg-loss/90 transition-colors">
            Sell
          </button>
        </div>
        <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="w-3 h-3" /> View on Solscan
        </button>
      </div>
    </div>
  );
};

export default TokenInfoPanel;
