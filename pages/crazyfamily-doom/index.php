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

  /* Live-Score-HUD im Spiel */
  #cfHud{ position:fixed; top:10px; right:14px; z-index:55;
    font-family:system-ui,sans-serif; font-size:14px; font-weight:bold; color:#ffd36b;
    background:rgba(10,6,8,.6); padding:5px 10px; border-radius:8px;
    text-shadow:0 0 8px rgba(225,27,27,.5); pointer-events:none; }
  #cfHud[hidden]{ display:none; }

  /* ── Bestenlisten-Overlay (globale Top 10 via highscores.php) ── */
  #cfBoard{ position:fixed; inset:0; z-index:99999; display:flex;
    align-items:center; justify-content:center; padding:20px;
    background:rgba(6,4,5,.82); font-family:system-ui,sans-serif; }
  #cfBoard[hidden]{ display:none; }
  #cfBoard .lb-card{ background:#161013; border:3px solid #3a2326; border-radius:10px;
    padding:18px 18px 14px; width:min(360px,92vw); box-shadow:0 14px 40px rgba(0,0,0,.6); color:#EDEDED; }
  #cfBoard h2{ margin:0 0 10px; font-size:15px; letter-spacing:1px; color:#ffd36b; }
  #cfBoard #lbResult{ margin:0 0 10px; font-size:13px; }
  #cfBoard #lbResult strong{ color:#ff6b3d; }
  #cfBoard #lbSubmitRow{ display:flex; gap:8px; margin:0 0 12px; }
  #cfBoard #lbNick{ flex:1; min-width:0; background:#0a0608; border:2px solid #4a3338;
    border-radius:8px; color:#fff; padding:8px 10px; font-size:14px; }
  #cfBoard #lbNick:focus{ outline:none; border-color:#e11b1b; }
  #cfBoard .lb-btn{ background:#e11b1b; border:none; border-radius:8px; color:#fff;
    padding:8px 14px; font-size:13px; font-weight:bold; cursor:pointer; box-shadow:0 3px 0 #7a0f0f; }
  #cfBoard .lb-btn:active{ transform:translateY(2px); box-shadow:0 1px 0 #7a0f0f; }
  #cfBoard .lb-btn[disabled]{ opacity:.6; cursor:default; }
  #cfBoard .lb-btn--ghost{ background:#4a3338; box-shadow:0 3px 0 #241a1c; }
  #cfBoard #lbList{ list-style:none; margin:0 0 14px; padding:0; font-size:13px; }
  #cfBoard #lbList li{ display:flex; gap:8px; padding:5px 2px; border-bottom:1px solid #2a1d20; }
  #cfBoard .lb-rank{ width:22px; color:#ffb155; font-weight:bold; }
  #cfBoard .lb-name{ flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  #cfBoard .lb-score{ color:#ffd36b; font-weight:bold; }
  #cfBoard .lb-empty{ justify-content:center; color:#A9B0BE; border:none; }
  #cfBoard .lb-actions{ display:flex; justify-content:flex-end; }
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
  <div id="cfHud" hidden>💀 <span id="cfHudKills">0</span> &middot; <span id="cfHudLevel">–</span></div>
  <div class="topbar">
    <div class="spacer"></div>
    <button id="finish-btn" title="Run beenden & in die Bestenliste eintragen">🏁</button>
    <button id="boardBtn" title="Bestenliste">🏆</button>
    <button id="fs-btn" title="Vollbild">⛶</button>
    <button id="back-btn" title="Zurück zum Menü">⏏</button>
  </div>

  <!-- Touch-Steuerung (nur auf Touch-Geräten eingeblendet). Buttons synthetisieren
       Tastatur-Events -> Engine (siehe Steuerungs-Mapping in der README). -->
  <div class="touch" id="touchControls" hidden>
    <div class="dpad">
      <button class="t up"    data-code="ArrowUp"    aria-label="Vorwärts">▲</button>
      <button class="t down"  data-code="ArrowDown"  aria-label="Zurück">▼</button>
      <button class="t left"  data-code="ArrowLeft"  aria-label="Links drehen">◀</button>
      <button class="t right" data-code="ArrowRight" aria-label="Rechts drehen">▶</button>
      <button class="t sl"    data-code="KeyA"       aria-label="Strafe links">⇤</button>
      <button class="t sr"    data-code="KeyD"       aria-label="Strafe rechts">⇥</button>
    </div>
    <div class="actions">
      <button class="t fire"  data-code="ControlLeft" aria-label="Schießen">🔫</button>
      <button class="t use"   data-code="Space"       aria-label="Tür/Schalter">✋</button>
      <button class="t enter" data-code="Enter"       aria-label="Bestätigen">↵</button>
      <button class="t esc"   data-code="Escape"      aria-label="Menü">⎋</button>
    </div>
  </div>
