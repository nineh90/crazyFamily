# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Wer ist der Kunde & worum geht es?

**CRAZYFAMILY** ist die offizielle Website des deutschen Streaming-Duos **Alex & Kevin** (Schwager), die montags, mittwochs und freitags ab 17 Uhr live auf TikTok streamen. Entwickelt und betreut von **Nils-Digital** (info@nils-digital.de).

- **Live-URL:** https://crazyfamily.info
- **Shop:** https://crazyfamilylp.myspreadshop.de
- **Hosting:** Strato (Apache, PHP)
- **TikTok:** @crazyfamilylp · **YouTube:** @CrazyFamilyLP · **Discord:** https://discord.gg/H4TT6yR78w
- **Google Search Console:** eingerichtet ✓ (Verifizierung: `google99cbb17ab43e6112.html`)
- **Kein Google Analytics / kein Tracking eingebunden** – daher auch kein Cookie-Banner nötig. Vor Einbau eines Trackers: DSGVO-Consent klären.

---

## Arbeitsprinzipien (immer beachten)

- Vor jeder Änderung die `TODO.md` lesen – dort steht was als nächstes dran ist (`TODO.md` ist in `.gitignore`, existiert nur lokal)
- Tasks in `TODO.md` nach Abschluss auf `[x]` setzen
- Nichts implementieren was nicht in der Roadmap steht, ohne Rückfrage
- Commit nach jeder abgeschlossenen Phase
- **Markenrecht (Crash-Bandicoot-Vibe):** nur eigene CSS/Canvas-Assets + Emojis, eigene Web-Audio-Sounds, generische Mechaniken und Begriffe – keine fremden Logos, Namen oder Assets

---

## Lokale Entwicklung

Kein Build-Tool, kein npm. Seit der PHP-Migration wird ein **PHP-Server** benötigt (Partials werden per `include $_SERVER['DOCUMENT_ROOT'] . '/partials/...'` geladen):

```bash
php -S localhost:8080
# → http://localhost:8080
```

`config.php` (in `.gitignore`) definiert `YOUTUBE_API_KEY` – ohne die Datei läuft alles, nur das YouTube-Grid auf videos.php bleibt leer.

---

## Technischer Stack

- **PHP + HTML/CSS/JS** – keine Frameworks, keine Build-Tools
- Eine CSS-Datei: `css/style.css` (EINZIGE CSS-Datei für das gesamte Projekt)
- Header/Footer als PHP-Partials: `<?php include $_SERVER['DOCUMENT_ROOT'] . '/partials/header.php'; ?>`
- Inhalte als JSON in `assets/data/` (leichtgewichtiges CMS)
- `assets/js/includes.js` ist Legacy (altes fetch-Include-System) und wird von **keiner Seite mehr geladen**

### Seitenstruktur

