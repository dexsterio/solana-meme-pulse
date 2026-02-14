

# DexScreener Mobile Reference Implementation

Pixel-perfect implementation of the mobile UI based on the three reference screenshots provided.

---

## Changes Required (Reference vs Current)

### 1. Index Page - Token List Mobile Layout (TokenTable.tsx) - CRITICAL

**Reference shows**: Each token is a two-line card row, NOT a traditional table on mobile:
- **Line 1**: Exchange icon (small, e.g. "swap" logo), Token logo (round), Ticker (bold white), Age badge (green leaf + "8h"), Lightning+boost number (green "500"), then right-aligned: Price, 1H %, 24H %
- **Line 2**: Small exchange icon, Token name (muted gray), then right-aligned small pills: "LIQ $39K", "VOL $1.1M", "MCAP $212K"

**Current**: Standard table rows with limited columns on mobile - missing age, boosts, exchange icons, and the LIQ/VOL/MCAP sub-row.

**Fix**: On mobile, render a completely different layout - card-style rows with two lines per token matching the reference exactly. Keep the table layout for desktop.

### 2. Index Page - Stats Boxes on Mobile (StatsBar.tsx) - HIGH

**Reference shows**: Two side-by-side boxes "24H VOLUME $17.49B" and "24H TXNS 41,268,759" ARE visible on mobile, displayed prominently below the filter bar.

**Current**: These stats are hidden on mobile (`!isMobile`).

**Fix**: Show the stats boxes on mobile. Make them a full-width two-column grid below the search bar.

### 3. Token Detail - Bottom Tab Bar (TokenDetail.tsx) - CRITICAL

**Reference shows**: 4 tabs with DIFFERENT labels and icons:
- **Info** (i icon) - Shows the TokenInfoPanel
- **Chart+Txns** (monitor icon) - Shows chart AND transaction list combined vertically
- **Chart** (chart icon) - Shows chart only
- **Txns** (list icon) - Shows transaction list only

**Current**: Tabs are Chart/Txns/Info/Trade - wrong structure entirely.

**Fix**: Change mobile tabs to match reference: Info, Chart+Txns, Chart, Txns. The "Chart+Txns" tab shows both chart (top ~55%) and transaction list (bottom ~45%) in a vertical split. Remove the separate "Trade" tab. Default to "Info" tab (matching the reference where Info is first).

### 4. Token Detail - Info Tab Content (TokenInfoPanel.tsx) - HIGH

**Reference shows**: The Info panel on mobile includes a single "Trade O/SOL" button (with arrows icon) instead of separate Buy/Sell buttons. The Watchlist and Alerts buttons are shown above it.

**Current**: Separate Buy and Sell buttons.

**Fix**: On mobile, replace the Buy/Sell buttons with a single full-width "Trade {ticker}/SOL" button that navigates to the trading panel. Keep Buy/Sell on desktop.

### 5. Token Detail - Transaction List Mobile Columns (TransactionList.tsx) - MEDIUM

**Reference shows**: Transaction table on mobile has columns: TXN (with buy/sell color indicator as a circle "B"), USD, Price (with SOL icon), MAKER (with filter icon). The "Txns" tab header shows a dropdown arrow.

**Current**: DATE, TYPE, USD, PRICE, MAKER, TXN columns.

**Fix**: Match reference columns: Show a colored circle indicator (B/S) as first column, then USD, Price (with SOL icon in header), MAKER. Rename/restructure to match.

### 6. Index Page - Filter Bar Mobile (TokenFilters.tsx) - MEDIUM

**Reference shows**: "Trending 6H" as a single green pill with dropdown chevron, then "New" and "Top" as separate pills. No "Gainers" visible. The time filter is embedded IN the trending pill text (not as separate sub-buttons).

**Current**: Trending pill with separate embedded time toggle buttons, plus Top, Gain, New buttons.

**Fix**: On mobile, show "Trending {timeFilter}" as a single pill with a dropdown chevron (tapping opens time selection). Show "New" and "Top" pills. Keep current desktop layout.

---

## Technical Implementation

### Files to modify:

| File | Priority | Changes |
|------|----------|---------|
| `src/components/TokenTable.tsx` | Critical | Complete mobile card-row layout with 2-line tokens, age, boosts, LIQ/VOL/MCAP sub-row |
| `src/pages/TokenDetail.tsx` | Critical | New tab structure: Info, Chart+Txns, Chart, Txns. Default to Info. Combined chart+txns view |
| `src/components/StatsBar.tsx` | High | Show 24H VOLUME and 24H TXNS boxes on mobile |
| `src/components/TokenInfoPanel.tsx` | High | Single "Trade {ticker}/SOL" button on mobile instead of Buy/Sell |
| `src/components/TransactionList.tsx` | Medium | Match reference columns: colored indicator, USD, Price (SOL), MAKER |
| `src/components/TokenFilters.tsx` | Medium | Compact "Trending 6H" single pill on mobile |

### Key technical decisions:
- Use `useIsMobile()` hook for all conditional rendering
- Mobile token rows will be `div`-based cards instead of `<tr>` elements for proper two-line layout
- Chart+Txns combined view uses flex column with chart at ~55vh and transactions filling remaining space
- All changes are mobile-only; desktop layout remains completely unchanged

