<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>CRAZYFAMILY LAND – Retro Jump'n'Run im Browser</title>
<meta name="description" content="CRAZYFAMILY LAND: Retro-Jump'n'Run im Game-Boy-Look – 4 Welten, 12 Level, Bosse, Superball-Power-up. Kostenlos im Browser spielen, auf PC und Handy!" />
<meta name="keywords" content="CrazyFamily Land, Jump and Run Browsergame, Retro Game online spielen, Pixel Jump n Run, CrazyFamily Spiele" />
<meta name="author" content="CRAZYFAMILY" />
<link rel="canonical" href="https://crazyfamily.info/pages/crazyfamily-land.php" />
<meta property="og:type" content="website" />
<meta property="og:title" content="CRAZYFAMILY LAND – Retro Jump'n'Run im Browser" />
<meta property="og:description" content="4 Welten, 12 Level, Bosse & Superball-Power-up – das Retro-Jump'n'Run der CRAZYFAMILY. Direkt im Browser spielen!" />
<meta property="og:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
<meta property="og:image:alt" content="CRAZYFAMILY LAND Jump'n'Run" />
<meta property="og:image:width" content="1000" />
<meta property="og:image:height" content="750" />
<meta property="og:url" content="https://crazyfamily.info/pages/crazyfamily-land.php" />
<meta property="og:site_name" content="CRAZYFAMILY" />
<meta property="og:locale" content="de_DE" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="CRAZYFAMILY LAND – Retro Jump'n'Run" />
<meta name="twitter:description" content="4 Welten, 12 Level, Bosse – das Retro-Jump'n'Run der CRAZYFAMILY direkt im Browser spielen!" />
<meta name="twitter:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
<meta name="twitter:image:alt" content="CRAZYFAMILY LAND Jump'n'Run" />
<meta name="theme-color" content="#0B0E14" />
<link rel="manifest" href="/manifest.json" />
<!-- Font -->
<link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />

<!-- Favicon -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<meta name="msapplication-TileColor" content="#0B0E14" />
<meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

<!-- Vollbild-Spielseite: lädt bewusst NICHT css/style.css – das Spiel bringt
     eigene Styles mit (html/body overflow:hidden, .btn etc. würden kollidieren) -->
