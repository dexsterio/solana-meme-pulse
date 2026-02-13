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

  const selectedTokens = useMemo(() => {
    const list = [...rawTokens];
    switch (viralSortBy) {
      case 'created':
        // already sorted by creation time from service (ogToken first)
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
    viralSortBy,
    setViralSortBy,
  };
}
