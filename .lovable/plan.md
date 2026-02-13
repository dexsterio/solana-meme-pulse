
# Always-On New Pairs Data Pipeline

## Problem
The WebSocket connection and token state live inside the `usePumpPortalNewTokens` hook, which only runs when the "New" category is active. Switching tabs or reloading the page loses all collected tokens and starts from zero.

## Solution
Make the PumpPortal WebSocket a **global singleton** that runs from app startup, independent of which tab is active. Tokens accumulate in a shared in-memory store and are instantly available when the user navigates to "New Pairs".

## Architecture

```text
App Startup
    |
    v
PumpPortalService (singleton module)
    |-- WebSocket always connected
    |-- Accumulates tokens in memory (max 50)
    |-- Auto-reconnect on disconnect
    |
    v
usePumpPortalNewTokens (hook)
    |-- Subscribes to the singleton's token updates
    |-- Returns current tokens instantly (no empty state)
```

## Implementation Steps

### 1. Create `src/services/pumpPortalService.ts` - Global Singleton
- Move all WebSocket logic, metadata fetching, and token mapping out of the hook into a standalone module
- The module connects immediately on import (app startup)
- Maintains an internal token array (max 50) and a set of listener callbacks
- Exposes `subscribe(callback)`, `getTokens()`, and `isConnected()` functions
- Auto-reconnect with 3s delay on disconnect

### 2. Refactor `src/hooks/usePumpPortalNewTokens.ts` - Thin Hook
- Replace all WebSocket logic with a simple subscription to the singleton service
- On mount: get current tokens from `getTokens()` (instant data)
- Subscribe to updates for new tokens as they arrive
- On unmount: unsubscribe (but the service keeps running)

### 3. Update `src/App.tsx` - Initialize Service on App Start
- Import the service module at the top level so the WebSocket connects immediately when the app loads, not when the user clicks "New Pairs"

### 4. Update `src/pages/Index.tsx` - Remove Empty State Delay
- Since tokens are now always available from the singleton, the "Listening for new tokens..." state only appears briefly on the very first app load
- The loading state checks if the service has tokens, which it will after a few seconds of the app being open

## Technical Details

- **No database needed**: The WebSocket produces tokens fast enough (every few seconds) that an in-memory buffer of 50 tokens is always populated within seconds of app start
- **No stale data**: Tokens are always fresh from the live WebSocket stream
- **Rate limit safe**: Single WebSocket connection shared across the entire app, never multiple connections
- **Memory efficient**: Capped at 50 tokens, old ones dropped automatically
- **Listener pattern**: Uses a simple pub/sub pattern so multiple components could subscribe if needed

