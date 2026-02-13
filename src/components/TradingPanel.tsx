import { useState } from 'react';
import { Token, formatCompact, formatNumber } from '@/data/mockTokens';
import {
  ChevronDown, ChevronUp, Pencil, Wallet, RefreshCw,
  Users, BarChart3, Copy, ExternalLink, Search, Clock,
  Target, Lock, Link2, Flame, Crown, Menu
} from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import SolanaIcon from '@/components/SolanaIcon';

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
  const [tokenInfoOpen, setTokenInfoOpen] = useState(true);
  const [reusedOpen, setReusedOpen] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);

  const buys = token.buys24h ?? Math.round(token.txns * 0.55);
  const sells = token.sells24h ?? (token.txns - buys);
  const vol5m = token.volume * 0.02;
  const netVol = vol5m * 0.15;

  const presetAmounts = ['0.01', '0.1', '1', '10'];
  const contractAddress = token.id || '5T17aqgJ8cM39SNuVBu2LK2cq5MWUpZxcQnnuwNjpump';
  const devAddress = '8F42B1C35D9E4A7BB2E19C3F4D5A6E7B';
  const truncate = (addr: string) => addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

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

      {/* Market / Limit / Adv tabs - underline style */}
      <div className="flex items-center px-3 py-0 border-b border-border">
        {(['market', 'limit', 'adv'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`px-3 py-2 text-xs font-medium capitalize transition-colors border-b-2 ${
              orderType === t
                ? 'text-foreground border-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            {t === 'adv' ? 'Adv.' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wallet className="w-3 h-3" />
            <span className="text-[10px]">1</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Menu className="w-3 h-3" />
            <span className="text-[10px]">0</span>
          </div>
        </div>
      </div>

      {/* Amount input */}
      <div className="px-3 py-3 border-b border-border space-y-2">
        <div className="flex items-center gap-2 bg-secondary rounded-md border border-border px-3 py-2">
          <span className="text-[10px] text-muted-foreground uppercase">Amount</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent text-sm font-bold text-foreground outline-none text-right"
          />
          <SolanaIcon size={14} />
          <Menu className="w-3.5 h-3.5 text-muted-foreground cursor-pointer" />
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
          <button className="px-2 py-1.5 rounded bg-secondary border border-border text-muted-foreground hover:text-foreground">
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Settings row - icon based */}
      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">⚙️ <span className="text-foreground font-medium">20%</span></span>
          <span className="flex items-center gap-1">⚠️ <span className="text-foreground font-medium">0.001</span></span>
          <span className="flex items-center gap-1">💰 <span className="text-foreground font-medium">0.01</span></span>
          <span className="flex items-center gap-1">☐ <span className="text-foreground font-medium">Off</span></span>
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
          className={`w-full py-3 rounded-full text-sm font-bold transition-colors ${
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
            { label: 'Bought', value: '0' },
            { label: 'Sold', value: '0' },
            { label: 'Holding', value: '0' },
            { label: 'PnL', value: '+0 (+0%)' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] text-muted-foreground">{label}</div>
              <div className="text-[10px] font-bold text-foreground flex items-center justify-center gap-0.5">
                {label !== 'PnL' && <SolanaIcon size={10} />}
                {value}
                {label === 'PnL' && <RefreshCw className="w-2.5 h-2.5 text-muted-foreground ml-0.5" />}
              </div>
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
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-accent transition-colors border-b border-border">
          <span className="text-xs font-medium text-foreground">Token Info</span>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-muted-foreground" />
            {tokenInfoOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-2 space-y-3 border-b border-border">
            {/* 2x3 grid of stat cards */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Top 10 H.', value: '32.5%', icon: <Users className="w-3 h-3" /> },
                { label: 'Dev H.', value: '0%', icon: <Crown className="w-3 h-3" /> },
                { label: 'Snipers H.', value: '4.2%', icon: <Target className="w-3 h-3" /> },
                { label: 'Insiders', value: '2.1%', icon: <Lock className="w-3 h-3" /> },
                { label: 'Bundlers', value: '0.8%', icon: <Link2 className="w-3 h-3" /> },
                { label: 'LP Burned', value: '100%', icon: <Flame className="w-3 h-3" />, color: 'text-profit' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="bg-secondary rounded-md p-2 border border-border text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    {icon}
                    <span className="text-[9px]">{label}</span>
                  </div>
                  <div className={`text-xs font-bold ${color || 'text-foreground'}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* Holders / Pro Traders / Dex Paid */}
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-secondary rounded-md p-2 border border-border text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Users className="w-3 h-3" />
                  <span className="text-[9px]">Holders</span>
                </div>
                <div className="text-xs font-bold text-foreground">1,245</div>
              </div>
              <div className="bg-secondary rounded-md p-2 border border-border text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <BarChart3 className="w-3 h-3" />
                  <span className="text-[9px]">Pro Traders</span>
                </div>
                <div className="text-xs font-bold text-foreground">12</div>
              </div>
              <div className="bg-secondary rounded-md p-2 border border-border text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <span className="text-[9px]">Dex Paid</span>
                </div>
                <div className="text-xs font-bold text-loss">Unpaid</div>
              </div>
            </div>

            {/* CA row */}
            <div className="flex items-center justify-between bg-secondary rounded-md px-2.5 py-2 border border-border">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-medium">CA:</span>
                <span className="text-[10px] text-foreground font-mono">{truncate(contractAddress)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Copy className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>

            {/* DA row */}
            <div className="flex items-center justify-between bg-secondary rounded-md px-2.5 py-2 border border-border">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-medium">DA:</span>
                <span className="text-[10px] text-foreground font-mono">{truncate(devAddress)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Search className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>

            {/* Exchange info row */}
            <div className="flex items-center justify-between bg-secondary rounded-md px-2.5 py-2 border border-border">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-foreground">{token.exchangeName || 'Raydium'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <SolanaIcon size={10} />
                  <span className="text-[10px] text-foreground font-mono">{token.priceSOL?.toFixed(8) || '0.00000001'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px]">{token.age || '2h'}</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Reused Image Tokens */}
      <Collapsible open={reusedOpen} onOpenChange={setReusedOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-accent transition-colors border-b border-border">
          <span className="text-xs text-muted-foreground">Reused Image Tokens (0)</span>
          {reusedOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-2 text-[10px] text-muted-foreground">No reused image tokens found.</div>
        </CollapsibleContent>
      </Collapsible>

      {/* Similar Tokens */}
      <Collapsible open={similarOpen} onOpenChange={setSimilarOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-accent transition-colors border-b border-border">
          <span className="text-xs text-muted-foreground">Similar Tokens</span>
          {similarOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-2 text-[10px] text-muted-foreground">No similar tokens found.</div>
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