<style>
  :root { --bg:#0B0E14; }
  * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  html,body { margin:0; height:100%; background:var(--bg); color:#fff;
    font-family:"Trebuchet MS",system-ui,sans-serif; overflow:hidden; }
  #wrap { width:100%; height:100%; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:10px; padding:8px; }
  h1 { margin:0; font-size:14px; letter-spacing:2px; color:#FF3EA5;
    font-family:Audiowide,"Trebuchet MS",system-ui,sans-serif;
    text-shadow:0 0 10px #FF3EA5, 0 0 22px rgba(255,62,165,.5); }
  #screen { image-rendering:pixelated; image-rendering:crisp-edges;
    background:#000; border:4px solid #2a2f3a; border-radius:6px;
    box-shadow:0 8px 30px rgba(0,0,0,.6); touch-action:none;
    max-width:96vw; max-height:62vh; }
  #pad { display:flex; gap:18px; align-items:center; justify-content:space-between;
    width:min(96vw,520px); user-select:none; }
  .cluster { display:flex; gap:10px; }
  .btn { width:54px; height:54px; border-radius:12px; border:none;
    background:#3a4150; color:#fff; font-size:20px; font-weight:bold;
    box-shadow:0 4px 0 #1e2330; touch-action:none; }
  .btn:active { transform:translateY(3px); box-shadow:0 1px 0 #1e2330; }
  .btn.act { background:#e0533a; box-shadow:0 4px 0 #7d2517; }
  .btn.jmp { background:#3aa15a; box-shadow:0 4px 0 #1f5e34; }
  #hint { font-size:11px; color:#7b8499; text-align:center; }
  @media (min-width:760px){ #pad{display:none;} }
  /* Zurück zur Fun-Zone */
  #backToFunzone { position:fixed; top:10px; left:12px; z-index:10;
    color:#B6FF00; text-decoration:none; font-size:13px; font-weight:bold;
    text-shadow:0 0 8px rgba(182,255,0,.6); }
  #backToFunzone:hover, #backToFunzone:focus-visible { text-decoration:underline; }
  /* Bestenliste (globale Top 10 via highscores.php) */
  #boardBtn { position:fixed; top:6px; right:12px; z-index:10;
    background:#3a4150; border:none; border-radius:10px; color:#fff;
    font-size:16px; width:38px; height:38px; cursor:pointer;
    box-shadow:0 3px 0 #1e2330; }
  #boardBtn:active { transform:translateY(2px); box-shadow:0 1px 0 #1e2330; }
  #landBoard { position:fixed; inset:0; z-index:20; display:flex;
    align-items:center; justify-content:center; background:rgba(6,4,10,.78); }
  #landBoard[hidden] { display:none; }
  .lb-card { background:#161b26; border:3px solid #2a2f3a; border-radius:10px;
    padding:18px 20px; width:min(92vw,360px); max-height:86vh; overflow:auto;
    box-shadow:0 0 24px rgba(255,62,165,.35), 0 12px 40px rgba(0,0,0,.7); }
  .lb-card h2 { margin:0 0 10px; font-size:15px; letter-spacing:1px; color:#ffd36b;
    font-family:Audiowide,"Trebuchet MS",system-ui,sans-serif; }
  #lbResult { margin:0 0 10px; font-size:13px; color:#EDEDED; }
  #lbResult strong { color:#B6FF00; }
  #lbSubmitRow { display:flex; gap:8px; margin:0 0 12px; }
  #lbNick { flex:1; min-width:0; background:#0B0E14; border:2px solid #3a4150;
    border-radius:8px; color:#fff; padding:8px 10px; font-size:14px; }
  #lbNick:focus { outline:none; border-color:#FF3EA5; }
  .lb-btn { background:#FF3EA5; border:none; border-radius:8px; color:#fff;
    font-weight:bold; font-size:13px; padding:8px 14px; cursor:pointer;
    box-shadow:0 3px 0 #8a1f5c; }
  .lb-btn:active { transform:translateY(2px); box-shadow:0 1px 0 #8a1f5c; }
  .lb-btn[disabled] { opacity:.6; cursor:default; }
  .lb-btn--ghost { background:#3a4150; box-shadow:0 3px 0 #1e2330; }
  #lbList { list-style:none; margin:0 0 14px; padding:0; font-size:13px; }
  #lbList li { display:flex; gap:8px; padding:5px 2px;
    border-bottom:1px solid rgba(255,255,255,.07); }
  .lb-rank { color:#7b8499; width:1.6em; }
  .lb-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .lb-score { color:#ffd23f; font-variant-numeric:tabular-nums; }
  .lb-empty { color:#7b8499; padding:6px 2px; }
  .lb-actions { display:flex; justify-content:flex-end; }
</style>
</head>
<body>
<a id="backToFunzone" href="/pages/games.php">← Zurück zur Fun-Zone</a>
<div id="wrap">
  <h1>★ CRAZYFAMILY&nbsp;LAND ★</h1>
  <canvas id="screen" width="160" height="144"></canvas>
  <div id="pad">
    <div class="cluster">
      <button class="btn" id="bL">◀</button>
      <button class="btn" id="bR">▶</button>
    </div>
    <div class="cluster">
      <button class="btn act" id="bB">B</button>
      <button class="btn jmp" id="bA">A</button>
    </div>
  </div>
  <div id="hint">⌨ Pfeiltasten/WASD bewegen · A/Leertaste springen · B/Shift rennen &amp; Superball · P Pause · ESC beenden · Enter wählen</div>
</div>

<button type="button" id="boardBtn" aria-label="Bestenliste anzeigen" title="Bestenliste">🏆</button>

<!-- Bestenlisten-Overlay: erscheint bei Game Over / Sieg (Event cfland:final aus land.js)
     oder per 🏆-Button. Globale Top 10 über die bestehende Highscore-API. -->
<div id="landBoard" hidden>
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

<script src="/assets/js/games/arcade.js" defer></script>
<script src="/assets/js/games/land.js" defer></script>

<script>
// Bestenlisten-Controller (läuft nach den defer-Skripten)
document.addEventListener('DOMContentLoaded', function () {
  if (!window.CFArcade) return;
  const GAME = 'land';

  const board     = document.getElementById('landBoard');
  const title     = document.getElementById('lbTitle');
  const result    = document.getElementById('lbResult');
  const scoreEl   = document.getElementById('lbScore');
  const submitRow = document.getElementById('lbSubmitRow');
  const nick      = document.getElementById('lbNick');
  const submitBtn = document.getElementById('lbSubmit');
  const list      = document.getElementById('lbList');

  let pendingScore = 0;

  // Während im Namensfeld getippt wird (oder das Overlay offen ist), dürfen die
  // Spieltasten (WASD/Pfeile/Enter/ESC) NICHT beim Spiel landen -> Capture-Phase
  // stoppt die Events, bevor der bubble-Listener des Spiels sie abfängt.
  ['keydown', 'keyup'].forEach(ev => window.addEventListener(ev, e => {
    if (board.hidden) return;
    if (e.code === 'Escape' && ev === 'keydown') { e.stopPropagation(); closeBoard(); return; }
    if (CFArcade.isTyping(e.target)) {
      e.stopPropagation();
      if (e.code === 'Enter' && ev === 'keydown') submit();
    }
  }, true));

  function renderBoard(scores) {
    if (!scores || !scores.length) {
      list.innerHTML = '<li class="lb-empty">Noch keine Einträge – sei der Erste!</li>';
      return;
    }
    list.innerHTML = scores.map((s, i) =>
      '<li><span class="lb-rank">' + (i + 1) + '.</span>' +
      '<span class="lb-name">' + s.name + '</span>' +
      '<span class="lb-score">' + s.score + '</span></li>'
    ).join('');
  }

  async function refreshBoard() {
    list.innerHTML = '<li class="lb-empty">Lade…</li>';
    renderBoard(await CFArcade.loadGlobal(GAME));
  }

  function openBoard(mode, score, won) {
    const over = mode === 'final';
    title.textContent = over ? (won ? '🎉 Durchgespielt!' : '🏁 Game Over') : '🏆 Bestenliste';
    result.hidden = !over;
    if (over) {
      const record = CFArcade.setLocalBest(GAME, score);
      scoreEl.textContent = score + (record ? ' 🏆 Neuer Rekord!' : '');
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

  async function submit() {
    if (pendingScore <= 0 || submitBtn.disabled) return;
    const name = (nick.value || '').trim() || 'Anonym';
    CFArcade.setNick(name);
    submitBtn.disabled = true;
    submitBtn.textContent = 'Gesendet ✓';
    renderBoard(await CFArcade.submitGlobal(GAME, name, pendingScore));
    pendingScore = 0;
    submitRow.hidden = true;
  }

  // Spielende (Game Over oder durchgespielt) -> Ergebnis-Overlay
  window.addEventListener('cfland:final', e => {
    // Game-Over-Jingle kurz wirken lassen, dann Panel zeigen
    setTimeout(() => openBoard('final', e.detail.score, e.detail.won), 900);
  });

  document.getElementById('boardBtn').addEventListener('click', () => {
    board.hidden ? openBoard('view') : closeBoard();
  });
  document.getElementById('lbClose').addEventListener('click', closeBoard);
  submitBtn.addEventListener('click', submit);
});
</script>
</body>
</html>
