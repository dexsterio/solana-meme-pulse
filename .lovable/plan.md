

# Token Info Panel - Detailed Micro-Level UI/UX Overhaul

Comparing the reference image to our current implementation pixel by pixel, here is every missing detail.

---

## A. Banner / Header Image Area (MAJOR MISSING FEATURE)

The reference shows a large hero image (the frog/lizard banner) taking up significant space at the top of the info panel. This is completely missing from our implementation.

**Details:**
- Full-width image area inside the panel, between the token name row and the social buttons
- Aspect ratio approximately 2:1 (wide banner)
- Rounded corners (rounded-lg) matching the panel
- If no image: show a gradient placeholder with the token logo centered and enlarged
- The Token interface needs a new optional `headerImage?: string` field

---

## B. Token Name / Ticker Row Layout (WRONG)

**Reference shows:**
- Token logo (large, ~40px) + token name "LIZARD" + ticker in parentheses or subtitle
- Below the name: a row of small icon badges: chain icon, exchange name, age badge, copy button
- Everything is left-aligned, not centered

**Our current implementation:**
- Token name row is split into two separate rows (name row + ticker row)
- Ticker row is CENTER-aligned (wrong, reference is left-aligned)
- Missing: age badge inline, rank badge, boost count badge with lightning icon

**Fix:**
- Merge into a single header section
- Left-align everything
- Add inline badges: age (e.g. "19h"), rank (e.g. "#2"), boosts (e.g. lightning + "300")
- Show chain > exchange below the name in a smaller muted line

---

## C. Social Buttons Row (MINOR DIFFERENCES)

**Reference shows:**
- Two buttons side by side: "Twitter" and "Website" (same width)
- A small dropdown chevron on the far right suggesting more options

**Our current:**
- Buttons exist but missing the dropdown chevron
- Layout is close but needs a chevron-down icon button at the end

**Fix:**
- Add a small ChevronDown icon button after the social buttons for "more links"

---

## D. Price Display Boxes (CLOSE BUT NEEDS POLISH)

**Reference shows:**
- Two boxes side by side: "PRICE USD" and "PRICE SOL"
- Clean borders, well-spaced
- The SOL price includes the Solana icon inline

**Our current:**
- Labels say "Price USD" and "Price" (should say "PRICE SOL")
- Otherwise similar

**Fix:**
- Change "PRICE" label to "PRICE SOL" for the second box

---

## E. Liquidity / FDV / MKT CAP Row (CLOSE)

**Reference:**
- Three boxes: LIQUIDITY (with shield icon), FDV, MKT CAP
- Clean layout

**Our current:**
- Very similar, looks correct

---

## F. Percentage Change Row (OVERFLOW BUG)

**Reference shows:**
- 5M, 1H, 6H, 24H boxes with percentages
- Large values like "+470%" shown WITHOUT decimals
- 24H box has a highlighted border (primary color)

**Our current:**
- Shows "+470.00%" which overflows the container width
- Needs smart formatting:
  - abs >= 100: no decimals ("+470%")
  - abs >= 10: 1 decimal ("+27.9%")
  - abs < 10: 2 decimals ("-3.86%")

---

## G. TXNS / Volume / Makers Section (MAJOR DIFFERENCES)

This is where the biggest differences exist between reference and our implementation.

**Reference shows:**
- Each row has 3 columns: Total | Buys | Sells
- Between the BUYS and SELLS numbers, there is a **horizontal split ratio bar** (green portion = buys, red portion = sells) spanning across both columns
- The bar gives an instant visual of buy vs sell pressure
- Clean alignment with numbers directly above/below labels

**Our current:**
- Has individual green/red bars under BUYS and SELLS separately (wrong)
- No combined ratio bar spanning the buy/sell columns
- The bars are disconnected, not showing the ratio

**Fix:**
- Replace individual bars with a single full-width ratio bar between the buy/sell columns
- Bar height: 3-4px, rounded-full
- Green portion width = buys/(buys+sells)*100%, Red portion = remainder
- Same pattern for Volume (BUY VOL / SELL VOL) and Makers (BUYERS / SELLERS)

---

## H. Buy/Sell Buttons at Bottom (MINOR)

**Reference shows:**
- Green "Buy" and Red "Sell" buttons with colored dot indicators
- Rounded corners, side by side

**Our current:**
- Uses emoji circles (wrong) - should use colored dot divs
- Otherwise similar

**Fix:**
- Replace emoji dots with actual colored div circles (w-2 h-2 rounded-full bg-profit/bg-loss)

---

## I. Watchlist / Alerts Buttons (CORRECT)

These look correct in our implementation.

---

## J. Missing: Token Description Area

The reference image hints at a description/bio area for the token below the social buttons or banner. This could be a collapsible text section.

**Fix:**
- Add optional `description?: string` to Token interface
- Show a 2-3 line truncated description below the banner, with "Read more" expand

---

## Summary of All Changes

### Files to modify:

**`src/components/TokenInfoPanel.tsx`** (major rewrite):
1. Add banner image area (new section after token name)
2. Restructure token name/ticker row - left-align, add badges (age, rank, boosts)
3. Add dropdown chevron to social buttons row
4. Fix "PRICE" label to "PRICE SOL"
5. Add `formatPercent()` helper - smart decimal shortening for percentages
6. Replace individual buy/sell bars with combined ratio bars in TXNS/Volume/Makers sections
7. Replace emoji dots in Buy/Sell buttons with proper colored divs
8. Add optional description section

**`src/data/mockTokens.ts`** (interface update):
1. Add `headerImage?: string` to Token interface
2. Add `description?: string` to Token interface

### New helper function:
```text
formatPercent(val: number): string
  abs >= 100 -> no decimals: "+470%"
  abs >= 10  -> 1 decimal:   "+27.9%"
  abs < 10   -> 2 decimals:  "-3.86%"
```

### Ratio bar component pattern:
```text
<div className="h-1 w-full flex rounded-full overflow-hidden bg-muted/20 my-1">
  <div className="bg-profit" style={{ width: `${buyPercent}%` }} />
  <div className="bg-loss" style={{ width: `${100 - buyPercent}%` }} />
</div>
```

This spans the full width of the BUYS+SELLS column area, showing the ratio visually.

### Banner image pattern:
```text
Full-width div with aspect-ratio ~2:1
  - If headerImage exists: <img> with object-cover, rounded-lg
  - If only logoUrl: centered enlarged logo on gradient background
  - If neither: gradient placeholder with token initial letter
```

### Badge pattern for ticker row:
```text
[Logo 40px] [Token Name bold] [Copy icon]
[chain dot] Solana > PumpSwap  [age badge "19h"] [rank "#2"] [boost icon + "300"]
```

---

### Technical Details

**Percentage overflow fix** applies to both `TokenInfoPanel.tsx` (lines 147-148) and potentially `TradingPanel.tsx` for consistency.

**Ratio bar** replaces lines 165-171, 182-188 in `TokenInfoPanel.tsx` - instead of separate `h-1 bg-profit/bg-loss` bars under each column, one combined bar spanning the full row width.

**Banner** inserts between lines 51 and 52 in `TokenInfoPanel.tsx`.

**Token name restructure** affects lines 31-71 in `TokenInfoPanel.tsx` - merging the two separate header rows into one cohesive left-aligned section with inline badges.

