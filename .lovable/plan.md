

# Improved Token Grid Card UI

## Overview
Redesign the token grid cards to be visually polished and professional, with larger square logos, better typography, improved padding, refined colors, and a hover effect that enlarges the logo area.

## Changes

### File: `src/components/TokenGrid.tsx` (Full Rewrite)

**Visual Improvements:**
- **Larger square token logos**: 48x48px (`w-12 h-12`) with `rounded-lg` instead of small round avatars
- **Hover effect**: On card hover, the logo scales up smoothly (`group-hover:scale-110`) with a subtle glow
- **Better typography**: Token name at 15px semibold, ticker at 13px, price at 18px bold -- all using Inter (no monospace)
- **Improved padding**: Card padding increased from `p-4` to `p-5`
- **Enhanced colors**: Subtle gradient border on hover (`border-primary/40`), slightly elevated card background (`bg-surface-2`), and a soft inner glow effect
- **Clearer data labels**: Stats labels at 12px with better contrast, values at 13px
- **Change indicators**: Larger percentage badges with colored backgrounds (`bg-profit/10` or `bg-loss/10`) instead of plain text
- **Exchange logos**: Show platform logos (pump.fun, Raydium, Meteora, Orca, Bonk) in grid cards too, positioned near the token name
- **Grid spacing**: Increased gap from `gap-3` to `gap-4`

### Technical Details

```text
Card Layout (improved):
+----------------------------------+
|  [48x48 Logo]   Name   [DEX]    |
|                 $TICK            |
|                                  |
|  $0.00001234         +12.5%     |
|                                  |
|  Vol  $1.2M    MCap  $4.5M     |
|  Liq  $800K    Age   2h        |
|                                  |
|  [5m +2.1%] [1h -0.5%] [6h +8%]|
+----------------------------------+
```

Key class changes:
- Card: `bg-[hsl(var(--surface-2))] border border-border/50 rounded-xl p-5 group cursor-pointer hover:border-primary/40 hover:bg-[hsl(var(--surface-3))] transition-all duration-200 hover:shadow-lg hover:shadow-primary/5`
- Logo: `w-12 h-12 rounded-lg transition-transform duration-200 group-hover:scale-110`
- Token name: `font-semibold text-foreground text-[15px]`
- Price: `text-lg font-bold text-foreground` (no font-mono)
- Stats grid: `text-[12px]` labels, `text-[13px]` values
- Change pills: Rounded background pills with `px-2 py-0.5 rounded-md text-[11px] font-medium`

