# CRAZYFAMILY – TODO & Fortschritt

> Abgestimmt im Briefing: 2026-06-02  
> Legende: `[ ]` offen · `[~]` in Arbeit · `[x]` erledigt

---

## PHASE 1 – Styling-Upgrade 🎨
> **Vibe:** Crash Bandicoot × Neon-Gaming-Arcade  
> **Status:** [x] Abgeschlossen

### 1.1 Neue CSS-Variablen
- [x] `--cyan: #00F5FF` in `:root` ergänzen
- [x] `--purple: #B600FF` in `:root` ergänzen
- [x] `--orange: #FF7300` in `:root` ergänzen

### 1.2 Scanline / CRT-Overlay
- [x] `body::after` mit `repeating-linear-gradient` für CRT-Linien
- [x] Opacity niedrig halten (~0.04) damit Text lesbar bleibt
- [x] `pointer-events: none` + `z-index` über allem anderen

### 1.3 Hero – Partikel-Hintergrund
- [x] Canvas-Element hinter dem Hero-Content einfügen
- [x] Neon-Punkte animiert in Pink/Cyan/Lime
- [x] Responsive (Canvas-Resize bei Fensteränderung)

### 1.4 Cards – Cartoon-Outline + Neon-Glow
- [x] `.card` bekommt `border: 3px solid #000` (dicke schwarze Outline)
- [x] `.card` bekommt `box-shadow` mit Neon-Glow (standardmäßig, nicht nur hover)
- [x] Hover: Glow intensiver + leichtes `translateY(-4px)`

### 1.5 Glitch-Effekt auf Überschriften
- [x] `@keyframes glitch` mit `transform: skew` animieren
- [x] Anwenden auf alle `h1` und `h2` mit `.logo-font`
- [x] `prefers-reduced-motion` respektieren

### 1.6 Button-Bounce-Animation (Crash-Bandicoot-Style)
- [x] `.btn:hover` bekommt übertriebene Hüpf-Animation (`@keyframes btnBounce`)
- [x] Shop-Button: Noch wilder – skew + scale + rotate beim Hover (`@keyframes shopBounce`)
- [x] Sound-Buttons: Wackeln beim Abspielen ← offen (sounds.js separat)

### 1.7 Section-Akzentfarben
- [x] Hero-Section → Primärfarbe bleibt Pink (`--pink`)
- [x] Family-Section → Akzent Cyan (`--cyan`)
- [x] Shop-Highlights-Section → Akzent Lime (`--lime`)
- [x] Q&A-Section → Akzent Purple (`--purple`)
- [x] Mods-Section → Akzent Orange (`--orange`)
- [x] Section-Überschriften in jeweiliger Akzentfarbe + Glow

### 1.8 Logo / Hero – Pseudo-3D-Effekt
- [x] CSS `filter: drop-shadow` mehrschichtig für Tiefenwirkung
- [x] Leichte Schaukel-Animation auf dem Duo-Bild (`@keyframes heroSway`)

### 1.9 Allgemeine Aufwertungen
- [x] `.logo_hero` (Sozial-Icons) bekommen Cartoon-Outline
- [x] Navigation: Aktiver Link bekommt Neon-Underline
- [x] Footer: Neon-Trennlinie oben intensivieren
- [x] Chip-Tags: Outline dicker + Farbe knalliger

---

## PHASE 2 – PHP-Migration 🔧
> **Status:** [x] Abgeschlossen

### 2.1 Vorbereitung
- [x] `config.php` anlegen (YouTube API-Key, nicht in git → `.gitignore` erweitern)
- [x] `.gitignore` erstellen/aktualisieren
- [ ] **⚠️ VOR DEPLOYMENT:** `LIVE_PIN` in `config.php` Zeile 3 ändern – aktuell `'1234'`, bitte auf eigenen PIN setzen. Datei danach manuell auf Strato hochladen (ist gitignored).

### 2.2 Seiten umbenennen
- [x] `index.html` → `index.php`
- [x] `pages/mods.html` → `pages/mods.php`
- [x] `pages/shop.html` → `pages/shop.php`
- [x] `pages/sounds.html` → `pages/sounds.php`
- [x] `pages/videos.html` → `pages/videos.php`
- [x] `pages/impressum.html` → `pages/impressum.php`
- [x] `partials/header.html` → `partials/header.php`
- [x] `partials/footer.html` → `partials/footer.php`

