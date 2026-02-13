

# Translate Entire Platform to English

## Summary
All Swedish text in the UI will be replaced with English. Every visible label, tooltip, button, status text, placeholder, and error message across all components will be changed to English.

---

## Changes Per File

### 1. `src/components/TokenFilters.tsx`
| Swedish | English |
|---------|---------|
| `Senaste 5 minuterna` | `Last 5 minutes` |
| `Senaste timmen` | `Last hour` |
| `Senaste 6 timmarna` | `Last 6 hours` |
| `Senaste 24 timmarna` | `Last 24 hours` |
| `Trendande` | `Trending` |
| `Topp` | `Top` |
| `Vinnare` | `Gainers` |
| `Nya Par` | `New Pairs` |
| `Sortera:` | `Rank by:` |
| `Trendande {time}` (option) | `Trending {time}` |
| `Volym` | `Volume` |
| `Prisförändring` | `Price Change` |
| `Transaktioner` | `Transactions` |
| `Filter` | `Filters` |
| `Anpassa` | `Customize` |
| `Min Volym:` | `Min Volume:` |
| `Min Likviditet:` | `Min Liquidity:` |
| `Max Ålder:` | `Max Age:` |
| `Alla` (placeholder) | `Any` |
| All tooltip texts | English equivalents |

### 2. `src/components/StatsBar.tsx`
| Swedish | English |
|---------|---------|
| `Sök token...` | `Search token...` |
| `Meme-zon` | `Meme Zone` |
| `Marknadsvy` | `Market View` |
| Tooltip texts | English equivalents |

### 3. `src/components/TrendingBar.tsx`
| Swedish | English |
|---------|---------|
| `Trendande` | `Trending` |
| Tooltip text | `top 10 tokens by 24h price change, scrolling live.` |

### 4. `src/components/ViralBar.tsx`
| Swedish | English |
|---------|---------|
| `Virala Memes` | `Viral Memes` |
| `Tillbaka` | `Back` |
| `Sortera:` | `Sort:` |
| `Först skapad` | `First Created` |
| `Högst MCap` | `Highest MCap` |
| `Högst Volym` | `Highest Volume` |
| All tooltip texts | English equivalents |

### 5. `src/components/TokenTable.tsx`
| Swedish | English |
|---------|---------|
| `PRIS` | `PRICE` |
| `ÅLDER` | `AGE` |
| `VOLYM` | `VOLUME` |
| `LIKVIDITET` | `LIQUIDITY` |
| `Först skapad` (status) | `First Created` |
| `Högst MCap` (status) | `Highest MCap` |
| `Kopia` (status) | `Clone` |
| OgBadge title | `The first token with this name` |
| TopBadge title | `The token with the highest market cap in the cluster` |
| All tooltip texts | English equivalents |

### 6. `src/components/TokenGrid.tsx`
| Swedish | English |
|---------|---------|
| Tooltip texts (totalt handlat, market cap, likviditet, tid sedan) | English equivalents |

### 7. `src/components/MarketSentimentBar.tsx`
| Swedish | English |
|---------|---------|
| `Alt-säsong` | `Alt Season` |
| `BTC-säsong` | `BTC Season` |
| `Säsong` | `Season` |
| `Rädsla & Girighet` | `Fear & Greed` |
| All tooltip texts | English equivalents |

### 8. `src/pages/Index.tsx`
| Swedish | English |
|---------|---------|
| `Lyssnar efter nya tokens...` | `Listening for new tokens...` |
| `Bara tokens med logotyp visas` | `Only tokens with logos are shown` |
| `DexTools API-gräns nådd — prova igen.` | `DexTools API rate limited — try again.` |
| `Kunde inte ladda data.` | `Failed to load data.` |
| `Försök igen` | `Retry now` |

### 9. `src/pages/TokenDetail.tsx`
| Swedish | English |
|---------|---------|
| `Token hittades inte` | `Token not found` |
| `Gå tillbaka` | `Go back` |

### 10. `src/pages/NotFound.tsx`
| Swedish | English |
|---------|---------|
| `Sidan hittades inte` | `Page not found` |
| `Tillbaka till startsidan` | `Return to Home` |

### 11. `src/components/TokenInfoPanel.tsx`
| Swedish | English |
|---------|---------|
| `Pris USD` | `Price USD` |
| `Pris` | `Price` |
| `LIKVIDITET` | `LIQUIDITY` |
| `KÖP` | `BUYS` |
| `SÄLJ` | `SELLS` |
| `VOLYM` | `VOLUME` |
| `KÖPVOLYM` | `BUY VOL` |
| `SÄLJVOLYM` | `SELL VOL` |
| `KÖPARE` | `BUYERS` |
| `SÄLJARE` | `SELLERS` |
| `Bevakningslista` | `Watchlist` |
| `Aviseringar` | `Alerts` |
| `Köp` | `Buy` |
| `Sälj` | `Sell` |

### 12. `src/components/TransactionList.tsx`
| Swedish | English |
|---------|---------|
| `Transaktioner` | `Transactions` |
| `Topphandlare` | `Top Traders` |
| `Innehavare` | `Holders` |
| `DATUM` | `DATE` |
| `TYP` | `TYPE` |
| `ANTAL` | `AMOUNT` |
| `PRIS` | `PRICE` |
| `Köp` / `Sälj` | `Buy` / `Sell` |
| `sv-SE` locale | `en-US` |

### 13. `src/components/PriceChart.tsx`
| Swedish | English |
|---------|---------|
| `Pris` | `Price` |
| `Diagramplacering — OHLCV-data kopplas senare` | `Chart placeholder — OHLCV data will be connected later` |

### 14. `src/components/SearchBar.tsx`
| Swedish | English |
|---------|---------|
| `Klistra in tokenadress för att söka...` | `Paste token address to search...` |
| `Sök` | `Go` |

---

## Technical Details
- 14 files modified
- No new dependencies needed
- No structural code changes, only text strings
- Crypto-specific terms (Token, SOL, MCap, FDV, TXNS, MAKERS) remain as-is (already in English)
