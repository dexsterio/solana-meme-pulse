
# Comprehensive UI Overflow Fix for TradingPanel

## Problem
The TradingPanel is constrained to 320px width but several elements overflow their containers due to oversized text, long addresses, and tight spacing.

## Specific Issues and Fixes

### 1. CA (Contract Address) Row - Overflow
- **Problem**: `text-sm font-mono` address is too wide, icons get pushed out
- **Fix**: Shorten truncation to show fewer characters (e.g., `5T17...pump` with `slice(0,4)...slice(-4)`), use `text-xs font-mono` for the address, and add `min-w-0 truncate` to prevent overflow

### 2. DA (Dev Address) Row - Same issue
- **Fix**: Same shorter truncation and smaller font

### 3. Exchange Info Row - SOL price overflow
- **Problem**: `0.00000195` in `text-sm font-mono` plus exchange name plus clock is too wide
- **Fix**: Use `text-xs` for the price, limit decimal display, use `truncate` on exchange name

### 4. Buy Button - Long token names
- **Problem**: "Buy Official Lizard Coin" can be very long
- **Fix**: Add `truncate` to the button text and `overflow-hidden`

### 5. Holders / Pro Traders / Dex Paid
- **Problem**: "Unpaid" text with icon in `text-base font-bold` is tight in 1/3 of 304px
- **Fix**: Reduce to `text-sm font-bold` for these values

### 6. Settings Row
- **Problem**: Four emoji+value pairs on one line can be tight
- **Fix**: Reduce gap from `gap-4` to `gap-3`, keep `text-xs`

### 7. Portfolio Row - PnL column
- **Problem**: "+0 (+0%)" with refresh icon in a quarter of 304px
- **Fix**: Use `text-xs` for PnL value, reduce icon size

### 8. 5m Stats Row
- **Problem**: Values like "20.3K" in `text-sm font-bold` are fine but labels can clip
- **Fix**: Add `truncate` safety on stat values

### 9. General Container Safety
- Add `overflow-hidden` to the root container to prevent any horizontal scroll
- Add `min-w-0` to flex children where needed
- Ensure all text uses `truncate` or `break-all` where content is dynamic

## File Modified
| File | Changes |
|------|---------|
| `src/components/TradingPanel.tsx` | Fix all overflow issues with shorter truncation, smaller fonts for addresses, truncate classes, and overflow-hidden on containers |

## Technical Notes
- No new dependencies
- All changes are CSS class adjustments and truncation logic
- Panel width stays at 320px - content must fit within ~304px usable width
