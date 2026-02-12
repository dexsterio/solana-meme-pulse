import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Token } from '@/data/mockTokens';

interface PriceChartProps {
  token: Token;
}

const timeframes = ['1s', '1m', '5m', '15m', '1h', '4h', 'D'];

const PriceChart = ({ token }: PriceChartProps) => {
  const [selectedTf, setSelectedTf] = useState('15m');
  const [showMcap, setShowMcap] = useState(false);

  const data = useMemo(() => {
    const points = 100;
    const basePrice = showMcap ? token.mcap : token.price;
    const result = [];
    let price = basePrice * 0.7;

    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.45) * basePrice * 0.03;
      price = Math.max(price + change, basePrice * 0.3);
      result.push({
        time: i,
        price: price,
        volume: Math.random() * token.volume * 0.05,
      });
    }
    return result;
  }, [token, showMcap]);

  const isUp = data[data.length - 1].price > data[0].price;

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border">
      {/* Chart controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTf(tf)}
              className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                selectedTf === tf ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-secondary rounded p-0.5">
          <button
            onClick={() => setShowMcap(false)}
            className={`px-2 py-1 text-[10px] rounded ${!showMcap ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
          >
            Price
          </button>
          <button
            onClick={() => setShowMcap(true)}
            className={`px-2 py-1 text-[10px] rounded ${showMcap ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
          >
            MCap
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isUp ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(220, 13%, 14%)', border: '1px solid hsl(220, 13%, 18%)', borderRadius: '6px', fontSize: '11px' }}
              labelStyle={{ color: 'hsl(215, 15%, 55%)' }}
              itemStyle={{ color: 'hsl(210, 20%, 90%)' }}
              formatter={(value: number) => showMcap ? `$${value.toFixed(0)}` : `$${value.toFixed(8)}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isUp ? 'hsl(142, 71%, 45%)' : 'hsl(0, 72%, 51%)'}
              fill="url(#priceGrad)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="px-3 py-1.5 border-t border-border text-[10px] text-muted-foreground text-center">
        Chart placeholder — OHLCV data will be connected later
      </div>
    </div>
  );
};

export default PriceChart;
