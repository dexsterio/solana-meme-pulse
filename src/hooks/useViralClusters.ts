import { useEffect, useState, useCallback } from 'react';
import {
  ViralCluster,
  getViralClusters,
  getClusterTokens,
  subscribeViralClusters,
  initViralDetection,
} from '@/services/viralDetectionService';
import { Token } from '@/data/mockTokens';

export function useViralClusters() {
  const [clusters, setClusters] = useState<ViralCluster[]>(getViralClusters);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  useEffect(() => {
    initViralDetection();
    setClusters(getViralClusters());
    return subscribeViralClusters(setClusters);
  }, []);

  const selectedTokens: Token[] = selectedCluster
    ? getClusterTokens(selectedCluster)
    : [];

  const clearSelection = useCallback(() => setSelectedCluster(null), []);

  return {
    clusters,
    selectedCluster,
    setSelectedCluster,
    clearSelection,
    selectedTokens,
  };
}
