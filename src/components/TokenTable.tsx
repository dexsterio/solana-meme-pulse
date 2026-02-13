import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap } from 'lucide-react';
import { CrownFilledIcon, CaretUpFilledIcon } from '@/components/icons/TablerIcons';
import { useIsMobile } from '@/hooks/use-mobile';

import pumpfunLogo from '@/assets/pumpfun-logo.png';
import bonkLogo from '@/assets/bonk-logo.png';
import raydiumLogo from '@/assets/raydium-logo.png';
import meteoraLogo from '@/assets/meteora-logo.png';
import orcaLogo from '@/assets/orca-logo.png';

interface TokenTableProps {
  tokens: Token[];
  isCryptoMarket?: boolean;
  ogTokenId?: string | null;
  topTokenId?: string | null;
  showCreatedColumn?: boolean;
}

const TokenLogo = ({ token }: { token: Token }) => {
  if (token.logoUrl) {
    return (
      <>
        <img
          src={token.logoUrl}
          alt={token.ticker}
          className="w-6 h-6 md:w-7 md:h-7 rounded-md shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) (fallback as HTMLElement).style.display = 'flex';
          }}
        />
        <div className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-gradient-to-br from-primary/60 to-accent items-center justify-center text-[10px] text-foreground font-bold shrink-0 hidden">
          {token.ticker?.charAt(0) || '?'}
        </div>
      </>
    );
  }
  return (
    <div className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-gradient-to-br from-primary/60 to-accent flex items-center justify-center text-[10px] text-foreground font-bold shrink-0">
      {token.ticker?.charAt(0) || '?'}
    </div>
  );
};

const ChangeCell = ({ value }: { value: number }) => (
  <td className={`px-2 md:px-3 py-2 text-right text-[12px] md:text-[13px] font-bold tracking-tight ${value >= 0 ? 'text-profit' : 'text-loss'}`}>
    {value >= 0 ? '+' : ''}
    {Math.abs(value) >= 1000
      ? `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}%`
      : `${value.toFixed(2)}%`
    }
  </td>
);

const OgBadge = () => (
  <span className="inline-flex items-center gap-0.5 text-[10px] text-yellow-400 font-bold shrink-0 ml-1.5" title="The first token with this name">
    <CrownFilledIcon className="w-3 h-3" /> OG
  </span>
);

const TopBadge = () => (
  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold shrink-0 ml-1.5" title="The token with the highest market cap in the cluster">
    <CaretUpFilledIcon className="w-3 h-3" /> TOP
  </span>
);

