

# Remove Trend Icons and Match Reference Colors

## Overview
Two main changes: (1) remove the TrendingUp/TrendingDown arrow icons from all percentage displays, and (2) adjust the entire color palette to match the DexScreener reference image more precisely.

## Changes

### 1. Remove Trend Icons from Percentages

**File: `src/components/TokenGrid.tsx`**
- Remove `TrendingUp` and `TrendingDown` imports from lucide-react
- Remove the icon elements from the 24h change badge (line 79) -- keep only the text percentage

### 2. Color Palette Update to Match Reference

**File: `src/index.css`** -- Update CSS custom properties

Analyzing the reference image carefully, the DexScreener background is noticeably lighter and more blue-tinted than our current `#0d0e14`. The reference shows approximately:

| Element | Current HSL | New HSL | Approx Hex |
|---------|-------------|---------|------------|
| Background (body) | 228 16% 6% | 225 20% 11% | #171b26 |
| Card / Surface-1 | 228 14% 8% | 225 18% 13% | #1b1f2c |
| Secondary / Input | 228 14% 11% | 225 16% 15% | #212535 |
| Surface-2 / Popover | 228 14% 10% | 225 18% 14% | #1d2230 |
| Accent / Surface-3 | 228 14% 13% | 225 16% 17% | #262a3a |
| Border | 228 12% 14% | 225 14% 18% | #292d3d |
| Muted | 228 14% 11% | 225 16% 15% | #212535 |
| Muted foreground | 220 10% 45% | 220 12% 50% | slightly brighter labels |

These values shift the entire platform from near-black to the slightly blue-grey tone visible in the reference, matching the DexScreener aesthetic precisely.

### Files Modified
1. **`src/components/TokenGrid.tsx`** -- Remove TrendingUp/TrendingDown icons from 24h badge
2. **`src/index.css`** -- Update all color CSS custom properties to match reference

