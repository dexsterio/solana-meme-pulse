import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ViralCluster,
  getViralClusters,
  getClusterTokens,
  subscribeViralClusters,
  initViralDetection,
} from '@/services/viralDetectionService';
import { Token } from '@/data/mockTokens';

export type ViralSortBy = 'created' | 'mcap' | 'volume';

export function useViralClusters() {
  const [clusters, setClusters] = useState<ViralCluster[]>(getViralClusters);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [viralSortBy, setViralSortBy] = useState<ViralSortBy>('created');

  useEffect(() => {
    initViralDetection();
    setClusters(getViralClusters());
    return subscribeViralClusters(setClusters);
  }, []);

  const rawTokens: Token[] = selectedCluster
    ? getClusterTokens(selectedCluster)
    : [];

  // All viral tokens from all clusters (deduplicated)
  const allViralTokens = useMemo(() => {
    const seen = new Set<string>();
    const result: Token[] = [];
    for (const cluster of clusters) {
      for (const token of cluster.tokens) {
        if (!seen.has(token.id)) {
          seen.add(token.id);
          result.push(token);
        }
      }
    }
    return result.sort((a, b) => b.mcap - a.mcap);
  }, [clusters]);

  const selectedTokens = useMemo(() => {
    const list = [...rawTokens];
    switch (viralSortBy) {
      case 'created':
        break;
      case 'mcap':
        list.sort((a, b) => b.mcap - a.mcap);
        break;
      case 'volume':
        list.sort((a, b) => b.volume - a.volume);
        break;
    }
    return list;
  }, [rawTokens, viralSortBy]);

  const clearSelection = useCallback(() => setSelectedCluster(null), []);

  return {
    clusters,
    selectedCluster,
    setSelectedCluster,
    clearSelection,
    selectedTokens,
    allViralTokens,
    viralSortBy,
    setViralSortBy,
  };
}