```
index.php               → Startseite (Hero + Partikel-Canvas, Family, Shop-Highlights, Q&A)
pages/
  mods.php              → Moderatoren (aus mods.json)
  shop.php              → Spreadshop-Embed (shopclient.nocache.js)
  sounds.php            → Audio-Player (aus sounds.json)
  videos.php            → TikTok-Embed + YouTube-API-Grid (API-Key via config.php)
  events.php            → Eventkalender (calendar.js + events.json, Mo/Mi/Fr automatisch markiert)
  community.php         → Discord-Link-Seite (Discord-Feed noch offen, braucht Webhook)
  games.php             → Mini-Games-Bereich (Snake, Frucht-Fänger, Kisten-Smash, Memory)
  crazyfamily-land.php  → CrazyFamily Land: eigenständige Vollbild-Spielseite (Retro-Jump'n'Run,
                          lädt bewusst NICHT style.css – eigene Inline-Styles; verlinkt von games.php)
  crazyfamily-chomp.php → CrazyFamily Chomp: Vollbild-Labyrinth-Arcade (eigene Inline-Styles,
                          Highscore-Overlay via arcade.js, API-Key 'chomp'; verlinkt von games.php)
  crazyfamily-rush.php  → CrazyFamily Rush: Vollbild-3D-Endlosläufer (Three.js via CDN, 1,5 MB
                          inline Base64-Assets, Highscore-Overlay, API-Key 'rush')
  crazyfamily-tetris.php→ CrazyFamily Tetris: Vollbild-Block-Puzzle (eigene Inline-Styles, lädt
                          bewusst NICHT style.css). Jeder Stein trägt Alex/Kevin (inline Base64-Assets).
                          Highscore-Overlay via arcade.js, feuert bei Game Over cfgame:final
                          (API-Key 'tetris'); verlinkt von games.php
  crazyfamily-doom/     → CrazyFamily Doom: eigenständiger Unterordner (echte Doom-Engine als WASM
                          + Freedoom-WADs). index.php + game.js/doomgeneric.* + eigene .htaccess.
                          Highscore = getötete Monster/Session: die Engine ist minimal gepatcht
                          (cf_*-Lesefunktionen, siehe BUILD.txt/NOTICE.txt), game.js liest sie per
                          Module.ccall und feuert cfgame:final (API-Key 'doom', arcade.js geladen).
                          WADs sind gitignored – siehe Deployment. Verlinkt von games.php.
  impressum.php         → Impressum (noindex, follow)
partials/
  header.php            → Navigation (absolute Pfade /pages/*.php)
  footer.php            → Footer
config.php              → YOUTUBE_API_KEY (in .gitignore, manuell auf Strato pflegen)
assets/
  js/
    mods.js / qanda.js / sounds.js / videos.js / shop-highlights.js  → JSON-Renderer
    seasonal.js         → Saisonale Effekte (snow, hearts, leaves, flowers, pumpkin, sunglow, confetti, candle1–4, eggs)
    calendar.js         → Monatstabelle für events.php (STREAM_DAYS = [0,2,4] = Mo/Mi/Fr)
    particles.js        → Hero-Partikel-Canvas (nur index.php)
    crates.js           → Crash-Style Easter Eggs: ?-Kisten, Früchte, TNT, Konami-Code („crazyfamily"),
                          Pause/Reset-Panel, Counter in localStorage (cf_*) – auf ALLEN Seiten geladen
    games/
      arcade.js         → geteilte Basis (window.CFArcade: Sound, Partikel, Loop, Highscore-Bridge)
      snake.js / catcher.js / smash.js / memory.js
      land.js           → CrazyFamily Land (eigenständig, NICHT CFArcade – eigener Loop/Sound/Save,
                          localStorage-Key crazyfamily_land_save_v1). Feuert bei Game Over/Sieg
                          das Event `cfland:final` ({score, won}) – die Seite zeigt darauf das
                          Bestenlisten-Overlay (API-Key 'land' in highscores.php)
  api/
    highscores.php      → globale Top-10-Bestenliste ohne Accounts (schreibt highscores.json)
  data/                 → mods.json, qanda.json, seasonal.json, shop-highlights.json, sounds.json,
                          events.json, highscores.json (in .gitignore!)
js/
  main.js               → Splash, Burger-Menü, Header-Shrink, Quotes (auf allen Seiten)
css/
  style.css             → einzige CSS-Datei
```

### Script-Loading pro Seite

Alle Seiten laden `js/main.js`, `assets/js/seasonal.js` (außer impressum) und `assets/js/crates.js` (alle `defer`). Zusätzlich:

