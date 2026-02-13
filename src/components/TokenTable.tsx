import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap, Info } from 'lucide-react';
import pumpfunLogo from '@/assets/pumpfun-logo.png';

interface TokenTableProps {
  tokens: Token[];
}

const TokenLogo = ({ token }: { token: Token }) => {
  if (token.logoUrl) {
    return (
      <img
        src={token.logoUrl}
        alt={token.ticker}
        className="w-[22px] h-[22px] rounded-full shrink-0"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) (fallback as HTMLElement).style.display = 'flex';
        }}
      />
    );
  }
  return (
    <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-primary/60 to-accent flex items-center justify-center text-[9px] text-foreground font-bold shrink-0">
      {token.ticker?.charAt(0) || '?'}
    </div>
  );
};

const ChangeCell = ({ value }: { value: number }) => (
  <td className={`px-3 py-2 text-right text-[13px] ${value >= 0 ? 'text-profit' : 'text-loss'}`}>
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
      <table className="w-full">
        <thead>
          <tr className="text-muted-foreground text-[11px] uppercase tracking-wider">
            <th className="px-3 py-2 text-left font-normal">#</th>
            <th className="px-3 py-2 text-left font-normal">TOKEN</th>
            <th className="px-3 py-2 text-right font-normal">
              <span className="inline-flex items-center gap-1">
                PRICE
                <Info className="w-3 h-3 text-muted-foreground/40" />
              </span>
            </th>
            <th className="px-3 py-2 text-right font-normal">AGE</th>
            <th className="px-3 py-2 text-right font-normal">TXNS</th>
            <th className="px-3 py-2 text-right font-normal">VOLUME</th>
            <th className="px-3 py-2 text-right font-normal">MAKERS</th>
            <th className="px-3 py-2 text-right font-normal">5M</th>
            <th className="px-3 py-2 text-right font-normal">1H</th>
            <th className="px-3 py-2 text-right font-normal">6H</th>
            <th className="px-3 py-2 text-right font-normal">24H</th>
            <th className="px-3 py-2 text-right font-normal">LIQUIDITY</th>
            <th className="px-3 py-2 text-right font-normal">MCAP</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.id}
              onClick={() => navigate(`/token/${token.id}`)}
              className="border-b border-border/30 hover:bg-accent/40 cursor-pointer transition-colors text-[13px]"
            >
              <td className="px-3 py-2 text-muted-foreground">#{token.rank}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <TokenLogo token={token} />
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{token.name}</span>
                    <span className="text-muted-foreground text-[12px]">/SOL</span>
                    <span className="text-muted-foreground text-[12px]">{token.ticker}</span>
                    {(token.exchangeName === 'pump.fun' || token.exchangeName === 'pumpfun') ? (
                      <img src={pumpfunLogo} alt="pump.fun" className="w-4 h-4 shrink-0" />
                    ) : token.exchangeName ? (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-secondary text-muted-foreground">{token.exchangeName}</span>
                    ) : null}
                    {token.boosts && (
                      <span className="flex items-center gap-0.5 text-[11px] text-profit font-medium">
                        <Zap className="w-3 h-3" />
                        {token.boosts}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-right text-foreground">{formatPrice(token.price)}</td>
              <td className="px-3 py-2 text-right text-muted-foreground">{token.age}</td>
              <td className="px-3 py-2 text-right text-foreground">{token.txns.toLocaleString()}</td>
              <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.volume)}</td>
              <td className="px-3 py-2 text-right text-muted-foreground">{token.makers.toLocaleString()}</td>
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