### 2.3 PHP-Includes einbauen
- [x] Jede Seite: `<div data-include="...">` ersetzen durch `<?php include $_SERVER['DOCUMENT_ROOT'] . '/partials/header.php'; ?>`
- [x] `assets/js/includes.js` deaktiviert – Script-Tag aus allen PHP-Seiten entfernt
- [x] Absolute Pfade in `header.php` Navigation (`/pages/mods.php` statt `../pages/mods.html`)

### 2.4 `.htaccess` anpassen
- [x] `.html`-Aufrufe auf `.php` weiterleiten (301)
- [x] Lokale Datei `.htacces` → `.htaccess` (korrekt benannt, PHP-Regel ergänzt)

### 2.5 Code-Bereinigung (im Zuge der Migration)
- [x] Doppelter `</head>`-Tag in `pages/shop.html` entfernt (shop.php sauber)
- [x] `shop.php` Navigation einkommentiert – Header per PHP eingebunden
- [x] Oster-Effekt `eggs` in `seasonal.js` implementiert (+ CSS `.egg-rise`)
- [x] YouTube API-Key aus `videos.js` entfernt → `window.YOUTUBE_API_KEY` aus `videos.php`/`config.php`

---

## PHASE 3 – SEO-Optimierung 🔍
> **Status:** [x] Abgeschlossen  
> **Search Console:** eingerichtet ✓  
> **Ziel-Keywords:** CrazyFamily, Alex und Kevin, CrazyFamilyLP, TikTok Streamer Gaming, Gaming Duo Deutschland

### 3.1 Technisches SEO
- [x] H2 "CRAZYFAMILY" in `index.php` sichtbar gemacht (inline `display:none` entfernt)
- [x] Alle Bilder: `alt`-Texte geprüft – alle relevanten Bilder haben aussagekräftige Alts
- [x] Alle Bilder: `width`/`height`/`loading="lazy"` geprüft – vorhanden auf allen Seiten
- [x] `sitemap_index.xml` aktualisiert (.html → .php, events.php + community.php ergänzt)
- [x] `robots.txt` geprüft + `Disallow: /config.php` ergänzt

### 3.2 Schema.org Strukturierte Daten
- [x] `Person` Schema für Alex in `index.php` (JSON-LD)
- [x] `Person` Schema für Kevin in `index.php` (JSON-LD)
- [x] `Event` Schema für wiederkehrende Streams (Mo/Mi/Fr 17 Uhr, eventSchedule) in `index.php`
- [x] `Product` Schema in `shop-highlights.js` vervollständigt (URL .html → .php)
- [x] `WebSite` Schema in `index.php` (JSON-LD, mit Organization + sameAs)

### 3.3 Meta-Tags optimieren
- [x] `index.php` – Title + Description + Keywords geprüft (bereits keyword-optimiert)
- [x] `pages/mods.php` – Description geprüft (klar und keyword-reich)
- [x] `pages/shop.php` – Description geprüft (Produktkategorien vorhanden)
- [x] `pages/sounds.php` – Description geprüft (Audio-Content benannt)
- [x] `pages/videos.php` – Description geprüft (YouTube + TikTok benannt)
- [x] `pages/impressum.php` – `noindex, nofollow` bereits in Phase 2 ergänzt

### 3.4 Interne Verlinkung
- [x] Mods-Seite: "← Zurück zur Startseite" Link ergänzt
- [x] Shop-Highlights auf Startseite: "Alle Produkte im Shop →" CTA-Button unterhalb des Grids
- [x] Sounds-Seite: Cross-Link zu Videos-Seite ergänzt
- [x] Footer: alle Seiten verlinkt (Mods, Videos, Sounds, Events, Shop, Impressum)

---

## PHASE 4 – Neue Features ✨
> **Status:** [x] Abgeschlossen (Discord-Webhook für Community-Seite → ausstehend, benötigt externe Konfiguration)

