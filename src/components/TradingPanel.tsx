import { useState } from 'react';
import { Token, formatCompact, formatNumber } from '@/data/mockTokens';
import {
  ChevronDown, ChevronUp, ChevronRight, Pencil, Wallet, RefreshCw,
  Users, BarChart3, Copy, ExternalLink, Search, Clock,
  Target, Lock, Link2, Flame, Crown, FileText, CircleUser, CircleDot,
  Settings, AlertTriangle, DollarSign, ToggleLeft } from
'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import SolanaIcon from '@/components/SolanaIcon';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TradingPanelProps {
  token: Token;
  initialMode: 'buy' | 'sell';
  onBack: () => void;
}

const TradingPanel = ({ token, initialMode, onBack }: TradingPanelProps) => {
  const [mode, setMode] = useState<'buy' | 'sell'>(initialMode);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
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
  const truncateAddr = (addr: string) => addr.length > 10 ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : addr;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  };

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
          'text-muted-foreground hover:text-foreground'}`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
          mode === 'sell' ?
          'text-loss border-b-2 border-loss bg-loss/10' :
          'text-muted-foreground hover:text-foreground'}`}
        >
          Sell
        </button>
      </div>

      {/* Market / Limit tabs */}
      <div className="flex items-center px-3 border-b border-border">
        {(['market', 'limit'] as const).map((t) =>
        <button
          key={t}
          onClick={() => setOrderType(t)}
          className={`px-3 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 ${
          orderType === t ?
          'text-foreground border-primary' :
          'text-muted-foreground hover:text-foreground border-transparent'}`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-muted-foreground cursor-help">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-xs">—</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Connect wallet to trade</TooltipContent>
          </Tooltip>
          <div className="flex items-center gap-1 text-muted-foreground">
            <SolanaIcon size={10} />
            <span className="text-xs">—</span>
          </div>
        </div>
      </div>

      {/* Amount input */}
      <div className="px-3 py-3 border-b border-border space-y-2">
        <div className="flex items-center gap-2 rounded-md border border-border bg-[hsl(0,0%,16%)] px-3 py-2.5 min-w-0">
          <span className="text-xs text-muted-foreground uppercase tracking-wide shrink-0">Amount</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || parseFloat(val) >= 0) setAmount(val);
            }}
            placeholder="0.00"
            className="flex-1 min-w-0 bg-transparent text-sm font-bold text-foreground outline-none text-right placeholder:text-muted-foreground [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Trade amount in SOL"
          />
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
            'bg-[hsl(0,0%,16%)] text-muted-foreground border border-border hover:text-foreground'}`}
          >
            {val}
          </button>
          )}
          <button
            className="px-2 py-1.5 rounded bg-[hsl(0,0%,16%)] border border-border text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Edit preset amounts"
            onClick={() => toast.info('Custom presets coming soon')}
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Settings row */}
      <div className="px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Tooltip><TooltipTrigger asChild>
            <span className="flex items-center gap-1 cursor-help"><Settings className="w-3 h-3" /> <span className="text-foreground font-medium">20%</span></span>
          </TooltipTrigger><TooltipContent>Slippage tolerance</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild>
            <span className="flex items-center gap-1 cursor-help"><AlertTriangle className="w-3 h-3" /> <span className="text-foreground font-medium">0.001</span></span>
          </TooltipTrigger><TooltipContent>Priority fee (SOL)</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild>
            <span className="flex items-center gap-1 cursor-help"><DollarSign className="w-3 h-3" /> <span className="text-foreground font-medium">0.01</span></span>
          </TooltipTrigger><TooltipContent>Tip amount (SOL)</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild>
            <span className="flex items-center gap-1 cursor-help"><ToggleLeft className="w-3 h-3" /> <span className="text-foreground font-medium">Off</span></span>
          </TooltipTrigger><TooltipContent>MEV Protection</TooltipContent></Tooltip>
        </div>
      </div>

      {/* Big action button */}
      <div className="px-3 py-3 border-b border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled
              className={`w-full py-3.5 rounded-full text-base font-bold transition-colors cursor-not-allowed opacity-60 ${
              mode === 'buy' ?
              'bg-profit text-background' :
              'bg-loss text-background'}`}
            >
              <span className="block truncate">Connect Wallet to {mode === 'buy' ? 'Buy' : 'Sell'}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Wallet connection coming soon</TooltipContent>
        </Tooltip>
      </div>

      {/* Portfolio row */}
      <div className="px-3 py-3 border-b border-border">
        <div className="text-center py-2">
          <Wallet className="w-5 h-5 text-muted-foreground/40 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Connect wallet to view portfolio</p>
        </div>
      </div>

      {/* Preset tabs */}
      <div className="flex border-b border-border">
        {[0, 1, 2].map((i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActivePreset(i)}
                className={`flex-1 py-2 text-center text-xs transition-colors border-r border-border last:border-r-0 ${
                  activePreset === i ? 'text-foreground bg-accent' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                Preset {i + 1}
              </button>
            </TooltipTrigger>
            <TooltipContent>Quick trade preset {i + 1}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Token Info collapsible */}
      <Collapsible open={tokenInfoOpen} onOpenChange={setTokenInfoOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 hover:bg-accent transition-colors border-b border-border">
          <span className="text-sm font-semibold text-foreground">Token Info</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toast.info('Token info refresh coming soon'); }}
              aria-label="Refresh token info"
            >
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
            {tokenInfoOpen ?
            <ChevronUp className="w-4 h-4 text-muted-foreground" /> :
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-3 space-y-3 border-b border-border">
            {/* 2x3 grid */}
            <div className="grid grid-cols-3 gap-2">
              {(() => {
                const top10 = 32.5,dev = 0,snipers = 4.2,insiders = 2.1,bundlers = 0.8;
                const lpBurned = true;
                const getColor = (val: number, threshold: number) => val === 0 ? 'text-foreground' : val > threshold ? 'text-loss' : 'text-profit';
                return [
                { label: 'Top 10 H.', value: `${top10}%`, icon: <Users className="w-3.5 h-3.5" />, color: getColor(top10, 20) },
                { label: 'Dev H.', value: `${dev}%`, icon: <Crown className="w-3.5 h-3.5" />, color: dev === 0 ? 'text-foreground' : dev > 6 ? 'text-loss' : 'text-profit' },
                { label: 'Snipers H.', value: `${snipers}%`, icon: <Target className="w-3.5 h-3.5" />, color: getColor(snipers, 6) },
                { label: 'Insiders', value: `${insiders}%`, icon: <Lock className="w-3.5 h-3.5" />, color: getColor(insiders, 6) },
                { label: 'Bundlers', value: `${bundlers}%`, icon: <Link2 className="w-3.5 h-3.5" />, color: getColor(bundlers, 10) },
                { label: 'LP Burned', value: lpBurned ? '100%' : 'No', icon: <Flame className="w-3.5 h-3.5" />, color: lpBurned ? 'text-profit' : 'text-loss' }];
              })().map(({ label, value, icon, color }) =>
              <div key={label} className="text-center py-1.5">
                  <div className={`flex items-center justify-center gap-1 ${color} mb-0.5`}>
                    {icon}
                    <span className="text-sm font-bold">{value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              )}
            </div>

            {/* Holders / Pro Traders / Dex Paid */}
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="text-center min-w-0">
                <div className="flex items-center justify-center gap-1 text-foreground mb-0.5">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-bold truncate">—</span>
                </div>
                <div className="text-xs text-muted-foreground">Holders</div>
              </div>
              <div className="text-center min-w-0">
                <div className="flex items-center justify-center gap-1 text-foreground mb-0.5">
                  <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-bold truncate">—</span>
                </div>
                <div className="text-xs text-muted-foreground">Pro Traders</div>
              </div>
              <div className="text-center min-w-0">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                  <CircleDot className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm font-bold truncate">—</span>
                </div>
                <div className="text-xs text-muted-foreground">Dex Paid</div>
              </div>
            </div>

            {/* CA row */}
            <div className="flex items-center justify-between py-2.5 border-t border-border min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground font-medium shrink-0">CA:</span>
                <span className="text-xs text-foreground font-mono truncate">{truncateAddr(contractAddress)}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => copyToClipboard(contractAddress, 'Contract address')} aria-label="Copy contract address">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </button>
                <a href={`https://solscan.io/token/${contractAddress}`} target="_blank" rel="noopener noreferrer" aria-label="View on Solscan">
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </a>
              </div>
            </div>

            {/* DA row */}
            <div className="flex items-center justify-between py-2.5 border-t border-border min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <CircleUser className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground font-medium shrink-0">DA:</span>
                <span className="text-xs text-foreground font-mono truncate">{truncateAddr(devAddress)}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a href={`https://solscan.io/account/${devAddress}`} target="_blank" rel="noopener noreferrer" aria-label="Search dev address">
                  <Search className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </a>
                <a href={`https://solscan.io/account/${devAddress}`} target="_blank" rel="noopener noreferrer" aria-label="View dev on Solscan">
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </a>
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
                  <span className="text-xs text-foreground font-mono">{token.priceSOL?.toFixed(6) ?? '0.000001'}</span>
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
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-muted-foreground">No reused image tokens found</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Similar Tokens */}
      <Collapsible open={similarOpen} onOpenChange={setSimilarOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-3 hover:bg-accent transition-colors border-b border-border">
          <span className="text-sm text-muted-foreground">Similar Tokens</span>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${similarOpen ? 'rotate-90' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-muted-foreground">No similar tokens found</p>
          </div>
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
