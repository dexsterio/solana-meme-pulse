import { ViralCluster } from '@/services/viralDetectionService';
import { formatNumber } from '@/data/mockTokens';
import { FlameFilledIcon, CrownFilledIcon, CaretUpFilledIcon } from '@/components/icons/TablerIcons';

interface ViralClusterListProps {
  clusters: ViralCluster[];
  onSelect: (name: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const ViralClusterList = ({ clusters, onSelect }: ViralClusterListProps) => {
  if (clusters.length === 0) return null;

  return (
    <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 p-2 md:p-3">
      {clusters.map((cluster) => (
        <button
          key={cluster.name}
          onClick={() => onSelect(cluster.name)}
          className="flex flex-col gap-2 p-3 md:p-4 rounded-lg border border-border/40 bg-card/80 hover:bg-accent/60 hover:border-orange-500/30 transition-all duration-150 text-left group"
        >
          {/* Header row */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-400" />
            </span>
            <FlameFilledIcon className="w-4 h-4 shrink-0" />
            <span className="text-foreground font-bold text-sm md:text-base truncate">
              {cluster.displayName}
            </span>
            <span className="ml-auto text-muted-foreground text-[11px] shrink-0">
              {timeAgo(cluster.firstSeen)}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {cluster.count} tokens
            </span>
            <span className="w-px h-3.5 bg-border/50" />
            <span className="flex items-center gap-1">
              <CrownFilledIcon className="w-3.5 h-3.5" />
              <span>OG: {cluster.ogToken.ticker}</span>
            </span>
            <span className="w-px h-3.5 bg-border/50" />
            <span className="flex items-center gap-1">
              <CaretUpFilledIcon className="w-3.5 h-3.5" />
              <span>TOP: {formatNumber(cluster.topToken.mcap)}</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ViralClusterList;
