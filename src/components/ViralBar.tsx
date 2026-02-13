import { ViralCluster } from '@/services/viralDetectionService';
import { formatNumber } from '@/data/mockTokens';
import { Flame, X, Crown, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { ViralSortBy } from '@/hooks/useViralClusters';
import InfoTooltip from '@/components/InfoTooltip';

interface ViralBarProps {
  clusters: ViralCluster[];
  selectedCluster: string | null;
  onSelect: (name: string) => void;
  onClear: () => void;
  viralSortBy?: ViralSortBy;
  onViralSortChange?: (sort: ViralSortBy) => void;
}

const sortOptions: { value: ViralSortBy; label: string; icon: React.ReactNode }[] = [
  { value: 'created', label: 'First Created', icon: <Clock className="w-3.5 h-3.5" /> },
  { value: 'mcap', label: 'Highest MCap', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { value: 'volume', label: 'Highest Volume', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

const ViralBar = ({ clusters, selectedCluster, onSelect, onClear, viralSortBy = 'created', onViralSortChange }: ViralBarProps) => {
  if (clusters.length === 0) return null;

  const selected = clusters.find((c) => c.name === selectedCluster);

  return (
    <div className="border-b border-border/40 bg-card/60">
      {/* Cluster pills row */}
      <div className="flex items-center gap-3 px-4 py-2.5 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider shrink-0 pr-1">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="font-semibold">Viral Memes</span>
          <InfoTooltip text="Meme-tokens som just nu går viralt — troligtvis uppmärksammade av en influencer eller trendar på sociala medier." />
        </div>
        <div className="w-px h-5 bg-border/50 shrink-0" />
        <div className="flex items-center gap-2">
          {clusters.map((cluster) => (
            <button
              key={cluster.name}
              onClick={() =>
                selectedCluster === cluster.name ? onClear() : onSelect(cluster.name)
              }
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all duration-150 shrink-0 border ${
                selectedCluster === cluster.name
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-[0_0_12px_-3px] shadow-orange-500/20'
                  : 'bg-secondary/80 hover:bg-accent text-foreground border-border/30 hover:border-border/60'
              }`}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
              </span>
              <span className="font-bold">{cluster.displayName}</span>
              <span className="text-muted-foreground/80 text-[11px] border-l border-border/40 pl-2">
                {cluster.count} tokens
              </span>
              <span className="text-muted-foreground/50 text-[11px]">
                {formatNumber(cluster.topToken.mcap)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected cluster: BACK button top-left + info + sort */}
      {selected && (
        <div className="border-t border-border/30 bg-gradient-to-r from-orange-500/8 to-transparent">
          {/* Row 1: Back button prominent top-left */}
          <div className="flex items-center gap-3 px-4 py-2">
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold bg-secondary hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-border/30 shrink-0"
            >
              ← Back
            </button>
            <div className="w-px h-5 bg-border/40" />
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-foreground font-bold text-sm">{selected.displayName}</span>
            </div>
            <span className="text-muted-foreground text-[13px]">
              {selected.count} tokens
            </span>
            <InfoTooltip text="Dessa tokens delar samma meme-namn. OG = den som skapades först. TOP = den med högst market cap." />
            <div className="w-px h-4 bg-border/40" />
            {/* Sort buttons */}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-[11px] uppercase tracking-wider mr-1">Sort:</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onViralSortChange?.(opt.value)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    viralSortBy === opt.value
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViralBar;
