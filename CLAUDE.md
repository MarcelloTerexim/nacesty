# NA CESTY — projektová dokumentácia

## O projekte

**NA CESTY** je webová aplikácia na plánovanie výletov, priebežné zaznamenávanie aktivít na časovej osi a automatické priraďovanie fotiek k udalostiam. Kombinuje plánovač + denník + fotogalériu do jedného systému.

Plná špecifikácia: `tripflow_prirucka.docx` v koreni projektu.

## Tech stack

- **Frontend:** čistý HTML5, CSS3, čistý JavaScript (vanilla, ES6+)
- **Backend:** PHP (vo fáze 1 iba na šablóny / `include`)
- **Databáza:** MariaDB (od fázy 2)
- **ŽIADNE frameworky** — žiadny React/Vue/Alpine, žiadny Bootstrap/Tailwind, žiadny jQuery, žiadny Laravel/Symfony, žiadny Composer balík bez súhlasu.

## Fázy vývoja

| Fáza | Obsah | Stav |
|------|-------|------|
| **1. Frontend prototyp** | UI, mock dáta v `localStorage`, žiadny backend | 🟡 prebieha |
| **2. Backend + DB + MVP** | PHP API, MariaDB, JWT auth, upload fotiek | ⚪ čaká |
| **3. Pokročilé funkcie** | Auto-priraďovanie fotiek (EXIF/GPS), POI (OSM), počasie, report PDF | ⚪ čaká |

## Štruktúra projektu

```
C:\www\nacesty\
├── index.html            Home — zoznam výletov
├── trip.html             Detail výletu (zoznam dní)
├── day.html              Timeline dňa
├── css/
│   └── style.css         globálne štýly + design tokens
├── js/
│   ├── app.js            UI logika, event handlers, router
│   ├── storage.js        localStorage CRUD wrapper
│   └── mock-data.js      sample výlety pri prvom spustení
├── assets/
│   └── icons/
│       └── logo.svg      placeholder logo (gradient + 🧭)
├── CLAUDE.md             tento súbor
├── TODO.md               zoznam úloh
└── tripflow_prirucka.docx
```

Vo fáze 2 sa pridá: `includes/` (PHP partials), `api/` (REST endpointy), `db/` (schéma + migrácie), `.htaccess`.

## Lokálne spustenie (fáza 1)

Fáza 1 je čisté HTML/CSS/JS — žiadny server netreba. Stačí dvojklik na `index.html` v prieskumníkovi (otvorí sa cez `file://`).

Ak preferuješ HTTP, ľubovoľný statický server stačí — napríklad cez VS Code rozšírenie „Live Server".

**Vo fáze 2** sa `.html` súbory premenia na `.php`, pridajú sa includes (header/footer/nav) a backend pripojenie na MariaDB.

**Reset dát:** v DevTools konzole `Storage.reset(); location.reload();` — sample dáta sa vygenerujú znova.

## Konvencie pre fázu 1

- **Jazyk UI:** **iba slovenčina** (žiadny i18n, žiadna angličtina v textoch).
- **Mobile-first** — primárny dizajn pre šírku 360–414 px, breakpointy nahor.
- **Bez autentifikácie** — žiadne login/register obrazovky.
- **Mock dáta v `localStorage`** — kľúč `nacesty.trips`, `nacesty.activities`, `nacesty.photos`.
- **Pri prvom spustení** sa do localStorage zapíšu sample dáta z `mock-data.js`.
- **Emoji ikony** pre typy aktivít: ✈️ 🚌 🚗 🚶 🍽️ 🏛️ 🏖️ 🛏️ atď.
- **Logo:** placeholder `assets/icons/logo.png` (alebo `.svg`) — užívateľ dodá neskôr. Do tej doby použiť emoji-fallback v hlavičke.
- **Vizuálny štýl:** moderný — gradient akcenty, zaoblené karty (border-radius 12–16 px), jemné tiene, veľa whitespace.
- **Lightbox fotiek:** vo fáze 1 placeholder (`<a target="_blank">` na full-size); skutočný overlay lightbox až neskôr.
- **PHP** sa zatiaľ používa len na `include` (spoločná hlavička/pätička), žiadna logika ani DB.

## Posunuté do neskorších fáz

- Drag & drop priradenia fotiek → **Fáza 3** (kde sa rieši aj auto-priraďovanie podľa EXIF/GPS).
- Lightbox / fullscreen prehliadač fotiek → fáza 2/3 (nie nutné pre prototyp).

## Pravidlá pre Claude

1. **Neinštaluj frameworky / knižnice** bez explicitného súhlasu užívateľa.
2. **Vo fáze 1 nepíš backend kód** (žiadny PHP fetch z DB, žiadne SQL, žiadne API endpointy).
3. **Pred prechodom do ďalšej fázy** počkaj na potvrdenie užívateľa.
4. **Drž sa štruktúry súborov** vyššie. Nové súbory pridávaj len po dohode.
5. **Ikony = emoji.** Žiadny FontAwesome, Lucide, Material Icons.
6. **Komentáre minimálne** — len keď je *prečo* nezrejmé. Žiadne JSDoc, žiadne PHPDoc bloky pre samozrejmé veci.
