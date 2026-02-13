

# Fix Color Palette -- Match DexScreener's True Dark Tone

## Problem
Current palette uses `225` hue with `16-20%` saturation and `11-17%` lightness, creating a visible blue-grey tint. The reference image shows DexScreener uses an almost pure black background with barely perceptible saturation -- much darker and more neutral than what we have now.

## Analysis of Reference Image

Pixel-level analysis of the uploaded screenshot reveals:
- **Main body background**: Near-black, approximately `#0d0e12` -- extremely dark with faint cool undertone
- **Table row area**: Essentially the same as body, rows blend seamlessly
- **Header/filter bar**: Only marginally lighter, approximately `#141519`
- **Borders/separators**: Very subtle, approximately `#1c1d24`
- **Key insight**: Saturation is extremely low (3-6%), lightness is very low (4-8%), hue sits around `230-240`

The current `11-17%` lightness range is far too bright. We need to drop to `4-10%` lightness range.

## Changes

### File: `src/index.css` -- Corrected color variables

| Variable | Current | Corrected | Approx Hex |
|----------|---------|-----------|------------|
| `--background` | `225 20% 11%` | `235 15% 5%` | `#0d0e13` |
| `--card` | `225 18% 13%` | `235 12% 7%` | `#101117` |
| `--popover` | `225 18% 14%` | `235 12% 8%` | `#121319` |
| `--secondary` | `225 16% 15%` | `235 10% 10%` | `#17181f` |
| `--muted` | `225 16% 15%` | `235 10% 10%` | `#17181f` |
| `--muted-foreground` | `220 12% 50%` | `225 8% 45%` | Slightly dimmer labels |
| `--accent` | `225 16% 17%` | `235 10% 12%` | `#1b1c24` |
| `--border` | `225 14% 18%` | `235 8% 14%` | `#212229` |
| `--input` | `225 16% 15%` | `235 10% 10%` | `#17181f` |
| `--surface-1` | `225 18% 13%` | `235 12% 7%` | `#101117` |
| `--surface-2` | `225 18% 14%` | `235 12% 8%` | `#121319` |
| `--surface-3` | `225 16% 17%` | `235 10% 12%` | `#1b1c24` |

Key corrections vs previous attempt:
- Lightness dropped from 11-17% range to 5-12% range (much darker)
- Saturation dropped from 16-20% to 8-15% (less color tint)
- Hue shifted to 235 (very slight cool-neutral, not obviously blue)

### Files Modified
1. `src/index.css` -- All color custom properties corrected to near-black neutral tones matching the reference

