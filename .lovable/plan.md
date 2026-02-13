
# Plan: Viral View UI/UX Polish -- Fixa overlappning, padding och tydlighet

## Sammanfattning

Atgarda alla UI/UX-problem i Viral-vyn: OG/TOP-badges som overlappar med logotyper, trang layout, dalig lasbarhet och bristande visuell hierarki. Uppgradera till varldsklassig UX med korrekt spacing, tydliga badges och professionell layout.

## Problem som atgardas

### 1. OG/TOP badges overlappar med rank-nummer och logo
Badgarna renderas inne i rank-kolumnen (#) som bara ar 48px bred (`w-12`). Nar OG-badge med Crown-ikon laggs till pa samma rad som rank-numret, overlappar allt.

### 2. Token-kolumnen ar for trang for alla element
Namn + ticker + exchange-logo + boosts trycks ihop pa en rad utan overflow-hantering.

### 3. STATUS-kolumnen ("First Created", "Clone") ar otydlig
Texten ar liten och saknar visuell vikt.

### 4. ViralBar saknar tydlig visuell separation
Nar en viral cluster ar vald saknas tydlig feedback om vilka tokens man tittar pa.

---

## Andringar

### Fil 1: `src/components/TokenTable.tsx`

**A. Flytta OG/TOP badges fran rank-kolumnen till token-namn-kolumnen**
- Ta bort badges fran `<td>` for rank (#) -- rad 98-110
- Rank-kolumnen ska bara visa `#{token.rank}` rent
- Flytta OG/TOP badges till token-namn-raden (rad 112-143), placerade EFTER ticker-texten
- Badges far `ml-1.5` margin och mindre storlek for att inte krocka med logotypen

**B. Fixa token-namn overflow**
- Lagg till `truncate` och `max-w` pa namn-texten sa den inte breder ut sig
- Se till att raden har `min-w-0` och `overflow-hidden`

**C. Forbattra STATUS-kolumnen**
- Ersatt ren text med tydliga pill-badges med bakgrundsfarg
- "First Created" -> gul pill med Crown-ikon
- "Highest MCap" -> gron pill med TrendingUp-ikon  
- "Clone" -> neutral gra pill

**D. Oка rank-kolumn bredd**
- Andring fran `w-12` till `w-10` (smalare, bara siffror nu)
- Token-kolumnen far `w-[260px]` for att ge plats at badges

### Fil 2: `src/components/ViralBar.tsx`

**A. Forbattra vald-cluster header**
- Storre typsnitt och tydligare bakgrund
- Lagg till token-antal och OG-token info i headern
- Tydligare stang-knapp med text "Back to all"

**B. Forbattra pill-design**
- Battre padding (`px-3 py-1.5`) och tydligare hover-effekt
- Lagg till `gap-2` istallet for `gap-1.5` mellan element i pillen
- Visuellt tydligare avskiljning mellan cluster-namn och metadata

**C. Responsiv scrollbar**
- Lagg till `scrollbar-hide` for att gomma scrollbar pa horisontell scroll

---

## Tekniska detaljer

### Badge-placering (fore och efter)

FORE (overlappar):
```text
| #1 [OG] | [LOGO] DUFFY /SOL DUFFY [pump] |
  ^--- rank + badge krockar     ^--- allt tryckt ihop
```

EFTER (rent):
```text
| #1 | [LOGO]  DUFFY /SOL DUFFY [OG] [pump] |
  ^---rank    ^---logo  ^---namn    ^---badge har plats
```

### Nya badge-stilar
- OG: `bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 rounded-md px-1.5 py-0.5 text-[10px] font-bold`
- TOP: `bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md px-1.5 py-0.5 text-[10px] font-bold`
- Clone: `bg-secondary text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px]`

### Filer som andras

| Fil | Andring |
|-----|---------|
| `src/components/TokenTable.tsx` | Flytta badges, fixa overflow, forbattra STATUS-kolumn, justera kolumnbredder |
| `src/components/ViralBar.tsx` | Forbattra spacing, pill-design, vald-cluster header |
