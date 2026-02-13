import { useState, useEffect } from 'react';
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
import { useTokens } from '@/hooks/useTokens';

const TokenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [panelMode, setPanelMode] = useState<'info' | 'buy' | 'sell'>('info');

  const { data: trendingTokens = [] } = useTokens('trending');

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

  useEffect(() => {
    if (token) {
      document.title = `${token.ticker} ${token.name} — SolScope`;
    } else {
      document.title = 'Token Detail — SolScope';
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <TrendingBar tokens={trendingTokens} />
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
          <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-accent transition-colors" aria-label="Go back" title="Go back">
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
      <div className="flex flex-col h-screen bg-background">
        <TrendingBar tokens={trendingTokens} />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Token not found</p>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary hover:underline text-sm mx-auto">
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <TrendingBar tokens={trendingTokens} />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
        <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-accent transition-colors" aria-label="Go back" title="Go back">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        {token.logoUrl ? (
          <img
            src={token.logoUrl}
            alt={token.name}
            className="w-7 h-7 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) (fallback as HTMLElement).style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-accent items-center justify-center text-[10px] text-foreground font-bold" style={{ display: token.logoUrl ? 'none' : 'flex' }}>
          {token.ticker?.charAt(0) || '?'}
        </div>
        <div>
          <span className="font-semibold text-foreground">{token.ticker}</span>
          <span className="text-muted-foreground ml-1.5 text-sm">{token.name}</span>
        </div>
        <SolanaIcon size={16} className="ml-1" />
      </div>

      {/* 3-panel layout */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0 p-2 gap-2">
          <div className="flex-1 min-h-0">
            <PriceChart token={token} />
          </div>
          <div className="min-h-[200px] max-h-[360px] h-[30vh] shrink-0">
            <TransactionList tokenId={token.id} />
          </div>
        </div>
        <div className="w-[320px] shrink-0 p-2 pl-1">
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
