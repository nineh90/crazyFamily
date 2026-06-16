/*
 * CrazyFamily Doom — Browser-Launcher für die quelloffene Doom-Engine.
 *
 * Engine: doomgeneric (auf Basis des 1997 von id Software unter GPL freigegebenen
 * Doom-Quellcodes), als reine SINGLE-PLAYER-Engine via Emscripten gebaut — mit
 * SDL für Bild + SOUND (Soundeffekte). Sauberes Rendering, kein Multiplayer-Ballast.
 * Spieldaten: frei lizenzierte Freedoom-WADs (BSD).
 *
 * Steuerung: Tastatur (oder Touch-Tasten). Hintergrundmusik ist aus (braucht einen
 * MIDI-Synth, der im Browser nicht zuverlässig läuft) — Soundeffekte sind an.
 */

const CFDoom = (() => {
  "use strict";

  // Bei jeder Engine-Änderung erhöhen — erzwingt frisches Laden (kein Browser-Cache).
  // v7: Score-Bridge (cf_*-Exporte für echten Kill-/Level-Highscore).
  const ENGINE_VERSION = "7";

  const WADS = {
    phase1: { file: "freedoom1.wad", label: "Phase 1" },
    phase2: { file: "freedoom2.wad", label: "Phase 2" },
  };

  let started = false;

  // ---- WAD herunterladen (mit Fortschritt) --------------------------------
  async function fetchWad(url, onProgress) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`WAD-Download fehlgeschlagen (${resp.status}): ${url}`);
    const total = Number(resp.headers.get("Content-Length")) || 0;
    const reader = resp.body.getReader();
    const chunks = []; let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); received += value.length;
      onProgress && onProgress(received, total);
    }
    const out = new Uint8Array(received); let off = 0;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return out;
  }

  // ---- Start --------------------------------------------------------------
  async function start(canvas, wadKey, hooks = {}) {
    if (started) return;
    started = true;
    const wad = WADS[wadKey] || WADS.phase1;

    hooks.onStatus && hooks.onStatus("Lade Spieldaten …");
    const wadBytes = await fetchWad(wad.file, (r, t) => hooks.onProgress && hooks.onProgress(r, t));
    hooks.onStatus && hooks.onStatus("Starte Engine …");

    window.Module = {
      canvas: canvas,
      noInitialRun: true,
      arguments: ["-iwad", wad.file, "-nomusic"],
      locateFile: (path) => (path.endsWith(".wasm") ? path + "?v=" + ENGINE_VERSION : path),
      preRun: [function () {
        // Gewählte WAD ins Emscripten-Dateisystem schreiben, bevor Doom startet.
        Module.FS.writeFile(wad.file, wadBytes);
      }],
      onRuntimeInitialized: function () {
        hooks.onStarted && hooks.onStarted();
        (Module.callMain || window.callMain)(Module.arguments);
        canvas.focus();
        resumeAudioOnGesture();
        startScoring();
      },
      print: function (t) { console.log(t); },
      printErr: function (t) { console.error(t); },
      setStatus: function () {},
      monitorRunDependencies: function () {},
    };

    const s = document.createElement("script");
    s.src = "doomgeneric.js?v=" + ENGINE_VERSION;
    s.onerror = () => hooks.onStatus && hooks.onStatus("Engine konnte nicht geladen werden.");
    document.body.appendChild(s);
  }

  // ---- Score-Bridge -------------------------------------------------------
  // Die Engine (gepatchtes doomgeneric, siehe NOTICE/BUILD) exportiert Lese-
  // Funktionen cf_*. Daraus bilden wir einen echten Score: Summe der getöteten
  // Monster über die ganze Session (killcount wird pro Level zurückgesetzt, wir
  // schreiben den Stand bei jedem Levelwechsel fest). Bei Spielertod (oder per
  // „Run beenden"-Button) feuern wir EINMAL `cfgame:final` – analog Chomp/Rush.
  function cfRead(name) {
    try {
      if (window.Module && Module.ccall) return Module.ccall(name, "number", [], []) | 0;
    } catch (e) {}
    return 0;
  }

  function startScoring() {
    let committed = 0;      // festgeschriebene Kills abgeschlossener Level
    let levelMax  = 0;      // höchster Killstand des aktuellen Levels
    let lastEp = -1, lastMap = -1;
    let seenAlive = false;  // erst nach erstem Lebenszeichen auf Tod prüfen
    let finalFired = false;

    function levelLabel(ep, map) {
      if (map <= 0) return "–";
      return ep > 1 ? ("E" + ep + "M" + map)        // Phase 1 (Episoden)
                    : ("MAP" + (map < 10 ? "0" : "") + map); // Phase 2
    }
    function currentScore() { return committed + levelMax; }

    function finish(reason) {
      if (finalFired) return;
      finalFired = true;
      window.dispatchEvent(new CustomEvent("cfgame:final", {
        detail: { score: currentScore(), level: levelLabel(lastEp, lastMap), reason: reason || "death" }
      }));
    }
    // Manueller Abschluss (Button „Run beenden") und Verlassen der Seite.
    window.CFDoomFinish = function () { if (currentScore() > 0) finish("manual"); };
    window.addEventListener("pagehide", function () { window.CFDoomFinish(); });

    setInterval(function () {
      if (finalFired) return;
      // Nur echtes Nutzer-Spiel zählen – NICHT die Demo-/Titelschleife.
      if (cfRead("cf_usergame") !== 1 || cfRead("cf_demoplayback") === 1) return;
      const gs = cfRead("cf_gamestate");          // 0=Level 1=Intermission
      if (gs !== 0 && gs !== 1) return;

      const ep = cfRead("cf_episode"), map = cfRead("cf_map");
      const kills = cfRead("cf_kills");
      const health = cfRead("cf_health");
      const pstate = cfRead("cf_pstate");         // 0=live 1=dead 2=reborn

      // Levelwechsel -> Killstand des vorigen Levels festschreiben
      if (ep !== lastEp || map !== lastMap) {
        if (lastEp !== -1) committed += levelMax;
        lastEp = ep; lastMap = map; levelMax = 0;
      }
      if (kills > levelMax) levelMax = kills;
      if (health > 0) seenAlive = true;

      window.dispatchEvent(new CustomEvent("cfdoom:score", {
        detail: { score: currentScore(), level: levelLabel(ep, map) }
      }));

      // Tod -> Run abschließen (erst nachdem der Spieler mal gelebt hat)
      if (seenAlive && (pstate === 1 || health <= 0)) finish("death");
    }, 500);
  }

  // Browser starten Audio erst nach einer Nutzer-Geste; bei Klick fortsetzen.
  function resumeAudioOnGesture() {
    const resume = () => {
      try {
        const ctx = window.Module && (Module.SDL2 && Module.SDL2.audioContext);
        if (ctx && ctx.state === "suspended") ctx.resume();
      } catch (e) {}
    };
    ["click", "keydown", "touchstart"].forEach(ev =>
      document.addEventListener(ev, resume, { passive: true }));
  }

  return { start, WADS };
})();
