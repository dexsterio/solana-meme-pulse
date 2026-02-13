import { CryptoGlobalData } from '@/services/coingeckoApi';
import { formatNumber } from '@/data/mockTokens';
import { TrendingUp, TrendingDown, Minus, Activity, Fuel, BarChart3, Bitcoin, Gem } from 'lucide-react';

interface MarketSentimentBarProps {
  data: CryptoGlobalData | undefined;
  isLoading: boolean;
}

function getFearGreedColor(value: number): string {
  if (value <= 25) return 'text-loss';
  if (value <= 45) return 'text-orange-400';
  if (value <= 55) return 'text-yellow-400';
  if (value <= 75) return 'text-emerald-400';
  return 'text-profit';
}

function getFearGreedBg(value: number): string {
  if (value <= 25) return 'bg-loss/10 border-loss/20';
  if (value <= 45) return 'bg-orange-400/10 border-orange-400/20';
  if (value <= 55) return 'bg-yellow-400/10 border-yellow-400/20';
  if (value <= 75) return 'bg-emerald-400/10 border-emerald-400/20';
  return 'bg-profit/10 border-profit/20';
}

function getAltSeasonStatus(btcDominance: number): { label: string; color: string; icon: typeof TrendingUp } {
  if (btcDominance < 40) return { label: 'Alt Season', color: 'text-profit', icon: TrendingUp };
  if (btcDominance <= 50) return { label: 'Neutral', color: 'text-yellow-400', icon: Minus };
  return { label: 'BTC Season', color: 'text-orange-400', icon: Bitcoin };
}

const MarketSentimentBar = ({ data, isLoading }: MarketSentimentBarProps) => {
  if (isLoading || !data) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-32 rounded bg-secondary animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  const altSeason = getAltSeasonStatus(data.btcDominance);
  const AltIcon = altSeason.icon;

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border overflow-x-auto">
      {/* Fear & Greed */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded border shrink-0 ${getFearGreedBg(data.fearGreed.value)}`}>
        <Activity className={`w-3.5 h-3.5 ${getFearGreedColor(data.fearGreed.value)}`} />
        <span className="text-[11px] text-muted-foreground">Fear & Greed</span>
        <span className={`text-[13px] font-bold ${getFearGreedColor(data.fearGreed.value)}`}>
          {data.fearGreed.value}
        </span>
        <span className={`text-[11px] ${getFearGreedColor(data.fearGreed.value)}`}>
          {data.fearGreed.classification}
        </span>
      </div>

      {/* Total Market Cap */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-secondary shrink-0">
        <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">Market Cap</span>
        <span className="text-[13px] font-bold text-foreground">{formatNumber(data.totalMarketCap)}</span>
        <span className={`text-[11px] font-medium ${data.marketCapChange24h >= 0 ? 'text-profit' : 'text-loss'}`}>
          {data.marketCapChange24h >= 0 ? '+' : ''}{data.marketCapChange24h.toFixed(2)}%
        </span>
      </div>

      {/* BTC Dominance */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-secondary shrink-0">
        <Bitcoin className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-[11px] text-muted-foreground">BTC Dom</span>
        <span className="text-[13px] font-bold text-foreground">{data.btcDominance.toFixed(1)}%</span>
      </div>

      {/* ETH Gas */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-secondary shrink-0">
        <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">ETH Gas</span>
        <span className="text-[13px] font-bold text-foreground">
          {data.ethGas > 0 ? `${data.ethGas} Gwei` : '—'}
        </span>
      </div>

      {/* Alt Season */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-secondary shrink-0">
        <AltIcon className={`w-3.5 h-3.5 ${altSeason.color}`} />
        <span className="text-[11px] text-muted-foreground">Season</span>
        <span className={`text-[13px] font-bold ${altSeason.color}`}>{altSeason.label}</span>
      </div>
    </div>
  );
};

export default MarketSentimentBar;
