

# Pixel-Perfect Trading Panel Polish

## Summary
Comprehensive micro-detail overhaul of `TradingPanel.tsx` to match the reference image exactly. Every font size, icon, color, and spacing will be corrected.

---

## Detailed Changes (all in `src/components/TradingPanel.tsx`)

### 1. Font Sizes - Scale Up Everything
The current panel uses `text-[10px]` and `text-xs` (12px) everywhere. The reference uses noticeably larger text:
- Order type tabs (Market, Limit, Adv.): `text-sm` (14px), not `text-xs`
- AMOUNT label and value: `text-sm` for label, `text-base` for value
- Preset buttons (0.01, 0.1, 1, 10): `text-sm`
- Settings row icons/values: `text-xs` (currently `text-[10px]`)
- "Advanced Trading Strategy" label: `text-sm`
- Buy button text: `text-base font-bold`
- Portfolio labels (Bought, Sold, etc.): `text-xs`
- Portfolio values: `text-sm font-bold`
- Token Info title: `text-sm font-semibold`
- Token Info stat values: `text-sm font-bold`
- Token Info stat labels: `text-xs`
- Holders/Pro Traders/Dex Paid values: `text-base font-bold`
- Holders/Pro Traders/Dex Paid labels: `text-xs`
- CA/DA text: `text-sm` for addresses (currently `text-[10px]`)
- Exchange row: `text-sm`

### 2. Token Info Stat Colors
In the reference, the percentage values are **cyan/teal colored** (matching the primary color), not white:
- Top 10 H., Dev H., Snipers H., Insiders, Bundlers values: `text-primary` (cyan)
- LP Burned 100%: `text-profit` (green) - already correct
- Remove background boxes from the stat cards - reference shows them without heavy borders

### 3. Token Info Grid Layout
Reference shows: icon + colored value on one line, label text below in muted gray. Currently we have icon + label on top, value below. Flip the layout:
```
  [icon] 0%        [icon] 0%        [icon] 0%
  Top 10 H.        Dev H.           Snipers H.
```

### 4. CA Row - Larger & Specific Icon
- Use a clipboard/document icon (from Lucide: `ClipboardList` or `FileText`) before "CA:"
- Address text: `text-sm font-mono` (bigger than current `text-[10px]`)
- Show more of the address: `22hE2VcTPDAkGCm...pump` format
- External link icon on the right
- Remove the secondary background box - reference shows a cleaner borderless row with just a subtle separator

### 5. DA Row - Specific Icons
- Use a wallet/user icon before "DA:"
- Address text: `text-sm font-mono`
- Three icons on the right: search (magnifying glass), external link, and a Q icon
- Same larger sizing as CA

### 6. Holders / Pro Traders / Dex Paid Row
Reference shows these WITHOUT background cards - they're in a clean row with larger text:
- Icon + large number on one line
- Label below in muted text
- "Unpaid" in red with a circle icon prefix
- Remove `bg-secondary` and `border` from these items

### 7. Portfolio Row - Solana Hamburger Icon
Reference shows a triple-bar icon (hamburger/list `≡`) before each value, colored:
- Bought: `≡ 0` (white)
- Sold: `≡ 0` (red/loss color)
- Holding: `≡ 0` (white)
- PnL: `≡ +0 (+0%)` with refresh icon
- Use `Menu` or `AlignJustify` Lucide icon as the `≡` symbol, or just use the text character `≡`

### 8. Exchange Row
- Show exchange logo/icon + name ("Changenow")
- Solana icon + price in SOL (`≡ 2.09`)
- Clock icon + age (`1h`)
- Slightly larger text

### 9. Reused Image Tokens & Similar Tokens
- Use `>` chevron right instead of up/down
- Text should be `text-sm`

---

## Files Modified
| File | Changes |
|------|---------|
| `src/components/TradingPanel.tsx` | Full rewrite with corrected sizes, colors, icons, and layout |

## Technical Notes
- No new dependencies
- All changes are CSS/layout/icon swaps
- No structural or logic changes

