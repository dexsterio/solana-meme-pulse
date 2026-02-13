
# Upgrade Percentage Typography Across Entire Project

## Overview
Upgrade all percentage number styling across every component in the project to use bold, tight-tracked, professional typography -- consistent everywhere, no thin or generic-looking numbers.

## Components to Update

### 1. `src/components/TokenGrid.tsx` (Grid Cards)
**24h change badge (lines 73-81):**
- Font: `text-[11px] font-medium` --> `text-[13px] font-bold tracking-tight`
- Padding: `px-2 py-0.5` --> `px-2.5 py-1`
- Icon: `w-3 h-3` --> `w-3.5 h-3.5`
- Background opacity: `0.12` --> `0.18`

**Timeframe pills 5m/1h/6h (lines 100-114):**
- Labels: `text-[10px]` --> `text-[11px] font-semibold uppercase tracking-wider`
- Values: `text-[11px] font-medium` --> `text-[13px] font-bold tracking-tight`
- Padding: `px-1.5 py-0.5` --> `px-2 py-1`
- Background opacity: `0.1` --> `0.15`
- Shape: `rounded-md` --> `rounded-lg`

### 2. `src/components/TokenTable.tsx` (Table View)
**ChangeCell component (lines 36-43):**
- Font: `text-[13px]` --> `text-[13px] font-bold tracking-tight`
- Add `+` prefix for positive values (currently missing)

### 3. `src/components/TrendingBar.tsx` (Trending Strip)
**Percentage span (line 36-38):**
- Font: `text-[11px]` (no weight) --> `text-[12px] font-bold tracking-tight`

### 4. `src/components/TokenInfoPanel.tsx` (Token Detail Page)
**Price change boxes (line 123):**
- Remove `font-mono` (violates project style rule -- Inter only)
- Font: `text-xs font-bold font-mono` --> `text-sm font-bold tracking-tight`

## Consistency Rules Applied
- All percentage numbers: `font-bold tracking-tight`
- No `font-mono` anywhere (project rule: Inter only)
- Positive values always prefixed with `+`
- Colored backgrounds with sufficient opacity for readability
- Minimum `text-[12px]` for any percentage display
