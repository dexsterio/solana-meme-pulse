
# Plan: Viral Meme Detection System

## Koncept

Systemet overvakar PumpPortal WebSocket-strommen i realtid och detekterar nar flera tokens med samma/liknande namn skapas under en kort tidsperiod. Nar detta hander skapas automatiskt en "viral cluster" -- en samlad kategori dar anvandaren kan se alla relaterade tokens rankade efter market cap, skapelsetid och volym.

## Hur det fungerar

1. **Detektion**: Varje ny token som kommer via WebSocket far sitt namn normaliserat (gemener, inga specialtecken). Systemet raknar hur manga tokens med samma normaliserade namn som skapats inom en 60-minuters period.

2. **Triggertroskelvarde**: Om 3 eller fler tokens med samma namn skapas inom 60 minuter flaggas det som en "viral meme".

3. **Viral Bar**: En ny horisontell bar visas under filtren (liknande TrendingBar) med klickbara pills for varje detekterad viral meme. Varje pill visar namn, antal tokens och en pulsande indikator.

4. **Klickbar detaljvy**: Nar anvandaren klickar pa en viral pill filtreras tabellen for att visa ENBART tokens i den clustern, sorterade med "OG" (forst skapad) markerad med en krona/badge, och resten rankade efter market cap.

## Nya filer

### 1. `src/services/viralDetectionService.ts` -- Hjarnan

Ny singleton-tjanst som:
- Prenumererar pa pumpPortalService-strommen
- Normaliserar tokennamn (lowercase, strip emojis/specialtecken)
- Haller en `Map<normalizedName, ViralCluster>` i minnet
- Varje cluster innehaller: namn, lista av tokens, forsta skapelsetid, senaste skapelsetid, antal tokens
- Exponerar `getViralClusters()`, `subscribe()`, och `getClusterTokens(name)`
- Troskelvarde: 3+ tokens med samma namn inom 60 min = viral

```text
ViralCluster {
  name: string              // Normaliserat namn (t.ex. "duffy")
  displayName: string       // Originalnamn fran forsta token (t.ex. "DUFFY")
  tokens: Token[]           // Alla tokens i clustern
  firstSeen: number         // Timestamp nar forsta token skapades
  lastSeen: number          // Timestamp nar senaste token skapades
  count: number             // Antal tokens
  topToken: Token           // Token med hogst mcap (trolig "OG")
  ogToken: Token            // Forst skapad token
}
```

### 2. `src/hooks/useViralClusters.ts` -- React-hook

Hook som prenumererar pa viralDetectionService och returnerar:
- `clusters: ViralCluster[]` -- sorterade efter antal tokens (flest forst)
- `selectedCluster: string | null` -- vald cluster
- `setSelectedCluster` -- funktion for att valja/avalja

### 3. `src/components/ViralBar.tsx` -- Visuell bar

Horisontell scrollbar som visas under TokenFilters nar det finns aktiva virala memes:

- Varje cluster visas som en klickbar pill med:
  - Pulsande rod/orange prick (indikerar aktiv viral)
  - Clusternamn i fetstil (t.ex. "DUFFY")
  - Antal tokens (t.ex. "x47 tokens")
  - Hogsta mcap i clustern
- Vald cluster far framhavd bakgrund
- "Viral Memes" etikett med virus-ikon till vanster

### 4. Andring i `src/components/TokenTable.tsx`

Nar en viral cluster ar vald:
- Visa en "OG"-badge (krona-ikon) bredvid den token som skapades forst
- Visa en "Top"-badge bredvid den med hogst mcap
- Lagg till en "Created" kolumn som visar exakt tid nar token skapades

### 5. Andring i `src/pages/Index.tsx`

- Importera useViralClusters och ViralBar
- Rendera ViralBar under TokenFilters
- Nar en cluster ar vald, filtrera tokens-listan till enbart den clusterns tokens
- Sortera efter mcap som default nar en viral cluster ar vald

### 6. Andring i `src/services/pumpPortalService.ts`

- Exportera en ny callback-hook `onNewToken(callback)` som kallas varje gang en ny token laggs till (for att viralDetectionService ska kunna lyssna)

## UI-layout nar viral cluster ar vald

```text
+------------------------------------------------------------------+
| Trending Bar                                                      |
+------------------------------------------------------------------+
| StatsBar (sok, etc)                                              |
+------------------------------------------------------------------+
| TokenFilters (trending, top, gainers, new pairs)                 |
+------------------------------------------------------------------+
| [virus] Viral Memes: [DUFFY x47] [PEPE2 x23] [CATDOG x12]      |
+------------------------------------------------------------------+
| Visar: DUFFY (47 tokens)               [X Stang]                |
+------------------------------------------------------------------+
| # | TOKEN           | OG? | PRICE  | MCAP   | VOL   | CREATED  |
| 1 | DUFFY [krona]   | OG  | $0.01  | $450K  | $120K | 14:23:01 |
| 2 | Duffy           |     | $0.008 | $280K  | $85K  | 14:23:45 |
| 3 | DUFFY Official  |     | $0.003 | $120K  | $40K  | 14:24:12 |
| ...                                                              |
+------------------------------------------------------------------+
```

## Detektionsalgoritm

```text
Normalisering:
1. Konvertera till lowercase
2. Ta bort emojis, specialtecken, siffror
3. Trimma whitespace
4. Exempel: "DUFFY 🐱" -> "duffy", "$DUFFY" -> "duffy", "Duffy Official" -> "duffy official"

For likhetsgruppering:
- Exakt matchning pa normaliserat namn (primr)
- Tokens som "DUFFY", "duffy", "$DUFFY" hamnar i samma cluster
- "Duffy Official" eller "Baby Duffy" far en sekundr check: 
  om forsta ordet matchar en befintlig cluster med 3+ tokens, lagg till dar ocksa
```

## Filer som andras/skapas

| Fil | Aktion |
|-----|--------|
| `src/services/viralDetectionService.ts` | Ny -- detektionslogik |
| `src/hooks/useViralClusters.ts` | Ny -- React hook |
| `src/components/ViralBar.tsx` | Ny -- visuell bar |
| `src/services/pumpPortalService.ts` | Andras -- lagg till onNewToken callback |
| `src/pages/Index.tsx` | Andras -- integrera ViralBar och filterlogik |
| `src/components/TokenTable.tsx` | Andras -- OG-badge och Created-kolumn |
