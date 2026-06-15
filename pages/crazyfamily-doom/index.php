<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CrazyFamily Doom – Echtes Doom im Browser</title>
<meta name="description" content="CrazyFamily Doom – die quelloffene Doom-Engine im Browser, mit frei lizenzierten Freedoom-Spieldaten: 2 Phasen, Soundeffekte, Single-Player. Kostenlos direkt im Browser der CRAZYFAMILY." />
<meta name="keywords" content="CrazyFamily Doom, Doom im Browser, Freedoom, Retro Shooter, Browser Game, CrazyFamily Spiele, Alex und Kevin" />
<meta name="author" content="CRAZYFAMILY" />
<link rel="canonical" href="https://crazyfamily.info/pages/crazyfamily-doom/" />
<meta property="og:type" content="website" />
<meta property="og:title" content="CrazyFamily Doom – Echtes Doom im Browser" />
<meta property="og:description" content="Die quelloffene Doom-Engine mit Freedoom-Daten – 2 Phasen, Sound, Single-Player. Direkt im Browser der CRAZYFAMILY!" />
<meta property="og:image" content="https://crazyfamily.info/assets/images/og-image.jpg" />
<meta property="og:url" content="https://crazyfamily.info/pages/crazyfamily-doom/" />
<meta property="og:site_name" content="CRAZYFAMILY" />
<meta property="og:locale" content="de_DE" />
<meta name="theme-color" content="#0a0608" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230a0608'/%3E%3Ctext x='16' y='23' font-size='20' font-weight='900' text-anchor='middle' fill='%23e11b1b' font-family='sans-serif'%3ED%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="style.css">
<style>
  /* Zurück zur Fun-Zone (Integration in crazyfamily.info) */
  #backToFunzone{ position:fixed; top:10px; left:12px; z-index:50;
    color:#ffb155; text-decoration:none; font-size:13px; font-weight:bold;
    font-family:system-ui,sans-serif; text-shadow:0 0 8px rgba(225,27,27,.6); }
  #backToFunzone:hover, #backToFunzone:focus-visible{ text-decoration:underline; }
</style>
</head>
<body>

<a id="backToFunzone" href="/pages/games.php">← Zurück zur Fun-Zone</a>

<!-- ============ START-MENÜ ============ -->
<div id="menu" class="screen">
  <div class="logo">
    <span class="logo-crazy">CRAZY<span class="logo-family">FAMILY</span></span>
    <span class="logo-doom">DOOM</span>
  </div>
  <p class="tagline">Die echte, quelloffene Doom-Engine im Browser — mit Sound,
     frei lizenzierten Freedoom-Daten, stabil &amp; ohne Grafikfehler.</p>

  <div class="phase-select">
    <button class="phase-btn" data-wad="phase1">
      <strong>PHASE 1</strong>
      <span>Doom-1-Stil · 4 Episoden · ~28&nbsp;MB</span>
    </button>
    <button class="phase-btn" data-wad="phase2">
      <strong>PHASE 2</strong>
      <span>Doom-2-Stil · 32 Maps · Doppelflinte · ~28&nbsp;MB</span>
    </button>
  </div>

  <details class="controls">
    <summary>Steuerung &amp; Hinweise</summary>
    <div class="controls-grid">
      <div><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / <kbd>↑</kbd><kbd>↓</kbd> Bewegen &amp; Strafen</div>
      <div><kbd>Q</kbd><kbd>E</kbd> / <kbd>←</kbd><kbd>→</kbd> Drehen</div>
      <div><kbd>Strg</kbd> Schießen</div>
      <div><kbd>Leer</kbd> Tür/Schalter benutzen</div>
      <div><kbd>Shift</kbd> Rennen</div>
      <div><kbd>1</kbd>–<kbd>7</kbd> Waffe wählen</div>
      <div><kbd>Tab</kbd> Karte</div>
      <div><kbd>Esc</kbd> Menü · Speichern/Laden</div>
    </div>
    <p class="note">🔊 <strong>Sound an</strong> — die Soundeffekte starten mit dem ersten Klick ins Spiel
       (Browser-Regel für Audio). Gespielt wird mit der Tastatur. (Hintergrundmusik ist aus.)</p>
  </details>
</div>

<!-- ============ LADEBILDSCHIRM ============ -->
<div id="loading" class="screen hidden">
  <div class="logo small"><span class="logo-doom">CRAZYFAMILY DOOM</span></div>
  <p id="status">Lade …</p>
  <div class="bar"><div id="bar-fill"></div></div>
  <p id="bar-text" class="bar-text"></p>
</div>

<!-- ============ SPIEL ============ -->
<div id="game" class="screen hidden">
  <div id="stage"><canvas id="canvas" tabindex="0" oncontextmenu="event.preventDefault()"></canvas></div>
  <div class="topbar">
    <div class="spacer"></div>
    <button id="fs-btn" title="Vollbild">⛶</button>
    <button id="back-btn" title="Zurück zum Menü">⏏</button>
  </div>
</div>

<footer id="legal">
  CrazyFamily Doom nutzt die quelloffene Doom-Engine (GPL-2.0) und frei lizenzierte
  <a href="https://freedoom.github.io/" target="_blank" rel="noopener">Freedoom</a>-Spieldaten (BSD).
  Siehe <a href="NOTICE.txt" target="_blank" rel="noopener">NOTICE</a>.
</footer>

<script src="game.js"></script>
<script>
(function () {
  const menu = document.getElementById("menu");
  const loading = document.getElementById("loading");
  const game = document.getElementById("game");
  const status = document.getElementById("status");
  const barFill = document.getElementById("bar-fill");
  const barText = document.getElementById("bar-text");
  const canvas = document.getElementById("canvas");
  const stage = document.getElementById("stage");

  function show(el) { [menu, loading, game].forEach(s => s.classList.add("hidden")); el.classList.remove("hidden"); }
  function mb(n) { return (n / 1048576).toFixed(1) + " MB"; }

  function fit() {
    const vw = stage.clientWidth, vh = stage.clientHeight, ratio = 4 / 3;
    let cw = vw, ch = vw / ratio;
    if (ch > vh) { ch = vh; cw = vh * ratio; }
    canvas.style.width = Math.round(cw) + "px";
    canvas.style.height = Math.round(ch) + "px";
  }

  document.querySelectorAll(".phase-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      show(loading);
      CFDoom.start(canvas, btn.getAttribute("data-wad"), {
        onStatus: t => { status.textContent = t; },
        onProgress: (r, t) => {
          const pct = t ? Math.round(r / t * 100) : 0;
          barFill.style.width = (t ? pct : 50) + "%";
          barText.textContent = t ? `${mb(r)} / ${mb(t)} (${pct}%)` : mb(r);
        },
        onStarted: () => { show(game); setTimeout(fit, 50); canvas.focus(); },
      }).catch(err => { status.textContent = "Fehler: " + err.message; console.error(err); });
    });
  });

  window.addEventListener("resize", () => { if (canvas.width) fit(); });
  document.getElementById("fs-btn").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else game.requestFullscreen && game.requestFullscreen();
    setTimeout(fit, 100);
  });
  document.getElementById("back-btn").addEventListener("click", () => location.reload());
  stage.addEventListener("click", () => canvas.focus());
})();
</script>
</body>
</html>
