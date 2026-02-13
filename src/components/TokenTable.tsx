import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap, Info } from 'lucide-react';
import pumpfunLogo from '@/assets/pumpfun-logo.png';
import bonkLogo from '@/assets/bonk-logo.png';
import raydiumLogo from '@/assets/raydium-logo.png';
import meteoraLogo from '@/assets/meteora-logo.png';
import orcaLogo from '@/assets/orca-logo.png';

interface TokenTableProps {
  tokens: Token[];
  isCryptoMarket?: boolean;
}

const TokenLogo = ({ token }: { token: Token }) => {
  if (token.logoUrl) {
    return (
      <img
        src={token.logoUrl}
        alt={token.ticker}
        className="w-7 h-7 rounded-md shrink-0"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) (fallback as HTMLElement).style.display = 'flex';
        }}
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/60 to-accent flex items-center justify-center text-[10px] text-foreground font-bold shrink-0">
      {token.ticker?.charAt(0) || '?'}
    </div>
  );
};

const ChangeCell = ({ value }: { value: number }) => (
  <td className={`px-3 py-2 text-right text-[13px] font-bold tracking-tight ${value >= 0 ? 'text-profit' : 'text-loss'}`}>
    {value >= 0 ? '+' : ''}
    {Math.abs(value) >= 1000
      ? `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}%`
      : `${value.toFixed(2)}%`
    }
  </td>
);

const TokenTable = ({ tokens, isCryptoMarket = false }: TokenTableProps) => {
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
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal">AGE</th>}
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal">TXNS</th>}
            <th className="px-3 py-2 text-right font-normal">VOLUME</th>
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal">MAKERS</th>}
            {isCryptoMarket ? (
              <>
                <th className="px-3 py-2 text-right font-normal">1H</th>
                <th className="px-3 py-2 text-right font-normal">24H</th>
                <th className="px-3 py-2 text-right font-normal">7D</th>
                <th className="px-3 py-2 text-right font-normal">30D</th>
              </>
            ) : (
              <>
                <th className="px-3 py-2 text-right font-normal">5M</th>
                <th className="px-3 py-2 text-right font-normal">1H</th>
                <th className="px-3 py-2 text-right font-normal">6H</th>
                <th className="px-3 py-2 text-right font-normal">24H</th>
              </>
            )}
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal">LIQUIDITY</th>}
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
                    {!isCryptoMarket && <span className="text-muted-foreground text-[12px]">/SOL</span>}
                    <span className="text-muted-foreground text-[12px]">{token.ticker}</span>
                    {!isCryptoMarket && (
                      <>
                        {(token.exchangeName === 'pump.fun' || token.exchangeName === 'pumpfun') ? (
                          <img src={pumpfunLogo} alt="pump.fun" className="w-4 h-4 shrink-0" />
                        ) : (token.exchangeName === 'letsbonk.fun' || token.exchangeName === 'bonk') ? (
                          <img src={bonkLogo} alt="letsbonk.fun" className="w-4 h-4 shrink-0" />
                        ) : (token.exchangeName?.toLowerCase().includes('raydium')) ? (
                          <img src={raydiumLogo} alt="Raydium" className="w-4 h-4 shrink-0" />
                        ) : (token.exchangeName?.toLowerCase().includes('meteora')) ? (
                          <img src={meteoraLogo} alt="Meteora" className="w-4 h-4 shrink-0" />
                        ) : (token.exchangeName?.toLowerCase().includes('orca')) ? (
                          <img src={orcaLogo} alt="Orca" className="w-4 h-4 shrink-0" />
                        ) : token.exchangeName ? (
                          <span className="text-[10px] px-1 py-0.5 rounded bg-secondary text-muted-foreground">{token.exchangeName}</span>
                        ) : null}
                        {token.boosts && (
                          <span className="flex items-center gap-0.5 text-[11px] text-profit font-medium">
                            <Zap className="w-3 h-3" />
                            {token.boosts}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-right text-foreground">{formatPrice(token.price)}</td>
              {!isCryptoMarket && <td className="px-3 py-2 text-right text-muted-foreground">{token.age}</td>}
              {!isCryptoMarket && <td className="px-3 py-2 text-right text-foreground">{token.txns.toLocaleString()}</td>}
              <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.volume)}</td>
              {!isCryptoMarket && <td className="px-3 py-2 text-right text-muted-foreground">{token.makers.toLocaleString()}</td>}
              {isCryptoMarket ? (
                <>
                  <ChangeCell value={token.change1h} />
                  <ChangeCell value={token.change24h} />
                  <ChangeCell value={token.change6h} />
                  <ChangeCell value={token.change5m} />
                </>
              ) : (
                <>
                  <ChangeCell value={token.change5m} />
                  <ChangeCell value={token.change1h} />
                  <ChangeCell value={token.change6h} />
                  <ChangeCell value={token.change24h} />
                </>
              )}
              {!isCryptoMarket && <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.liquidity)}</td>}
              <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.mcap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;
