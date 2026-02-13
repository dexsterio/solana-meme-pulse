import { ViralCluster } from '@/services/viralDetectionService';
import { formatNumber } from '@/data/mockTokens';
import { Flame, X, Crown, TrendingUp } from 'lucide-react';

interface ViralBarProps {
  clusters: ViralCluster[];
  selectedCluster: string | null;
  onSelect: (name: string) => void;
  onClear: () => void;
}

const ViralBar = ({ clusters, selectedCluster, onSelect, onClear }: ViralBarProps) => {
  if (clusters.length === 0) return null;

  const selected = clusters.find((c) => c.name === selectedCluster);

  return (
    <div className="border-b border-border/40 bg-card/60">
      {/* Cluster pills row */}
      <div className="flex items-center gap-3 px-4 py-2.5 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider shrink-0 pr-1">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="font-semibold">Viral Memes</span>
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
              {/* Pulsing dot */}
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

      {/* Selected cluster detail header */}
      {selected && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/30 bg-gradient-to-r from-orange-500/8 to-transparent">
          <div className="flex items-center gap-3 text-[13px]">
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-foreground font-bold text-sm">{selected.displayName}</span>
            </div>
            <div className="w-px h-4 bg-border/40" />
            <span className="text-muted-foreground">
              {selected.count} tokens found
            </span>
            <div className="w-px h-4 bg-border/40" />
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top MCap: <span className="text-foreground font-semibold">{formatNumber(selected.topToken.mcap)}</span></span>
            </div>
            <div className="w-px h-4 bg-border/40" />
            <div className="flex items-center gap-1 text-muted-foreground">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>OG: <span className="text-foreground font-semibold">{selected.ogToken.name}</span></span>
            </div>
          </div>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/30"
          >
            <X className="w-3.5 h-3.5" />
            <span>Back to all</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ViralBar;