### 4.1 Livestream-Status-Banner
- [x] `assets/data/livestream.json` angelegt (isLive: false, manuell toggeln)
- [x] `assets/js/livestream.js` erstellt (lädt JSON, zeigt Banner wenn isLive: true)
- [x] CSS für LIVE-Badge (pulsierend, Neon-Rot, sticky)
- [x] In `header.php` eingebunden → auf allen Seiten aktiv
- [x] Auf allen Seiten aktiv (via header.php)

### 4.2 Eventkalender

> **JSON-Format für `assets/data/events.json`** (für spätere Einträge):
> ```json
> [
>   {
>     "date": "YYYY-MM-DD",
>     "title": "Titel des Events",
>     "type": "special",
>     "note": "Kurze Beschreibung für die Event-Liste"
>   }
> ]
> ```
> `type`-Werte: `"stream"` (normaler Stream-Tag) · `"special"` (Sonder-Event, wird farblich hervorgehoben)

- [x] `assets/data/events.json` angelegt (Special Events)
- [x] `pages/events.php` erstellt (Monatstabelle + Event-Liste)
- [x] `assets/js/calendar.js` – Monatstabelle als CSS-Grid (Bug: STREAM_DAYS war [1,3,5] → korrigiert auf [0,2,4] = Mo/Mi/Fr)
- [x] Wochentage Mo/Mi/Fr automatisch als Stream-Tage markiert (🎮)
- [x] Navigation-Link "Events" in `header.php` ergänzt
- [x] `sitemap_index.xml` mit events.php + community.php aktualisiert

### 4.3 Community / Fanwall
- [x] `pages/community.php` angelegt (Discord-Link-Seite mit Social Links)
- [x] Navigation-Link "Community" in `header.php` ergänzt
- [ ] Discord-Bot / Zapier-Webhook einrichten → **benötigt externe Konfiguration durch Nils/Kunden**
- [ ] Konzept für Discord-Feed noch offen (Webhook URL vom Discord-Server nötig)

---

## Technische Schulden (beim Bearbeiten mitfixen) 🐛

- [x] `pages/shop.html:32` – doppelter `</head>`-Tag entfernt (in shop.php behoben)
- [x] `css/style.css` – `@keyframes rise/fall/bloom` Duplikate entfernt; `@keyframes flicker`-Duplikat behoben (Kerzen-Variante → `candleFlame`)
- [x] `assets/js/videos.js:18` – API-Key ausgelagert → `window.YOUTUBE_API_KEY` via `config.php`
- [x] `partials/header.html` – relative Pfade → absolute `/pages/*.php` in `header.php`
- [x] `pages/shop.html` – Navigation einkommentiert (header.php per PHP eingebunden)
- [x] `assets/js/seasonal.js` – `eggs`-Effekt implementiert (Ostern)

---

---

## PHASE 5 – Crash Bandicoot Easter Eggs 🟠
> **Idee:** Interaktive Spielereien im Crash-Bandicoot-Stil, eigener Stil (kein Copyright)
> **Status:** [~] In Arbeit

### 5.1 Kisten-System (Easter Eggs) ← FERTIG
- [x] `assets/js/crates.js` erstellt – eigenständiges Modul, IIFE
- [x] **3 Kistentypen** (CSS-only, kein Copyright):
  - [x] Normale Kiste `!` – braunes Holzdesign via CSS-Gradienten (60% Chance)
  - [x] Frage-Kiste `?` – lila/cyan Neon, zeigt zufälligen CrazyFamily-Quote (30%)
  - [x] TNT-Kiste – dunkelrot, pulsierend, löst Screen-Shake aus (10%)
- [x] 2–3 zufällige Kisten pro Seitenaufruf an Randpositionen (fixed)
- [x] Click/Enter/Space → Smash-Animation (scale + rotate + fade)
- [x] Partikelexplosion je nach Kistentyp (12–22 Partikel, typgerechte Farben)
- [x] Web Audio API Sounds: Holzknacken / Jingle / Tiefes Bumm (kein Copyright)
- [x] Screen-Shake bei TNT (`body.cf-shake` + `@keyframes cf-shake-kf`)
- [x] Quote-Popup bei `?`-Kiste (CrazyFamily-Insider-Quotes, Neon-Cyan-Style)
- [x] `🪵 X` Wumpa-Counter (fixed bottom-right, persistent via `localStorage`)
- [x] **Crash-Runner** nach jeder 5. Kiste: oranges Blob-Männchen mit Laufbeinen + `!` über dem Kopf läuft über den Bildschirm
- [x] In alle 6 Seiten eingebunden (`index.php`, alle `pages/*.php`)
- [x] CSS in `style.css` ergänzt (Kisten, Partikel, Shake, Popup, Counter, Runner)
- [x] `prefers-reduced-motion` respektiert

