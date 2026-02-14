
# Fix Viral Button Logic: Show Cluster Categories First

## Problem
Currently, clicking "Viral" dumps ALL viral tokens into a flat list. The user expects to see **clusters as categories** first (e.g., "Epstein Files", "Doge Moon"), and only after clicking a specific cluster should they see all tokens belonging to that cluster.

## Solution

### New Component: `ViralClusterList.tsx`
Create a dedicated view that renders when `category === 'viral'` and no cluster is selected. This replaces the flat token list with a **list of clickable cluster cards**, each showing:
- Cluster name (bold, large)
- Token count (e.g., "7 tokens")
- Top token market cap
- OG token ticker + TOP token ticker as quick info
- Time since first seen (e.g., "Started 23m ago")
- Pulsing orange dot indicator (viral)

Clicking a cluster card calls `setSelectedCluster(name)`, which then shows the token list (existing behavior with OG/TOP badges).

### Changes to `Index.tsx`
- When `isViralCategory && !isViralView`: render `<ViralClusterList>` instead of `<TokenTable>` or the empty state
- When `isViralCategory && isViralView`: keep current behavior (show tokens in selected cluster with OG/TOP badges)
- Hide the `ViralBar` cluster pills when in viral category (redundant since the main view IS the cluster list)

### Changes to `ViralBar.tsx`
- Only show when a cluster IS selected (as a header with Back button + sort controls)
- Remove the cluster pills row when in viral category mode (the cluster list replaces it)

### Responsive Design
- **Mobile**: Single-column cluster cards, compact layout
- **Tablet**: 2-column grid of cluster cards
- **Desktop**: 3-column grid of cluster cards

---

## Technical Details

### New file: `src/components/ViralClusterList.tsx`
A grid of cluster cards. Each card contains:
- Orange flame icon + cluster display name
- Token count badge
- Top token mcap + OG token name
- Time ago since first seen
- Click handler to select the cluster

### Modified files:

| File | Changes |
|------|---------|
| `src/components/ViralClusterList.tsx` | **New** - Grid of clickable cluster category cards |
| `src/pages/Index.tsx` | Render `ViralClusterList` when viral category active and no cluster selected; hide ViralBar pills in viral category |
| `src/components/ViralBar.tsx` | Accept `isViralCategory` prop; hide cluster pills row when in viral category (only show selected cluster header) |

### Flow

```text
User clicks "Viral" button
       |
       v
  ViralClusterList shows all clusters as cards
  (e.g., "Epstein Files - 7 tokens", "Doge Moon - 4 tokens")
       |
  User clicks a cluster card
       |
       v
  ViralBar shows: [Back] [Cluster Name] [Sort controls]
  TokenTable shows: all tokens in that cluster with OG/TOP badges
       |
  User clicks "Back"
       |
       v
  Returns to ViralClusterList
```