</div>

<footer id="legal">
  CrazyFamily Doom nutzt die quelloffene Doom-Engine (GPL-2.0) und frei lizenzierte
  <a href="https://freedoom.github.io/" target="_blank" rel="noopener">Freedoom</a>-Spieldaten (BSD).
  Siehe <a href="NOTICE.txt" target="_blank" rel="noopener">NOTICE</a>.
</footer>

<!-- Bestenlisten-Overlay: erscheint bei Spielertod (Event cfgame:final) oder per 🏆-Button.
     Globale Top 10 über die bestehende Highscore-API (assets/api/highscores.php, Key 'doom'). -->
<div id="cfBoard" hidden>
  <div class="lb-card">
    <h2 id="lbTitle">🏆 Bestenliste</h2>
    <p id="lbResult" hidden>Dein Ergebnis: <strong id="lbScore">0</strong></p>
    <div id="lbSubmitRow" hidden>
      <input type="text" id="lbNick" maxlength="16" placeholder="Dein Name" aria-label="Spitzname für die Bestenliste" />
      <button type="button" id="lbSubmit" class="lb-btn">Eintragen</button>
    </div>
    <ol id="lbList" aria-label="Globale Bestenliste"></ol>
    <div class="lb-actions">
      <button type="button" id="lbClose" class="lb-btn lb-btn--ghost">Schließen</button>
    </div>
  </div>
</div>

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
        onStarted: () => { show(game); setTimeout(fit, 50); canvas.focus();
          document.getElementById("cfHud").hidden = false; showTouch(); },
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

  // Live-Score-HUD aktualisieren (Event aus game.js)
  const hudKills = document.getElementById("cfHudKills");
  const hudLevel = document.getElementById("cfHudLevel");
  window.addEventListener("cfdoom:score", e => {
    hudKills.textContent = e.detail.score;
    hudLevel.textContent = e.detail.level;
  });

  // ---- Touch-Steuerung -------------------------------------------------
  // Synthetische Tastatur-Events, die am Canvas hochbubbeln -> SDL/Doom.
  // code/key/keyCode werden alle gesetzt (verschiedene SDL-Builds lesen
  // unterschiedliche Felder). Pro Button eigenes Down/Up -> Multitouch ok.
  const KEYCODES = {
    ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39,
    KeyA: 65, KeyD: 68, ControlLeft: 17, Space: 32, Enter: 13, Escape: 27,
  };
  const KEYNAMES = {
    ArrowUp: "ArrowUp", ArrowDown: "ArrowDown", ArrowLeft: "ArrowLeft", ArrowRight: "ArrowRight",
    KeyA: "a", KeyD: "d", ControlLeft: "Control", Space: " ", Enter: "Enter", Escape: "Escape",
  };
  function sendKey(type, code) {
    const ev = new KeyboardEvent(type, {
      code: code, key: KEYNAMES[code] || code, keyCode: KEYCODES[code] || 0,
      which: KEYCODES[code] || 0, bubbles: true, cancelable: true,
    });
    canvas.dispatchEvent(ev);
  }

  const isTouch = ("ontouchstart" in window) || navigator.maxTouchPoints > 0;
  const touchControls = document.getElementById("touchControls");

  touchControls.querySelectorAll(".t").forEach(btn => {
    const code = btn.getAttribute("data-code");
    let held = false;
    const press = e => { e.preventDefault(); if (held) return; held = true; btn.classList.add("on"); sendKey("keydown", code); };
    const release = e => { if (e) e.preventDefault(); if (!held) return; held = false; btn.classList.remove("on"); sendKey("keyup", code); };
    btn.addEventListener("touchstart", press, { passive: false });
    btn.addEventListener("touchend", release, { passive: false });
    btn.addEventListener("touchcancel", release, { passive: false });
    btn.addEventListener("contextmenu", e => e.preventDefault());
    // Maus-Fallback (Desktop-Test): mousedown/up
    btn.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
  });

  function showTouch() { if (isTouch) touchControls.hidden = false; }
})();
</script>

