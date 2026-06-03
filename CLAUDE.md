# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Wer ist der Kunde & worum geht es?

**CRAZYFAMILY** ist die offizielle Website des deutschen Streaming-Duos **Alex & Kevin** (Schwager), die montags, mittwochs und freitags ab 17 Uhr live auf TikTok streamen. Entwickelt und betreut von **Nils-Digital** (info@nils-digital.de).

- **Live-URL:** https://crazyfamily.info
- **Shop:** https://crazyfamilylp.myspreadshop.de
- **Hosting:** Strato (Apache)
- **TikTok:** @crazyfamilylp
- **YouTube:** @CrazyFamilyLP
- **Discord:** https://discord.gg/H4TT6yR78w
- **Google Search Console:** eingerichtet ✓

---

## Arbeitsprinzipien (immer beachten)

- Vor jeder Änderung die `TODO.md` lesen – dort steht was als nächstes dran ist
- Tasks in `TODO.md` nach Abschluss auf `[x]` setzen
- Nichts implementieren was nicht in der Roadmap steht, ohne Rückfrage
- Commit nach jeder abgeschlossenen Phase

---

## Lokale Entwicklung

Kein Build-Tool, kein npm. Nur ein lokaler Webserver wegen CORS (fetch für Partials/JSON):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

---

## Aktueller Technischer Stack

- **Reines HTML/CSS/JS** – keine Frameworks, keine Build-Tools
- Eine CSS-Datei: `css/style.css`
- Partials (Header/Footer) werden client-seitig per `fetch()` geladen (`assets/js/includes.js`)
- Alle Inhalte als JSON in `assets/data/`

### Seitenstruktur

```
index.html              → Startseite (Hero, Family-Cards, Shop-Highlights, Q&A)
pages/
  mods.html             → Moderatoren (geladen aus mods.json)
  shop.html             → Spreadshop-Iframe (crazyfamilylp.myspreadshop.de)
  sounds.html           → Audio-Player (geladen aus sounds.json)
  videos.html           → TikTok-Embed + YouTube-API-Grid
  impressum.html        → Impressum
partials/
  header.html           → Navigation (wird per fetch() eingebunden)
  footer.html           → Footer (wird per fetch() eingebunden)
assets/
  js/
    includes.js         → Lädt header.html + footer.html via data-include="", danach initHeaderInteractions()
    mods.js             → Rendert mods.json in Cards
    qanda.js            → Rendert qanda.json als Accordion
    seasonal.js         → Saisonale Effekte (Schnee, Herzen etc.) via seasonal.json
    shop-highlights.js  → Rendert shop-highlights.json als Produkt-Grid + schreibt JSON-LD in #shopHighlightsSchema
    sounds.js           → Audio-Player aus sounds.json
    videos.js           → YouTube-API + TikTok-Embed
  data/
    mods.json           → Moderatoren-Daten
    qanda.json          → Q&A-Fragen und Antworten
    seasonal.json       → Saisonale Events (Datum, Effekt, Nachricht)
    shop-highlights.json → Produkt-Highlights (isActive, priority, images, price)
    sounds.json         → Audio-Tracks
css/
  style.css             → EINZIGE CSS-Datei für das gesamte Projekt
js/
  main.js               → Splash, Burger-Menü, Quotes/Chips (geladen auf allen Seiten)
```

### Script-Loading pro Seite

Alle Seiten laden `js/main.js` und `assets/js/includes.js` (beide `defer`). Seitenspezifische Scripts:

| Seite | Zusätzliche Scripts |
|-------|---------------------|
| `index.html` | `assets/js/shop-highlights.js`, `assets/js/qanda.js`, `assets/js/seasonal.js` |
| `pages/mods.html` | `assets/js/mods.js`, `assets/js/seasonal.js` |
| `pages/sounds.html` | `assets/js/sounds.js`, `assets/js/seasonal.js` |
| `pages/videos.html` | `assets/js/videos.js`, `assets/js/seasonal.js` |
| `pages/impressum.html` | `assets/js/seasonal.js` |

**Achtung Ladereihenfolge:** `includes.js` muss nach `js/main.js` geladen werden, da beide `defer` nutzen und `includes.js` intern `initHeaderInteractions()` aufruft – das setzt die Burger-Listener neu. `shop-highlights.js` auf `index.html` läuft **ohne** `defer` und benötigt das bereits im HTML vorhandene `<script id="shopHighlightsSchema" type="application/ld+json">`.

**CSS-Pfade:** Root-Seite nutzt `css/style.css`, Unterseiten in `pages/` nutzen `../css/style.css`.

### Include-System

