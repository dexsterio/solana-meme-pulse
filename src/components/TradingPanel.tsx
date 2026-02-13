import { useState } from 'react';
import { Token, formatCompact, formatNumber } from '@/data/mockTokens';
import {
  ChevronDown, ChevronUp, ChevronRight, Pencil, Wallet, RefreshCw,
  Users, BarChart3, Copy, ExternalLink, Search, Clock,
  Target, Lock, Link2, Flame, Crown, Menu, FileText, CircleUser, CircleDot } from
'lucide-react';
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
  const sells = token.sells24h ?? token.txns - buys;
  const vol5m = token.volume * 0.02;
  const netVol = vol5m * 0.15;

  const presetAmounts = ['0.01', '0.1', '1', '10'];
  const contractAddress = token.id || '5T17aqgJ8cM39SNuVBu2LK2cq5MWUpZxcQnnuwNjpump';
  const devAddress = '8F42B1C35D9E4A7BB2E19C3F4D5A6E7B';
  const truncateCA = (addr: string) => addr.length > 10 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr;
  const truncateDA = (addr: string) => addr.length > 10 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr;

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-y-auto overflow-x-hidden">
      {/* 5m Stats row */}
      <div className="grid grid-cols-4 gap-0 border-b border-border">
        {[
        { label: '5m Vol', value: formatCompact(vol5m) },
        { label: 'Buys', value: formatCompact(buys), color: 'text-profit' },
        { label: 'Sells', value: formatCompact(sells), color: 'text-loss' },
        { label: 'Net Vol', value: formatCompact(netVol), color: netVol >= 0 ? 'text-profit' : 'text-loss' }].
        map(({ label, value, color }) =>
        <div key={label} className="text-center py-2.5 px-1 min-w-0">
            <div className="text-xs text-muted-foreground truncate">{label}</div>
            <div className={`text-sm font-bold truncate ${color || 'text-foreground'}`}>{value}</div>
          </div>
        )}
      </div>

      {/* Buy / Sell toggle */}
      <div className="flex items-center border-b border-border">
        <button
          onClick={() => setMode('buy')}
          className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
          mode === 'buy' ?
          'text-profit border-b-2 border-profit bg-profit/10' :
          'text-muted-foreground hover:text-foreground'}`
          }>

          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
          mode === 'sell' ?
          'text-loss border-b-2 border-loss bg-loss/10' :
          'text-muted-foreground hover:text-foreground'}`
          }>

          Sell
        </button>
        <button className="px-3 py-3 text-muted-foreground hover:text-foreground border-l border-border">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Market / Limit / Adv tabs */}
      <div className="flex items-center px-3 border-b border-border">
        {(['market', 'limit', 'adv'] as const).map((t) =>
        <button
          key={t}
          onClick={() => setOrderType(t)}
          className={`px-3 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 ${
          orderType === t ?
          'text-foreground border-primary' :
          'text-muted-foreground hover:text-foreground border-transparent'}`
          }>

            {t === 'adv' ? 'Adv.' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Wallet className="w-3.5 h-3.5" />
            <span className="text-xs">1</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <SolanaIcon size={14} />
            <span className="text-xs">0</span>
          </div>
        </div>
      </div>

      {/* Amount input */}
      {/* Amount input */}
      <div className="px-3 py-3 border-b border-border space-y-2">
        <div className="flex items-center gap-2 rounded-md border border-border bg-[hsl(0,0%,16%)] px-3 py-2.5 min-w-0">
          <span className="text-xs text-muted-foreground uppercase tracking-wide shrink-0">Amount</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 min-w-0 bg-transparent text-sm font-bold text-foreground outline-none text-right placeholder:text-muted-foreground" />

          <SolanaIcon size={14} className="shrink-0" />
          
        </div>
        <div className="flex gap-1.5 min-w-0">
          {presetAmounts.map((val) =>
          <button
            key={val}
            onClick={() => setAmount(val)}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors min-w-0 truncate ${
            amount === val ?
            'bg-[hsl(0,0%,20%)] text-foreground border border-primary/50' :
            'bg-[hsl(0,0%,16%)] text-muted-foreground border border-border hover:text-foreground'}`
            }>

              {val}
            </button>
          )}
          <button className="px-2 py-1.5 rounded bg-[hsl(0,0%,16%)] border border-border text-muted-foreground hover:text-foreground shrink-0">
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Settings row */}
      <div className="px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">⚙️ <span className="text-foreground font-medium">20%</span></span>
          <span className="flex items-center gap-1">⚠️ <span className="text-foreground font-medium">0.001</span></span>
          <span className="flex items-center gap-1">💰 <span className="text-foreground font-medium">0.01</span></span>
          <span className="flex items-center gap-1">☐ <span className="text-foreground font-medium">Off</span></span>
        </div>
      </div>

      {/* Advanced Trading Strategy */}
      <div className="px-3 py-2.5 border-b border-border">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border bg-secondary accent-primary w-4 h-4" />
          <span className="text-sm text-muted-foreground">Advanced Trading Strategy</span>
        </label>
      </div>

      {/* Big action button */}
      <div className="px-3 py-3 border-b border-border">
        <button
          className={`w-full py-3.5 rounded-full text-base font-bold transition-colors ${
          mode === 'buy' ?
          'bg-profit text-background hover:bg-profit/90' :
          'bg-loss text-background hover:bg-loss/90'}`
          }>

          <span className="block truncate">{mode === 'buy' ? `Buy ${token.name}` : `Sell ${token.name}`}</span>
        </button>
      </div>

      {/* Portfolio row */}
      <div className="px-3 py-3 border-b border-border">
        <div className="grid grid-cols-4 gap-1 text-center">
          {[
          { label: 'Bought', value: '0', color: 'text-foreground' },
          { label: 'Sold', value: '0', color: 'text-loss' },
          { label: 'Holding', value: '0', color: 'text-foreground' },
          { label: 'PnL', value: '+0 (+0%)', color: 'text-foreground', isPnl: true }].
          map(({ label, value, color, isPnl }) =>
          <div key={label}>
              <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
              <div className={`text-xs font-bold ${color} flex items-center justify-center gap-0.5 min-w-0 truncate`}>
                {!isPnl && <SolanaIcon size={10} />}
                <span className="truncate">{value}</span>
                {isPnl && <RefreshCw className="w-2.5 h-2.5 text-muted-foreground ml-0.5 shrink-0" />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preset tabs */}
      <div className="flex border-b border-border">
        {[0, 1, 2].map((i) =>
        <button
          key={i}
          onClick={() => setActivePreset(i)}
          className={`flex-1 py-2.5 text-xs font-medium text-center transition-colors ${
          activePreset === i ?
          'text-foreground border-b-2 border-primary' :
          'text-muted-foreground hover:text-foreground'}`
          }>

            PRESET {i + 1}
          </button>
        )}
      </div>

      {/* Token Info collapsible */}
      <Collapsible open={tokenInfoOpen} onOpenChange={setTokenInfoOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 hover:bg-accent transition-colors border-b border-border">
          <span className="text-sm font-semibold text-foreground">Token Info</span>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            {tokenInfoOpen ?
            <ChevronUp className="w-4 h-4 text-muted-foreground" /> :

            <ChevronDown className="w-4 h-4 text-muted-foreground" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-3 space-y-3 border-b border-border">
            {/* 2x3 grid - icon + colored value on top, label below */}
            <div className="grid grid-cols-3 gap-2">
              {[
              { label: 'Top 10 H.', value: '32.5%', icon: <Users className="w-3.5 h-3.5" />, color: 'text-primary' },
              { label: 'Dev H.', value: '0%', icon: <Crown className="w-3.5 h-3.5" />, color: 'text-primary' },
              { label: 'Snipers H.', value: '4.2%', icon: <Target className="w-3.5 h-3.5" />, color: 'text-primary' },
              { label: 'Insiders', value: '2.1%', icon: <Lock className="w-3.5 h-3.5" />, color: 'text-primary' },
              { label: 'Bundlers', value: '0.8%', icon: <Link2 className="w-3.5 h-3.5" />, color: 'text-primary' },
              { label: 'LP Burned', value: '100%', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-profit' }].
              map(({ label, value, icon, color }) =>
              <div key={label} className="text-center py-1.5">
                  <div className={`flex items-center justify-center gap-1 ${color} mb-0.5`}>
                    {icon}
                    <span className="text-sm font-bold">{value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              )}
            </div>

            {/* Holders / Pro Traders / Dex Paid - clean row, no bg boxes */}
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-center min-w-0">
                <div className="flex items-center justify-center gap-1 text-foreground mb-0.5">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-bold truncate">1,245</span>
                </div>
                <div className="text-xs text-muted-foreground">Holders</div>
              </div>
              <div className="text-center min-w-0">
                <div className="flex items-center justify-center gap-1 text-foreground mb-0.5">
                  <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-bold truncate">12</span>
                </div>
                <div className="text-xs text-muted-foreground">Pro Traders</div>
              </div>
              <div className="text-center min-w-0">
                <div className="flex items-center justify-center gap-1 text-loss mb-0.5">
                  <CircleDot className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-bold truncate">Unpaid</span>
                </div>
                <div className="text-xs text-muted-foreground">Dex Paid</div>
              </div>
            </div>

            {/* CA row - bigger, specific icon */}
            <div className="flex items-center justify-between py-2.5 border-t border-border min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground font-medium shrink-0">CA:</span>
                <span className="text-xs text-foreground font-mono truncate">{truncateCA(contractAddress)}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Copy className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </div>
            </div>

            {/* DA row - wallet icon, bigger */}
            <div className="flex items-center justify-between py-2.5 border-t border-border min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <CircleUser className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground font-medium shrink-0">DA:</span>
                <span className="text-xs text-foreground font-mono truncate">{truncateDA(devAddress)}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Search className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </div>
            </div>

            {/* Exchange info row */}
            <div className="flex items-center justify-between py-2.5 border-t border-border min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs text-foreground font-medium truncate">{token.exchangeName || 'Raydium'}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-0.5">
                  <SolanaIcon size={12} />
                  <span className="text-xs text-foreground font-mono">{token.priceSOL?.toFixed(6) || '0.000001'}</span>
                </div>
                <div className="flex items-center gap-0.5 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{token.age || '2h'}</span>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Reused Image Tokens */}
      <Collapsible open={reusedOpen} onOpenChange={setReusedOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 hover:bg-accent transition-colors border-b border-border">
          <span className="text-sm text-muted-foreground">Reused Image Tokens (0)</span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${reusedOpen ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-2 text-xs text-muted-foreground">No reused image tokens found.</div>
        </CollapsibleContent>
      </Collapsible>

      {/* Similar Tokens */}
      <Collapsible open={similarOpen} onOpenChange={setSimilarOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 hover:bg-accent transition-colors border-b border-border">
          <span className="text-sm text-muted-foreground">Similar Tokens</span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${similarOpen ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-2 text-xs text-muted-foreground">No similar tokens found.</div>
        </CollapsibleContent>
      </Collapsible>

      {/* Back to Token Info */}
      <div className="px-3 py-2.5 mt-auto border-t border-border">
        <button
          onClick={onBack}
          className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors text-center">

          ← Token Info
        </button>
      </div>
    </div>);

};

export default TradingPanel;