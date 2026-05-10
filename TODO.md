# TODO — NA CESTY Project

**Stav projektu: Phase 2 ✅ HOTOVÁ**

| Fáza | Obsah | Stav |
|------|-------|------|
| **Phase 1** | Frontend prototyp (HTML/CSS/JS + localStorage) | ✅ HOTOVÁ |
| **Phase 2** | Backend + MariaDB + PHP API | ✅ HOTOVÁ |
| **Phase 2.5** | API Integrácia (aplikácia → DB) | ⏳ NAPLÁNOVANÉ |
| **Phase 3** | Pokročilé funkcie (EXIF, POI, počasie) | ⏳ BUDÚCNOSŤ |

## 🛠️ Setup

- [x] Vytvoriť adresárovú štruktúru (`css/`, `js/`, `assets/icons/`)
- [x] `index.html`, `trip.html`, `day.html` — inline `<head>` a nav (PHP includes pridáme až vo fáze 2)
- [x] `css/style.css` — CSS reset + design tokens
- [x] `assets/icons/logo.svg` — placeholder s gradientom + 🧭

> **Pozn.:** PHP includes (`includes/header.php`, `footer.php`, `nav.php`) **boli odstránené** — fáza 1 ide čisto cez HTML, lebo užívateľ ešte nemá rozchodený lokálny PHP server. PHP sa nasadí vo fáze 2.

## 🎨 Dizajn / design tokens

- [x] Farebná paleta (gradient cyan → fialová, neutrály, status farby)
- [x] Typografia (system font stack, 6 veľkostí)
- [x] Spacing škála (4 / 8 / 12 / 16 / 24 / 32 / 48)
- [x] Tiene (sm, md, lg, fab)
- [x] Border-radius (sm 8, md 12, lg 16, xl 20, full 9999)
- [x] Mapa emoji pre kategórie/typy aktivít

## 📱 Obrazovka 1: Home (`index.php`)

- [x] Hlavička s logom (PNG/SVG s emoji 🧭 fallbackom)
- [x] Filter tabs Aktívne / Archív
- [x] Karty výletov (názov, destinácia, dátumy, počet dní/aktivít/fotiek, badge)
- [x] Empty state
- [x] FAB „+ Nový výlet"
- [x] Modal Nový výlet (názov, destinácia, start, počet dní)

## 📱 Obrazovka 2: Detail výletu (`trip.php?id=...`)

- [x] Hero hlavička (názov, destinácia, dátumy, status, progress bar)
- [x] Tlačidlo späť
- [x] Karty dní s počasím (placeholder dáta) a počtom aktivít

## 📱 Obrazovka 3: Deň / Timeline (`day.php`)

- [x] Hlavička s počasím v subtitle
- [x] Tlačidlo späť na trip
- [x] Timeline aktivít (čiara medzi položkami, checkbox, čas, emoji, názov, popis)
- [x] Hodnotenie (😞 😐 😊) sa zobrazí po označení ako hotová
- [x] Galéria fotiek pod aktivitou + tlačidlo „pridať fotku"
- [x] Empty state
- [x] Tlačidlo „+" v navigácii

## 📱 Modal: Pridanie aktivity (3-krokový wizard) — ZÁKLADNÉ

- [x] Krok 1 — kategória (7 dlaždíc)
- [x] Krok 2 — typ (variabilne, podľa kategórie)
- [x] Krok 3 — formulár (názov, čas od/do, poznámka)
- [x] Progress bar krokov, tlačidlá Späť

## ✨ CSS REFACTOR — DESIGN UPDATE (✅ HOTOVÁ)

Zmena dizajnu podľa profesionálnych návrhov (screen1, screen2):

### Header & Design Tokens
- [x] Zmena header farby zo gradientu na solid #2d7a8f (medium tealova)
- [x] Pridané design tokeny: `--color-header`, `--color-header-light`
- [x] Aktualizovanie hover stavov pre header prvky

### Hero sekcia
- [x] Nová hero sekcia s background imagom (Unsplash placeholder)
- [x] Gradient overlay rgba(0,0,0,0.3) na fotografii
- [x] Responsive výšky: 200px (mobile), 300px (tablet), 400px (desktop)
- [x] Dynamické naplnenie hero textu (trip/day info)
- [x] Implementácia na `day.html` a `trip.html`

### Responsive Layout (Mobile-First)
- [x] **Mobile (360-414px)**: 1-stĺpcový layout (dni + timeline + panel stack)
- [x] **Tablet (768px)**: 2-stĺpcový layout (dni + timeline side-by-side)
- [x] **Desktop (1024px)**: 3-stĺpcový layout (dni | timeline | panel)
- [x] CSS grid `#day-detail` s breakpointami
- [x] Generovanie dní zoznamu v `renderDay()`
- [x] Zvýraznenie aktívneho dňa (`.day-card--active`)

### Timeline Activity Items
- [x] Zväčšenie ikony z 22px na 36px (40px container)
- [x] Nové štýly pre action buttons (`.activity__action-btn`)
- [x] Veľkosť action buttons: 32×32px

## ✨ FÁZA 1.1 + 1.2 + 1.3 + 1.4a — ROZŠÍRENÉ FUNKCIE (✅ HOTOVÉ)