```html
<!-- In jeder HTML-Seite: -->
<div data-include="/partials/header.html"></div>
<div data-include="/partials/footer.html"></div>
```

`assets/js/includes.js` ersetzt diese divs per `fetch()`. **SEO-nachteilig** – wird mit der PHP-Migration ersetzt.

### JSON-Daten als CMS

| Datei | Zweck | Wichtige Felder |
|-------|-------|-----------------|
| `mods.json` | Team-Karten | `name`, `rolle`, `bild`, `beschreibung`, `links{}` |
| `qanda.json` | Akkordeon-FAQ | `question`, `answer[]` (type: text/list) |
| `seasonal.json` | Saisonale Banner + Effekte | `start/end` (MM-DD), `effect`, `priority`, `placement` |
| `shop-highlights.json` | Produkt-Grid | `isActive`, `priority`, `images[]`, `price`, `badge` |
| `sounds.json` | Audio-Player | `titel`, `beschreibung`, `source` |

Shop: `isActive: false` = ausgeblendet. XMAS-Produkte bleiben deaktiviert bis zur Saison.

Seasonal-Effekte: `snow`, `hearts`, `leaves`, `flowers`, `pumpkin`, `sunglow`, `confetti`, `candle1–4`. (`eggs` ist in der JSON referenziert aber **nicht implementiert** – Oster-Effekt fehlt noch.)

---

## Design-System (aktuell)

### Farben

```css
:root {
  --bg:     #0B0E14;  /* Haupt-Hintergrund */
  --text:   #EDEDED;  /* Haupttext */
  --muted:  #A9B0BE;  /* Sekundärtext */
  --pink:   #FF3EA5;  /* Neon-Pink – Primärfarbe */
  --lime:   #B6FF00;  /* Neon-Lime – Sekundärfarbe */
  --card:   #111626;  /* Card-Hintergrund */
  --yt:     #FF0033;  /* YouTube-Rot */
  --dc:     #5865F2;  /* Discord-Blau */
}
```

### Schriften

- **Audiowide** (Google Fonts) → Logo, Headlines (`.logo-font`)
- **Inter** (System-Font) → Fließtext

### Wichtige CSS-Klassen

- `.logo-font` → Audiowide + Neon-Pink + Flicker-Animation
- `.neon` → Neon-Glow + Flicker auf Text
- `.flimmer` → sanftes Bildflimmern
- `.neon-border` → animierter Glow-Box-Shadow
- `.btn-shop` → Gradient Pink→Lime + Pulse-Animation
- `.chip` / `.chip--1/2/3` → Neon-Pill-Tags

---

## Bekannte technische Schulden (beim Bearbeiten mitfixen)

