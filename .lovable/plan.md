
# Plan: Fear & Greed gauge som matchar referensbilden

## Sammanfattning

Designa om Fear & Greed-indikatorn i MarketSentimentBar till en visuell halvcirkelformad gauge (mätare) som matchar referensbilden exakt:
- Halvcirkelformad arc med gradient (röd -> orange -> gul -> grön)
- En nål/pekare som pekar mot rätt värde (0-100)
- Stort siffervärde i mitten
- Klassificeringstext under siffran (t.ex. "Extreme fear")
- "Fear & Greed >" text ovanför gaugen
- Mörk bakgrund med rundade hörn, som ett eget kort

## Ändringar

### Fil: `src/components/MarketSentimentBar.tsx`

Ersätt det nuvarande Fear & Greed-pillet (rad 48-58) med en ny gauge-komponent:

**Gauge-implementering med SVG:**
- En `<svg>` med en halvcirkelformad arc (`<path>` med stroke-gradient)
- Gradientfärger: röd (#ea384c) -> orange (#f97316) -> gul (#eab308) -> grön (#22c55e)
- En nål-linje som roteras baserat på värdet (0 = vänster/180 grader, 100 = höger/0 grader)
- Liten röd/vit prick på nålens spets
- Siffran visas stort centrerat under arcen
- Klassificeringstext under siffran

**Layout:**
- Kortet blir lite bredare (~140px) och högre (~80px) jämfört med de andra pillerna
- Texten "Fear & Greed >" visas längst upp med chevron-ikon
- Bakgrund: `bg-card` med `rounded-lg` och `border border-border`

**SVG-beräkning:**
- Arc-radie: ca 35px
- Nålens vinkel: `180 - (value / 100) * 180` grader
- Nålen ritas som en linje från cirkelns centrum till arcens kant

### Inga andra filer behöver ändras

Övriga indikatorer (Market Cap, BTC Dom, ETH Gas, Alt Season) förblir oförändrade.

## Tekniska detaljer

### SVG Arc-formel
```
startAngle = 180 (vänster sida)
endAngle = 0 (höger sida)
needleAngle = 180 - (value / 100) * 180

nålens x = cx + radius * cos(needleAngle * PI / 180)
nålens y = cy - radius * sin(needleAngle * PI / 180)
```

### Gradient-arc
SVG `linearGradient` med stops:
- 0%: #ea384c (röd)
- 33%: #f97316 (orange)  
- 50%: #eab308 (gul)
- 100%: #22c55e (grön)

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| `src/components/MarketSentimentBar.tsx` | Ersätt Fear & Greed pill med SVG gauge-komponent |