<script src="/assets/js/games/arcade.js"></script>
<script>
/* Highscore-Controller (globale Top 10 via highscores.php, Key 'doom'). Läuft nach dem defer-Skript.
   game.js feuert bei Tod/„Run beenden" window.dispatchEvent(new CustomEvent('cfgame:final',{detail:{score}})). */
document.addEventListener('DOMContentLoaded', function () {
  if (!window.CFArcade) return;
  var GAME = 'doom';

  var board     = document.getElementById('cfBoard');
  var title     = document.getElementById('lbTitle');
  var result    = document.getElementById('lbResult');
  var scoreEl   = document.getElementById('lbScore');
  var submitRow = document.getElementById('lbSubmitRow');
  var nick      = document.getElementById('lbNick');
  var submitBtn = document.getElementById('lbSubmit');
  var list      = document.getElementById('lbList');
  var pendingScore = 0;

  function renderBoard(scores) {
    if (!scores || !scores.length) {
      list.innerHTML = '<li class="lb-empty">Noch keine Einträge – sei der Erste!</li>';
      return;
    }
    list.innerHTML = scores.map(function (s, i) {
      return '<li><span class="lb-rank">' + (i + 1) + '.</span>' +
             '<span class="lb-name">' + s.name + '</span>' +
             '<span class="lb-score">' + s.score + '</span></li>';
    }).join('');
  }
  function refreshBoard() {
    list.innerHTML = '<li class="lb-empty">Lade…</li>';
    CFArcade.loadGlobal(GAME).then(renderBoard);
  }

  function openBoard(mode, score) {
    var over = mode === 'final';
    title.textContent = over ? '🏁 Run beendet' : '🏆 Bestenliste';
    result.hidden = !over;
    if (over) {
      var record = CFArcade.setLocalBest(GAME, score);
      scoreEl.textContent = score + ' Kills' + (record ? ' 🏆 Neuer Rekord!' : '');
      pendingScore = score;
    }
    submitRow.hidden = !(over && pendingScore > 0);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Eintragen';
    nick.value = CFArcade.getNick();
    board.hidden = false;
    refreshBoard();
  }
  function closeBoard() { board.hidden = true; }

  function submit() {
    if (pendingScore <= 0 || submitBtn.disabled) return;
    var name = (nick.value || '').trim() || 'Anonym';
    CFArcade.setNick(name);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Gesendet ✓';
    CFArcade.submitGlobal(GAME, name, pendingScore).then(renderBoard);
    pendingScore = 0;
    submitRow.hidden = true;
  }

  // Spielende -> Ergebnis-/Eintrag-Overlay
  window.addEventListener('cfgame:final', function (e) {
    setTimeout(function () { openBoard('final', Math.floor(e.detail.score)); }, 600);
  });

  // „Run beenden"-Button: löst den Game-Over-Flow mit aktuellem Stand aus
  document.getElementById('finish-btn').addEventListener('click', function () {
    if (window.CFDoomFinish) window.CFDoomFinish();
  });
  document.getElementById('boardBtn').addEventListener('click', function () {
    board.hidden ? openBoard('view') : closeBoard();
  });
  document.getElementById('lbClose').addEventListener('click', closeBoard);
  submitBtn.addEventListener('click', submit);
  nick.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
});
</script>
</body>
</html>
