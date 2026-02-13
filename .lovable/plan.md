

# Comprehensive Trading Panel & Token Page Polish

## Summary
Major overhaul of the TradingPanel to match the reference image exactly, plus add the Solana logo SVG as an inline icon replacing "SOL" text throughout. Also add all missing sections: Holders, CA, DA, Pro Traders, Dex Paid, Reused Image Tokens, Similar Tokens.

---

## 1. Add Solana Logo SVG to project

Copy `user-uploads://solanaLogoMark.svg` to `src/assets/solana-logo.svg` and create a reusable `SolanaIcon` component that renders it inline at any size (default 14px).

## 2. Rewrite `src/components/TradingPanel.tsx`

Complete overhaul matching the reference image top-to-bottom:

### Order Type Tabs (Market / Limit / Adv.)
- Underlined active tab style (not pill)
- Right side: wallet icon with count "1" and hamburger menu icon "0"

### Amount Input
- Label "AMOUNT" left-aligned, value right-aligned
- Solana logo icon replaces "SOL" text next to the amount
- Right side: hamburger/list icon

### Preset Buttons Row
- 0.01, 0.1, 1, 10 with bordered pills
- Edit (pencil) icon on the far right

### Settings Row
- Icons-based: slippage gear "20%", warning triangle "0.001", tip icon "0.01", checkbox "Off"
- All inline with small icons

### Advanced Trading Strategy
- Checkbox with label, same as now

### Big Action Button
- Full-width rounded pill, gradient green for Buy, red for Sell
- Text: "Buy {TokenName}" or "Sell {TokenName}"

### Portfolio Row
- 4 columns: Bought, Sold, Holding, PnL
- Each value prefixed with Solana logo icon (not "SOL" text)
- PnL shows "+0 (+0%)" format with refresh icon

### Preset Tabs
- PRESET 1, PRESET 2, PRESET 3 - underlined active

### Token Info Section (collapsible, open by default)
- Title "Token Info" with dropdown arrow and refresh icon
- 2x3 grid of stat cards:
  - Top 10 H. (person icon, percentage)
  - Dev H. (crown icon, percentage)
  - Snipers H. (target icon, percentage)
  - Insiders (lock icon, percentage)
  - Bundlers (link icon, percentage)
  - LP Burned (fire icon, percentage, green for 100%)

### Holders / Pro Traders / Dex Paid Row
- 3 columns with icons:
  - Holders: person-group icon + count
  - Pro Traders: chart icon + count
  - Dex Paid: colored badge "Unpaid" (red) or "Paid" (green)

### CA (Contract Address) Row
- Label "CA:" + truncated address + copy/external-link icon

### DA (Dev Address) Row
- Label "DA:" + truncated address + search/external-link icons

### Exchange Info Row
- Exchange logo + name (e.g., "Changenow")
- Solana logo + price in SOL
- Clock icon + age

### Reused Image Tokens
- Collapsible section "Reused Image Tokens (0)" with arrow

### Similar Tokens
- Collapsible section "Similar Tokens" with arrow

## 3. Solana Logo Replacement Throughout

Replace "SOL" text with inline Solana logo icon in:
- TradingPanel: amount input, portfolio values (Bought, Sold, Holding)
- TokenInfoPanel: Price SOL display
- TransactionList: SOL column values
- Token detail header: replace "SOL" badge with Solana logo

## 4. Files Changed

| File | Action |
|------|--------|
| `src/assets/solana-logo.svg` | Copy from upload |
| `src/components/SolanaIcon.tsx` | New - reusable inline SVG component |
| `src/components/TradingPanel.tsx` | Full rewrite matching reference |
| `src/components/TokenInfoPanel.tsx` | Replace "SOL" text with SolanaIcon |
| `src/components/TransactionList.tsx` | Replace SOL column text with SolanaIcon |
| `src/pages/TokenDetail.tsx` | Replace SOL badge with SolanaIcon in header |

## Technical Details
- No new dependencies needed
- Solana SVG is ~1KB, inlined as React component for crisp rendering at any size
- All data in new sections is mock/placeholder (no API calls needed)
- Token address truncation: first 16 chars + "..." + last 4 chars