### 1.1.1 — Rozšírenie kategórií a typov
- [x] **Doprava:** Pridaný typ `Metro/Subway` (🚇)
- [x] **Jedlo:** Rozšírené na 12 typov:
  - `Obed` (🍲), `Večera` (🍷), `Snack` (🍿), `Drink` (☕)
  - `Potraviny` (🛒), `Domáce` (🍳) — NOVÉ
  - Existujúce: Reštaurácia, Kaviareň, Fast food, Bar, Raňajky

### 1.1.2 — Tlačidlo na pridanie aktivity
- [x] Presunúť z **pravej strany na ľavú** v `day.html` nav
- [x] Zmeniť text z `+` na **`+ PRIDAJ`**
- [x] CSS trieda `.nav__action--add` pre správny layout

### 1.1.3 — Automatické vrátenie koncového času
- [x] Keď sa zmení `startTime`, `endTime` sa automaticky nastavi na **startTime + 1 hodina**
- [x] Event listener na `.change` v `#form-new-activity input[name="startTime"]`
- [x] Užívateľ môže `endTime` ručne zmeniť

### 1.1.4 — Pole na sumu v EUR
- [x] Nové pole v Kroku 3: `Suma (EUR)` — number input (0–9999.99)
- [x] Uloženie do `amount: null | number` v `Storage.activities`
- [x] Zobrazenie v timeline: **€ 15.50** (zelená farba #059669)
- [x] CSS `.activity__amount` štýl

### 1.2.1 — Inteligentný default čas
- [x] Funkcia `computeDefaultStartTime(dayId)` — nájde poslednú aktivitu v dňi
- [x] Default `startTime = endTime poslednej + 30 minút`
- [x] Ak žiadna aktivita: default `09:00`
- [x] Automaticky sa nastaví aj `endTime = startTime + 1h`
- [x] `Wizard.state.dayId` — pridané do state pri otvorení modalu

### 1.3.1 — Vlastný typ "INE" s pamäťou
- [x] Každá kategória má typ **`Iné` (✏️)** na konci
- [x] Funkcie `loadCustomTypes()` a `saveCustomType()` — localStorage `'nacesty.customTypes'`
- [x] V **Kroku 2:** Zobrazovanie saved custom types ako dodatočné tlačidlá
- [x] V **Kroku 3:** Validácia — title je **povinný** pre "ine" typ
- [x] Submit handler: Ak `type === 'ine'`, uloží custom type a nastaví `type: 'custom:NAZOV'`
- [x] Zapamätané názvy sa ponúkajú v ďalšom výbere ako `tile--custom`

### 1.4a — Umiestnenie (text pole)
- [x] Nové pole v Kroku 3: `Umiestnenie` — text input (max 160 znakov)
- [x] Uloženie do `location: null | string` v `Storage.activities`
- [x] Zobrazenie v timeline: **📍 Koloseum, Rím** (modrá farba #0891b2)
- [x] CSS `.activity__location` štýl

## 💾 Mock dáta + localStorage

- [x] Schéma JSON (trips, days, activities, photos)
- [x] `js/storage.js` — generický CRUD wrapper (collection factory)
- [x] `js/mock-data.js` — 3 výlety: Rím+Florencia (live), Tatry (planned), Praha (completed)
- [x] Auto-seed pri prvom načítaní (`Storage.isSeeded`)
- [x] Auto-generovanie `days` pri vytvorení výletu
- [x] Upload fotky cez FileReader → base64 do localStorage (limit 4 MB)

## 🎯 Interakcie

- [x] Toggle checkbox → ukladá stav, zobrazí výber smajlíkov
- [x] Klik na smajlík → uloží/zruší rating
- [x] Klik na fotku → `target="_blank"` (placeholder pre lightbox)
- [x] Kliknutie mimo modalu / Escape → zatvorenie
- [ ] ~~Drag fotky na aktivitu~~ → **presunuté do Fázy 3**

## ✨ Polish

- [x] Smooth animácie (slideUp pri modale, hover transforms, pulse pre live badge)
- [x] Empty states (3 varianty)
- [x] Touch-friendly veľkosti (44×44 tap targets, 48 px tlačidlá)
- [x] Focus states cez `:focus-visible`
- [x] `prefers-reduced-motion` rešpekt

## 🧪 Manuálny test scenár

- [ ] Otvoriť `index.html` (dvojklik alebo Live Server) → vidím 3 sample výlety (1 live, 1 planned, 1 v archíve)
- [ ] Vytvoriť nový výlet (3 dni) → zobrazí sa v Aktívne
- [ ] Otvoriť detail → vidím Day 1, 2, 3 s dátumami
- [ ] Otvoriť Day 1 → pridať aktivitu cez 3-krokový wizard
- [ ] Označiť ako hotovú → vybrať smajlík
- [ ] Pridať fotku → preview pod aktivitou
- [ ] Refresh stránky → dáta zostali
- [ ] Skontrolovať šírky: 360, 414, 768, 1024 px

## 🐛 Známe limity (pre fázu 2/3)

- localStorage limit ~5 MB → veľa fotiek = problém
- Photos sú base64 v rovnakom úložisku ako trips (riešime v phase 2 file storage)
- Bez auth, bez multi-user
- Počasie iba mock, nie reálne API
- Žiadne zoraďovanie aktivít drag&drop (fáza 3)
- Lightbox fotiek len `target="_blank"` (full overlay neskôr)

---

**Po dokončení manuálneho testu** → review s užívateľom → schválenie → presun na Fázu 2 (Backend + DB).
