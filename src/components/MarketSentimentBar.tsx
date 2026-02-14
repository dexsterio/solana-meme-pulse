import { CryptoGlobalData } from '@/services/coingeckoApi';
import { formatNumber } from '@/data/mockTokens';
import { TrendingUp, TrendingDown, Minus, Activity, Fuel, BarChart3, Bitcoin, Gem, ChevronRight } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

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

const FearGreedGauge = ({ value, classification, compact }: { value: number; classification: string; compact?: boolean }) => {
  const cx = 50;
  const cy = 40;
  const radius = 32;
  const strokeWidth = 7;
  const needleAngle = 180 - (value / 100) * 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = radius - 4;
  const needleX = cx + needleLen * Math.cos(needleRad);
  const needleY = cy - needleLen * Math.sin(needleRad);
  const needleColor = getFearGreedColor(value);

  const startX = cx - radius;
  const endX = cx + radius;

  const svgW = compact ? 70 : 100;
  const svgH = compact ? 34 : 48;

  return (
    <div className={`flex items-center ${compact ? 'gap-2 px-2 py-1.5' : 'gap-3 px-4 py-2'} rounded-lg border border-border bg-card shrink-0`}>
      <div className="flex flex-col items-center">
        <svg width={svgW} height={svgH} viewBox="0 0 100 48">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea384c" />
              <stop offset="33%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d={`M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${cy}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke={needleColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={needleX} cy={needleY} r="2.5" fill={needleColor} />
          <circle cx={cx} cy={cy} r="2.5" fill="hsl(var(--foreground))" />
        </svg>
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground font-medium">Fear & Greed</span>
        </div>
        <span className={`${compact ? 'text-base' : 'text-xl'} font-bold leading-none`} style={{ color: needleColor }}>
          {value}
        </span>
        <span className="text-[10px] text-muted-foreground">{classification}</span>
      </div>
    </div>
  );
};

const MarketSentimentBar = ({ data, isLoading }: MarketSentimentBarProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isLoading || !data) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border overflow-x-auto">
        {Array.from({ length: isMobile ? 3 : 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 md:w-32 rounded bg-[hsl(0,0%,16%)] animate-pulse shrink-0 border border-border" />
        ))}
      </div>
    );
  }

  const altSeason = getAltSeasonStatus(data.btcDominance);
  const AltIcon = altSeason.icon;

  return (
    <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 border-b border-border overflow-x-auto scrollbar-hide">
      {/* Total Market Cap */}
      <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded border border-border bg-[hsl(0,0%,16%)] shrink-0">
        <BarChart3 className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground" />
        <span className="text-[10px] md:text-[11px] text-muted-foreground">{isMobile ? 'MCap' : 'Market Cap'}</span>
        <span className="text-[11px] md:text-[13px] font-bold text-foreground">{formatNumber(data.totalMarketCap)}</span>
        <span className={`text-[10px] md:text-[11px] font-medium ${data.marketCapChange24h >= 0 ? 'text-profit' : 'text-loss'}`}>
          {data.marketCapChange24h >= 0 ? '+' : ''}{data.marketCapChange24h.toFixed(1)}%
        </span>
      </div>

      {/* BTC Dominance */}
      <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded border border-border bg-[hsl(0,0%,16%)] shrink-0">
        <Bitcoin className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-400" />
        <span className="text-[10px] md:text-[11px] text-muted-foreground">BTC</span>
        <span className="text-[11px] md:text-[13px] font-bold text-foreground">{data.btcDominance.toFixed(1)}%</span>
      </div>

      {/* ETH Gas */}
      <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded border border-border bg-[hsl(0,0%,16%)] shrink-0">
        <Fuel className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground" />
        <span className="text-[10px] md:text-[11px] text-muted-foreground">Gas</span>
        <span className="text-[11px] md:text-[13px] font-bold text-foreground">
          {data.ethGas > 0 ? `${data.ethGas}` : '—'}
        </span>
      </div>

      {/* Alt Season */}
      <div className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded border border-border bg-[hsl(0,0%,16%)] shrink-0">
        <AltIcon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${altSeason.color}`} />
        <span className={`text-[11px] md:text-[13px] font-bold ${altSeason.color}`}>{altSeason.label}</span>
      </div>

      {/* Fear & Greed Gauge */}
      <FearGreedGauge value={data.fearGreed.value} classification={data.fearGreed.classification} compact={isMobile || isTablet} />
    </div>
  );
};

export default MarketSentimentBar;
