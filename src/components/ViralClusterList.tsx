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
    <div className="grid grid-cols-1 min-[600px]:grid-cols-2 lg:grid-cols-3 gap-1.5 md:gap-2 p-2 md:p-3">
      {clusters.map((cluster) => (
        <button
          key={cluster.name}
          onClick={() => onSelect(cluster.name)}
          className="flex items-center justify-between gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border/30 bg-[hsl(0,0%,13%)] hover:bg-[hsl(0,0%,16%)] hover:border-border/60 transition-all duration-150 text-left group"
        >
          {/* Left: icon + name + count */}
          <div className="flex items-center gap-2.5 min-w-0">
            <FlameFilledIcon className="w-4 h-4 shrink-0" />
            <span className="text-foreground font-bold text-[13px] md:text-sm truncate">
              {cluster.displayName}
            </span>
            <span className="text-muted-foreground/70 text-[11px] shrink-0">
              {cluster.count}
            </span>
          </div>

          {/* Right: OG + TOP + time */}
          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <CrownFilledIcon className="w-3 h-3" />
              <span>{cluster.ogToken.ticker}</span>
            </span>
            <span className="flex items-center gap-1">
              <CaretUpFilledIcon className="w-3 h-3" />
              <span>{formatNumber(cluster.topToken.mcap)}</span>
            </span>
            <span className="text-muted-foreground/50">
              {timeAgo(cluster.firstSeen)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ViralClusterList;
