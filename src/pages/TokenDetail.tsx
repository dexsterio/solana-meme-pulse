import { useParams, useNavigate } from 'react-router-dom';
import { mockTokens } from '@/data/mockTokens';
import PriceChart from '@/components/PriceChart';
import TransactionList from '@/components/TransactionList';
import TokenInfoPanel from '@/components/TokenInfoPanel';
import TrendingBar from '@/components/TrendingBar';
import { ArrowLeft } from 'lucide-react';

const TokenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = mockTokens.find((t) => t.id === id);

  if (!token) {
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
        <span className="text-2xl">{token.logo}</span>
        <div>
          <span className="font-semibold text-foreground">{token.name}</span>
          <span className="text-muted-foreground ml-1.5 text-sm">/ {token.ticker}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground">SOL</span>
      </div>

      {/* 3-panel layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Chart + Transactions */}
        <div className="flex-1 flex flex-col min-w-0 p-2 gap-2">
          <div className="flex-1 min-h-0">
            <PriceChart token={token} />
          </div>
          <div className="h-[280px] shrink-0">
            <TransactionList tokenId={token.id} />
          </div>
        </div>

        {/* Right: Token Info */}
        <div className="w-[320px] shrink-0 p-2 pl-0">
          <TokenInfoPanel token={token} />
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