1. `pages/shop.html:32` → doppelter `</head>`-Tag
2. `css/style.css` → `@keyframes rise`, `@keyframes fall`, `@keyframes bloom` je zweimal definiert
3. `assets/js/videos.js:18` → YouTube API-Key hardcoded (bei PHP-Migration in config.php auslagern)
4. `partials/header.html` → Nav-Links nutzen `../pages/` → nach Migration absolute Pfade
5. `.htacces` (lokaler Dateiname, ein 's) → beim Deployment prüfen ob `.htaccess` korrekt landet
6. `pages/shop.html` → Navigation ist auskommentiert
7. `seasonal.js` → `eggs`-Effekt fehlt (Ostern), muss implementiert werden
8. Doppelter Burger-Handler: `js/main.js` UND `assets/js/includes.js` registrieren beide einen Click-Listener auf `#navToggle` → führt zu doppeltem Toggle pro Klick; `js/main.js`-Handler sollte entfernt werden, sobald `includes.js` zuverlässig feuert

---

## Abgestimmte Roadmap (Briefing 2026-06-02)

### PHASE 1 – Styling-Upgrade ← AKTUELL

**Vibe:** Crash Bandicoot trifft Neon-Gaming-Arcade. Knallig, animiert, verspielt – aber lesbar.

**Neue CSS-Variablen hinzufügen:**

```css
--cyan:   #00F5FF;  /* Neon-Cyan */
--purple: #B600FF;  /* Neon-Purple */
--orange: #FF7300;  /* Crash-Bandicoot-Orange */
```

**Konkrete Umsetzungsliste (Details in TODO.md):**

| # | Element | Beschreibung |
|---|---------|--------------|
| 1.1 | Scanline-Overlay | CSS `body::after` mit repeating-linear-gradient – CRT-Linien-Effekt |
| 1.2 | Hero-Partikel | Canvas-Element mit animierten Neon-Punkten im Hintergrund |
| 1.3 | Cards – Outline | Dicke schwarze Border + Neon-Glow standardmäßig auf `.card` |
| 1.4 | Glitch-Headings | CSS `@keyframes glitch` mit clip-path auf h1/h2 |
| 1.5 | Button-Bounce | Hüpf-Animation beim Hover (Crash-Bandicoot-Style, übertrieben) |
| 1.6 | Section-Akzentfarben | Hero=Pink, Family=Cyan, Shop=Lime, Q&A=Purple, Mods=Orange |
| 1.7 | Logo-3D-Effekt | CSS-Schlagschatten + Pseudo-3D-Tiefe auf Hero-Logo |
| 1.8 | Neue Farben einbauen | CSS-Variablen + gezielter Einsatz in Sections |

### PHASE 2 – PHP-Migration (nach Phase 1)

- Alle `.html` → `.php` umbenennen
- `<?php include 'partials/header.php'; ?>` statt `data-include`-System
- `assets/js/includes.js` wird überflüssig (aber stehen lassen als Fallback bis Migration komplett)
- `config.php` für YouTube API-Key (nicht in git)
- Absolute Pfade in Navigation (`/pages/mods.php` statt `../pages/mods.html`)
- CSS-Duplikate bereinigen
- Fehlenden `eggs`-Effekt implementieren
- `shop.html` Navigation wieder einkommentieren + header einbinden

### PHASE 3 – SEO-Optimierung (parallel zu Phase 1 + 2)

**Ziel-Keywords:** "CrazyFamily", "Alex und Kevin", "CrazyFamilyLP", "TikTok Streamer Gaming", "Gaming Duo Deutschland"

| # | Maßnahme | Datei |
|---|----------|-------|
| 3.1 | H1 auf `index.html` sichtbar machen (aktuell `display:none`) | `index.html` |
| 3.2 | Schema.org `Person` für Alex & Kevin | `index.html` |
| 3.3 | Schema.org `Event` für Stream-Termine (Mo/Mi/Fr 17 Uhr) | `index.html` |
| 3.4 | Schema.org `Product` vervollständigen | `shop-highlights.js` (bereits begonnen) |
| 3.5 | Meta-Titles und -Descriptions aller Seiten optimieren | alle `.html` |
| 3.6 | Interne Verlinkung verbessern (Seiten untereinander verlinken) | alle `.html` |
| 3.7 | `sitemap_index.xml` updaten (neue Seiten events, community) | `sitemap_index.xml` |
| 3.8 | Bilder-Alt-Texte prüfen und vervollständigen | alle `.html` |
| 3.9 | `loading="lazy"` + `width`/`height` auf allen Bildern prüfen | alle `.html` |

### PHASE 4 – Neue Features (nach Phase 2)

#### 4.1 Livestream-Status-Banner

Neue Datei: `assets/data/livestream.json`

```json
{ "isLive": false, "message": "Wir sind LIVE! Jetzt auf TikTok!", "url": "https://www.tiktok.com/@crazyfamilylp" }
```

- Pulsierender LIVE-Badge im Header wenn `isLive: true`
- Vorerst manueller Toggle (Nils-Digital setzt isLive auf true/false)
- TikTok-API-Anbindung als spätere Erweiterung (API ist stark limitiert)

#### 4.2 Eventkalender

Neue Datei: `assets/data/events.json`
Neue Seite: `pages/events.html`

```json
[
  { "date": "2026-06-04", "title": "Regulärer Stream", "type": "stream" },
  { "date": "2026-06-10", "title": "Special Challenge", "type": "special", "note": "..." }
]
```

- Monatstabelle als CSS-Grid
- Feste Termine (Mo/Mi/Fr) automatisch markiert
- Navigation-Link ergänzen

#### 4.3 Community/Fanwall

- Neue Seite: `pages/community.html`
- Discord-Feed via Webhook oder Bot → JSON → Seite
- **Erst nach PHP-Migration sinnvoll** (braucht serverseitige Logik)

---

## Content-Pflege (Referenz)

### Moderator hinzufügen

`assets/data/mods.json` – neues Objekt einfügen:

```json
{
  "name": "Name",
  "rolle": "Moderator",
  "bild": "/assets/images/moderator_name.png",
  "beschreibung": "...",
  "links": { "tiktok": "https://...", "discord": "https://..." }
}
```

Unterstützte Link-Keys: `tiktok`, `youtube`, `amazon`, `discord`, `website`

### Shop-Highlight aktivieren

`assets/data/shop-highlights.json` → `"isActive": true`, `"priority"` erhöhen (höher = weiter oben).

### Saisonales Event ergänzen

`assets/data/seasonal.json` – neues Objekt:

```json
{ "start": "MM-DD", "end": "MM-DD", "message": "🎉 Text", "effect": "snow", "priority": 3, "placement": "overlay" }
```
