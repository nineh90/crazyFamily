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
  const ENGINE_VERSION = "6";

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
