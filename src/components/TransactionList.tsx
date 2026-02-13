import { useState, useMemo } from 'react';
import { generateMockTransactions, formatPrice, formatCompact } from '@/data/mockTokens';
import { ExternalLink } from 'lucide-react';
import SolanaIcon from '@/components/SolanaIcon';

interface TransactionListProps {
  tokenId: string;
}

const tabs = ['Transactions', 'Top Traders', 'Holders'] as const;

const TransactionList = ({ tokenId }: TransactionListProps) => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Transactions');
  const transactions = useMemo(() => generateMockTransactions(tokenId), [tokenId]);

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === tab ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-card border-b border-border z-10">
            <tr className="text-muted-foreground">
              <th className="px-2 py-1.5 text-left font-medium">DATE</th>
              <th className="px-2 py-1.5 text-left font-medium">TYPE</th>
              <th className="px-2 py-1.5 text-right font-medium">USD</th>
              <th className="px-2 py-1.5 text-right font-medium">AMOUNT</th>
              <th className="px-2 py-1.5 text-right font-medium"><span className="flex items-center justify-end gap-1"><SolanaIcon size={10} /></span></th>
              <th className="px-2 py-1.5 text-right font-medium">PRICE</th>
              <th className="px-2 py-1.5 text-right font-medium">MAKER</th>
              <th className="px-2 py-1.5 text-center font-medium">TXN</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border/30 hover:bg-accent/30">
                <td className="px-2 py-1.5 text-muted-foreground">
                  {new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
                <td className="px-2 py-1.5 text-right text-primary font-mono">{tx.maker}</td>
                <td className="px-2 py-1.5 text-center">
                  <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary inline cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
