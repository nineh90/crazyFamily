# CrazyFamily Doom

Echtes Doom im Browser — auf der **quelloffenen Doom-Engine "doomgeneric"** (GPL-2.0),
mit Emscripten gebaut: **sauberes Bild + Soundeffekte**, reiner Single-Player (keine
Grafikfehler), und den **frei lizenzierten Freedoom-Spieldaten** (BSD). Reine statische
Dateien, kein Backend.

## Dateien
| Datei | Zweck |
|-------|-------|
| `index.html` | Gebrandeter Launcher (Menü, Phasenauswahl, Ladebalken) |
| `game.js` | Lädt WAD, richtet die Engine ein, startet das Spiel |
| `style.css` | CrazyFamily-Optik |
| `doomgeneric.js` / `doomgeneric.wasm` | Die Doom-Engine (GPL-2.0, ~1,2 MB) |
| `freedoom1.wad` / `freedoom2.wad` | Spieldaten Phase 1 / Phase 2 (je ~28 MB) |
| `serve.py` | Lokaler Testserver ohne Caching (`python3 serve.py`) |
| `NOTICE.txt` / `BUILD.txt` / `freedoom-COPYING.txt` | Lizenz-/Quell-/Buildhinweise |

## Auf die Webseite stellen
Ganzen Ordner `CrazyFamilyDoom/` hochladen und `index.html` verlinken. Über HTTP(S)
ausliefern (nicht per `file://`). `.wasm`/`.wad` am besten GZip/Brotli + Caching.

## Lokal testen
```bash
cd CrazyFamilyDoom
python3 serve.py        # ohne Browser-Cache
# Browser: http://localhost:8000/
```

## Steuerung
- **W A S D / Pfeile** bewegen & strafen, **Q E / ← →** drehen
- **Strg** schießen · **Leertaste** benutzen · **Shift** rennen
- **1–7** Waffen · **Tab** Karte · **Esc** Menü (Speichern/Laden)
- 🔊 **Sound:** Soundeffekte starten mit dem ersten **Klick ins Spiel**
  (Browser-Regel für Audio).

## Stand & Grenzen
- ✅ **Sound (Effekte)**, sauberes Bild, stabil, Single-Player.
- ⏳ **Keine Maussteuerung** (doomgeneric ist Tastatur-orientiert; Maus-Blick wäre
  ein eigener Ausbau-Schritt).
- ⏳ **Keine Hintergrundmusik** (`-nomusic`; Dooms MUS/MIDI bräuchte einen MIDI-Synth,
  der im Browser nicht zuverlässig läuft).
- Spielstände: über das Doom-Menü (Esc → Save/Load).

## Lizenz / Recht
Siehe **`NOTICE.txt`**: Engine = GPL-2.0 (Quellcode + Build-Anleitung beigelegt),
Spieldaten = Freedoom (BSD). Die kommerziellen Original-DOOM-WADs sind **nicht** enthalten.