| Seite | Zusätzliche Scripts |
|-------|---------------------|
| `index.php` | `shop-highlights.js` (**ohne** `defer`, braucht `<script id="shopHighlightsSchema">` im HTML), `qanda.js`, `particles.js` |
| `pages/mods.php` | `mods.js` |
| `pages/sounds.php` | `sounds.js` |
| `pages/videos.php` | `videos.js` (liest `window.YOUTUBE_API_KEY`, gesetzt im `<head>` via config.php) |
| `pages/events.php` | `calendar.js` |
| `pages/games.php` | `games/arcade.js` + die 4 Spielmodule |
| `pages/crazyfamily-land.php` | **Ausnahme:** lädt NUR `games/arcade.js` (Highscore-Bridge) + `games/land.js` (kein main.js/seasonal/crates, keine Partials – Vollbild-Spielseite) |
| `pages/crazyfamily-chomp.php` | **Ausnahme:** komplettes Standalone-Spiel inline + NUR `games/arcade.js` (Highscore-Bridge). Spiel feuert bei Game Over `cfgame:final` → Seite zeigt Bestenlisten-Overlay (API-Key 'chomp') |
| `pages/crazyfamily-rush.php` | **Ausnahme:** wie Chomp (API-Key 'rush'); lädt zusätzlich Three.js + GLTF/DRACO-Loader via CDN. ~1,5 MB Datei (inline Base64-Assets) |
| `pages/crazyfamily-tetris.php` | **Ausnahme:** wie Chomp (API-Key 'tetris'); komplettes Standalone-Tetris inline + NUR `games/arcade.js`. ~0,7 MB Datei (inline Base64-Köpfe Alex/Kevin) |
| `pages/crazyfamily-doom/` | **Ausnahme:** eigenständig – lädt `game.js` + `doomgeneric.js/.wasm` + `arcade.js` (Highscore-Bridge, Key 'doom'). Eigene `.htaccess` (WASM-MIME, Caching). Score = Kills/Session über gepatchte cf_*-Engine-Exporte |

> **Highscore-Bridge für Standalone-Spiele:** Chomp & Rush bleiben unveränderte Standalone-Spiele; die EINZIGE Spiel-Änderung ist eine Zeile am Game-Over-Punkt, die `window.dispatchEvent(new CustomEvent('cfgame:final',{detail:{score}}))` feuert. Der Overlay-Controller + die Overlay-Styles (`#cfBoard`/`.lb-*`) liegen inline in der jeweiligen Seite (sie laden bewusst NICHT `style.css`) und hängen die globale Top-10 dran – analog zu `land.js`/`cfland:final`. In `games.php` selbst sind die drei neuen Spiele Link-Kacheln (`.game-tile--chomp/--rush/--doom`, in `style.css`).

**CSS-Pfade:** Root-Seite nutzt `css/style.css`, Unterseiten `../css/style.css`. Asset-/Script-Pfade in `pages/` sind absolut (`/assets/...`), nur `../js/main.js` und das Stylesheet sind relativ.

### JSON-Daten als CMS

| Datei | Zweck | Wichtige Felder |
|-------|-------|-----------------|
| `mods.json` | Team-Karten | `name`, `rolle`, `bild`, `beschreibung`, `links{}` (Keys: tiktok, youtube, amazon, discord, website) |
| `qanda.json` | Akkordeon-FAQ | `question`, `answer[]` (type: text/list) |
| `seasonal.json` | Saisonale Banner + Effekte | `start`/`end` (MM-DD), `effect`, `priority`, `placement` |
| `shop-highlights.json` | Produkt-Grid + JSON-LD | `isActive` (false = ausgeblendet), `priority` (höher = weiter oben), `images[]`, `price`, `badge` |
| `sounds.json` | Audio-Player | `titel`, `beschreibung`, `source` |
| `events.json` | Special Events im Kalender | `date` (YYYY-MM-DD), `title`, `type` (stream/special), `note` |
| `highscores.json` | globale Bestenliste | wird zur Laufzeit von `highscores.php` beschrieben – nie deployen/überschreiben. Erlaubte Spiel-Keys in `highscores.php` `$GAMES`: `snake`, `catcher`, `smash`, `memory`, `land`, `chomp`, `rush`, `doom`, `tetris` |

---

## Design-System

**Vibe:** Crash Bandicoot trifft Neon-Gaming-Arcade (Jungle/Sunset). Knallig, animiert, verspielt – aber lesbar.

