
# Buy/Sell Trading Panel in Side Panel

## Overview
When the user clicks the "Buy" or "Sell" button on the token detail page, the right side panel switches from the info view to a trading panel that matches the reference image. Clicking a "Back" or "Token Info" link returns to the info panel.

## What the Trading Panel Includes (matching reference)
1. **5m Vol / Buys / Sells / Net Vol row** - quick stats bar at top
2. **Buy / Sell toggle tabs** - cyan active for Buy, with a dropdown arrow button
3. **Market / Limit / Adv tabs** - order type selector with wallet icons
4. **Amount input** - with preset buttons (0.01, 0.1, 1, 10) and edit icon
5. **Settings row** - slippage (20%), priority fee, tip, expiry toggles
6. **Advanced Trading Strategy checkbox**
7. **Big action button** - "Buy {TokenName}" in cyan/green
8. **Portfolio row** - Bought, Sold, Holding, PnL stats
9. **Preset tabs** - PRESET 1, PRESET 2, PRESET 3
10. **Token Info collapsible** - Top 10 H., Dev H., Snipers H., Insiders, Bundlers, LP Burned

## Changes

### 1. New file: `src/components/TradingPanel.tsx`
- A full trading panel component receiving `token` and an `onBack` callback
- Accepts `initialMode` prop ('buy' | 'sell') to set which tab is active
- All sections from the reference image implemented as static UI (no real trading logic)
- The big button says "Buy {token.name}" or "Sell {token.name}" depending on active tab
- A "Token Info" link/button at bottom to switch back to info panel

### 2. Modified: `src/components/TokenInfoPanel.tsx`
- Add `onBuyClick` and `onSellClick` callback props to the Buy/Sell buttons
- Pass these callbacks up to the parent

### 3. Modified: `src/pages/TokenDetail.tsx`
- Add state: `panelMode: 'info' | 'buy' | 'sell'`
- When `panelMode` is 'info', render `TokenInfoPanel` (current behavior)
- When 'buy' or 'sell', render `TradingPanel` with `initialMode`
- Pass `onBuyClick` / `onSellClick` to TokenInfoPanel to toggle state
- Pass `onBack` to TradingPanel to return to info view

## Technical Details
- No backend needed -- this is purely UI
- No new dependencies
- The trading panel is static/mock (no wallet integration)
- Panel width stays at 320px, same as current info panel
- Color scheme: cyan (#00e5b0 / profit color) for Buy active state, loss color for Sell
