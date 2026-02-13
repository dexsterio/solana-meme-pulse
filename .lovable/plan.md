
## Plan: Ta bort InfoTooltip-ikoner och rensa token-partext

### 1. Ta bort alla InfoTooltip-anvandningar

Filer som anvander InfoTooltip:

- **TokenTable.tsx** (rad 75-96): Ta bort InfoTooltip fran AGE, TXNS, VOLUME, MAKERS, LIQUIDITY, MCAP, STATUS kolumnrubriker. Behall bara texten.
- **TokenGrid.tsx** (rad 93): Ta bort InfoTooltip fran Vol, MCap, Liq, Age labels. Ta aven bort `tip`-propertyn fran arrayen.
- **MarketSentimentBar.tsx** (rad 77, 109, 120): Ta bort InfoTooltip fran Fear and Greed, Market Cap, BTC Dom.
- **StatsBar.tsx**, **ViralBar.tsx**, **TokenFilters.tsx** (om de anvander InfoTooltip): Kontrollera och ta bort.

Ta aven bort importen av InfoTooltip fran alla filer.

### 2. Rensa "/SOL" och partext

- **TokenTable.tsx** (rad 117): Ta bort `<span>/SOL</span>` sa det bara visar tokennamn och ticker.
- **TokenInfoPanel.tsx** (rad 39-42): Ta bort `/ SolanaIcon`-raden fran ticker-sektionen. Visa bara ticker.
- **TokenDetail.tsx** (rad 82-83): Andra fran `{token.name} / {token.ticker}` till `{token.ticker} {token.name}` (ticker forst, sedan namn, utan snedstreck).

### 3. Ta bort InfoTooltip-komponenten

- Radera filen `src/components/InfoTooltip.tsx` eftersom den inte langre anvands.

---

### Tekniska detaljer

**Filer som andras:**
- `src/components/TokenTable.tsx` - Ta bort 6 InfoTooltip-instanser och `/SOL`-text
- `src/components/TokenGrid.tsx` - Ta bort 4 InfoTooltip-instanser
- `src/components/MarketSentimentBar.tsx` - Ta bort 3 InfoTooltip-instanser
- `src/components/TokenInfoPanel.tsx` - Ta bort `/ SolanaIcon` fran ticker-rad
- `src/pages/TokenDetail.tsx` - Andra header till `{token.ticker} {token.name}`
- `src/components/InfoTooltip.tsx` - Radera filen

**Filer att kontrollera:** StatsBar.tsx, ViralBar.tsx, TokenFilters.tsx for eventuella InfoTooltip-anvandningar.
