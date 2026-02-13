import { ViralCluster } from '@/services/viralDetectionService';
import { formatNumber } from '@/data/mockTokens';
import { Flame, X, Crown } from 'lucide-react';

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
      {/* Cluster pills */}
      <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider shrink-0">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Viral</span>
        </div>
        <div className="w-px h-4 bg-border/50 shrink-0" />
        {clusters.map((cluster) => (
          <button
            key={cluster.name}
            onClick={() =>
              selectedCluster === cluster.name ? onClear() : onSelect(cluster.name)
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors shrink-0 ${
              selectedCluster === cluster.name
                ? 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40'
                : 'bg-secondary hover:bg-accent text-foreground'
            }`}
          >
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
            </span>
            <span className="font-bold">{cluster.displayName}</span>
            <span className="text-muted-foreground">x{cluster.count}</span>
            <span className="text-muted-foreground/60 text-[11px]">
              {formatNumber(cluster.topToken.mcap)}
            </span>
          </button>
        ))}
      </div>

      {/* Selected cluster header */}
      {selected && (
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/30 bg-orange-500/5">
          <div className="flex items-center gap-2 text-[12px]">
            <Crown className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-foreground font-semibold">{selected.displayName}</span>
            <span className="text-muted-foreground">
              {selected.count} tokens &middot; Top: {formatNumber(selected.topToken.mcap)}
            </span>
          </div>
          <button
            onClick={onClear}
            className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ViralBar;
