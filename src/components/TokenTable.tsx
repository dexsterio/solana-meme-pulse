import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber, formatCompact } from '@/data/mockTokens';
import { Zap } from 'lucide-react';

interface TokenTableProps {
  tokens: Token[];
}

const ChangeCell = ({ value }: { value: number }) => (
  <td className={`px-3 py-2 text-right font-mono text-xs ${value >= 0 ? 'text-profit' : 'text-loss'}`}>
    {value >= 0 ? '+' : ''}{value.toFixed(1)}%
  </td>
);

const TokenTable = ({ tokens }: TokenTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="px-3 py-2 text-left font-medium">#</th>
            <th className="px-3 py-2 text-left font-medium">TOKEN</th>
            <th className="px-3 py-2 text-right font-medium">PRICE ($)</th>
            <th className="px-3 py-2 text-right font-medium">AGE</th>
            <th className="px-3 py-2 text-right font-medium">TXNS</th>
            <th className="px-3 py-2 text-right font-medium">VOLUME</th>
            <th className="px-3 py-2 text-right font-medium">MAKERS</th>
            <th className="px-3 py-2 text-right font-medium">5M</th>
            <th className="px-3 py-2 text-right font-medium">1H</th>
            <th className="px-3 py-2 text-right font-medium">6H</th>
            <th className="px-3 py-2 text-right font-medium">24H</th>
            <th className="px-3 py-2 text-right font-medium">LIQUIDITY</th>
            <th className="px-3 py-2 text-right font-medium">MCAP</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.id}
              onClick={() => navigate(`/token/${token.id}`)}
              className="border-b border-border/50 hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <td className="px-3 py-2 text-muted-foreground">{token.rank}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{token.logo}</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">{token.name}</span>
                      <span className="text-muted-foreground">/{token.ticker}</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-surface-3 text-muted-foreground">SOL</span>
                      {token.boosts && (
                        <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                          <Zap className="w-3 h-3" />
                          {token.boosts}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-right font-mono text-foreground">{formatPrice(token.price)}</td>
              <td className="px-3 py-2 text-right text-muted-foreground">{token.age}</td>
              <td className="px-3 py-2 text-right text-foreground">{formatCompact(token.txns)}</td>
              <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.volume)}</td>
              <td className="px-3 py-2 text-right text-muted-foreground">{formatCompact(token.makers)}</td>
              <ChangeCell value={token.change5m} />
              <ChangeCell value={token.change1h} />
              <ChangeCell value={token.change6h} />
              <ChangeCell value={token.change24h} />
              <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.liquidity)}</td>
              <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.mcap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;
