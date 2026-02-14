
# Comprehensive iPad/Tablet UI/UX Overhaul

After auditing the current state at 768px and 834px viewports, multiple critical issues have been identified that make the tablet experience poor.

---

## Critical Bugs Found

### BUG 1: Token Detail Page Completely Broken on Tablet (CRITICAL)
The chart and info panel areas appear completely blank/empty on tablet. The right panel (260px) squeezes the main content area too much at 768px, leaving only ~500px for chart + transaction list. The chart's `ResponsiveContainer` may not render properly in the cramped space. The loading skeleton also doesn't account for tablet width properly.

**Fix**: On tablet, use a stacked layout similar to mobile but without the bottom tab bar. Show chart on top (~50% height), transaction list below (~25%), and info panel below that as a scrollable section. Alternatively, reduce the right panel further or switch to a collapsible sidebar.

### BUG 2: Token Table Missing Too Many Columns on Tablet
Currently, tablet hides AGE, TXNS, MAKERS, and LIQUIDITY -- showing only #, TOKEN, PRICE, VOLUME, 1H, 24H, MCAP. This is too aggressive for an 834px screen. AGE and TXNS are important data.

**Fix**: Restore AGE and TXNS columns on tablet (they fit at 834px). Only hide MAKERS and LIQUIDITY.

### BUG 3: Token Table Text Truncation on Tablet
Token names are heavily truncated (e.g., "P...", "S...", "N...") due to `max-w-[120px]` on the name span. On tablet, there's more room.

**Fix**: Increase `max-w` for token name on tablet to `max-w-[160px]`.

### BUG 4: StatsBar Not Optimized for Tablet
The stats bar works but the spacing between elements could be better utilized. The Market View button could show full text "Market View" instead of just the icon.

### BUG 5: TokenFilters Missing Gainers Button on Tablet
Currently, the `isTablet` flag hides the Customize button, but the Gainers button is shown. The time filter toggles in the Trending pill work but are slightly cramped.

### BUG 6: ViralBar Cluster Pills Cramped on Tablet
The viral cluster pills show token count and mcap on non-mobile, but at tablet sizes they can overflow.

### BUG 7: MarketSentimentBar Not Tablet-Optimized
Uses `isMobile` checks only. On tablet, the pills could use slightly larger text and better spacing.

### BUG 8: TransactionList Not Tablet-Optimized
Shows all desktop columns on tablet, which can be tight at 768px within the 500px remaining after the 260px panel.

### BUG 9: TokenInfoPanel Too Narrow on Tablet
At 260px width, the info panel's content (price boxes, LIQ/FDV/MCAP grid) is extremely cramped. Text overflows.

### BUG 10: TokenGrid Not Tablet-Optimized
Grid uses `md:grid-cols-3` which works okay at 768px but cards are small. Could use 2 columns for better readability on portrait iPad.

---

## Implementation Plan

### 1. Fix Token Detail Tablet Layout (TokenDetail.tsx) - HIGHEST PRIORITY

The core fix: On tablet, switch from desktop's side-by-side layout (chart + right panel) to a **stacked scrollable layout**:
- Chart takes full width, ~45vh height
- Transaction list takes full width, ~30vh height  
- Info panel takes full width below, scrollable
- No bottom tab bar (tablet has enough vertical space to stack everything)

This eliminates the cramped 260px panel problem entirely.

### 2. Restore Table Columns on Tablet (TokenTable.tsx)

- Show AGE column on tablet (was hidden)
- Show TXNS column on tablet (was hidden)  
- Keep MAKERS and LIQUIDITY hidden on tablet
- Show 3 change columns instead of 2: add 6H back (5M, 1H, 6H removed -> 1H, 6H, 24H)
- Increase token name max-width to 160px on tablet

### 3. Optimize TokenGrid for Tablet (TokenGrid.tsx)

- Use 2 columns on portrait tablet (768px) instead of 3
- Use 3 columns on landscape tablet (1024px+)

### 4. Optimize TransactionList for Tablet (TransactionList.tsx)

- In the stacked tablet layout, the transaction list gets full width, so desktop columns work fine
- Add `isTablet` check to slightly compact column padding

### 5. Optimize MarketSentimentBar for Tablet (MarketSentimentBar.tsx)

- Add `isTablet` awareness
- Use intermediate sizing between mobile compact and desktop full

### 6. Optimize ViralBar for Tablet (ViralBar.tsx)

- Show token count but hide mcap on tablet to prevent overflow
- Ensure sort buttons show labels on tablet

### 7. Optimize TrendingBar for Tablet (TrendingBar.tsx)

- Show full "Trending" label on tablet (currently shows it since `!isMobile`)
- Ensure mcap is shown on tablet

### 8. Loading Skeleton Tablet Fix (Index.tsx)

- Show appropriate number of skeleton columns matching tablet visible columns

---

## Technical Details

### Files to modify (8 files):

| File | Changes | Priority |
|------|----------|----------|
| `src/pages/TokenDetail.tsx` | Stacked layout for tablet instead of cramped side-by-side | Critical |
| `src/components/TokenTable.tsx` | Restore AGE+TXNS columns, add 6H change, wider name | High |
| `src/components/TokenGrid.tsx` | 2-col portrait tablet, 3-col landscape | Medium |
| `src/components/TransactionList.tsx` | Tablet padding optimization | Medium |
| `src/components/MarketSentimentBar.tsx` | Tablet-aware sizing | Medium |
| `src/components/ViralBar.tsx` | Hide mcap on tablet pills | Low |
| `src/components/TrendingBar.tsx` | Verify labels correct on tablet | Low |
| `src/pages/Index.tsx` | Skeleton columns match tablet layout | Low |

### Key technical decisions:
- Tablet (768-1024px) uses `useIsTablet()` hook for conditional rendering
- Token Detail on tablet uses a **full-width stacked scroll layout** (no side panel, no bottom tabs)
- This is the optimal approach: iPad portrait has plenty of vertical space and full horizontal width makes chart and info panel readable
- Desktop layout (1024px+) remains completely unchanged
