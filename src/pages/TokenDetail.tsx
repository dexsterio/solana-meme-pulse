import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTokenDetails } from '@/services/dextoolsApi';
import { fetchTokenDetailsDexScreener } from '@/services/dexscreenerApi';
import PriceChart from '@/components/PriceChart';
import TransactionList from '@/components/TransactionList';
import TokenInfoPanel from '@/components/TokenInfoPanel';
import TradingPanel from '@/components/TradingPanel';
import TrendingBar from '@/components/TrendingBar';
import { ArrowLeft } from 'lucide-react';
import SolanaIcon from '@/components/SolanaIcon';
import { Skeleton } from '@/components/ui/skeleton';

const TokenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [panelMode, setPanelMode] = useState<'info' | 'buy' | 'sell'>('info');

  const { data: token, isLoading, isError } = useQuery({
    queryKey: ['token-detail', id],
    queryFn: async () => {
      const ds = await fetchTokenDetailsDexScreener(id || '');
      if (ds) return ds;
      return fetchTokenDetails(id || '');
    },
    enabled: !!id,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <TrendingBar />
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-32 h-5" />
        </div>
        <div className="flex-1 flex min-h-0 p-2 gap-2">
          <div className="flex-1">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="w-[320px]">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !token) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Token not found</p>
          <button onClick={() => navigate('/')} className="text-primary hover:underline text-sm">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <TrendingBar />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
        <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-accent transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        {token.logoUrl ? (
          <img src={token.logoUrl} alt={token.name} className="w-7 h-7 rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <span className="text-2xl">🪙</span>
        )}
        <div>
          <span className="font-semibold text-foreground">{token.name}</span>
          <span className="text-muted-foreground ml-1.5 text-sm">/ {token.ticker}</span>
        </div>
        <SolanaIcon size={16} />
      </div>

      {/* 3-panel layout */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0 p-2 gap-2">
          <div className="flex-1 min-h-0">
            <PriceChart token={token} />
          </div>
          <div className="h-[280px] shrink-0">
            <TransactionList tokenId={token.id} />
          </div>
        </div>
        <div className="w-[320px] shrink-0 p-2 pl-0">
          {panelMode === 'info' ? (
            <TokenInfoPanel
              token={token}
              onBuyClick={() => setPanelMode('buy')}
              onSellClick={() => setPanelMode('sell')}
            />
          ) : (
            <TradingPanel
              token={token}
              initialMode={panelMode}
              onBack={() => setPanelMode('info')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
