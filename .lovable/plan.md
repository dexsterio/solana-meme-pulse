

# Mobile-First Responsive UI Overhaul

A comprehensive plan to make every screen fully usable on all mobile devices (320px-428px) and tablets (768px-1024px).

---

## Current Problems (Mobile)

Looking at the app on a 390px viewport, the following critical issues are visible:

1. **Index Page**: StatsBar pills wrap awkwardly across multiple lines. Filter bar overflows and "Rank by" dropdown + Customize/Filters/View toggle are cut off. Token table columns overflow horizontally with data cut off (PRICE column barely visible, all change columns hidden).
2. **Token Detail Page**: The 3-panel layout shows chart + right panel side by side on mobile -- chart is ~70px wide and unusable. Right panel (TokenInfoPanel) overlaps the chart. Transaction list is hidden behind the panel. The header bar is fine.
3. **Trending Bar**: Works OK due to marquee scroll, but items are slightly cramped.
4. **Viral Bar**: Sort buttons and cluster pills overflow without wrapping.

---

## Plan

### 1. Token Detail Page - Mobile Layout (`TokenDetail.tsx`)

The most critical fix. On mobile, switch from horizontal 3-panel to vertical stacked layout:

- Use `useIsMobile()` hook (already exists at 768px breakpoint)
- Mobile: Stack chart (full width, fixed ~45vh height), then transaction list, then info/trading panel below
- Add a floating bottom tab bar to switch between Chart, Txns, and Info views on mobile
- Hide the right panel column entirely on mobile; show it as a full-width section or bottom sheet
- Desktop: Keep current layout unchanged

### 2. Index Page - Stats Bar (`StatsBar.tsx`)

- On mobile: Hide "24H VOLUME" and "24H TXNS" stat pills (they take too much space)
- Search input: Make it full-width on mobile
- Market View button: Show as icon-only on mobile (just the globe icon)
- Use `flex-wrap` with proper ordering so search is always first

### 3. Index Page - Token Filters (`TokenFilters.tsx`)

- On mobile: Show only the category buttons (Trending, Top, Gainers, New Pairs) in a horizontally scrollable row
- Hide "Rank by" dropdown, "Customize" button on mobile (keep Filters + View toggle)
- Filter expanded panel: Stack inputs vertically (2 per row instead of 4)
- Time filter pills inside Trending button: Keep as-is (already compact)

### 4. Token Table - Mobile Adaptation (`TokenTable.tsx`)

- On mobile: Hide AGE, TXNS, MAKERS, LIQUIDITY, and individual change columns (5M, 1H, 6H)
- Show only: Rank, Token (name+logo), Price, 24H change, MCap
- Reduce padding from `px-3` to `px-2`
- Make TOKEN column width auto-expand to use available space

### 5. Token Grid - Mobile (`TokenGrid.tsx`)

- Change grid from `grid-cols-2` to `grid-cols-1` on very small screens (< 375px)
- Keep `grid-cols-2` for 375px+ mobile (already works OK)
- Reduce card padding from `p-5` to `p-3` on mobile

### 6. Token Info Panel - Mobile (`TokenInfoPanel.tsx`)

- When displayed full-width on mobile (from TokenDetail changes), it works well already
- Ensure social buttons don't overflow on narrow screens
- Price USD/SOL grid: Keep 2-col (works at 390px)

### 7. Trading Panel - Mobile (`TradingPanel.tsx`)

- Ensure the panel works at full width on mobile (already scrollable)
- Reduce horizontal padding slightly on mobile
- 5m stats grid: Ensure text doesn't truncate (already has `truncate` + `min-w-0`)

### 8. Trending Bar - Mobile (`TrendingBar.tsx`)

- Hide the "Trending" label text on very small screens, keep only the flame icon
- Reduce pill padding slightly

### 9. Viral Bar - Mobile (`ViralBar.tsx`)

- Sort buttons: Show only icons on mobile (hide labels)
- Cluster pills: Allow horizontal scroll (already does)
- Back button + cluster info: Stack vertically on mobile

### 10. Market Sentiment Bar - Mobile (`MarketSentimentBar.tsx`)

- Already horizontally scrollable -- OK
- Reduce Fear & Greed gauge size slightly on mobile

### 11. Global CSS (`index.css`)

- Add touch-friendly tap targets: minimum 44px for all interactive elements on mobile
- Add `safe-area-inset` padding for notched phones (iPhone X+)
- Prevent horizontal page overflow with `overflow-x: hidden` on body for mobile

### 12. Transaction List - Mobile (`TransactionList.tsx`)

- Hide AMOUNT, SOL, PRICE columns on mobile
- Show only: DATE, TYPE, USD, MAKER, TXN
- Reduce font size and padding for compact mobile display

---

## Technical Approach

All responsive changes will use:
- The existing `useIsMobile()` hook for JS-driven layout changes
- Tailwind responsive prefixes (`md:`, `lg:`) for CSS-only changes
- No new dependencies needed

### Files to modify:

| File | Changes |
|------|---------|
| `src/pages/TokenDetail.tsx` | Mobile stacked layout with tab navigation |
| `src/components/StatsBar.tsx` | Hide stats on mobile, full-width search |
| `src/components/TokenFilters.tsx` | Compact mobile filter row |
| `src/components/TokenTable.tsx` | Hide columns on mobile |
| `src/components/TokenGrid.tsx` | Adjust grid and padding |
| `src/components/TrendingBar.tsx` | Compact label on mobile |
| `src/components/TransactionList.tsx` | Hide columns on mobile |
| `src/components/ViralBar.tsx` | Icon-only sort on mobile |
| `src/components/TokenInfoPanel.tsx` | Minor mobile tweaks |
| `src/components/TradingPanel.tsx` | Minor mobile tweaks |
| `src/index.css` | Safe area insets, overflow fix |

Total: ~11 files with focused mobile responsive changes.