### 5.2 Erweiterungen ← FERTIG (Briefing 2026-06-04)
- [x] **Sammel-Früchte** – 🍎 fallen vom oberen Rand, anklicken/Enter zum Sammeln; eigener Counter (`cf_fruit` in localStorage), eigener Pop + Blip-Sound. Max. 2 gleichzeitig, Spawn alle ~11–20 s. *(markenrechtlich generisch gehalten: kein „Wumpa"-Wording im sichtbaren UI)*
- [x] **Konami-Code** – tippe **`crazyfamily`** → alle Kisten spawnen gleichzeitig + Konfetti-Regen + „CRAZY!"-Overlay
- [x] **Tag-basiertes Spawn-System** – an Stream-Tagen (Mo/Mi/Fr) spawnen TNT-Kisten 3× häufiger (`isStreamDay()` in `crates.js`)
- [x] **Highscore / Master-Badge** – bei Meilensteinen (10/25/50/100/250/500 Kisten) erscheint kurz ein „MASTER · X"-Overlay (einmalig pro Stufe, `cf_master` in localStorage)
- [x] **Idle-Trigger** – nach 30 s Inaktivität wackelt eine zufällige Kiste auffällig (`cf-crate--attention`); Reset bei Maus/Tastatur/Scroll/Touch
- [ ] **Eigene Schutzmaske (Fly-by)** – generische Stammesmaske statt „Aku-Aku" (markenrechtlich neu gedacht); noch offen, optionales Extra

### 5.2b Feinjustierung Kisten (Briefing 2026-06-04) ← FERTIG
- [x] **Weniger Kisten, völlig wahllos** – kein Batch beim Seitenaufruf mehr; nur noch **Spruch-Kisten** (`?`) spawnen zeitgesteuert, **~1–2 pro Minute** (Intervall 30–60 s), max. 2 gleichzeitig; ungeklickte Kisten verschwinden nach 22 s leise
- [x] **Gelegentlicher Apfel** bleibt unverändert erhalten
- [x] **Pause-Button** – stoppt Kisten + Früchte, entfernt aktive Elemente, blendet die Counter aus (Play-Button bleibt sichtbar); Status persistent (`cf_paused` in localStorage)
- [x] **Reset-Button** – löscht Kisten-, Frucht- & Master-Score (`🗑`); kleines Steuer-Panel unten rechts über den Countern

### 5.3 Mini-Games-Bereich ← VOM KUNDEN GEWÜNSCHT (2026-06-04)
> **Status:** [x] Umgesetzt (Briefing 2026-06-04 abgestimmt: volle Zone, 4 Spiele, Crash/Neon-Stil,
> Highscores lokal + leichtgewichtige globale Bestenliste ohne Accounts).
> Eigener Bereich `pages/games.php` mit browserbasierten Mini-Games (reines JS/Canvas, kein Build-Tool).
>
> **Abgestimmte Eckpunkte:**
> - Spiele: 🐍 Snake · 🍎 Frucht-Fänger · 📦 Kisten-Smash · 🧠 Memory
> - Mobile/Touch: Pflicht ✓ (Swipe für Snake, Tap/Drag für Rest, `touch-action:none`)
> - Highscores: lokal (localStorage) **+** globale Top-10 ohne Login (nur Spitzname) via PHP
> - Stil: voll im Crash/Neon-Look, recycelt Sounds/Partikel-Technik aus `crates.js`
>
> **Markenrecht:** nur eigene CSS/Canvas-Assets + Emojis, eigene Web-Audio-Sounds,
> generische Mechaniken, keine fremden Logos/Namen.
>
> **Architektur:** `assets/js/games/arcade.js` (geteilte Basis: `window.CFArcade` – Sound,
> Partikel, Loop, Highscore-Bridge) + je ein Modul `snake.js` / `catcher.js` / `smash.js` /
> `memory.js`. API-Endpoint `assets/api/highscores.php` (+ `assets/data/highscores.json`).
>
- [x] Konzept + Spielauswahl mit Kunde final abstimmen
- [x] `pages/games.php` anlegen (Layout im Crash-Stil, Auswahl-Grid + Bühne + Bestenliste)
- [x] Navigation-Link "Games" in `header.php` + Footer ergänzen
- [x] `sitemap_index.xml` um `games.php` erweitern
- [x] Mini-Games implementiert: Snake, Frucht-Fänger, Kisten-Smash, Memory
- [x] Highscore-Anzeige (localStorage) + globale Bestenliste (PHP-API, ohne Accounts)
- [x] `assets/data/highscores.json` in `.gitignore` (Deploy darf Server-Liste nicht überschreiben)
- [ ] **⚠️ VOR/BEIM DEPLOYMENT:** `assets/data/highscores.json` einmalig auf Strato hochladen
      und **beschreibbar** machen (chmod), damit die PHP-API Scores speichern kann.

### 5.4 Kevins neue Spiele integrieren ← VOM KUNDEN GEWÜNSCHT (2026-06-15)
> **Status:** [x] Umgesetzt. Drei von Kevin gebaute Spiele (Übergabe-Ordner `Games/`)
> nach dem `crazyfamily-land.php`-Muster als eigenständige Vollbild-`.php`-Seiten eingebunden.
> Spiele selbst unverändert – einzige Änderung: 1 Zeile Game-Over-Event für den Highscore.
> Abgestimmt: Doom ohne Highscore, WADs nicht in git.

- [x] **CrazyFamily Chomp** → `pages/crazyfamily-chomp.php` (Labyrinth-Arcade), Highscore-Overlay (API-Key `chomp`)
- [x] **CrazyFamily Rush** → `pages/crazyfamily-rush.php` (3D-Runner, Three.js via CDN), Highscore-Overlay (API-Key `rush`)
- [x] **CrazyFamily Doom** → `pages/crazyfamily-doom/` (echte Doom-Engine, WASM) – **bewusst ohne Highscore** (Engine liefert keinen auslesbaren Score)
- [x] Highscore-Event `cfgame:final` in Chomp & Rush (je 1 Zeile am Game-Over-Punkt) + Overlay-Controller/-Styles inline
- [x] `assets/api/highscores.php`: Keys `chomp` + `rush` ergänzt (Cap 999999); Doom bewusst nicht
- [x] `pages/games.php`: drei Link-Kacheln + Schema.org-`ItemList` (jetzt 8 Spiele) + Intro/Meta erweitert
- [x] `css/style.css`: Kachel-Modifier `.game-tile--chomp/--rush/--doom`
- [x] `sitemap_index.xml`: drei neue Spielseiten ergänzt
- [x] `.gitignore`: `*.wad` (58 MB) + `serve.py` + Übergabe-Ordner `Games/` ausgeschlossen
- [ ] **⚠️ VOR/BEIM DEPLOYMENT:** `freedoom1.wad` + `freedoom2.wad` einmalig manuell nach `pages/crazyfamily-doom/` auf Strato laden (gitignored) + die dortige `.htaccess` mit hochladen (WASM-MIME)
- [ ] Übergabe-Ordner `Games/` löschen, sobald alles live verifiziert ist (enthält nur noch die Quell-HTMLs von Chomp & Rush)

---

## Fortschritts-Übersicht

| Phase | Fortschritt | Status |
|-------|-------------|--------|
| Phase 1 – Styling | 25 / 25 Tasks | ✅ Abgeschlossen |
| Phase 2 – PHP-Migration | 20 / 20 Tasks | ✅ Abgeschlossen |
| Phase 3 – SEO | 14 / 14 Tasks | ✅ Abgeschlossen |
| Phase 4 – Features | 9 / 11 Tasks | 🟩 Nahezu fertig (Discord-Webhook offen) |
| Phase 5 – Easter Eggs | 28 / 30 Tasks | 🟩 Kisten + Mini-Games fertig (optionale Maske + Strato-Schreibrechte offen) |
| Technische Schulden | 6 / 6 Tasks | ✅ Abgeschlossen |
