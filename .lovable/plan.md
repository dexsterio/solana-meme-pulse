
# Solana Meme Token Market Scanner

## Översikt
En fullscreen, dark-mode crypto market page inspirerad av DexScreener, fokuserad på Solana meme tokens. Börjar med realistisk mock-data, förberedd för riktigt API och OHLCV-chart senare.

---

## Sida 1: Token-lista (Huvudsida)

### Header
- Statistik-bar: 24H Volume, 24H Transactions, antal tokens som visas
- Sökfält för token-adress med "Go"-knapp

### Navigeringsflikar
- **Tidsperiod-filter**: 5M, 1H, 6H, 24H (toggle-knappar)
- **Kategoriflikar**: Trending, Top, Gainers, New Pairs
- **Rank by**: Dropdown (Trending 6H, Volume, Price change, etc.)
- **Filter-knapp**: Öppnar avancerade filter (min/max volym, likviditet, MCAP, ålder)

### Token-tabell (Listvy)
Kolumner exakt som referensbilden:
- Rank (#)
- Token (logo, namn, ticker, chain-badge, boost-ikon)
- Price ($)
- Age
- TXNS
- Volume
- Makers
- 5M / 1H / 6H / 24H prisförändringar (grön/röd)
- Liquidity
- MCAP

### Alternativ vy: Kort/Grid-vy
- Toggle mellan tabell och grid med stora token-logotyper
- Varje kort visar token-info, pris, prisförändring, volym

---

## Sida 2: Token-detaljsida (klicka på en token)

### Layout (3 paneler, likt DexScreener)

**Vänster panel - Chart**
- Placeholder-chart med Recharts (förberett för OHLCV-data senare)
- Tidsperiod-selector: 1s, 1m, 5m, 15m, 1h, 4h, D
- Price/MCap toggle

**Nedre vänster - Transaktionslista**
- Flikar: Transactions, Top Traders, Holders
- Tabell med: Date, Type (Buy/Sell), USD, Token amount, SOL, Price, Maker, TXN-länk
- Buys i grönt, Sells i rött

**Höger panel - Token Info**
- Token-logotyp och namn
- Sociala länkar: Website, Twitter, Telegram
- Prisinfo: USD-pris, SOL-pris
- Stats: Liquidity, FDV, Market Cap
- Prisförändringar: 5M, 1H, 6H, 24H
- Handelsdata: TXNS (Buys/Sells), Volume (Buy/Sell), Makers (Buyers/Sellers)
- Watchlist & Alerts-knappar
- Buy/Sell-knappar

### Trending-bar (överst)
- Horisontell scrollbar med top trending tokens

---

## Design
- **Dark mode** som standard (mörk bakgrund likt DexScreener)
- **Fullscreen layout** utan margins
- Grönt för positiva värden, rött för negativa
- Kompakt, data-tät typografi
- Responsiv men optimerad för desktop

---

## Data
- Mock-data med ~20 realistiska Solana meme tokens
- Simulerad prisförändring och volym
- Förberett att koppla till riktigt API i framtiden
