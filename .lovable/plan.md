

# Pixel-Perfect DexScreener Clone - Main Page Overhaul

## Problem
The current main page differs from the reference image in many details: layout of stats bar, filter bar design, token row formatting, font sizes, colors, icons, and text styles.

## Detailed Differences Found

### 1. Stats Bar (StatsBar.tsx)
- **Reference**: Two separate bordered/outlined rectangular boxes. Left box: "24H VOLUME: $19.070B" with large bold white value. Right box: "24H TXNS: 44,002,850" with large bold white value.
- **Current**: Simple inline text in a single row, small font.
- **Fix**: Redesign as two bordered containers with large bold values.

### 2. Filter/Navigation Bar (TokenFilters.tsx)
- **Reference**: 
  - Green pill "Last 24 hours" with clock icon
  - Orange/red pill "Trending" with fire icon + embedded time toggles (5M 1H 6H 24H) 
  - Individual buttons: "Top" (with trophy icon), "Gainers" (with chart icon), "New Pairs" (with sparkle icon), "Profile" (with user icon), "Boosted" (with rocket icon), "Ads" (with megaphone icon)
  - Right side: "Rank by: Trending 6H" dropdown, "Filters" button, "Customize" button (with gear icon)
- **Current**: Simple toggle buttons, missing several filter tabs, different styling.
- **Fix**: Complete redesign of filter bar with proper pills, icons, and all buttons.

### 3. Search Bar (SearchBar.tsx)
- **Reference**: Search bar is integrated into the stats area, not a separate row. Actually it appears the search is part of the stats bar row.
- **Current**: Separate row below stats.
- **Fix**: Merge search into stats bar or remove the separate search row. In the reference, the volume box itself contains the search area.

### 4. Table Header (TokenTable.tsx)
- **Reference**: Italic uppercase muted text headers. PRICE has an info circle icon. No border-bottom visible, just text.
- **Current**: Regular font-medium uppercase text.
- **Fix**: Change to italic style headers, add info icon to PRICE.

### 5. Token Row Format (TokenTable.tsx)
- **Reference row format**: `#1  [icon][icon][icon]  SHUTDOWN /SOL  SHUT IT DOWN  ⚡500`
  - Rank with # prefix in muted color
  - 2-3 small square icons (chain icon, DEX icon, etc.) between rank and name
  - Token ticker in BOLD white caps
  - "/SOL" in muted gray
  - Full token name in lighter gray
  - Boost with lightning icon ⚡ and number in green
- **Current format**: `1  [emoji]  PEPE /PEPE  SOL  ⚡48`
  - Missing # prefix
  - Using emoji instead of small icons
  - Different text arrangement

- **Fix**: 
  - Add # prefix to rank
  - Add placeholder chain/DEX icons (small colored squares)
  - Reorder: ticker BOLD, /SOL muted, full name muted, boost green
  - Token name should be bold and larger

### 6. Number Formatting
- **Reference**: TXNS shows "44,430" (comma-separated), Volume shows "$2.0M", MAKERS shows "9,999"
- **Current**: TXNS shows "15.4K" (compact), Volume with $, MAKERS shows "3.2K"
- **Fix**: TXNS and MAKERS should use comma-separated full numbers, not compact. Volume and Liquidity/MCAP can use compact ($2.0M format).

### 7. Change Percentages
- **Reference**: Shows values like "0.31%", "1.16%", "0.17%", "1,446%" without + sign for positive values
- **Current**: Shows "+2.5%", "+8.3%" with + sign
- **Fix**: Remove + sign, just show number with % and color (green/red)

### 8. Colors & Typography
- **Reference**: Background appears to be around #0d0e12 or similar very dark blue-black. Profit green is a brighter green. Loss red is a vivid red. Font appears to be Inter or similar sans-serif at ~12px for table rows.
- **Current**: Slightly lighter background, colors are close but need fine-tuning.
- **Fix**: Adjust CSS variables for exact color match.

### 9. Row Styling
- **Reference**: Very subtle row borders, hover state with slightly lighter background. Rows are compact with less vertical padding.
- **Current**: Similar but padding may be slightly different.
- **Fix**: Reduce row padding, make borders more subtle.

## Technical Changes

### File: `src/index.css`
- Adjust CSS variables for more accurate DexScreener colors
- Background darker: approximately `222 15% 7%`
- Profit green: approximately `145 80% 42%`
- Loss red: approximately `0 80% 55%`

### File: `src/components/StatsBar.tsx`
- Complete redesign with two bordered boxes
- Left box: "24H VOLUME:" label + large bold "$19.070B" value
- Right box: "24H TXNS:" label + large bold "44,002,850" value
- Values in large, bold, white text

### File: `src/components/SearchBar.tsx`
- Remove as separate component or integrate into stats bar
- In reference, the search seems embedded in the left stats box

### File: `src/components/TokenFilters.tsx`
- Add green "Last 24 hours" pill with clock icon
- Change "Trending" to an orange/red pill with fire icon
- Embed time toggles (5M, 1H, 6H, 24H) inside the Trending pill
- Add icon-labeled buttons: Top, Gainers, New Pairs, Profile, Boosted, Ads
- Right side: "Rank by:" with down arrow + "Trending 6H", Filters button, Customize button with gear icon

### File: `src/components/TokenTable.tsx`
- Header: italic text, add info icon (circle-i) next to PRICE
- Rank cell: show "#1" format instead of just "1"
- Token cell restructured:
  - Small colored square icons (2-3 placeholder DEX/chain icons)
  - Ticker in bold white uppercase
  - "/SOL" in muted
  - Full name in lighter muted
  - Boost with green lightning + number
- TXNS and MAKERS: comma-separated full numbers (not compact K/M)
- Change cells: remove + sign, just percentage with color
- Reduce vertical padding for compact rows

### File: `src/data/mockTokens.ts`
- Add a `formatWithCommas` utility for TXNS/MAKERS display
- Update `formatPrice` to match reference formatting (e.g., "$0.0₄5554" subscript notation for very small numbers)

### File: `src/pages/Index.tsx`
- Adjust layout to remove separate SearchBar row
- Integrate search into StatsBar

