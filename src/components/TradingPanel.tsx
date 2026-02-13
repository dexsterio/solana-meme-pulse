import { useState } from 'react';
import { Token, formatCompact, formatNumber } from '@/data/mockTokens';
import { ChevronDown, ChevronUp, Settings, Pencil, Wallet } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

interface TradingPanelProps {
  token: Token;
  initialMode: 'buy' | 'sell';
  onBack: () => void;
}

const TradingPanel = ({ token, initialMode, onBack }: TradingPanelProps) => {
  const [mode, setMode] = useState<'buy' | 'sell'>(initialMode);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'adv'>('market');
  const [amount, setAmount] = useState('0.1');
  const [activePreset, setActivePreset] = useState(0);
  const [tokenInfoOpen, setTokenInfoOpen] = useState(false);

  const buys = token.buys24h ?? Math.round(token.txns * 0.55);
  const sells = token.sells24h ?? (token.txns - buys);
  const vol5m = token.volume * 0.02;
  const netVol = vol5m * 0.15;

  const presetAmounts = ['0.01', '0.1', '1', '10'];

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-y-auto text-xs">
      {/* 5m Stats row */}
      <div className="grid grid-cols-4 gap-0 border-b border-border">
        {[
          { label: '5m Vol', value: formatCompact(vol5m) },
          { label: 'Buys', value: formatCompact(buys), color: 'text-profit' },
          { label: 'Sells', value: formatCompact(sells), color: 'text-loss' },
          { label: 'Net Vol', value: formatCompact(netVol), color: netVol >= 0 ? 'text-profit' : 'text-loss' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center py-2 px-1">
            <div className="text-[10px] text-muted-foreground">{label}</div>
            <div className={`text-xs font-bold ${color || 'text-foreground'}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Buy / Sell toggle */}
      <div className="flex items-center border-b border-border">
        <button
          onClick={() => setMode('buy')}
          className={`flex-1 py-2.5 text-sm font-bold text-center transition-colors ${
            mode === 'buy'
              ? 'text-profit border-b-2 border-profit bg-profit/10'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-2.5 text-sm font-bold text-center transition-colors ${
            mode === 'sell'
              ? 'text-loss border-b-2 border-loss bg-loss/10'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sell
        </button>
        <button className="px-2 py-2.5 text-muted-foreground hover:text-foreground border-l border-border">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Market / Limit / Adv tabs */}
      <div className="flex items-center px-3 py-2 border-b border-border gap-1">
        {(['market', 'limit', 'adv'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${
              orderType === t
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'adv' ? 'Adv' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground text-[10px]">0.00 SOL</span>
        </div>
      </div>

      {/* Amount input */}
      <div className="px-3 py-3 border-b border-border space-y-2">
        <div className="flex items-center gap-2 bg-secondary rounded-md border border-border px-3 py-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-sm font-bold text-foreground outline-none"
          />
          <span className="text-muted-foreground text-xs">SOL</span>
          <Pencil className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
        </div>
        <div className="flex gap-1.5">
          {presetAmounts.map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                amount === val
                  ? 'bg-accent text-foreground border border-primary/40'
                  : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Settings row */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Slippage: <span className="text-foreground font-medium">20%</span></span>
            <span className="text-muted-foreground">Priority: <span className="text-foreground font-medium">auto</span></span>
          </div>
          <Settings className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-[10px]">
          <span className="text-muted-foreground">Tip: <span className="text-foreground font-medium">0.01</span></span>
          <span className="text-muted-foreground">Expiry: <span className="text-foreground font-medium">off</span></span>
        </div>
      </div>

      {/* Advanced Trading Strategy */}
      <div className="px-3 py-2 border-b border-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border bg-secondary accent-primary w-3.5 h-3.5" />
          <span className="text-xs text-muted-foreground">Advanced Trading Strategy</span>
        </label>
      </div>

      {/* Big action button */}
      <div className="px-3 py-3 border-b border-border">
        <button
          className={`w-full py-3 rounded-md text-sm font-bold transition-colors ${
            mode === 'buy'
              ? 'bg-profit text-background hover:bg-profit/90'
              : 'bg-loss text-background hover:bg-loss/90'
          }`}
        >
          {mode === 'buy' ? `Buy ${token.name}` : `Sell ${token.name}`}
        </button>
      </div>

      {/* Portfolio row */}
      <div className="px-3 py-2.5 border-b border-border">
        <div className="grid grid-cols-4 gap-1 text-center">
          {[
            { label: 'Bought', value: '—' },
            { label: 'Sold', value: '—' },
            { label: 'Holding', value: '—' },
            { label: 'PnL', value: '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] text-muted-foreground">{label}</div>
              <div className="text-xs font-bold text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preset tabs */}
      <div className="flex border-b border-border">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setActivePreset(i)}
            className={`flex-1 py-2 text-[10px] font-medium text-center transition-colors ${
              activePreset === i
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            PRESET {i + 1}
          </button>
        ))}
      </div>

      {/* Token Info collapsible */}
      <Collapsible open={tokenInfoOpen} onOpenChange={setTokenInfoOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-accent transition-colors">
          <span className="text-xs font-medium text-foreground">Token Info</span>
          {tokenInfoOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-1.5">
            {[
              { label: 'Top 10 H.', value: '32.5%' },
              { label: 'Dev H.', value: '0%' },
              { label: 'Snipers H.', value: '4.2%' },
              { label: 'Insiders', value: '2.1%' },
              { label: 'Bundlers', value: '0.8%' },
              { label: 'LP Burned', value: '100%', color: 'text-profit' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{label}</span>
                <span className={`text-[10px] font-medium ${color || 'text-foreground'}`}>{value}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Back to Token Info */}
      <div className="px-3 py-2 mt-auto border-t border-border">
        <button
          onClick={onBack}
          className="w-full py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors text-center"
        >
          ← Token Info
        </button>
      </div>
    </div>
  );
};

export default TradingPanel;
