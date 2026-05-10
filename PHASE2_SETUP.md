# Phase 2 Setup — Backend + MariaDB + API

**Stav: ✅ HOTOVÁ (2026-05-10)**

## 📋 Setup guide

### Prerequisites
- Apache + PHP 8.2+ (XAMPP)
- MariaDB (súčasť XAMPP)
- Browser s localStorage

### Projekt path
```
C:\xampp\htdocs\nacesty\
```

### Súbory Phase 2

```
nacesty/
├── index.php          (aplikácia — čítanie z localStorage)
├── trip.php           (detail výletu)
├── day.php            (timeline dňa)
├── config.php         (DB konekcia — PDO)
├── seed.php           (seeding demo dát)
├── api/
│   ├── trips.php      (REST: GET/POST/PUT/DELETE trips)
│   ├── activities.php (REST: GET/POST/PUT/DELETE activities)
│   └── photos.php     (REST: POST upload, GET, DELETE)
├── photos/            (upload priečinok)
├── css/
│   └── style.css
├── js/
│   ├── app.js         (UI logika)
│   ├── storage.js     (localStorage CRUD)
│   └── mock-data.js   (sample dáta)
└── db/
    └── schema.sql     (databázová schéma)
```

## 🗄️ Databáza

**Databáza:** `nacesty_db`
**Server:** localhost
**User:** root (XAMPP default)

### Tabuľky
- `users` — užívateľi
- `trips` — výlety
- `days` — dni výletov
- `activities` — aktivity
- `photos` — fotky na serveri
- `custom_types` — pamäť custom typov

### Demo user
```
Email: demo@nacesty.sk
Password: demo123
User ID: 1
```

## 🔌 API Endpointy

### Trips
```
GET    /api/trips.php              — zoznam všetkých tripov
POST   /api/trips.php              — nový trip
PUT    /api/trips.php?id=xxx       — update trip (status, name)
DELETE /api/trips.php?id=xxx       — zmazať trip
```

### Activities
```
GET    /api/activities.php?day_id=xxx   — aktivity pre deň
POST   /api/activities.php              — nová aktivita
PUT    /api/activities.php?id=xxx       — update aktivitu
DELETE /api/activities.php?id=xxx       — zmazať aktivitu
```

### Photos
```
POST   /api/photos.php              — upload fotky (multipart/form-data)
GET    /api/photos.php?activity_id=xxx  — fotky pre aktivitu
DELETE /api/photos.php?id=xxx           — zmazať fotku
```

## 📊 Aktuálny stav aplikácie

### Phase 1 (Frontend)
✅ HTML/CSS/JS frontend funguje
✅ Dáta v localStorage
✅ UI: trips, days, activities, photos
✅ 3-step wizard na pridanie aktivity

### Phase 2 (Backend)
✅ MariaDB databáza s schémou
✅ PHP config (PDO konekcia)
✅ API endpointy (CRUD operácie)
✅ Demo dáta v DB

### Phase 2.5 (Budúcnosť)
⏳ API wrapper v JavaScripte (API.js)
⏳ Zmena Storage → API v app.js
⏳ Aplikácia → DB zápis

## 🚀 Testing

### 1. Načítaj aplikáciu
```
http://localhost/nacesty/index.php
```

### 2. Testuj API
```
http://localhost/nacesty/api/trips.php
```
Mal by si vidieť JSON s tripmi z DB.

### 3. Seed demo dáta
```
http://localhost/nacesty/seed.php
```

## 📝 Notes

- Aplikácia v Phase 2 **stále používa localStorage** (Phase 1 hybrid)
- API endpointy sú **pripravené, ale nevyužívané**
- Phase 2.5 bude **prepojenie aplikácie s API**
- Auth nie je implementovaná (demo user = 1)

## ⚠️ Known limitations

- Žiadna autentifikácia (demo user_id = 1)
- Photo upload bez validácie MIME type
- Žiadne error handling na frontend (Phase 2.5)
- localStorage limit ~5MB
