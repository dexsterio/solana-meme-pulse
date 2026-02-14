import { useState, useMemo } from 'react';
import { generateMockTransactions, formatPrice, formatCompact } from '@/data/mockTokens';
import { ExternalLink, Users, BarChart3 } from 'lucide-react';
import SolanaIcon from '@/components/SolanaIcon';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionListProps {
  tokenId: string;
}

const tabs = ['Transactions', 'Top Traders', 'Holders'] as const;

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const TransactionList = ({ tokenId }: TransactionListProps) => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Transactions');
  const transactions = useMemo(() => generateMockTransactions(tokenId), [tokenId]);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border">
      <div className="flex items-center gap-1 px-2 md:px-3 py-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-2 md:px-3 py-1 text-[11px] md:text-xs font-medium rounded transition-colors ${
              activeTab === tab ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'Transactions' ? (
          <table className="w-full text-[10px] md:text-[11px]">
            <thead className="sticky top-0 bg-card border-b border-border z-10">
              <tr className="text-muted-foreground">
                {isMobile ? (
                  <>
                    <th className="px-1.5 py-1.5 text-left font-medium">TXN</th>
                    <th className="px-1.5 py-1.5 text-right font-medium">USD</th>
                    <th className="px-1.5 py-1.5 text-right font-medium">
                      <span className="flex items-center justify-end gap-0.5">PRICE <SolanaIcon size={9} /></span>
                    </th>
                    <th className="px-1.5 py-1.5 text-right font-medium">MAKER</th>
                  </>
                ) : (
                  <>
                    <th className="px-2 py-1.5 text-left font-medium">DATE</th>
                    <th className="px-2 py-1.5 text-left font-medium">TYPE</th>
                    <th className="px-2 py-1.5 text-right font-medium">USD</th>
                    <th className="px-2 py-1.5 text-right font-medium">AMOUNT</th>
                    <th className="px-2 py-1.5 text-right font-medium" aria-label="SOL amount">
                      <span className="flex items-center justify-end gap-1"><SolanaIcon size={10} /></span>
                    </th>
                    <th className="px-2 py-1.5 text-right font-medium">PRICE</th>
                    <th className="px-2 py-1.5 text-right font-medium">MAKER</th>
                    <th className="px-2 py-1.5 text-center font-medium">TXN</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border/30 hover:bg-accent/30">
                  {isMobile ? (
                    <>
                      <td className="px-1.5 py-1.5">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ${tx.type === 'buy' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'}`}>
                          {tx.type === 'buy' ? 'B' : 'S'}
                        </span>
                      </td>
                      <td className="px-1.5 py-1.5 text-right text-foreground">${tx.usd.toFixed(2)}</td>
                      <td className="px-1.5 py-1.5 text-right font-mono text-foreground">{formatPrice(tx.price)}</td>
                      <td className="px-1.5 py-1.5 text-right text-primary font-mono text-[9px]">{tx.maker}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 py-1.5 text-muted-foreground" title={new Date(tx.date).toLocaleString()}>
                        {formatRelativeTime(tx.date)}
                      </td>
                      <td className={`px-2 py-1.5 font-medium ${tx.type === 'buy' ? 'text-profit' : 'text-loss'}`}>
                        {tx.type === 'buy' ? 'Buy' : 'Sell'}
                      </td>
                      <td className="px-2 py-1.5 text-right text-foreground">${tx.usd.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-right text-foreground">{formatCompact(tx.tokenAmount)}</td>
                      <td className="px-2 py-1.5 text-right text-muted-foreground">
                        <span className="flex items-center justify-end gap-0.5"><SolanaIcon size={10} />{tx.sol.toFixed(3)}</span>
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-foreground">{formatPrice(tx.price)}</td>
                      <td className="px-2 py-1.5 text-right text-primary font-mono text-[11px]">{tx.maker}</td>
                      <td className="px-2 py-1.5 text-center">
                        <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary inline cursor-pointer" />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : activeTab === 'Top Traders' ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
            <BarChart3 className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Top traders data coming soon</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
            <Users className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Holders data coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;