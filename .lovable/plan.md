

# Plan: Market View-forbattringar, sentimentdata och 7d/30d-fix

## Sammanfattning

Sex andringar behovs:
1. Fixa 7d/30d prisdata (visar 0% just nu)
2. Byta namn: "MemeMarket" till "Meme Zone", "CryptoMarket" till "Market View"
3. Lagga till marknadssentiment-panel (Fear & Greed Index, BTC Dominance, Total Market Cap, ETH Gas, Alt Season)
4. Uppdatera Token-interfacet med nya falt
5. Uppdatera edge function for att hamta mer data
6. Skapa ny edge function for global marknadsdata

---

## 1. Fixa edge function -- hamta 7d och 30d data

**Fil: `supabase/functions/coingecko-proxy/index.ts`**

Problemet: API-anropet begarer bara `price_change_percentage=1h,24h`. Behover lagga till `7d,30d`.

Andring pa rad 18:
```
price_change_percentage=1h,24h,7d,30d
```

Dessutom lagga till en ny route `/global` som hamtar:
- CoinGecko `/api/v3/global` -- BTC dominance, total market cap
- Alternative.me Fear & Greed Index -- `https://api.alternative.me/fng/`

## 2. Ny edge function for marknadsdata

**Ny fil: `supabase/functions/crypto-global/index.ts`**

Hamtar tre datakallor parallellt:
- **CoinGecko Global**: `https://api.coingecko.com/api/v3/global` -- ger `total_market_cap.usd`, `market_cap_percentage.btc`, `market_cap_percentage.eth`
- **Fear & Greed**: `https://api.alternative.me/fng/` -- ger `value` (0-100) och `value_classification` ("Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed")
- **ETH Gas**: `https://api.etherscan.io/api?module=gastracker&action=gasoracle` (fri utan nyckel, eller alternativt approximerat fran CoinGecko-data)

Returnerar ett JSON-objekt med all global data.

## 3. Uppdatera Token-interface

**Fil: `src/data/mockTokens.ts`**

Lagg till tva nya falt i Token-interfacet:
```typescript
change7d: number;
change30d: number;
```

## 4. Uppdatera coingeckoApi.ts

**Fil: `src/services/coingeckoApi.ts`**

- Lagg till `price_change_percentage_7d_in_currency` och `price_change_percentage_30d_in_currency` i CoinGeckoToken-interfacet
- Mappa dessa till `change7d` och `change30d` i mapToToken
- Lagg till ny funktion `fetchCryptoGlobal()` som anropar `crypto-global` edge function

## 5. Uppdatera TokenTable -- anvand ratt falt

**Fil: `src/components/TokenTable.tsx`**

Rad 134-137 anvander felaktiga falt. Andras till:
```tsx
<ChangeCell value={token.change1h} />
<ChangeCell value={token.change24h} />
<ChangeCell value={token.change7d} />
<ChangeCell value={token.change30d} />
```

## 6. Byta namn pa knappen

**Fil: `src/components/StatsBar.tsx`**

Rad 50: Andra fran `'MemeMarket' : 'CryptoMarket'` till `'Meme Zone' : 'Market View'`

## 7. Ny komponent: MarketSentimentBar

**Ny fil: `src/components/MarketSentimentBar.tsx`**

Visas ovanfor tabellen nar Market View ar aktivt. Innehaller:

| Indikator | Visning | Kalla |
|-----------|---------|-------|
| Fear & Greed Index | Siffra (0-100) + fargkodad etikett | alternative.me |
| BTC Dominance | Procent (t.ex. "52.3%") | CoinGecko Global |
| Total Market Cap | Forkortad (t.ex. "$2.45T") | CoinGecko Global |
| ETH Gas | Gwei-varde | Etherscan/approximerat |
| Alt Season | Indikator baserad pa BTC dominance-trend | Beraknat lokalt |

Layout: horisontell rad med kompakta "kort" (likt StatsBar-stilen), varje indikator i en `bg-secondary` ruta med etikett och varde.

Fear & Greed fargkodning:
- 0-25: Rod (Extreme Fear)
- 26-45: Orange (Fear)
- 46-55: Gul (Neutral)
- 56-75: Ljusgron (Greed)
- 76-100: Gron (Extreme Greed)

Alt Season-logik: Om BTC dominance ar under 40% = Alt Season, 40-50% = Neutral, over 50% = BTC Season.

## 8. Uppdatera Index.tsx

**Fil: `src/pages/Index.tsx`**

- Importera och rendera `MarketSentimentBar` ovanfor tabellen nar `isCryptoMarket === true`
- Anvand React Query for att hamta global data fran `crypto-global` edge function
- Skicka global data som props till MarketSentimentBar

## 9. Uppdatera alla filer som skapar Token-objekt

Filer som skapar Token-objekt behover default-varden for `change7d` och `change30d`:
- `src/hooks/useTokens.ts` -- lagg till `change7d: 0, change30d: 0`
- `src/hooks/usePumpPortalNewTokens.ts` -- lagg till `change7d: 0, change30d: 0`
- `src/services/dexscreenerApi.ts` -- lagg till `change7d: 0, change30d: 0`
- `src/services/dextoolsApi.ts` -- lagg till `change7d: 0, change30d: 0`

---

## Tekniska detaljer

### CoinGecko Global API-respons
```json
{
  "data": {
    "total_market_cap": { "usd": 2450000000000 },
    "market_cap_percentage": { "btc": 52.3, "eth": 17.8 },
    "market_cap_change_percentage_24h_usd": 1.5
  }
}
```

### Fear & Greed API-respons
```json
{
  "data": [{ "value": "72", "value_classification": "Greed" }]
}
```

### Filer som andras/skapas

| Fil | Aktion |
|-----|--------|
| `supabase/functions/coingecko-proxy/index.ts` | Uppdatera -- lagg till 7d,30d |
| `supabase/functions/crypto-global/index.ts` | Ny fil -- global marknadsdata |
| `src/data/mockTokens.ts` | Lagg till change7d, change30d |
| `src/services/coingeckoApi.ts` | Mappa 7d/30d, ny fetchCryptoGlobal |
| `src/components/TokenTable.tsx` | Fixa 7d/30d kolumner |
| `src/components/StatsBar.tsx` | Byt namn till Meme Zone / Market View |
| `src/components/MarketSentimentBar.tsx` | Ny komponent |
| `src/pages/Index.tsx` | Integrera sentiment-panel |
| `src/hooks/useTokens.ts` | Default change7d/30d |
| `src/hooks/usePumpPortalNewTokens.ts` | Default change7d/30d |
| `src/services/dexscreenerApi.ts` | Default change7d/30d |
| `src/services/dextoolsApi.ts` | Default change7d/30d |
| `supabase/config.toml` | Registrera crypto-global |

