
# Översätt hela plattformen till svenska

## Sammanfattning
All synlig text i gränssnittet ska bytas ut från engelska till svenska. Inga engelskspråkiga ord kvar i UI:t (förutom kryptovaluta-termer som är universella, t.ex. "Token", "SOL", "MCap", "FDV").

---

## Alla ändringar per fil

### 1. `src/components/TokenFilters.tsx`
| Engelska | Svenska |
|----------|---------|
| `Trending` | `Trendande` |
| `Top` | `Topp` |
| `Gainers` | `Vinnare` |
| `New Pairs` | `Nya Par` |
| `Rank by:` | `Sortera:` |
| `Trending 24H` (option) | `Trendande 24H` |
| `Volume` (option) | `Volym` |
| `Price Change` (option) | `Prisförändring` |
| `Transactions` (option) | `Transaktioner` |
| `Market Cap` (option) | `Market Cap` |
| `Filters` | `Filter` |
| `Customize` | `Anpassa` |
| `Min Volume:` | `Min Volym:` |
| `Min Liquidity:` | `Min Likviditet:` |
| `Max Age:` | `Max Ålder:` |
| `Any` (placeholder) | `Alla` |
| `Last 5 minutes` etc. (timeLabel) | `Senaste 5 minuterna` osv. |

### 2. `src/components/StatsBar.tsx`
| Engelska | Svenska |
|----------|---------|
| `Search token...` | `Sök token...` |
| `Market View` | `Marknadsvy` |
| `Meme Zone` | `Meme-zon` |

### 3. `src/components/TrendingBar.tsx`
| Engelska | Svenska |
|----------|---------|
| `Trending` | `Trendande` |

### 4. `src/components/ViralBar.tsx`
| Engelska | Svenska |
|----------|---------|
| `Viral Memes` | `Virala Memes` |
| `tokens` (i "X tokens") | `tokens` (behåll) |
| `Back` | `Tillbaka` |
| `Sort:` | `Sortera:` |
| `First Created` | `Först skapad` |
| `Highest MCap` | `Högst MCap` |
| `Highest Volume` | `Högst Volym` |

### 5. `src/components/TokenTable.tsx`
| Engelska | Svenska |
|----------|---------|
| `TOKEN` | `TOKEN` (behåll) |
| `PRICE` | `PRIS` |
| `AGE` | `ÅLDER` |
| `TXNS` | `TXNS` (behåll) |
| `VOLUME` | `VOLYM` |
| `MAKERS` | `MAKERS` (behåll) |
| `LIQUIDITY` | `LIKVIDITET` |
| `STATUS` | `STATUS` (behåll) |
| `First Created` (status) | `Först skapad` |
| `Highest MCap` (status) | `Högst MCap` |
| `Clone` (status) | `Kopia` |
| OgBadge title: `The first token...` | `Den första token med detta namn` |
| TopBadge title: `The token with...` | `Token med högst market cap i klustret` |

### 6. `src/components/TokenGrid.tsx`
- Inga synliga engelska etiketter kvar (Vol, MCap, Liq, Age behålls som förkortningar)

### 7. `src/components/MarketSentimentBar.tsx`
| Engelska | Svenska |
|----------|---------|
| `Market Cap` | `Market Cap` (behåll, universell term) |
| `BTC Dom` | `BTC Dom` (behåll) |
| `ETH Gas` | `ETH Gas` (behåll) |
| `Season` | `Säsong` |
| `Alt Season` | `Alt-säsong` |
| `BTC Season` | `BTC-säsong` |
| `Neutral` | `Neutral` (behåll) |
| `Fear & Greed` | `Rädsla & Girighet` |

### 8. `src/pages/Index.tsx`
| Engelska | Svenska |
|----------|---------|
| `Listening for new tokens...` | `Lyssnar efter nya tokens...` |
| `Only tokens with logos are shown` | `Bara tokens med logotyp visas` |
| `DexTools API rate limited...` | `DexTools API-gräns nådd — prova igen.` |
| `Failed to load data.` | `Kunde inte ladda data.` |
| `Retry now` | `Försök igen` |

### 9. `src/pages/TokenDetail.tsx`
| Engelska | Svenska |
|----------|---------|
| `Token not found` | `Token hittades inte` |
| `Go back` | `Gå tillbaka` |

### 10. `src/pages/NotFound.tsx`
| Engelska | Svenska |
|----------|---------|
| `Oops! Page not found` | `Sidan hittades inte` |
| `Return to Home` | `Tillbaka till startsidan` |

### 11. `src/components/TokenInfoPanel.tsx`
| Engelska | Svenska |
|----------|---------|
| `Price USD` | `Pris USD` |
| `Price` (SOL) | `Pris` |
| `LIQUIDITY` | `LIKVIDITET` |
| `TXNS` | `TXNS` (behåll) |
| `BUYS` | `KÖP` |
| `SELLS` | `SÄLJ` |
| `VOLUME` | `VOLYM` |
| `BUY VOL` | `KÖPVOLYM` |
| `SELL VOL` | `SÄLJVOLYM` |
| `MAKERS` | `MAKERS` (behåll) |
| `BUYERS` | `KÖPARE` |
| `SELLERS` | `SÄLJARE` |
| `Watchlist` | `Bevakningslista` |
| `Alerts` | `Aviseringar` |
| `Buy` | `Köp` |
| `Sell` | `Sälj` |
| Twitter/Telegram/Website buttons | Behåll engelska (brand names) |

### 12. `src/components/TransactionList.tsx`
| Engelska | Svenska |
|----------|---------|
| `Transactions` | `Transaktioner` |
| `Top Traders` | `Topphandlare` |
| `Holders` | `Innehavare` |
| `DATE` | `DATUM` |
| `TYPE` | `TYP` |
| `AMOUNT` | `ANTAL` |
| `PRICE` | `PRIS` |
| `Buy` / `Sell` | `Köp` / `Sälj` |
| Time format `en-US` | `sv-SE` |

### 13. `src/components/PriceChart.tsx`
| Engelska | Svenska |
|----------|---------|
| `Price` (toggle) | `Pris` |
| `Chart placeholder — OHLCV data will be connected later` | `Diagramplacering — OHLCV-data kopplas senare` |

### 14. `src/components/SearchBar.tsx`
| Engelska | Svenska |
|----------|---------|
| `Paste token address to search...` | `Klistra in tokenadress för att söka...` |
| `Go` | `Sök` |

---

## Tekniska detaljer
- Totalt 14 filer ändras
- Inga nya beroenden krävs
- Inga strukturella kodändringar, bara textsträngar
- Kryptovaluta-specifika termer (Token, SOL, MCap, FDV, MCAP, TXNS, MAKERS) behålls på engelska då de är branschstandard