const TokenTable = ({ tokens, isCryptoMarket = false, ogTokenId, topTokenId, showCreatedColumn }: TokenTableProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2">
        <p className="text-muted-foreground text-sm">No tokens found</p>
        <p className="text-muted-foreground/60 text-xs">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${isMobile ? 'table-auto' : 'table-fixed'}`}>
        <thead className="sticky top-0 bg-background z-10">
          <tr className="text-muted-foreground/80 text-[11px] uppercase tracking-wider border-b border-border">
            <th className="w-8 md:w-10 px-2 md:px-3 py-2 text-left font-medium">#</th>
            <th className="px-2 md:px-3 py-2 text-left font-medium">TOKEN</th>
            <th className="px-2 md:px-3 py-2 text-right font-medium">PRICE</th>
            {!isMobile && !isCryptoMarket && <th className="px-3 py-2 text-right font-medium">AGE</th>}
            {!isMobile && !isCryptoMarket && <th className="px-3 py-2 text-right font-medium">TXNS</th>}
            <th className="px-2 md:px-3 py-2 text-right font-medium">{isMobile ? 'VOL' : 'VOLUME'}</th>
            {!isMobile && !isCryptoMarket && <th className="px-3 py-2 text-right font-medium">MAKERS</th>}
            {isMobile ? (
              <th className="px-2 py-2 text-right font-medium">24H</th>
            ) : isCryptoMarket ? (
              <>
                <th className="px-3 py-2 text-right font-medium">1H</th>
                <th className="px-3 py-2 text-right font-medium">24H</th>
                <th className="px-3 py-2 text-right font-medium">7D</th>
                <th className="px-3 py-2 text-right font-medium">30D</th>
              </>
            ) : (
              <>
                <th className="px-3 py-2 text-right font-medium">5M</th>
                <th className="px-3 py-2 text-right font-medium">1H</th>
                <th className="px-3 py-2 text-right font-medium">6H</th>
                <th className="px-3 py-2 text-right font-medium">24H</th>
              </>
            )}
            {!isMobile && !isCryptoMarket && <th className="px-3 py-2 text-right font-medium">LIQUIDITY</th>}
            <th className="px-2 md:px-3 py-2 text-right font-medium">MCAP</th>
            {!isMobile && showCreatedColumn && <th className="w-[120px] px-3 py-2 text-right font-medium">STATUS</th>}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.id}
              onClick={() => navigate(`/token/${token.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/token/${token.id}`); }}
              tabIndex={0}
              role="button"
              className="border-b border-border/30 hover:bg-accent/40 cursor-pointer transition-colors text-[12px] md:text-[13px] focus-visible:bg-accent/40 outline-none"
            >
              {/* Rank */}
              <td className={`px-2 md:px-3 py-2 font-bold ${token.rank <= 5 ? 'text-[#e5a50a]' : 'text-muted-foreground/70'}`}>
                #{token.rank}
              </td>

              {/* Token name */}
              <td className="px-2 md:px-3 py-2 min-w-0">
                <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                  <TokenLogo token={token} />
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <div className="flex items-center gap-1 md:gap-1.5 min-w-0">
                      <span className="font-semibold text-foreground shrink-0 text-[12px] md:text-[13px]">{token.ticker}</span>
                      {!isMobile && (
                        <span className="text-muted-foreground text-[12px] truncate max-w-[120px]" title={token.name}>{token.name}</span>
                      )}
                      {ogTokenId === token.id && <OgBadge />}
                      {topTokenId === token.id && topTokenId !== ogTokenId && <TopBadge />}
                      {!isMobile && !isCryptoMarket && (
                        <>
                          {(token.exchangeName === 'pump.fun' || token.exchangeName === 'pumpfun' || token.exchangeName?.toLowerCase().includes('pump')) ? (
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
                            <span className="text-[10px] px-1 py-0.5 rounded bg-[hsl(0,0%,16%)] text-muted-foreground shrink-0">{token.exchangeName}</span>
                          ) : null}
                          {token.boosts && (
                            <span className="flex items-center gap-0.5 text-[11px] text-profit font-medium shrink-0">
                              <Zap className="w-3 h-3" />
                              {token.boosts}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {isMobile && (
                      <span className="text-muted-foreground text-[10px] truncate max-w-[100px]" title={token.name}>{token.name}</span>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-2 md:px-3 py-2 text-right text-foreground">{formatPrice(token.price)}</td>
              {!isMobile && !isCryptoMarket && <td className="px-3 py-2 text-right text-muted-foreground">{token.age}</td>}
              {!isMobile && !isCryptoMarket && <td className="px-3 py-2 text-right text-foreground">{token.txns.toLocaleString()}</td>}
              <td className="px-2 md:px-3 py-2 text-right text-foreground">{formatNumber(token.volume)}</td>
              {!isMobile && !isCryptoMarket && <td className="px-3 py-2 text-right text-muted-foreground">{token.makers.toLocaleString()}</td>}
              {isMobile ? (
                <ChangeCell value={token.change24h} />
              ) : isCryptoMarket ? (
                <>
                  <ChangeCell value={token.change1h} />
                  <ChangeCell value={token.change24h} />
                  <ChangeCell value={token.change7d} />
                  <ChangeCell value={token.change30d} />
                </>
              ) : (
                <>
                  <ChangeCell value={token.change5m} />
                  <ChangeCell value={token.change1h} />
                  <ChangeCell value={token.change6h} />
                  <ChangeCell value={token.change24h} />
                </>
              )}
              {!isMobile && !isCryptoMarket && <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.liquidity)}</td>}
              <td className="px-2 md:px-3 py-2 text-right text-foreground">{formatNumber(token.mcap)}</td>
              {!isMobile && showCreatedColumn && (
                <td className="px-3 py-2 text-right">
                  {ogTokenId === token.id ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-yellow-400 font-bold">
                      <CrownFilledIcon className="w-3 h-3" /> First Created
                    </span>
                  ) : topTokenId === token.id ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <CaretUpFilledIcon className="w-3 h-3" /> Highest MCap
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Clone</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;