```css
:root {
  --bg:     #0B0E14;  --text: #EDEDED;  --muted: #A9B0BE;
  --pink:   #FF3EA5;  /* Primärfarbe */
  --lime:   #B6FF00;  /* Sekundärfarbe */
  --cyan:   #00F5FF;  --purple: #B600FF;  --orange: #FF7300;
  --card:   #111626;  --yt: #FF0033;  --dc: #5865F2;
}
```

- **Audiowide** (Google Fonts) → Logo/Headlines (`.logo-font`), **Inter** → Fließtext
- Section-Akzentfarben: Hero=Pink, Family=Cyan, Shop=Lime, Q&A=Purple, Mods=Orange
- Wichtige Klassen: `.neon`, `.flimmer`, `.neon-border`, `.btn-shop`, `.chip--1/2/3`, Scanline-Overlay via `body::after`
- Animationen respektieren `prefers-reduced-motion`

---

## SEO (Stand: Phase 3 abgeschlossen, Audit 2026-06-04)

- Jede Seite hat: `<title>`, `meta description`, `canonical`, Open Graph + Twitter Cards
- `index.php`: Schema.org JSON-LD für `WebSite`, `Person` (Alex + Kevin) und wiederkehrendes `Event` (Mo/Mi/Fr 17 Uhr); `shop-highlights.js` schreibt `Product`-JSON-LD in `#shopHighlightsSchema`
- `sitemap_index.xml`: alle indexierbaren Seiten; **Impressum gehört NICHT hinein** (noindex). Bei neuen Seiten ergänzen + `lastmod` aktualisieren
- `robots.txt`: Disallow für `/config.php`, `/partials/`, `/assets/api/`
- `impressum.php`: `noindex, follow`
- Bilder: `alt` Pflicht, `width`/`height` gegen CLS, `loading="lazy"` unterhalb des Folds (gilt auch für JS-Templates in mods.js/videos.js/shop-highlights.js)
- `.htaccess`: HTTPS-Redirect, www-Entfernung, `.html → .php` 301-Redirects, Caching, GZIP

---

## Deployment (Strato) – Checkliste

1. `config.php` liegt nur auf dem Server (nicht in git) – bei Neuaufsetzung manuell hochladen
2. `assets/data/highscores.json` einmalig hochladen + **beschreibbar** machen (chmod), sonst speichert die Highscore-API nicht; bei Deploys NIE überschreiben
3. `.htaccess` prüfen (lokaler Dateiname korrekt mit zwei „s") – auch die eigene `.htaccess` in `pages/crazyfamily-doom/` mit hochladen (WASM-MIME!)
4. **CrazyFamily Doom:** `freedoom1.wad` + `freedoom2.wad` (je ~28 MB) sind gitignored → einmalig manuell nach `pages/crazyfamily-doom/` hochladen, sonst startet Doom nicht. `doomgeneric.js/.wasm` liegen dagegen im git
5. `TODO.md` ist gitignored – existiert nur lokal

---

## Roadmap-Status (Briefing 2026-06-02 / 2026-06-04)

| Phase | Status |
|-------|--------|
| 1 – Styling-Upgrade (Crash/Neon) | ✅ fertig |
| 2 – PHP-Migration | ✅ fertig |
| 3 – SEO | ✅ fertig |
| 4 – Features (Events, Community) | 🟩 fast fertig – Discord-Webhook für Community-Feed offen (braucht externe Konfiguration) |
| 5 – Easter Eggs + Mini-Games | 🟩 fast fertig – optionale „Schutzmaske" (Fly-by) offen |

**Bekannte Inkonsistenz:** TODO.md führt das Livestream-Status-Banner (4.1, `livestream.json`/`livestream.js`) als erledigt, die Dateien wurden aber in Commit `d45a09c` wieder gelöscht. Bei Bedarf neu umsetzen, nicht als vorhanden voraussetzen.
