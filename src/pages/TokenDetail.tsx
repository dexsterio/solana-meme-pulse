import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTokenDetails } from '@/services/dextoolsApi';
import { fetchTokenDetailsDexScreener } from '@/services/dexscreenerApi';
import { formatPrice } from '@/data/mockTokens';
import PriceChart from '@/components/PriceChart';
import TransactionList from '@/components/TransactionList';
import TokenInfoPanel from '@/components/TokenInfoPanel';
import TradingPanel from '@/components/TradingPanel';
import TrendingBar from '@/components/TrendingBar';
import { ArrowLeft, BarChart3, List, Info, Monitor } from 'lucide-react';
import SolanaIcon from '@/components/SolanaIcon';
import { Skeleton } from '@/components/ui/skeleton';
import { useTokens } from '@/hooks/useTokens';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

type MobileTab = 'info' | 'chart-txns' | 'chart' | 'txns';

const TokenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [panelMode, setPanelMode] = useState<'info' | 'buy' | 'sell'>('info');
  const [mobileTab, setMobileTab] = useState<MobileTab>('info');
  const [showTradingPanel, setShowTradingPanel] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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
          {!isMobile && (
            <div className="w-[320px]">
              <Skeleton className="w-full h-full" />
            </div>
          )}
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

  const mobileTabs: { key: MobileTab; label: string; icon: React.ReactNode }[] = [
    { key: 'info', label: 'Info', icon: <Info className="w-4 h-4" /> },
    { key: 'chart-txns', label: 'Chart+Txns', icon: <Monitor className="w-4 h-4" /> },
    { key: 'chart', label: 'Chart', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'txns', label: 'Txns', icon: <List className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {!isMobile && <TrendingBar tokens={trendingTokens} />}

      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 border-b border-border">
        <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-accent transition-colors" aria-label="Go back" title="Go back">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        {token.logoUrl ? (
          <img
            src={token.logoUrl}
            alt={token.name}
            className="w-6 h-6 md:w-7 md:h-7 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) (fallback as HTMLElement).style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-primary/60 to-accent items-center justify-center text-[10px] text-foreground font-bold" style={{ display: token.logoUrl ? 'none' : 'flex' }}>
          {token.ticker?.charAt(0) || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground text-sm">{token.ticker}</span>
            <span className="text-muted-foreground text-xs md:text-sm truncate">{token.name}</span>
            <SolanaIcon size={14} className="shrink-0" />
          </div>
          {isMobile && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-foreground text-xs font-bold">{formatPrice(token.price)}</span>
              <span className={`text-[11px] font-bold ${token.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      {isMobile ? (
        <div className="flex-1 flex flex-col min-h-0 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]">
          {/* Mobile trading panel overlay */}
          {showTradingPanel ? (
            <div className="flex-1 min-h-0 p-2 overflow-y-auto">
              <TradingPanel
                token={token}
                initialMode={panelMode === 'info' ? 'buy' : panelMode}
                onBack={() => setShowTradingPanel(false)}
              />
            </div>
          ) : (
            <>
              {mobileTab === 'info' && (
                <div className="flex-1 min-h-0 p-2 overflow-y-auto">
                  <TokenInfoPanel
                    token={token}
                    onBuyClick={() => { setPanelMode('buy'); setShowTradingPanel(true); }}
                    onSellClick={() => { setPanelMode('sell'); setShowTradingPanel(true); }}
                    onTradeClick={() => setShowTradingPanel(true)}
                  />
                </div>
              )}
              {mobileTab === 'chart-txns' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="h-[55%] min-h-0 p-2">
                    <PriceChart token={token} />
                  </div>
                  <div className="h-[45%] min-h-0 p-2 pt-0">
                    <TransactionList tokenId={token.id} />
                  </div>
                </div>
              )}
              {mobileTab === 'chart' && (
                <div className="flex-1 min-h-0 p-2">
                  <PriceChart token={token} />
                </div>
              )}
              {mobileTab === 'txns' && (
                <div className="flex-1 min-h-0 p-2">
                  <TransactionList tokenId={token.id} />
                </div>
              )}
            </>
          )}

          {/* Bottom tab bar */}
          {!showTradingPanel && (
            <div className="fixed bottom-0 left-0 right-0 flex items-center bg-card border-t border-border z-50 safe-area-bottom">
              {mobileTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setMobileTab(tab.key)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors min-h-[44px] ${
                    mobileTab === tab.key
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : isTablet ? (
        /* Tablet layout - stacked scrollable */
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-2">
            <div className="h-[45vh] min-h-[280px]">
              <PriceChart token={token} />
            </div>
          </div>
          <div className="p-2 pt-0">
            <div className="h-[30vh] min-h-[200px]">
              <TransactionList tokenId={token.id} />
            </div>
          </div>
          <div className="p-2 pt-0">
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
      ) : (
        /* Desktop layout */
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
      )}
    </div>
  );
};

export default TokenDetail;