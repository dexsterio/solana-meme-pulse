import { useEffect, useState } from 'react';
import { Token } from '@/data/mockTokens';
import { getTokens, isConnected, subscribe } from '@/services/pumpPortalService';

export function usePumpPortalNewTokens() {
  const [tokens, setTokens] = useState<Token[]>(getTokens);
  const [connected, setConnected] = useState(isConnected);

  useEffect(() => {
    // Sync immediately in case tokens arrived before mount
    setTokens(getTokens());
    setConnected(isConnected());

    const unsubscribe = subscribe((updated) => {
      setTokens(updated);
      setConnected(isConnected());
    });

    return unsubscribe;
  }, []);

  return { tokens, isConnected: connected };
}
