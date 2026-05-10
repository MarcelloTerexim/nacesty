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
| **1. Frontend prototyp** | UI, mock dáta v `localStorage`, žiadny backend | ✅ HOTOVÁ (2026-05-10) |
| **2. Backend + DB + MVP** | PHP API, MariaDB, CRUD endpointy, photo upload endpoint | ✅ HOTOVÁ (2026-05-10) |
| **2.5 API Integrácia** | Zmena Storage → API v app.js, aplikácia → DB zápis | ⏳ NAPLÁNOVANÉ |
| **3. Pokročilé funkcie** | Auto-priraďovanie fotiek (EXIF/GPS), POI (OSM), počasie, report PDF | ⏳ BUDÚCNOSŤ |

## Štruktúra projektu

```
C:\xampp\htdocs\nacesty\
├── index.php             Home — zoznam výletov (PHP)
├── trip.php              Detail výletu (PHP)
├── day.php               Timeline dňa (PHP)
├── config.php            Databázová konekcia (PDO)
├── seed.php              Seeding demo dát
├── css/
│   └── style.css         Globálne štýly + design tokens
├── js/
│   ├── app.js            UI logika, event handlers
│   ├── storage.js        localStorage CRUD wrapper
│   └── mock-data.js      Sample výlety (Phase 1)
├── api/
│   ├── trips.php         REST: GET/POST/PUT/DELETE trips
│   ├── activities.php    REST: GET/POST/PUT/DELETE activities
│   └── photos.php        REST: POST upload, GET, DELETE photos
├── photos/               Upload priečinok (pre fotky)
├── CLAUDE.md             Tento súbor
├── TODO.md               Zoznam úloh
└── PHASE2_SETUP.md       Phase 2 dokumentácia
```

**Phase 2 stav:**
- ✅ `config.php` — PDO konekcia na MariaDB
- ✅ `api/` — 3x REST endpointy (CRUD)
- ✅ MariaDB `nacesty_db` s tabuľkami (users, trips, days, activities, photos, custom_types)
- ✅ Demo dáta v DB (seed.php)
- ✅ HTML → PHP konverzia (index.php, trip.php, day.php)

## Lokálne spustenie

### Prerequisites
1. **XAMPP** so Apache + PHP 8.2+ + MariaDB
2. **MariaDB** — databáza `nacesty_db` vytvorená (schéma sql)

### Startup
```bash
# 1. Spusti XAMPP Control Panel
# 2. Klikni Start pri Apache a MySQL
# 3. Otvri v prehliadači:
http://localhost/nacesty/index.php
```

### Seed demo dáta
```
http://localhost/nacesty/seed.php
```
Vytvorí demo user a sample trip v DB.

### Test API
```
http://localhost/nacesty/api/trips.php
```
Mal by si vidieť JSON s tripmi z DB.

### Reset dát (localStorage)
V DevTools konzole: `Storage.reset(); location.reload();`

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

## ✨ Nové funkcie Fázy 1 (Etapa 1 — schválené 2026-05-10)

### Kategórie a typy aktivít — ROZŠÍRENÉ
- **Doprava:** Pridaný `Metro/Subway` (🚇)
- **Jedlo:** Rozšírené na 12 typov (Obed 🍲, Večera 🍷, Snack 🍿, Drink ☕, Potraviny 🛒, Domáce 🍳)

### Všetky aktivity majú nové polia
- **Suma (EUR):** Číslo 0–9999.99, zobrazuje sa ako **€ 15.50** (zelená)
- **Umiestnenie:** Text, max 160 znakov, zobrazuje sa ako **📍 Koloseum, Rím** (modrá)
- **Default čas:** StartTime sa automaticky počíta ako koniec poslednej aktivity + 30 min (ak prvá: 09:00)
- **Auto-endTime:** Keď sa zmení startTime, endTime sa automaticky nastaví na +1 hodina

### Tlačidlo "+ PRIDAJ"
- **Poloha:** Ľavá strana navigácie v `day.html`
- **Text:** "+ PRIDAJ" (namiesto len "+")
- **CSS:** `.nav__action--add` trieda

### Vlastný typ aktivity — "Iné"
- Každá kategória má typ **"Iné" (✏️)** na konci Kroku 2
- **Pamäť:** Zapisané custom names sa ukladajú do localStorage (`'nacesty.customTypes'`)
- **Zobrazenie:** Zapamätané nazvy sa ponúkajú ako tlačidlá v ďalšom výbere
- **Validácia:** Musí byť vyplnený názov aktivity
- **Uloženie:** V `Storage.activities.type` sa ukladá ako `'custom:NAZOV'`

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
