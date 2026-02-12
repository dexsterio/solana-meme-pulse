import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap, Info } from 'lucide-react';

interface TokenTableProps {
  tokens: Token[];
}

const ChangeCell = ({ value }: { value: number }) => (
  <td className={`px-2 py-1.5 text-right font-mono text-[11px] ${value >= 0 ? 'text-profit' : 'text-loss'}`}>
    {Math.abs(value) >= 1000
      ? `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}%`
      : `${Math.abs(value).toFixed(2)}%`
    }
  </td>
);

const TokenTable = ({ tokens }: TokenTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="px-2 py-1.5 text-left font-normal italic text-[10px]">#</th>
            <th className="px-2 py-1.5 text-left font-normal italic text-[10px]">TOKEN</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">
              <span className="inline-flex items-center gap-0.5">
                PRICE
                <Info className="w-2.5 h-2.5 text-muted-foreground/50" />
              </span>
            </th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">AGE</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">TXNS</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">VOLUME</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">MAKERS</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">5M</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">1H</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">6H</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">24H</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">LIQUIDITY</th>
            <th className="px-2 py-1.5 text-right font-normal italic text-[10px]">MCAP</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.id}
              onClick={() => navigate(`/token/${token.id}`)}
              className="border-b border-border/30 hover:bg-accent/40 cursor-pointer transition-colors"
            >
              <td className="px-2 py-1.5 text-muted-foreground font-mono">#{token.rank}</td>
              <td className="px-2 py-1.5">
                <div className="flex items-center gap-2">
                  {/* Chain/DEX icons placeholder */}
                  <div className="flex items-center gap-0.5">
                    <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[8px] text-foreground font-bold">S</div>
                    <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[8px] text-foreground font-bold">R</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground text-[12px]">{token.ticker}</span>
                    <span className="text-muted-foreground text-[11px]">/SOL</span>
                    <span className="text-muted-foreground text-[10px] max-w-[100px] truncate">{token.name}</span>
                    {token.boosts && (
                      <span className="flex items-center gap-0.5 text-[10px] text-profit">
                        <Zap className="w-2.5 h-2.5" />
                        {token.boosts}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-2 py-1.5 text-right font-mono text-foreground">{formatPrice(token.price)}</td>
              <td className="px-2 py-1.5 text-right text-muted-foreground">{token.age}</td>
              <td className="px-2 py-1.5 text-right text-foreground font-mono">{token.txns.toLocaleString()}</td>
              <td className="px-2 py-1.5 text-right text-foreground font-mono">{formatNumber(token.volume)}</td>
              <td className="px-2 py-1.5 text-right text-muted-foreground font-mono">{token.makers.toLocaleString()}</td>
              <ChangeCell value={token.change5m} />
              <ChangeCell value={token.change1h} />
              <ChangeCell value={token.change6h} />
              <ChangeCell value={token.change24h} />
              <td className="px-2 py-1.5 text-right text-foreground font-mono">{formatNumber(token.liquidity)}</td>
              <td className="px-2 py-1.5 text-right text-foreground font-mono">{formatNumber(token.mcap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;
