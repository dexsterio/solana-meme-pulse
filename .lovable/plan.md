

# Implementeringsplan: Trending Ticker, Cryptomarket-knapp och Filterfixar

## Sammanfattning

Tre huvudfunktioner ska implementeras:
1. Reparera saknade tidsfilter-knappar (5M, 1H, 6H, 24H) i filter-raden
2. Omdesigna trending-raden till en rullande/tågande ticker med guld-text, marketcap och procent
3. Lägga till en "Cryptomarket"-knapp som hämtar top 500 krypto via CoinGecko API

---

## 1. Trending-raden -- Rullande ticker med guld och marketcap

**Fil: `src/components/TrendingBar.tsx`** -- Omskriven helt

Andringar:
- CSS-animation (`@keyframes marquee`) som scrollar innehållet horisontellt i en oandlig loop
- Duplicerat innehåll (renderas 2x) for somlös loop-effekt
- Varje token visar: ranking, logo (storre, 20px), ticker-namn, foerkortad marketcap (t.ex. "$4.2M"), procentforandring
- Top 3 tokens far guldfargatd text pa ticker-namnet (gradient gold: `#FFD700` till `#FFA500`)
- Logoer ar storre (20px istället for 16px) for battre synlighet
- `formatCompact` fran mockTokens anvands for marketcap-forkortning

**Fil: `src/index.css`** -- Ny keyframe-animation

Lagg till:
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

## 2. Filter-raden -- Aterstall saknade tidsfilter

**Fil: `src/components/TokenFilters.tsx`**

Tidsfilter-knapparna (5M, 1H, 6H, 24H) finns redan i koden (rad 60-74 inuti Trending-pill). De ser ut att fungera. Det som saknas ar den grona tidsperiod-pillen som togs bort (rad 40-45 ar tom). Denna lamnades tom medvetet -- den behovs inte da tidsknapparna redan finns inbaddade i trending-knappen.

Inga andringar behovs har -- filtren fungerar redan.

## 3. Cryptomarket-knapp -- CoinGecko-integration

### 3a. Ny edge function for CoinGecko API

**Ny fil: `supabase/functions/coingecko-proxy/index.ts`**

- Anropar CoinGeckos fria API: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`
- Ingen API-nyckel behovs for det fria lagret
- Mappar data till Token-interfacet
- Paginering: hamtar 5 sidor (500 tokens)
- CORS-headers for frontend-anrop

### 3b. Ny service-fil

**Ny fil: `src/services/coingeckoApi.ts`**

- `fetchCryptoMarket()` -- anropar edge function, returnerar `Token[]`
- Mappar CoinGecko-falt (`current_price`, `market_cap`, `price_change_percentage_24h`, etc.) till Token-interfacet

### 3c. Uppdatera StatsBar med Cryptomarket-knapp

**Fil: `src/components/StatsBar.tsx`**

- Ny prop: `onCryptoMarketToggle` och `isCryptoMarket`
- Ny knapp "Cryptomarket" med ikon (Globe) bredvid 24H TXNS-rutan
- Aktiv state: knappen far primarkfarg nar Cryptomarket ar valt
- Toggle-beteende: klick byter mellan meme tokens och cryptomarket

### 3d. Uppdatera Index.tsx

**Fil: `src/pages/Index.tsx`**

- Ny state: `const [isCryptoMarket, setIsCryptoMarket] = useState(false)`
- Ny hook: `useCryptoMarket()` med React Query
- Nar `isCryptoMarket` ar true, visas CoinGecko-data istallet for meme tokens
- Filter-raden doljs eller anpassas i cryptomarket-lage (kategorier ar inte relevanta)

### 3e. Uppdatera Category-typ

**Fil: `src/components/TokenFilters.tsx`**

- Lagg till `'cryptomarket'` som Category-alternativ (eller hantera via separat boolean)

---

## Tekniska detaljer

### Guld-gradient for top 3

```css
background: linear-gradient(135deg, #FFD700, #FFA500);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Marquee-animation

- Container med `overflow: hidden`
- Inre div med `display: flex` och `animation: marquee 30s linear infinite`
- Innehallet dupliceras for somlost loopande
- Pausar vid hover (`animation-play-state: paused`)

### CoinGecko API-mappning

CoinGecko returnerar:
```json
{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "image": "https://...",
  "current_price": 67000,
  "market_cap": 1300000000000,
  "price_change_percentage_24h": 2.5,
  "total_volume": 35000000000
}
```

Mappas till Token-interfacet med rimliga defaults for Solana-specifika falt.

### Filer som andras/skapas

| Fil | Aktion |
|-----|--------|
| `src/components/TrendingBar.tsx` | Omskriven -- rullande ticker med guld |
| `src/index.css` | Ny marquee keyframe |
| `src/components/StatsBar.tsx` | Ny Cryptomarket-knapp |
| `src/pages/Index.tsx` | Ny state och CoinGecko-integration |
| `src/services/coingeckoApi.ts` | Ny fil -- CoinGecko API-anrop |
| `supabase/functions/coingecko-proxy/index.ts` | Ny edge function |

