import { useNavigate } from 'react-router-dom';
import { Token, formatPrice, formatNumber } from '@/data/mockTokens';
import { Zap } from 'lucide-react';
import { CrownFilledIcon, CaretUpFilledIcon } from '@/components/icons/TablerIcons';
import InfoTooltip from '@/components/InfoTooltip';
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

const OgBadge = () => (
  <span className="inline-flex items-center gap-0.5 text-[10px] text-yellow-400 font-bold shrink-0 ml-1.5" title="The first token created with this name">
    <CrownFilledIcon className="w-3 h-3" /> OG
  </span>
);

const TopBadge = () => (
  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold shrink-0 ml-1.5" title="The token with the highest market cap in this cluster">
    <CaretUpFilledIcon className="w-3 h-3" /> TOP
  </span>
);

const TokenTable = ({ tokens, isCryptoMarket = false, ogTokenId, topTokenId, showCreatedColumn }: TokenTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <thead>
          <tr className="text-muted-foreground text-[11px] uppercase tracking-wider">
            <th className="w-10 px-3 py-2 text-left font-normal">#</th>
            <th className={`${showCreatedColumn ? 'w-[280px]' : isCryptoMarket ? 'w-[200px]' : 'w-[260px]'} px-3 py-2 text-left font-normal`}>TOKEN</th>
            <th className="px-3 py-2 text-right font-normal">PRICE</th>
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal"><span className="inline-flex items-center gap-1">AGE <InfoTooltip text="Time since the token was first created." iconSize={10} /></span></th>}
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal"><span className="inline-flex items-center gap-1">TXNS <InfoTooltip text="Number of buy and sell transactions." iconSize={10} /></span></th>}
            <th className="px-3 py-2 text-right font-normal"><span className="inline-flex items-center gap-1">VOLUME <InfoTooltip text="Total USD value traded." iconSize={10} /></span></th>
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal"><span className="inline-flex items-center gap-1">MAKERS <InfoTooltip text="Unique wallets that traded this token." iconSize={10} /></span></th>}
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
            {!isCryptoMarket && <th className="px-3 py-2 text-right font-normal"><span className="inline-flex items-center gap-1">LIQUIDITY <InfoTooltip text="Available liquidity in the trading pool." iconSize={10} /></span></th>}
            <th className="px-3 py-2 text-right font-normal"><span className="inline-flex items-center gap-1">MCAP <InfoTooltip text="Market capitalization = price × total supply." iconSize={10} /></span></th>
            {showCreatedColumn && <th className="w-[120px] px-3 py-2 text-right font-normal"><span className="inline-flex items-center gap-1">STATUS <InfoTooltip text="OG = first created token. TOP = highest market cap. Clone = duplicate." iconSize={10} /></span></th>}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.id}
              onClick={() => navigate(`/token/${token.id}`)}
              className="border-b border-border/30 hover:bg-accent/40 cursor-pointer transition-colors text-[13px]"
            >
              {/* Rank — clean, no badges */}
              <td className="px-3 py-2 text-muted-foreground">
                #{token.rank}
              </td>

              {/* Token name + badges inline */}
              <td className="px-3 py-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <TokenLogo token={token} />
                  <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                    <span className="font-semibold text-foreground truncate max-w-[100px]">{token.name}</span>
                    {!isCryptoMarket && <span className="text-muted-foreground text-[12px] shrink-0">/SOL</span>}
                    <span className="text-muted-foreground text-[12px] shrink-0">{token.ticker}</span>
                    {ogTokenId === token.id && <OgBadge />}
                    {topTokenId === token.id && topTokenId !== ogTokenId && <TopBadge />}
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
                          <span className="text-[10px] px-1 py-0.5 rounded bg-secondary text-muted-foreground shrink-0">{token.exchangeName}</span>
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
              {!isCryptoMarket && <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.liquidity)}</td>}
              <td className="px-3 py-2 text-right text-foreground">{formatNumber(token.mcap)}</td>
              {showCreatedColumn && (
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
