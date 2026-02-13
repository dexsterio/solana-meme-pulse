

# Integrera DexTools API for Live Token Data

## Oversikt
Byta fran mock-data till riktig data fran DexTools API v2 for att hamta trending tokens, gainers, och token-detaljer pa Solana.

## API-detaljer
- **Base URL**: `https://public-api.dextools.io/trial/v2`
- **Auth Header**: `x-api-key: {API_KEY}`
- **Endpoints**:
  - `GET /ranking/solana/hotpools` - Trending/hot pairs
  - `GET /ranking/solana/gainers` - Top gainers
  - `GET /ranking/solana/losers` - Top losers
  - `GET /token/solana/{address}` - Token details

## CORS-utmaning
DexTools API tillater troligen inte anrop direkt fran webblasaren (CORS-blockering). Darfor behover vi en **proxy-losning**. Tva alternativ:

1. **Enkel CORS-proxy** (snabb losning): Anvanda en allcors/corsproxy-tjanst temporart
2. **Lovable Cloud edge function** (korrekt losning): Skapa en edge function som proxar API-anrop

Planen implementerar **bada**: forst en direkt-anrop med fallback, och forbereder for edge function om det behovs.

## Tekniska andringar

### 1. Ny fil: `src/services/dextoolsApi.ts`
- API-klient med base URL och API-nyckel
- Funktioner: `fetchHotPools()`, `fetchGainers()`, `fetchLosers()`, `fetchTokenDetails(address)`
- Mappar API-respons till var befintliga `Token`-interface
- Hanterar felfall och retry-logik

### 2. Ny fil: `src/hooks/useTokens.ts`
- TanStack Query hook (`useQuery`) for att hamta tokens
- Stodjer olika kategorier (trending, gainers, new)
- Auto-refetch var 30:e sekund
- Fallback till mock-data vid API-fel

### 3. Uppdatera: `src/data/mockTokens.ts`
- Lagg till mapper-funktion `mapDexToolsToToken()` som konverterar API-respons till `Token`-interfacet
- Behall mock-data som fallback

### 4. Uppdatera: `src/pages/Index.tsx`
- Byt fran `mockTokens` import till `useTokens()` hook
- Visa laddnings-skeleton medan data hamtas
- Visa felmeddelande om API:t inte svarar

### 5. Uppdatera: `src/components/TrendingBar.tsx`
- Anvand live trending data istallet for mock

### 6. Uppdatera: `src/components/StatsBar.tsx`
- Visa aggregerade stats fran live data

### 7. Uppdatera: `src/pages/TokenDetail.tsx`
- Hamta detaljerad token-info via API vid navigering

## Data-mappning

DexTools API returnerar data i ett annat format an vart `Token`-interface. Mapper-funktionen konverterar:

```text
DexTools response          -->  Token interface
----------------------------------------------
pair.baseToken.symbol      -->  ticker
pair.baseToken.name        -->  name
pair.price                 -->  price
pair.volume24h             -->  volume
pair.txCount24h            -->  txns
pair.priceChange.h24       -->  change24h
pair.priceChange.h6        -->  change6h
pair.priceChange.h1        -->  change1h
pair.priceChange.m5        -->  change5m
pair.liquidity             -->  liquidity
pair.fdv                   -->  fdv / mcap
pair.baseToken.address     -->  address
pair.creationTime          -->  age (beraknad)
```

## Implementeringsordning
1. Skapa API-klient (`dextoolsApi.ts`)
2. Skapa React Query hook (`useTokens.ts`)
3. Uppdatera Index.tsx att anvanda hooken
4. Uppdatera TrendingBar och StatsBar
5. Uppdatera TokenDetail for live data
6. Testa och verifiera att data visas korrekt

