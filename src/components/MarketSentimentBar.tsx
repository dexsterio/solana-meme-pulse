import { CryptoGlobalData } from '@/services/coingeckoApi';
import { formatNumber } from '@/data/mockTokens';
import { TrendingUp, TrendingDown, Minus, Activity, Fuel, BarChart3, Bitcoin, Gem, ChevronRight } from 'lucide-react';

interface MarketSentimentBarProps {
  data: CryptoGlobalData | undefined;
  isLoading: boolean;
}

function getFearGreedColor(value: number): string {
  if (value <= 25) return '#ea384c';
  if (value <= 45) return '#f97316';
  if (value <= 55) return '#eab308';
  if (value <= 75) return '#22c55e';
  return '#16a34a';
}

function getAltSeasonStatus(btcDominance: number): { label: string; color: string; icon: typeof TrendingUp } {
  if (btcDominance < 40) return { label: 'Alt Season', color: 'text-profit', icon: TrendingUp };
  if (btcDominance <= 50) return { label: 'Neutral', color: 'text-yellow-400', icon: Minus };
  return { label: 'BTC Season', color: 'text-orange-400', icon: Bitcoin };
}

const FearGreedGauge = ({ value, classification }: { value: number; classification: string }) => {
  const cx = 60;
  const cy = 48;
  const radius = 38;
  const strokeWidth = 8;
  const needleAngle = 180 - (value / 100) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleX = cx + radius * Math.cos(needleRad);
  const needleY = cy - radius * Math.sin(needleRad);
  const needleColor = getFearGreedColor(value);

  // Arc path (semicircle from left to right)
  const startX = cx - radius;
  const endX = cx + radius;

  return (
    <div className="flex flex-col items-center px-3 py-2 rounded-lg border border-border bg-card shrink-0 min-w-[140px]">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[10px] text-muted-foreground font-medium">Fear & Greed</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
      </div>
      <svg width="120" height="58" viewBox="0 0 120 58">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea384c" />
            <stop offset="33%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        {/* Arc */}
        <path
          d={`M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={needleColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Needle dot */}
        <circle cx={needleX} cy={needleY} r="3" fill={needleColor} />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill="hsl(var(--foreground))" />
      </svg>
      <span className="text-lg font-bold leading-none" style={{ color: needleColor }}>
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground mt-0.5">{classification}</span>
    </div>
  );
};

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
      {/* Fear & Greed Gauge */}
      <FearGreedGauge value={data.fearGreed.value} classification={data.fearGreed.classification} />

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
