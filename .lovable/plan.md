

# Enterprise-Level UI/UX Polish Plan

A comprehensive audit of every component across the platform, identifying bugs, inconsistencies, and areas for improvement to bring the UI to production-ready quality.

---

## 1. Main Token Table (Index page)

**Issues found:**
- Token names truncate with ellipsis ("Official Liza...", "OpenCl...") losing readability
- "pumpswap" text badges shown instead of pump.fun logo (inconsistent with Token Info Panel which already uses the logo)
- No hover tooltip on truncated names
- Table header row lacks sticky positioning -- scrolling loses context
- No empty state for zero search results
- Token rank numbers (#1-#12) use muted color -- top 5 should use gold per established convention
- Missing row alternation or subtle separation for dense data scanning
- Table columns don't resize well on narrower screens
- "TOKEN" column shows `{name} {ticker}` but reference convention is `{ticker} {name}` (inconsistent with memory)

**Fixes:**
- Make table header sticky with `sticky top-0 bg-background z-10`
- Add gold color for rank #1-5 in table (matches Token Info Panel)
- Add `title` attribute on truncated token names for hover tooltip
- Improve token name display: show ticker first, then name (per convention)
- Add "No tokens found" empty state for search with no results
- Subtle row hover highlight improvement

## 2. Trending Bar

**Issues found:**
- Trending label section (flame icon + "Trending" text) is missing from the bar -- the code removes it but the label helps users understand the section
- Marquee animation has no pause control explanation
- No separator between trending label and scrolling items
- Rankings in trending bar don't use gold for top 3 consistently

**Fixes:**
- Restore "Trending" label with flame icon on the left side
- Ensure gold styling for top 3 rank numbers in trending bar

## 3. Stats Bar

**Issues found:**
- Search input has no clear (X) button when text is entered
- "Market View" button label is confusing -- it says "Market View" when NOT in market view (should say the destination action)
- Stats bar wraps on smaller screens without graceful handling

**Fixes:**
- Add clear button (X icon) in search input when query is non-empty
- Fix the Market View toggle label logic for clarity

## 4. Token Filters Bar

**Issues found:**
- Native `<select>` dropdown for "Rank by" has unstyled OS dropdown appearance on some browsers
- Filter panel inputs (Min Volume, Min Liquidity, etc.) are non-functional -- they don't connect to any state
- Filter inputs lack proper number validation
- "Customize" and "Filters" buttons show toast "coming soon" but Filters does expand a panel

**Fixes:**
- Connect filter inputs to actual filtering state so they work
- Add number formatting/validation to filter inputs
- Style the select dropdown properly to avoid OS-native rendering issues

## 5. Token Detail Page Header

**Issues found:**
- Token name shows `{ticker} {name}` in header but panel shows `{name} ({ticker})` -- inconsistent
- Back button has no hover tooltip
- Solana icon sits alone without context

**Fixes:**
- Unify name display format across header and panel
- Add `title="Go back"` to back button

## 6. Price Chart

**Issues found:**
- "Chart placeholder" text at bottom is unprofessional for production
- Chart tooltip shows raw time index number (0-99) instead of meaningful time labels
- No crosshair cursor on chart hover
- Timeframe buttons (1s, 1m, etc.) are very small (10px) and hard to click
- No loading state when switching timeframes
- Chart area has no min-height constraint -- can collapse to unusable size

**Fixes:**
- Remove or restyle "Chart placeholder" text to be less prominent
- Generate meaningful time labels for X axis tooltip
- Increase timeframe button tap targets (min 24px height)
- Add `cursor-crosshair` to chart area
- Set min-height on chart container

## 7. Transaction List

**Issues found:**
- "Top Traders" and "Holders" tabs show nothing when clicked (empty content, no empty state)
- Transaction dates show only time, no date -- confusing for older transactions
- Table has no loading skeleton
- SOL column header shows only icon with no label -- accessibility issue
- No pagination or "load more" for large transaction lists
- Transaction amounts lack consistent formatting

**Fixes:**
- Add empty state UI for "Top Traders" and "Holders" tabs
- Add aria-label to SOL column header
- Add loading skeleton for initial load
- Improve date formatting to include relative time

## 8. Token Info Panel (Right Panel)

**Issues found:**
- Banner area: when no header image, the gradient placeholder feels generic
- Social buttons overlap banner but the overlap doesn't look clean when there's no banner image
- Description "Read more" button could be missed -- low contrast
- Price SOL shows too many decimals (8) for large SOL values
- Liquidity/FDV/MKT CAP boxes -- text can overflow on smaller panel widths
- Watchlist and Alerts buttons show toast "coming soon" -- should be disabled with tooltip instead
- Buy/Sell buttons have dot indicators that don't convey meaning
- Audit section: "Info" icon (Lucide) used next to Mintable/Freezable should be removed per memory (no info icons)
- Audit warning text has clickable "More" that does nothing
- "Claim your token page" button has no destination

**Fixes:**
- Remove `Info` icons from Audit section rows (per established convention)
- Disable "More" link in audit warning or link it properly
- Improve price SOL formatting (adaptive decimal places)
- Clean up Buy/Sell button dot indicators
- Add proper disabled state + tooltip to Watchlist/Alerts

## 9. Trading Panel

**Issues found:**
- Amount input allows negative numbers
- Preset amounts don't highlight correctly when manually typing matching value
- "Trading not yet connected" toast on main action button -- should be more prominent disabled state
- Portfolio section shows all zeros with no context for new users
- Settings row icons (Settings, AlertTriangle, DollarSign, ToggleLeft) have no labels/tooltips -- cryptic
- "Preset 1/2/3" tabs have no explanation of what they do
- Collapsible sections "Reused Image Tokens (0)" and "Similar Tokens" show hardcoded empty data
- Wallet balance shows "0" with no "Connect Wallet" CTA
- SOL balance indicator in header shows "0" -- should prompt wallet connection

**Fixes:**
- Add `min="0"` to amount input
- Add tooltips to settings row icons (Slippage, Priority Fee, Tip, MEV Protection)
- Add "Connect Wallet" prompt instead of showing "0" balance
- Add empty state messaging for Reused/Similar sections

## 10. Grid View

**Issues found:**
- Grid cards show MCap twice (once as main number, once in stats grid)
- No exchange logo on grid cards (inconsistent with table view)
- Change percentages don't show 24h in the main badge (only 5m, 1h, 6h in bottom)
- Card hover effect could be more refined
- No rank number shown on grid cards

**Fixes:**
- Replace duplicate MCap with Price as the main number
- Add rank badge to grid cards
- Show 24h change in bottom row too

## 11. Global/Cross-cutting Issues

**Issues found:**
- No favicon or app title set (shows generic)
- No loading/splash screen on initial app load
- Console error logging in NotFound page (`console.error`) -- should be `console.warn`
- No keyboard navigation support for table rows (can't arrow key through)
- No responsive mobile layout -- entire app breaks on mobile
- Scrollbar styles only work in WebKit browsers
- No error boundary wrapping the app
- Toast notifications lack consistent styling
- Color inconsistency: some profit values use `text-profit` class, others use hardcoded `#26a269`
- No `<title>` tag updates when navigating between pages
- Marquee animation in TrendingBar never pauses on mobile (battery drain)

**Fixes:**
- Add React Error Boundary at app level
- Add page title updates via `document.title` in each route
- Standardize all green/red colors to use CSS variables consistently
- Add basic mobile responsiveness (hide right panel, stack layout)
- Add Firefox scrollbar styling (`scrollbar-width: thin`)

## 12. Accessibility Issues

**Issues found:**
- Table rows lack keyboard interaction (Enter to navigate)
- Color-only indicators (green/red) with no text alternative for colorblind users
- Several buttons missing aria-labels
- Focus styles exist but are rarely visible in the dark theme
- Select dropdown lacks proper label association

**Fixes:**
- Add `tabIndex={0}` and `onKeyDown` handler for table rows
- Ensure all interactive elements have proper aria attributes
- Add `role="button"` where needed

---

## Technical Implementation Summary

| Area | Files to modify | Priority |
|------|----------------|----------|
| Table sticky header + gold ranks + name format | TokenTable.tsx | High |
| Trending bar label restoration | TrendingBar.tsx | Medium |
| Search clear button | StatsBar.tsx | Medium |
| Chart improvements | PriceChart.tsx | High |
| Transaction empty states | TransactionList.tsx | Medium |
| Info panel audit cleanup | TokenInfoPanel.tsx | High |
| Trading panel UX | TradingPanel.tsx | Medium |
| Grid view fixes | TokenGrid.tsx | Medium |
| Filter functionality | TokenFilters.tsx, Index.tsx | Medium |
| Global: error boundary, titles, mobile | App.tsx, Index.tsx, TokenDetail.tsx, index.css | High |
| Accessibility pass | All components | Medium |

Total estimated file changes: ~12 files with focused, surgical edits to address all identified issues.

