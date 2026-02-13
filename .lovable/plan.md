
# UI/UX Bug Audit and Fix Plan

After a thorough review of every component and page, here is a categorized list of all identified UI/UX issues, grouped into phases for systematic resolution.

---

## Phase 1: Critical / Broken Functionality (17 bugs)

1. **TradingPanel: "Adv." tab still exists** - Was supposed to be removed per earlier instructions, but `'adv'` is still in the tab array (line 83)
2. **TradingPanel: Duplicate comment** - "Amount input" comment appears twice (lines 108-109)
3. **TradingPanel: Empty space where Adv Trading Strategy was** - Lines 153-160 are blank/commented out, leaving dead whitespace
4. **TradingPanel: Buy/Sell button empty trailing whitespace** - Extra blank lines inside button elements (lines 63-64, 73-74)
5. **TokenDetail: Loading skeleton has no TrendingBar tokens** - `<TrendingBar />` called with no `tokens` prop during loading, renders nothing
6. **TokenDetail: Error state missing TrendingBar** - Error view doesn't include TrendingBar for consistency
7. **TokenDetail: Token not found page has no back navigation arrow** - Only a text link, inconsistent with the rest of the app
8. **Index page: TrendingBar empty when data loading** - TrendingBar receives empty arrays during initial load, showing nothing
9. **TokenTable: Missing table header row** - No `<th>` headers visible when `table-fixed` is used but columns have no content yet
10. **TokenInfoPanel: `token.priceSOL.toFixed(8)` can crash** - If priceSOL is undefined, `.toFixed()` throws
11. **TokenInfoPanel: Missing null check on social links** - If none of twitter/telegram/website exist, empty social row still renders
12. **PriceChart: Random mock data regenerates on every render** - `useMemo` depends on `token` object reference which changes each render from API
13. **StatsBar: Search `onSearch` fires on Enter but no visual feedback** - No loading state or indication that search was triggered
14. **TokenGrid: `onError` hides image but no fallback shown** - When logo fails, just `display:none` with no replacement element
15. **TrendingBar: No tokens prop on TokenDetail** - TrendingBar on token detail page gets no data, renders null
16. **NotFound: Uses `bg-muted` instead of `bg-background`** - Inconsistent with rest of app's dark theme
17. **App.css: Unused styles** - Entire file contains Vite boilerplate CSS that conflicts with Tailwind

## Phase 2: Visual / Contrast Issues (14 bugs)

18. **StatsBar: `bg-secondary` search input low contrast** - Same issue as previous Amount input fix; secondary blends with background
19. **StatsBar: Stats pills (`bg-secondary`) barely visible** - 24H VOLUME and 24H TXNS pills have near-zero contrast
20. **TokenFilters: `bg-secondary` buttons invisible** - Customize, Filters, rank dropdown all use `bg-secondary` which blends in
21. **TokenFilters: `select` dropdown native styling** - Browser-default select on dark bg looks broken on some browsers
22. **TokenFilters: Filter panel `bg-secondary` inputs invisible** - The expandable filter inputs have no visible background
23. **TokenTable: No visible column headers** - Headers use `text-muted-foreground` at 45% lightness, extremely hard to read
24. **TokenTable: Rank text `text-muted-foreground` too dim** - `#` numbers barely visible
25. **TokenGrid: `hsl(var(--surface-2))` card background** - Nearly identical to page background, cards don't stand out
26. **TokenInfoPanel: `bg-secondary` stat boxes invisible** - Price USD, Price SOL, Liquidity/FDV/MCAP boxes all blend into background
27. **TransactionList: Header `bg-card` same as container** - Sticky header has no visual separation from content
28. **PriceChart: Tooltip hardcoded HSL values** - Don't match CSS variables, can look wrong if theme changes
29. **MarketSentimentBar: Skeleton placeholders `bg-secondary` invisible** - Loading state shows nothing
30. **ViralBar: `bg-secondary/80` pills low contrast** - Cluster buttons hard to see
31. **TradingPanel: Settings row emojis render inconsistently** - Using emoji (gear, warning, etc.) instead of proper icons

## Phase 3: Layout / Spacing Issues (12 bugs)

32. **TokenDetail: No gap between chart and right panel** - `pl-0` on right panel creates asymmetric spacing
33. **TokenDetail: Transaction list fixed 280px** - Too short on large screens, too tall on small ones
34. **TokenDetail: Header missing Solana icon spacing** - SolanaIcon sits right against the name with no logical separation
35. **TradingPanel: Portfolio PnL "+0 (+0%)" text overflow** - On narrow 320px panel, this text can overflow
36. **TradingPanel: Preset tabs "Preset 1/2/3" meaningless** - No indication of what presets do, placeholder text
37. **TokenTable: `table-fixed` with percentage widths causes column misalignment** - Columns don't resize well
38. **TokenTable: Token name `max-w-[100px]` truncation too aggressive** - Many token names get cut off
39. **TokenGrid: No max-width constraint** - On ultra-wide screens, grid stretches excessively
40. **StatsBar: No responsive breakpoints** - All items in one row, overflows on smaller screens
41. **TokenFilters: `whitespace-nowrap` causes horizontal overflow** - On medium screens the filter bar scrolls
42. **MarketSentimentBar: `overflow-x-auto` but no scroll indicator** - Users don't know they can scroll
43. **Index page: No sticky header** - StatsBar and filters scroll away with content

