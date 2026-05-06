-- =====================================================================
-- NA CESTY — databázová schéma (fáza 2)
-- MariaDB 10.4+, encoding utf8mb4, collation utf8mb4_slovak_ci
-- =====================================================================

SET NAMES utf8mb4 COLLATE utf8mb4_slovak_ci;

-- ---------------------------------------------------------------------
-- POZNÁMKA: Skript predpokladá, že databáza už existuje a je vybraná
-- (cez phpMyAdmin: klikni vľavo na svoju databázu → Import).
-- Ak máš lokálnu inštaláciu kde môžeš vytvárať DB, odkomentuj nižšie:
-- ---------------------------------------------------------------------
-- CREATE DATABASE IF NOT EXISTS nakurze_nacesty
--     CHARACTER SET utf8mb4
--     COLLATE utf8mb4_slovak_ci;
-- USE nakurze_nacesty;

-- ---------------------------------------------------------------------
-- Drop existujúcich tabuliek (pre opätovné spustenie počas vývoja)
-- Poradie: najprv tabuľky s FK, potom tie na ktoré sa odkazuje
-- ---------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS activity_types;
DROP TABLE IF EXISTS activity_categories;
DROP TABLE IF EXISTS days;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS poi;
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- USERS — používatelia
-- =====================================================================
CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(190) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100) NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;

