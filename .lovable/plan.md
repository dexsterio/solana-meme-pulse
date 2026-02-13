
# Comprehensive UX and Information Improvements

## Problem
The platform lacks explanatory context for users. Key concepts like "Viral Memes", "OG", "TOP", filter categories, and market data are not explained anywhere, making the platform confusing for new users.

## Solution Overview
Add tooltips, section headers with descriptions, onboarding hints, and contextual information throughout the entire platform so users always understand what they're looking at.

---

## Changes

### 1. Reusable InfoTooltip Component
Create a new `src/components/InfoTooltip.tsx` component that wraps any label with a hover tooltip (using Radix Tooltip). Shows a small `(i)` icon that reveals an explanation on hover.

### 2. ViralBar -- Explain "Viral Memes"
- Add a short description text below/beside the "Viral Memes" label: *"Tokens with the same name appearing 3+ times in the last hour -- a sign of viral meme activity"*
- When a cluster is selected, add explanatory labels:
  - Next to "OG" badge: tooltip explaining *"The first token created with this name"*
  - Next to "TOP" badge: tooltip explaining *"The token with the highest market cap in this cluster"*
  - Add a subtitle under the cluster header: *"These tokens share the same meme name. The OG was created first, TOP has the highest market cap."*

### 3. StatsBar -- Label Explanations
- Add tooltips to "24H VOLUME" explaining *"Total trading volume across all listed tokens in the last 24 hours"*
- Add tooltip to "24H TXNS" explaining *"Total number of buy/sell transactions in the last 24 hours"*
- Add tooltip to "Market View" button explaining *"Switch to a broader crypto market overview with BTC, ETH and top coins"*

### 4. TokenFilters -- Category Explanations
- Add tooltips to each category button:
  - Trending: *"Tokens with the most activity and attention right now"*
  - Top: *"Highest ranked tokens by market cap and volume"*
  - Gainers: *"Tokens with the biggest price increases"*
  - New Pairs: *"Freshly created tokens streaming in real-time via WebSocket"*
- Add tooltips to Rank By options explaining each sorting method

### 5. TrendingBar -- Small Label
- Add a tooltip to "Trending" label: *"Top 10 tokens by 24h price change, scrolling live"*

### 6. TokenTable -- Column Header Tooltips
- Add tooltips to column headers:
  - TXNS: *"Number of buy and sell transactions"*
  - MAKERS: *"Unique wallets that traded this token"*
  - LIQUIDITY: *"Available liquidity in the trading pool"*
  - MCAP: *"Market capitalization = price x total supply"*
  - AGE: *"Time since the token was first created"*
  - VOLUME: *"Total USD value traded"*
- Add tooltips to the STATUS column values (First Created, Highest MCap, Clone)

### 7. MarketSentimentBar -- Explanations
- Add tooltips to each market indicator:
  - Market Cap: *"Total value of all cryptocurrencies combined"*
  - BTC Dom: *"Bitcoin's share of the total crypto market cap"*
  - ETH Gas: *"Current Ethereum network transaction fee"*
  - Season: *"When BTC dominance is low, altcoins tend to outperform (Alt Season)"*
  - Fear and Greed: *"Market sentiment index from 0 (extreme fear) to 100 (extreme greed)"*

### 8. TokenGrid -- Info Labels
- Add small labels/tooltips for Vol, MCap, Liq, Age abbreviations so users understand what each stat means on hover.

### 9. Welcome/Empty State Enhancement
- When the token list is empty or loading for the first time, show a brief platform description: *"Solana Meme Token Scanner -- Track trending tokens, spot viral memes, and discover new pairs in real-time."*

---

## Technical Details

- **InfoTooltip component**: Uses `@radix-ui/react-tooltip` (already installed). Renders an `Info` icon (from lucide) with configurable tooltip text. Compact styling matching the platform theme.
- **Files to create**: `src/components/InfoTooltip.tsx`
- **Files to modify**:
  - `src/components/ViralBar.tsx` -- add descriptions and tooltips for viral concepts
  - `src/components/StatsBar.tsx` -- add tooltips to stat labels
  - `src/components/TokenFilters.tsx` -- add tooltips to category buttons and rank options
  - `src/components/TrendingBar.tsx` -- add tooltip to trending label
  - `src/components/TokenTable.tsx` -- add tooltips to column headers, OG/TOP badges, and status labels
  - `src/components/TokenGrid.tsx` -- add tooltips to abbreviated stat labels
  - `src/components/MarketSentimentBar.tsx` -- add tooltips to all market indicators
  - `src/pages/Index.tsx` -- add welcome subtitle text
- **No new dependencies needed** -- all using existing Radix Tooltip
- **Design approach**: Small `(i)` icons in `text-muted-foreground/50` that don't clutter the UI but are discoverable on hover. Tooltip max-width ~250px with `text-[12px]` body text.