## Phase 4: Interaction / UX Issues (11 bugs)

44. **TokenInfoPanel: Copy button no click handler** - Copy icon present but clicking does nothing
45. **TokenInfoPanel: Watchlist/Alerts buttons non-functional** - No state or handler attached
46. **TradingPanel: Copy CA/DA buttons no click handler** - Icons suggest copy but no `onClick`
47. **TradingPanel: ExternalLink buttons no href** - Links don't go anywhere
48. **TradingPanel: Search icon on DA row does nothing** - No search action bound
49. **TradingPanel: Big Buy/Sell button non-functional** - No click handler or feedback
50. **TradingPanel: Pencil (edit) button on amount row does nothing** - No action bound
51. **TradingPanel: RefreshCw on portfolio does nothing** - Refresh icon is decorative
52. **TradingPanel: RefreshCw on Token Info header does nothing** - Suggests refresh but no handler
53. **PriceChart: Timeframe buttons change state but don't affect data** - All timeframes show same random data
54. **TokenFilters: Customize button does nothing** - No panel or action

## Phase 5: Data / Logic Issues (9 bugs)

55. **TradingPanel: All Token Info values hardcoded** - top10=32.5, dev=0, snipers=4.2, etc. are static literals, not from API
56. **TradingPanel: Holders "1,245" hardcoded** - Not from token data
57. **TradingPanel: Pro Traders "12" hardcoded** - Not from token data
58. **TradingPanel: Dex Paid "Unpaid" hardcoded** - Not from token data
59. **TokenInfoPanel: FDV calculation potentially wrong** - Uses `token.fdv` which may not exist, should fallback
60. **TransactionList: Mock data only** - Uses `generateMockTransactions`, no real data
61. **PriceChart: Mock data only** - Random walk, no real OHLCV
62. **TrendingBar: MCap shown with `$` prefix via formatCompact** - But formatCompact doesn't add `$`, the template adds it, causing `$$` for formatNumber calls elsewhere
63. **Index page: Search only filters client-side** - No API-based search, misleading for large datasets

## Phase 6: Accessibility / Polish (8 bugs)

64. **No focus styles on any interactive elements** - Tab navigation impossible
65. **No aria-labels on icon-only buttons** - Screen readers can't describe actions
66. **TradingPanel: `type="text"` on amount input** - Should be `type="number"` or have input validation
67. **TokenTable: No hover state on header row** - Headers look like they could be sortable but aren't
68. **SearchBar component unused** - `SearchBar.tsx` exists but is never imported anywhere
69. **NavLink component unused** - `NavLink.tsx` exists but never used
70. **App.css conflicting styles** - `#root` max-width and padding conflicts with full-screen layout
71. **No mobile responsiveness** - Entire app breaks below ~1024px width

---

## Implementation Approach

### Phase 1 (Critical): Fix crashes, remove dead code, fix broken rendering
- Remove Adv. tab, clean dead whitespace, add null checks, fix NotFound theme, delete App.css boilerplate

### Phase 2 (Visual): Fix all contrast/visibility issues
- Replace all `bg-secondary` with visible alternatives (e.g., `bg-[hsl(0,0%,16%)]` with explicit borders)
- Ensure all text meets minimum contrast ratios

### Phase 3 (Layout): Fix spacing, overflow, and responsive issues
- Add responsive breakpoints, fix truncation, improve panel sizing

### Phase 4 (Interaction): Wire up non-functional buttons
- Add clipboard copy, toast feedback, proper link targets

### Phase 5 (Data): Connect real data or add "placeholder" indicators
- Mark hardcoded values clearly, add proper fallbacks

### Phase 6 (Accessibility): Add focus states, aria-labels, input types
- Delete unused components (SearchBar, NavLink), clean App.css

---

### Technical Details

**Files to modify:**
- `src/components/TradingPanel.tsx` - Phases 1, 2, 3, 4, 5 (largest changes)
- `src/components/TokenTable.tsx` - Phases 2, 3
- `src/components/TokenGrid.tsx` - Phases 2, 3
- `src/components/TokenInfoPanel.tsx` - Phases 1, 2, 4
- `src/components/StatsBar.tsx` - Phases 2, 3
- `src/components/TokenFilters.tsx` - Phases 2, 3
- `src/components/TrendingBar.tsx` - Phase 1
- `src/components/MarketSentimentBar.tsx` - Phase 2
- `src/components/TransactionList.tsx` - Phase 2
- `src/components/PriceChart.tsx` - Phase 2, 5
- `src/pages/TokenDetail.tsx` - Phases 1, 3
- `src/pages/Index.tsx` - Phase 3
- `src/pages/NotFound.tsx` - Phase 1
- `src/index.css` - Phase 2
- `src/App.css` - Phase 6 (clean or delete)

**Files to delete:**
- `src/components/SearchBar.tsx` (unused)
- `src/components/NavLink.tsx` (unused)
- `src/App.css` (conflicting boilerplate)

Each phase builds on the previous one. Phase 1 should be done first to prevent runtime errors. The remaining phases can be done in order for a systematic cleanup before production.