-- =====================================================================
-- TRIPS — výlety
-- =====================================================================
CREATE TABLE trips (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(120) NOT NULL,
    destination     VARCHAR(120) NULL,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    days_count      SMALLINT UNSIGNED NOT NULL,
    status          ENUM('planned', 'live', 'completed') NOT NULL DEFAULT 'planned',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_trips_user (user_id),
    INDEX idx_trips_dates (start_date, end_date),

    CONSTRAINT fk_trips_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;

-- =====================================================================
-- DAYS — dni výletu
-- =====================================================================
CREATE TABLE days (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trip_id             BIGINT UNSIGNED NOT NULL,
    day_index           SMALLINT UNSIGNED NOT NULL,
    date                DATE NOT NULL,
    weather_temp        TINYINT NULL,
    weather_summary     VARCHAR(60) NULL,
    weather_emoji       VARCHAR(10) NULL,

    UNIQUE KEY uq_days_trip_index (trip_id, day_index),
    INDEX idx_days_date (date),

    CONSTRAINT fk_days_trip
        FOREIGN KEY (trip_id) REFERENCES trips(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;

-- =====================================================================
-- ACTIVITY_CATEGORIES — kategórie aktivít (lookup)
-- =====================================================================
CREATE TABLE activity_categories (
    slug            VARCHAR(40) NOT NULL PRIMARY KEY,
    label           VARCHAR(60) NOT NULL,
    emoji           VARCHAR(10) NOT NULL,
    sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;

-- =====================================================================
-- ACTIVITY_TYPES — typy aktivít v rámci kategórie (lookup)
-- =====================================================================
CREATE TABLE activity_types (
    slug            VARCHAR(40) NOT NULL PRIMARY KEY,
    category_slug   VARCHAR(40) NOT NULL,
    label           VARCHAR(60) NOT NULL,
    emoji           VARCHAR(10) NOT NULL,
    sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,

    INDEX idx_types_category (category_slug),

    CONSTRAINT fk_types_category
        FOREIGN KEY (category_slug) REFERENCES activity_categories(slug)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;

-- =====================================================================
-- ACTIVITIES — aktivity v dňoch
-- =====================================================================
CREATE TABLE activities (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    day_id          BIGINT UNSIGNED NOT NULL,
    category_slug   VARCHAR(40) NOT NULL,
    type_slug       VARCHAR(40) NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NULL,
    title           VARCHAR(160) NOT NULL,
    description     TEXT NULL,
    location_name   VARCHAR(160) NULL,
    lat             DECIMAL(9,6) NULL,
    lng             DECIMAL(9,6) NULL,
    is_completed    TINYINT(1) NOT NULL DEFAULT 0,
    rating          ENUM('bad', 'ok', 'good') NULL,
    order_index     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_activities_day (day_id, start_time),
    INDEX idx_activities_type (type_slug),
    INDEX idx_activities_category (category_slug),

    CONSTRAINT fk_activities_day
        FOREIGN KEY (day_id) REFERENCES days(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_activities_category
        FOREIGN KEY (category_slug) REFERENCES activity_categories(slug)
        ON UPDATE CASCADE,

    CONSTRAINT fk_activities_type
        FOREIGN KEY (type_slug) REFERENCES activity_types(slug)
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;

-- =====================================================================
-- PHOTOS — fotky priradené k výletom / aktivitám
-- =====================================================================
CREATE TABLE photos (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    trip_id         BIGINT UNSIGNED NOT NULL,
    activity_id     BIGINT UNSIGNED NULL,
    file_path       VARCHAR(500) NOT NULL,
    file_size       INT UNSIGNED NULL,
    width           SMALLINT UNSIGNED NULL,
    height          SMALLINT UNSIGNED NULL,
    taken_at        DATETIME NULL,
    lat             DECIMAL(9,6) NULL,
    lng             DECIMAL(9,6) NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_photos_trip (trip_id),
    INDEX idx_photos_activity (activity_id),
    INDEX idx_photos_taken (taken_at),

    CONSTRAINT fk_photos_trip
        FOREIGN KEY (trip_id) REFERENCES trips(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_photos_activity
        FOREIGN KEY (activity_id) REFERENCES activities(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;

-- =====================================================================
-- POI — body záujmu (pre návrhy)
-- =====================================================================
CREATE TABLE poi (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(160) NOT NULL,
    city                VARCHAR(80) NULL,
    country             VARCHAR(80) NULL,
    category            VARCHAR(40) NULL,
    lat                 DECIMAL(9,6) NULL,
    lng                 DECIMAL(9,6) NULL,
    rating              DECIMAL(2,1) NULL,
    osm_id              VARCHAR(64) NULL,
    google_place_id     VARCHAR(120) NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_poi_city (city),
    INDEX idx_poi_category (category),
    INDEX idx_poi_geo (lat, lng)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_slovak_ci;


-- =====================================================================
-- SEED — kategórie aktivít (zhodné s frontend CATEGORIES v js/app.js)
-- =====================================================================
INSERT INTO activity_categories (slug, label, emoji, sort_order) VALUES
    ('doprava',    'Doprava',    '🚗',  10),
    ('jedlo',      'Jedlo',      '🍽️', 20),
    ('kultura',    'Kultúra',    '🏛️', 30),
    ('oddych',     'Oddych',     '🏖️', 40),
    ('sport',      'Šport',      '🏃',  50),
    ('nakupy',     'Nákupy',     '🛍️', 60),
    ('ubytovanie', 'Ubytovanie', '🛏️', 70);

-- =====================================================================
-- SEED — typy aktivít
-- =====================================================================
INSERT INTO activity_types (slug, category_slug, label, emoji, sort_order) VALUES
    -- Doprava
    ('lietadlo', 'doprava', 'Lietadlo', '✈️', 10),
    ('bus',      'doprava', 'Bus',      '🚌', 20),
    ('vlak',     'doprava', 'Vlak',     '🚂', 30),
    ('auto',     'doprava', 'Auto',     '🚗', 40),
    ('mhd',      'doprava', 'MHD',      '🚊', 50),
    ('pesi',     'doprava', 'Pešo',     '🚶', 60),
    ('lod',      'doprava', 'Loď',      '🛳️', 70),

    -- Jedlo
    ('restauracia', 'jedlo', 'Reštaurácia', '🍽️', 10),
    ('kaviaren',    'jedlo', 'Kaviareň',    '☕',  20),
    ('fastfood',    'jedlo', 'Fast food',   '🍕',  30),
    ('bar',         'jedlo', 'Bar',         '🍷',  40),
    ('ranajky',     'jedlo', 'Raňajky',     '🥐',  50),

    -- Kultúra
    ('pamiatka', 'kultura', 'Pamiatka', '🏛️', 10),
    ('muzeum',   'kultura', 'Múzeum',   '🖼️', 20),
    ('divadlo',  'kultura', 'Divadlo',  '🎭', 30),
    ('koncert',  'kultura', 'Koncert',  '🎵', 40),
    ('kostol',   'kultura', 'Kostol',   '⛪', 50),

    -- Oddych
    ('plaz',   'oddych', 'Pláž',   '🏖️', 10),
    ('park',   'oddych', 'Park',   '🌳', 20),
    ('spa',    'oddych', 'Spa',    '🧖', 30),
    ('vyhlad', 'oddych', 'Výhľad', '🌅', 40),

    -- Šport
    ('turistika', 'sport', 'Turistika', '🥾', 10),
    ('bicykel',   'sport', 'Bicykel',   '🚴', 20),
    ('plavanie',  'sport', 'Plávanie',  '🏊', 30),
    ('lyzovanie', 'sport', 'Lyžovanie', '🎿', 40),

    -- Nákupy
    ('obchody',  'nakupy', 'Obchody',  '🛍️', 10),
    ('trhy',     'nakupy', 'Trhy',     '🏪', 20),
    ('suveniry', 'nakupy', 'Suveníry', '🎁', 30),

    -- Ubytovanie
    ('hotel',  'ubytovanie', 'Hotel',  '🏨', 10),
    ('airbnb', 'ubytovanie', 'Airbnb', '🏠', 20),
    ('hostel', 'ubytovanie', 'Hostel', '🛏️', 30),
    ('kemp',   'ubytovanie', 'Kemp',   '🏕️', 40);

-- =====================================================================
-- Hotovo. Schéma vytvorená, lookup tabuľky naplnené.
-- =====================================================================
