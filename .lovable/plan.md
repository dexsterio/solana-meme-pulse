

# Replace Icons with Custom Tabler SVGs

## Overview
Replace 5 Lucide icons with custom Tabler icon SVGs throughout the platform, each with specific colors matching the provided designs.

## Icon Mapping

| Icon | Replaces | Color | Used In |
|------|----------|-------|---------|
| Filled Flame | `Flame` (lucide) | #e5a50a (gold) | ViralBar, TrendingBar, TokenFilters |
| Info Octagon | `Info` (lucide) | #e5a50a stroke | InfoTooltip (used everywhere) |
| World | `Globe` (lucide) | #e5a50a stroke | StatsBar (Market View button) |
| Filled Crown | `Crown` (lucide) | #e5a50a (gold) | ViralBar, TokenTable (OG badge, STATUS column) |
| Filled Caret Up | `TrendingUp` (lucide) | #26a269 (green) | ViralBar sort, TokenTable (TOP badge, Highest MCap status) |

## Changes

### 1. New file: `src/components/icons/TablerIcons.tsx`
Create reusable React SVG icon components for all 5 icons, accepting `className` and `style` props for sizing. Each renders the exact SVG path provided.

### 2. `src/components/InfoTooltip.tsx`
- Remove `Info` from lucide-react import
- Import `InfoOctagonIcon` from TablerIcons
- Replace `<Info>` with `<InfoOctagonIcon>`

### 3. `src/components/ViralBar.tsx`
- Remove `Flame`, `Crown`, `TrendingUp` from lucide-react import
- Import `FlameFilledIcon`, `CrownFilledIcon`, `CaretUpFilledIcon` from TablerIcons
- Replace all 3 icons in: header label, selected cluster crown, sort option for "Highest MCap"

### 4. `src/components/TrendingBar.tsx`
- Remove `Flame` from lucide-react
- Import `FlameFilledIcon` from TablerIcons
- Replace the trending label flame icon

### 5. `src/components/TokenFilters.tsx`
- Remove `Flame` from lucide-react
- Import `FlameFilledIcon` from TablerIcons
- Replace in Trending category button

### 6. `src/components/StatsBar.tsx`
- Remove `Globe` from lucide-react
- Import `WorldIcon` from TablerIcons
- Replace in Market View button

### 7. `src/components/TokenTable.tsx`
- Remove `Crown`, `TrendingUp` from lucide-react
- Import `CrownFilledIcon`, `CaretUpFilledIcon` from TablerIcons
- Replace in: OgBadge, TopBadge, and STATUS column (First Created / Highest MCap rows)

## Technical Details
- All custom icons accept `className` and `style` props for consistent sizing with the rest of the UI
- Colors are baked into the SVG fills/strokes as provided, but can be overridden via `className` if needed
- No new dependencies required
