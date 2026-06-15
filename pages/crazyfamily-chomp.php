<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>CrazyFamily Chomp</title>

<meta name="description" content="CrazyFamily Chomp – das Neon-Labyrinth-Arcade der CRAZYFAMILY: friss die Punkte, weiche den Geistern (WUT, CHAOS, FROST &amp; GLUT) aus und knack den globalen Highscore. Kostenlos im Browser auf PC und Handy." />
<meta name="keywords" content="CrazyFamily Chomp, CrazyFamily Spiele, Labyrinth Arcade, Punkte fressen, Browser Game, Highscore, Alex und Kevin Spiele" />
<meta name="author" content="CRAZYFAMILY" />
<link rel="canonical" href="https://crazyfamily.info/pages/crazyfamily-chomp.php" />
<meta property="og:type" content="website" />
<meta property="og:title" content="CrazyFamily Chomp – Neon-Labyrinth-Arcade" />
<meta property="og:description" content="Friss die Punkte, weiche den Geistern aus, knack den Highscore – das Arcade-Spiel der CRAZYFAMILY direkt im Browser!" />
<meta property="og:image" content="https://crazyfamily.info/assets/images/og-image.jpg" />
<meta property="og:image:alt" content="CrazyFamily Chomp Neon-Labyrinth-Arcade" />
<meta property="og:url" content="https://crazyfamily.info/pages/crazyfamily-chomp.php" />
<meta property="og:site_name" content="CRAZYFAMILY" />
<meta property="og:locale" content="de_DE" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="CrazyFamily Chomp – Neon-Labyrinth-Arcade" />
<meta name="twitter:description" content="Friss die Punkte, weiche den Geistern aus, knack den Highscore!" />
<meta name="twitter:image" content="https://crazyfamily.info/assets/images/og-image.jpg" />
<meta name="theme-color" content="#0B0E14" />
<link rel="manifest" href="/manifest.json" />
<link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "CrazyFamily Chomp",
  "alternateName": ["CrazyFamilyChomp", "Crazy Chomp"],
  "url": "https://crazyfamily.info/pages/crazyfamily-chomp.php",
  "image": "https://crazyfamily.info/assets/images/og-image.jpg",
  "description": "CrazyFamily Chomp ist das kostenlose Neon-Labyrinth-Arcade der CRAZYFAMILY: friss alle Punkte, sammle Power-Glut, jage die Geister und knack den globalen Highscore – direkt im Browser auf PC und Handy.",
  "genre": "Arcade",
  "playMode": "SinglePlayer",
  "gamePlatform": ["Web Browser", "PC", "Smartphone"],
  "applicationCategory": "Game",
  "operatingSystem": "Web",
  "inLanguage": "de",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
  "publisher": { "@type": "Organization", "name": "CRAZYFAMILY", "url": "https://crazyfamily.info/" }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://crazyfamily.info/" },
    { "@type": "ListItem", "position": 2, "name": "Mini-Games & Fun-Zone", "item": "https://crazyfamily.info/pages/games.php" },
    { "@type": "ListItem", "position": 3, "name": "CrazyFamily Chomp", "item": "https://crazyfamily.info/pages/crazyfamily-chomp.php" }
  ]
}
</script>

<style>
  :root{
    --bg0:#0a0410; --bg1:#1a0a06; --orange:#ff7a2b; --orange2:#ffb155;
    --neon:#ff8a3c; --teal:#36e0ff; --pink:#ff7ad1; --red:#ff3b3b;
  }
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
  html,body{margin:0;height:100%;overflow:hidden;background:#05030a;
    font-family:"Trebuchet MS",system-ui,Segoe UI,sans-serif;color:#fff;}
  #wrap{position:fixed;inset:0;display:flex;flex-direction:column;
    align-items:center;justify-content:flex-start;gap:8px;padding:8px;
    background:radial-gradient(120% 90% at 50% -10%, #2a0e08 0%, var(--bg1) 35%, var(--bg0) 70%, #05030a 100%);}
  /* Kopf / HUD */
  #hud{width:min(96vw,460px);display:flex;justify-content:space-between;
    align-items:flex-end;padding:2px 6px;font-weight:bold;letter-spacing:1px;}
  .col{display:flex;flex-direction:column;line-height:1.1;}
  .lab{font-size:9px;color:#9a6b4a;letter-spacing:2px;}
  .val{font-size:17px;color:var(--orange2);text-shadow:0 0 8px rgba(255,140,60,.5),2px 2px 0 #6e2f12;}
  .mid{align-items:center;}
  .mid .val{color:#ffd36b;}
  .right{align-items:flex-end;}
  #lives{display:flex;gap:5px;margin-top:3px;height:16px;}
  .life{width:14px;height:14px;background:
      radial-gradient(circle at 60% 40%, #fff2b0 0%, var(--orange) 55%, #c85a14 100%);
    border-radius:50%;
    clip-path:polygon(100% 35%,46% 50%,100% 65%,100% 100%,0 100%,0 0,100% 0);
    box-shadow:0 0 6px rgba(255,150,60,.7);}
  /* Spielfeld */
  #stage{position:relative;}
  canvas#game{display:block;background:#070310;border-radius:10px;
    border:2px solid #34170d;box-shadow:0 0 0 2px #1a0a06,0 14px 40px rgba(0,0,0,.7),
      0 0 60px rgba(255,110,40,.10);
    max-width:96vw;max-height:64vh;touch-action:none;}
  /* Overlays */
  #ov{position:absolute;inset:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center;text-align:center;gap:14px;
    border-radius:10px;background:rgba(7,3,16,.82);backdrop-filter:blur(2px);
    padding:18px;}
  #ov.hide{display:none;}
  .logo{font-size:34px;font-weight:900;letter-spacing:2px;line-height:.95;
    background:linear-gradient(180deg,#ffe39a,#ff8a2b 55%,#c83a14);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    text-shadow:0 0 22px rgba(255,120,40,.45);filter:drop-shadow(2px 3px 0 #5e1f0c);}
  .logo small{display:block;font-size:11px;letter-spacing:6px;font-weight:700;
    color:#ff9a5c;-webkit-text-fill-color:#ff9a5c;margin-top:6px;text-shadow:none;}
  .sub{font-size:13px;color:#e8c39a;max-width:300px;line-height:1.5;}
  .big{font-size:26px;font-weight:900;color:#ffd36b;text-shadow:0 0 16px rgba(255,150,40,.6);}
  .btn{appearance:none;border:none;cursor:pointer;font-weight:800;
    font-family:inherit;letter-spacing:1px;color:#2a0c04;
    background:linear-gradient(180deg,#ffd07a,var(--orange));
    padding:13px 30px;font-size:16px;border-radius:30px;
    box-shadow:0 5px 0 #9c4410,0 8px 22px rgba(255,120,40,.4);}
  .btn:active{transform:translateY(3px);box-shadow:0 2px 0 #9c4410;}
  .ghosthint{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;font-size:11px;color:#cda;}
  .gh{display:flex;align-items:center;gap:5px;}
  .dot{width:13px;height:13px;border-radius:7px 7px 3px 3px;box-shadow:0 0 8px currentColor;}
  .hintline{font-size:10px;color:#8a6346;max-width:330px;line-height:1.6;}
  /* Steuerung mobil */
  #ctl{display:none;width:min(96vw,460px);justify-content:space-between;
    align-items:center;margin-top:2px;user-select:none;}
  #dpad{display:grid;grid-template-columns:repeat(3,48px);grid-template-rows:repeat(3,48px);gap:4px;}
  #dpad button{border:none;border-radius:12px;background:#2a1812;color:#ffb070;
    font-size:22px;box-shadow:0 4px 0 #160b07;touch-action:none;}
  #dpad button:active{transform:translateY(3px);box-shadow:0 1px 0 #160b07;background:#43251a;}
  .pup{grid-area:1/2;} .pl{grid-area:2/1;} .pr{grid-area:2/3;} .pdn{grid-area:3/2;}
  .util{display:flex;flex-direction:column;gap:8px;}
  .ubtn{border:none;border-radius:12px;background:#2a1812;color:#ffb070;
    font-size:13px;font-weight:bold;padding:10px 14px;box-shadow:0 4px 0 #160b07;}
  .ubtn:active{transform:translateY(3px);box-shadow:0 1px 0 #160b07;}
  #foot{font-size:10px;color:#6e4a32;text-align:center;margin-top:2px;}
  @media (max-width:760px){ #ctl{display:flex;} canvas#game{max-height:54vh;} }
  @media (min-width:761px){ canvas#game{max-height:70vh;} }

  /* ── CrazyFamily Highscore-Overlay (globale Top 10 via highscores.php) ── */
  #funznav{ pointer-events:none; }
  #funznav a, #funznav button{ pointer-events:auto; }
  #boardBtn{ background:none; border:none; font:inherit; font-weight:bold;
    color:#ffd23f; cursor:pointer; text-shadow:0 0 8px rgba(255,210,63,.6); }
  #backToFunzone{ color:#B6FF00; text-decoration:none; font-weight:bold;
    text-shadow:0 0 8px rgba(182,255,0,.6); }
  #backToFunzone:hover, #backToFunzone:focus-visible, #boardBtn:hover{ text-decoration:underline; }
  #cfBoard{ position:fixed; inset:0; z-index:99999; display:flex;
    align-items:center; justify-content:center; background:rgba(6,4,10,.82);
    font-family:"Trebuchet MS",system-ui,sans-serif; }
  #cfBoard[hidden]{ display:none; }
  #cfBoard .lb-card{ background:#161b26; border:3px solid #2a2f3a; border-radius:10px;
    padding:18px 20px; width:min(92vw,360px); max-height:86vh; overflow:auto;
    color:#EDEDED; text-align:left;
    box-shadow:0 0 24px rgba(255,62,165,.35),0 12px 40px rgba(0,0,0,.7); }
  #cfBoard h2{ margin:0 0 10px; font-size:15px; letter-spacing:1px; color:#ffd36b; }
  #cfBoard #lbResult{ margin:0 0 10px; font-size:13px; }
  #cfBoard #lbResult strong{ color:#B6FF00; }
  #cfBoard #lbSubmitRow{ display:flex; gap:8px; margin:0 0 12px; }
  #cfBoard #lbNick{ flex:1; min-width:0; background:#0B0E14; border:2px solid #3a4150;
    border-radius:8px; color:#fff; padding:8px 10px; font-size:14px; }
  #cfBoard #lbNick:focus{ outline:none; border-color:#FF3EA5; }
  #cfBoard .lb-btn{ background:#FF3EA5; border:none; border-radius:8px; color:#fff;
    font-weight:bold; font-size:13px; padding:8px 14px; cursor:pointer;
    box-shadow:0 3px 0 #8a1f5c; }
  #cfBoard .lb-btn:active{ transform:translateY(2px); box-shadow:0 1px 0 #8a1f5c; }
  #cfBoard .lb-btn[disabled]{ opacity:.6; cursor:default; }
  #cfBoard .lb-btn--ghost{ background:#3a4150; box-shadow:0 3px 0 #1e2330; }
  #cfBoard #lbList{ list-style:none; margin:0 0 14px; padding:0; font-size:13px; }
  #cfBoard #lbList li{ display:flex; gap:8px; padding:5px 2px;
    border-bottom:1px solid rgba(255,255,255,.07); }
  #cfBoard .lb-rank{ color:#7b8499; width:1.6em; }
  #cfBoard .lb-name{ flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  #cfBoard .lb-score{ color:#ffd23f; font-variant-numeric:tabular-nums; }
  #cfBoard .lb-empty{ color:#7b8499; padding:6px 2px; }
  #cfBoard .lb-actions{ display:flex; justify-content:flex-end; }
</style>
</head>
<body>
<div id="wrap">
  <div id="hud">
    <div class="col"><span class="lab">SCORE</span><span class="val" id="score">0</span></div>
    <div class="col mid"><span class="lab">REKORD</span><span class="val" id="hi">0</span></div>
    <div class="col right"><span class="lab">LEVEL</span><span class="val" id="level">1</span>
      <div id="lives"></div></div>
  </div>

  <div id="stage">
    <canvas id="game" width="456" height="504"></canvas>
    <div id="ov">
      <div class="logo">CRAZY&nbsp;CHOMP<small>CRAZYFAMILY ARCADE</small></div>
      <div class="sub" id="ovsub">Friss die Punkte!</div>
      <button class="btn" id="startBtn">▶ SPIELEN</button>
      <div class="hintline" id="ovhint">⌨ Pfeiltasten / WASD bewegen · P Pause · M Ton · ESC Menü<br>📱 Wischen oder Steuerkreuz nutzen</div>
    </div>
  </div>

  <div id="ctl">
    <div id="dpad">
      <button class="pup" data-d="up">▲</button>
      <button class="pl" data-d="left">◀</button>
      <button class="pr" data-d="right">▶</button>
      <button class="pdn" data-d="down">▼</button>
    </div>
    <div class="util">
      <button class="ubtn" id="pauseBtn">❚❚ Pause</button>
      <button class="ubtn" id="soundBtn">🔊 Ton</button>
    </div>
  </div>
  <div id="foot"><span id="funznav"><button type="button" id="boardBtn">🏆 Bestenliste</button> · CrazyFamily Chomp · eigenständiges Arcade-Spiel · © CrazyFamily · <a id="backToFunzone" href="/pages/games.php">← Zurück zur Fun-Zone</a></span></div>
</div>

<script>
"use strict";
/* =========================================================================
   CRAZYFAMILY CHOMP  —  ein eigenständiges Labyrinth-Fress-Arcade-Spiel
   im CrazyFamily-Look (dunkel/Endzeit, glühendes Orange-Neon).
   Komplett eigener Code & eigene Grafik – inspiriert vom Genre-Klassiker,
   aber ohne Original-Code, -Sprites, -Labyrinth oder -Namen.
   Eine einzelne HTML-Datei, mobil & Desktop, zum Einbinden auf der Webseite.
   ========================================================================= */

/* ----------------------------------------------------------------------- */
/* Labyrinth (19×21). Zeichen:  # Wand · . Punkt · o Power-Glut ·          */
/* = Hausttür · G Geisterstart · P Spielerstart · T Tunnel · ' ' frei      */
/* ----------------------------------------------------------------------- */
const MAZE = [
  "###################",
  "#........#........#",
  "#o##.###.#.###.##o#",
  "#........#........#",
  "#.##.#.#####.#.##.#",
  "#....#...#...#....#",
  "####.###.#.###.####",
  "#....#.......#....#",
  "####.#.##=##.#.####",
  "T....#.#GGG#.#....T",
  "####.#.#####.#.####",
  "#....#.......#....#",
  "####.###.#.###.####",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o.#.....P.....#.o#",
  "##.#.#.#####.#.#.##",
  "#....#...#...#....#",
  "#.######.#.######.#",
  "#........#........#",
  "###################",
];
const COLS = 19, ROWS = 21, TILE = 24;
const BW = COLS*TILE, BH = ROWS*TILE;   // 456 × 504 (logische Pixel)

/* ----------------------------------------------------------------------- */
/* Canvas / HiDPI                                                          */
/* ----------------------------------------------------------------------- */
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
function setupHiDPI(){
  const dpr = Math.min(window.devicePixelRatio||1, 2.5);
  cv.width = BW*dpr; cv.height = BH*dpr;
  cv.style.aspectRatio = BW+'/'+BH;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.imageSmoothingEnabled = true;
}
setupHiDPI();
addEventListener('resize', setupHiDPI);

/* ----------------------------------------------------------------------- */
/* Hilfen                                                                  */
/* ----------------------------------------------------------------------- */
const wrapCol = x => ((x%COLS)+COLS)%COLS;
function tileChar(tx,ty){
  if(ty<0||ty>=ROWS) return '#';
  return MAZE[ty][wrapCol(tx)];
}
function isWall(tx,ty){
  const c = tileChar(tx,ty);
  return c==='#' || c==='=';     // Tür gilt für die Wegfindung als Wand
}
const centerX = tx => tx*TILE + TILE/2;
const centerY = ty => ty*TILE + TILE/2;
const txOf = e => Math.round((e.x - TILE/2)/TILE);
const tyOf = e => Math.round((e.y - TILE/2)/TILE);
const centered = e => ((e.x-TILE/2)%TILE===0) && ((e.y-TILE/2)%TILE===0);
const DIRS = { up:{x:0,y:-1}, left:{x:-1,y:0}, down:{x:0,y:1}, right:{x:1,y:0} };

/* ----------------------------------------------------------------------- */
/* Sound (WebAudio, simpel & retro)                                        */
/* ----------------------------------------------------------------------- */
const Snd = (()=>{
  let ac=null, on=true;
  const ensure=()=>{ if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return ac; };
  function blip(freq,dur,type='square',vol=.18,slideTo){
    if(!on) return; const a=ensure(); if(!a) return;
    const o=a.createOscillator(), g=a.createGain();
    o.type=type; o.frequency.value=freq;
    if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, a.currentTime+dur);
    g.gain.value=vol; g.gain.exponentialRampToValueAtTime(.0001, a.currentTime+dur);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+dur);
  }
  let waka=false;
  return {
    setOn(v){ on=v; if(on) ensure(); },
    get on(){ return on; },
    resume(){ const a=ensure(); if(a&&a.state==='suspended') a.resume(); },
    chomp(){ waka=!waka; blip(waka?330:220, .06, 'square', .12); },
    power(){ blip(180,.5,'sawtooth',.16, 90); },
    eatGhost(){ blip(200,.18,'square',.2, 900); },
    fruit(){ blip(700,.12,'triangle',.2, 1100); },
    death(){ blip(500,.7,'sawtooth',.22, 60); },
    extra(){ blip(880,.3,'triangle',.2, 1320); },
    start(){ blip(440,.12,'square',.18,660); },
  };
})();

/* ----------------------------------------------------------------------- */
/* Geister-Definitionen (CrazyFamily-Crew)                                 */
/* ----------------------------------------------------------------------- */
const GHOSTS = [
  { id:'wut',   name:'WUT',   color:'#ff3b3b', corner:{x:COLS-2,y:0},   home:{tx:9,ty:7}, inside:false, dotLimit:0 },
  { id:'chaos', name:'CHAOS', color:'#ff7ad1', corner:{x:0,y:0},        home:{tx:9,ty:9}, inside:true,  dotLimit:0 },
  { id:'frost', name:'FROST', color:'#36e0ff', corner:{x:COLS-2,y:ROWS-1}, home:{tx:8,ty:9}, inside:true, dotLimit:30 },
  { id:'glut',  name:'GLUT',  color:'#ff9a2b', corner:{x:0,y:ROWS-1},   home:{tx:10,ty:9}, inside:true, dotLimit:60 },
];

/* ----------------------------------------------------------------------- */
/* Spielzustand                                                            */
/* ----------------------------------------------------------------------- */
const HI_KEY = 'crazychomp_hi_v1';
let G = null;            // aktuelle Partie
let mode = 'title';      // title|ready|play|dying|levelclear|gameover|paused
let modeT = 0;           // Timer im aktuellen Modus
let prevMode = 'play';
let highScore = parseInt(localStorage.getItem(HI_KEY)||'0',10)||0;

const pellets = [];      // 2D: 0 leer · 1 Punkt · 2 Power
let pelletCount = 0;

function freshGame(){
  return {
    score:0, lives:3, level:1, dotsEaten:0,
    pac:null, ghosts:[], fright:0, frightMax:0, combo:0,
    fruit:null, fruitShown:0, modeIdx:0, modeTimer:0, scatter:true,
    extraGiven:false,
  };
}

/* Pellets aus dem Labyrinth aufbauen */
function loadPellets(){
  pelletCount=0;
  for(let y=0;y<ROWS;y++){
    pellets[y]=[];
    for(let x=0;x<COLS;x++){
      const c=MAZE[y][x];
      if(c==='.'){ pellets[y][x]=1; pelletCount++; }
      else if(c==='o'){ pellets[y][x]=2; pelletCount++; }
      else pellets[y][x]=0;
    }
  }
}

/* Pac & Geister positionieren */
function spawnEntities(){
  // Pac
  let psx=9,psy=15;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++) if(MAZE[y][x]==='P'){psx=x;psy=y;}
  G.pac={ x:centerX(psx), y:centerY(psy), dx:-1,dy:0, want:DIRS.left,
          tx:psx,ty:psy, acc:0, mouth:0, dead:0 };
  // Geister
  G.ghosts = GHOSTS.map((def,i)=>{
    const g={ def, color:def.color, name:def.name,
      x:centerX(def.home.tx), y:centerY(def.home.ty),
      homeX:centerX(def.home.tx), homeY:centerY(def.home.ty),
      tx:def.home.tx, ty:def.home.ty, dx:0,dy:-1, acc:0,
      state: def.inside? 'home':'normal', dotLimit:def.dotLimit, bob:i };
    if(!def.inside){ g.dx=-1; g.dy=0; }
    return g;
  });
}

/* Modus-Zeitplan (Scatter/Chase) – wird mit Level etwas aggressiver */
function modePhases(){
  const lvl=G.level;
  const sc = lvl>=5?5:7, ch = lvl>=3?22:20;
  return [ ['scatter',sc],['chase',ch],['scatter',sc],['chase',ch],
           ['scatter',5],['chase',ch],['scatter',5],['chase',1e9] ];
}

/* Geschwindigkeiten (Pixel/Sekunde) */
function pacSpeed(){ return Math.min(118 + (G.level-1)*7, 165); }
function ghostBase(){ return Math.min(108 + (G.level-1)*7, 160); }
function ghostSpeed(g){
  if(g.state==='eyes') return 300;
  if(g.state==='home'||g.state==='leave'||g.state==='enter') return 95;
  if(g.state==='fright') return ghostBase()*0.55;
  // Tunnel verlangsamt Geister
  if(g.ty===9 && (g.tx<=4||g.tx>=COLS-5)) return ghostBase()*0.55;
  return ghostBase();
}
function frightDuration(){ return Math.max(0, 8 - (G.level-1)); }

/* ----------------------------------------------------------------------- */
/* Eingabe                                                                 */
/* ----------------------------------------------------------------------- */
function setWant(name){ if(G&&G.pac) G.pac.want = DIRS[name]; }
addEventListener('keydown', e=>{
  const k=e.key.toLowerCase();
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault();
  if(k==='arrowup'||k==='w') setWant('up');
  else if(k==='arrowdown'||k==='s') setWant('down');
  else if(k==='arrowleft'||k==='a') setWant('left');
  else if(k==='arrowright'||k==='d') setWant('right');
  else if(k==='p') togglePause();
  else if(k==='m') toggleSound();
  else if(k==='escape'){ if(mode!=='title'){ toTitle(); } }
  else if(k==='enter'){ if(mode==='title'||mode==='gameover') startGame(); }
}, {passive:false});

document.querySelectorAll('#dpad button').forEach(b=>{
  const d=b.dataset.d;
  const go=ev=>{ ev.preventDefault(); setWant(d); };
  b.addEventListener('touchstart',go,{passive:false});
  b.addEventListener('mousedown',go);
});

/* Wischen auf dem Spielfeld */
let tsx=0,tsy=0,tsT=0;
cv.addEventListener('touchstart',e=>{ const t=e.touches[0]; tsx=t.clientX;tsy=t.clientY;tsT=Date.now(); },{passive:true});
cv.addEventListener('touchend',e=>{
  const t=e.changedTouches[0]; const dx=t.clientX-tsx, dy=t.clientY-tsy;
  if(Math.abs(dx)<18&&Math.abs(dy)<18) return;
  if(Math.abs(dx)>Math.abs(dy)) setWant(dx>0?'right':'left');
  else setWant(dy>0?'down':'up');
},{passive:true});

document.getElementById('startBtn').onclick = ()=>{ Snd.resume(); startGame(); };
document.getElementById('pauseBtn').onclick = togglePause;
document.getElementById('soundBtn').onclick = toggleSound;

function toggleSound(){
  Snd.setOn(!Snd.on);
  document.getElementById('soundBtn').textContent = Snd.on?'🔊 Ton':'🔇 Aus';
}
function togglePause(){
  if(mode==='play'){ prevMode=mode; mode='paused'; showOverlay('paused'); }
  else if(mode==='paused'){ mode='play'; hideOverlay(); }
}

/* ----------------------------------------------------------------------- */
/* Spielablauf                                                             */
/* ----------------------------------------------------------------------- */
function startGame(){
  Snd.resume(); Snd.start();
  G = freshGame();
  startLevel();
  hideOverlay();
}
function startLevel(){
  loadPellets();
  spawnEntities();
  G.modeIdx=0; G.modeTimer=0; G.scatter=true; G.fright=0; G.combo=0;
  G.fruit=null; G.fruitShown=0;
  setMode('ready');
}
function resetAfterDeath(){
  spawnEntities();
  G.modeIdx=0; G.modeTimer=0; G.scatter=true; G.fright=0; G.combo=0;
  setMode('ready');
}
function setMode(m){ mode=m; modeT=0; }
function toTitle(){ mode='title'; showOverlay('title'); }

/* ----------------------------------------------------------------------- */
/* Update                                                                  */
/* ----------------------------------------------------------------------- */
function update(dt){
  modeT += dt;
  if(mode==='ready'){ if(modeT>1.8) setMode('play'); return; }
  if(mode==='dying'){
    G.pac.dead += dt;
    if(G.pac.dead>1.6){
      if(G.lives>0){ resetAfterDeath(); }
      else { mode='gameover'; saveHi(); showOverlay('gameover'); window.dispatchEvent(new CustomEvent('cfgame:final',{detail:{score:G.score}})); }
    }
    return;
  }
  if(mode==='levelclear'){
    if(modeT>1.8){ G.level++; startLevel(); }
    return;
  }
  if(mode!=='play') return;

  // Scatter/Chase-Zeitplan (pausiert während Power-Glut)
  if(G.fright>0){
    G.fright -= dt;
    if(G.fright<=0){ G.fright=0; G.combo=0; }
  } else {
    const phases=modePhases();
    G.modeTimer += dt;
    const cur=phases[G.modeIdx];
    if(G.modeTimer >= cur[1] && G.modeIdx<phases.length-1){
      G.modeIdx++; G.modeTimer=0;
      G.scatter = phases[G.modeIdx][0]==='scatter';
      reverseGhosts();
    }
  }

  updatePac(dt);
  for(const g of G.ghosts) updateGhost(g,dt);
  checkCollisions();
  updateFruit(dt);

  if(pelletCount<=0){ mode='levelclear'; modeT=0; }
}

/* Pac bewegen */
function updatePac(dt){
  const p=G.pac;
  let n = p.acc + pacSpeed()*dt; let steps=Math.min(Math.floor(n),26); p.acc = n-Math.floor(n);
  for(let i=0;i<steps;i++) pacStep();
  if(p.dx||p.dy) p.mouth += dt*12;
}
function pacStep(){
  const p=G.pac;
  if(centered(p)){
    p.tx=txOf(p); p.ty=tyOf(p);
    // gewünschte Richtung übernehmen, wenn frei
    if(p.want && !isWall(p.tx+p.want.x, p.ty+p.want.y)){ p.dx=p.want.x; p.dy=p.want.y; }
    // aktuelle Richtung blockiert? -> anhalten
    if(isWall(p.tx+p.dx, p.ty+p.dy)){ p.dx=0; p.dy=0; }
    eatAt(p.tx,p.ty);
  }
  p.x += p.dx; p.y += p.dy;
  if(p.x<0) p.x+=BW; else if(p.x>=BW) p.x-=BW;
}
function eatAt(tx,ty){
  const v=pellets[ty]&&pellets[ty][tx];
  if(!v) return;
  if(v===1){ G.score+=10; Snd.chomp(); }
  else if(v===2){ G.score+=50; triggerFright(); Snd.power(); }
  pellets[ty][tx]=0; pelletCount--; G.dotsEaten++;
  // Bonus-Frucht erscheint bei 70 und 170 gefressenen Punkten
  if((G.dotsEaten===70 || G.dotsEaten===170) && !G.fruit){ spawnFruit(); }
  checkExtraLife();
}
function checkExtraLife(){
  if(!G.extraGiven && G.score>=10000){ G.extraGiven=true; G.lives++; Snd.extra(); }
}

function triggerFright(){
  G.frightMax = frightDuration();
  if(G.frightMax<=0) return;
  G.fright = G.frightMax; G.combo=0;
  for(const g of G.ghosts){
    if(g.state==='normal'){ g.state='fright'; g.dx*=-1; g.dy*=-1; }
  }
}
function reverseGhosts(){
  for(const g of G.ghosts) if(g.state==='normal'||g.state==='fright'){ g.dx*=-1; g.dy*=-1; }
}

/* Geist-Logik */
function updateGhost(g,dt){
  // Power-Glut zu Ende -> wieder normal
  if(g.state==='fright' && G.fright<=0) g.state='normal';

  if(g.state==='home'){
    // Freigabe nach gefressenen Punkten – Position dabei auf ganze Pixel snappen,
    // damit die Gitter-Zentrierung (Integer-Schritte) draußen wieder greift.
    if(G.dotsEaten >= g.dotLimit){ g.state='leave'; g.x=g.homeX; g.y=g.homeY; return; }
    g.x = g.homeX;
    g.y = Math.round(g.homeY + Math.sin((modeT+g.bob)*4)*4);
    return;
  }
  let n=g.acc + ghostSpeed(g)*dt; let steps=Math.min(Math.floor(n),26); g.acc=n-Math.floor(n);
  for(let i=0;i<steps;i++) ghostStep(g);
}
function ghostStep(g){
  if(g.state==='leave'){
    if(g.x!==centerX(9)) g.x += g.x<centerX(9)?1:-1;
    else if(g.y > centerY(7)) g.y -= 1;
    else { g.state='normal'; g.tx=9; g.ty=7; g.dx=0; g.dy=-1; if(G.fright>0){ g.state='fright'; } }
    return;
  }
  if(g.state==='enter'){
    if(g.x!==g.homeX) g.x += g.x<g.homeX?1:-1;
    else if(g.y < g.homeY) g.y += 1;
    else { g.state='home'; g.dx=0; g.dy=-1; }
    return;
  }
  // normal / fright / eyes : Gitterbewegung
  if(centered(g)){
    g.tx=txOf(g); g.ty=tyOf(g);
    if(g.state==='eyes' && g.tx===9 && g.ty===7){ g.state='enter'; g.x=centerX(9); g.y=centerY(7); return; }
    ghostDecide(g);
  }
  g.x += g.dx; g.y += g.dy;
  if(g.x<0) g.x+=BW; else if(g.x>=BW) g.x-=BW;
}
function ghostTarget(g){
  if(g.state==='eyes') return {x:9,y:7};
  if(G.scatter && g.state!=='fright') return g.def.corner;
  const p=G.pac;
  switch(g.def.id){
    case 'wut':   return {x:p.tx, y:p.ty};
    case 'chaos': return {x:p.tx+4*p.dx, y:p.ty+4*p.dy};
    case 'frost': {
      const px=p.tx+2*p.dx, py=p.ty+2*p.dy;
      const red=G.ghosts[0];
      return {x:2*px-red.tx, y:2*py-red.ty};
    }
    case 'glut': {
      const d=(g.tx-p.tx)**2+(g.ty-p.ty)**2;
      return d>64 ? {x:p.tx,y:p.ty} : g.def.corner;
    }
  }
  return {x:p.tx,y:p.ty};
}
function ghostDecide(g){
  const order=[DIRS.up,DIRS.left,DIRS.down,DIRS.right];
  const rev={x:-g.dx,y:-g.dy};
  const choices=[];
  for(const d of order){
    if(d.x===rev.x && d.y===rev.y) continue;
    if(isWall(g.tx+d.x, g.ty+d.y)) continue;
    choices.push(d);
  }
  if(choices.length===0){ g.dx=rev.x; g.dy=rev.y; return; }
  if(g.state==='fright'){
    const c=choices[(Math.random()*choices.length)|0];
    g.dx=c.x; g.dy=c.y; return;
  }
  const t=ghostTarget(g);
  let best=choices[0], bd=Infinity;
  for(const d of choices){
    const nx=g.tx+d.x, ny=g.ty+d.y;
    const dist=(nx-t.x)**2+(ny-t.y)**2;
    if(dist<bd){ bd=dist; best=d; }
  }
  g.dx=best.x; g.dy=best.y;
}

/* Kollisionen Pac <-> Geist */
function checkCollisions(){
  const p=G.pac;
  for(const g of G.ghosts){
    if(g.state==='eyes'||g.state==='home'||g.state==='enter') continue;
    const dx=p.x-g.x, dy=p.y-g.y;
    if(dx*dx+dy*dy < 13*13){
      if(g.state==='fright'){
        G.combo++; const pts=200*Math.pow(2,Math.min(G.combo-1,3));
        G.score+=pts; g.state='eyes'; Snd.eatGhost(); checkExtraLife();
        floatScore(g.x,g.y,pts);
      } else {
        loseLife();
        return;
      }
    }
  }
}
function loseLife(){
  G.lives--; G.pac.dead=0.0001; mode='dying'; modeT=0; Snd.death();
}

/* Bonus-Frucht */
function spawnFruit(){
  G.fruit={ x:centerX(9), y:centerY(11), t:0 };
}
function fruitValue(){
  const tbl=[100,300,500,700,1000,2000,3000,5000];
  return tbl[Math.min(G.level-1,tbl.length-1)];
}
function updateFruit(dt){
  if(!G.fruit) return;
  G.fruit.t += dt;
  const p=G.pac, f=G.fruit;
  if((p.x-f.x)**2+(p.y-f.y)**2 < 13*13){
    const v=fruitValue(); G.score+=v; floatScore(f.x,f.y,v); Snd.fruit(); G.fruit=null; checkExtraLife(); return;
  }
  if(G.fruit.t>9) G.fruit=null;
}

/* Schwebende Punktezahl */
const floats=[];
function floatScore(x,y,v){ floats.push({x,y,v,t:0}); }
function updateFloats(dt){ for(let i=floats.length-1;i>=0;i--){ floats[i].t+=dt; floats[i].y-=14*dt; if(floats[i].t>1) floats.splice(i,1); } }

function saveHi(){ if(G.score>highScore){ highScore=G.score; localStorage.setItem(HI_KEY,String(highScore)); } }

/* ----------------------------------------------------------------------- */
/* Glut-Partikel (Atmosphäre)                                              */
/* ----------------------------------------------------------------------- */
const embers=[];
function seedEmbers(){ for(let i=0;i<26;i++) embers.push(newEmber(Math.random()*BH)); }
function newEmber(y){ return { x:Math.random()*BW, y, vy:6+Math.random()*14, r:.6+Math.random()*1.6, a:.15+Math.random()*.35 }; }
function updateEmbers(dt){ for(const e of embers){ e.y-=e.vy*dt; e.x+=Math.sin(e.y*.03)*0.25; if(e.y< -5){ e.y=BH+5; e.x=Math.random()*BW; } } }
seedEmbers();

/* ----------------------------------------------------------------------- */
/* Vorgerendertes Labyrinth (Neon-Wände)                                   */
/* ----------------------------------------------------------------------- */
const wallCanvas = document.createElement('canvas');
wallCanvas.width=BW; wallCanvas.height=BH;
function renderWalls(){
  const w=wallCanvas.getContext('2d');
  w.clearRect(0,0,BW,BH);
  // Wände als gerundete Neon-Blöcke mit Glut-Glühen
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      const c=MAZE[y][x];
      if(c!=='#') continue;
      const px=x*TILE, py=y*TILE, pad=3, r=7;
      // Füllung dunkel
      roundRect(w, px+pad, py+pad, TILE-2*pad, TILE-2*pad, r);
      const grd=w.createLinearGradient(px,py,px,py+TILE);
      grd.addColorStop(0,'#2a0f08'); grd.addColorStop(1,'#160806');
      w.fillStyle=grd; w.fill();
      // Glühender Rand
      w.save();
      w.shadowColor='rgba(255,120,40,.55)'; w.shadowBlur=9;
      w.lineWidth=2; w.strokeStyle='#ff8a3c';
      roundRect(w, px+pad, py+pad, TILE-2*pad, TILE-2*pad, r); w.stroke();
      w.restore();
      // feine innere Linie
      w.lineWidth=1; w.strokeStyle='rgba(255,200,140,.25)';
      roundRect(w, px+pad+2.5, py+pad+2.5, TILE-2*pad-5, TILE-2*pad-5, r-2); w.stroke();
    }
  }
  // Hausttür
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++) if(MAZE[y][x]==='='){
    w.save(); w.shadowColor='#ff7ad1'; w.shadowBlur=8; w.strokeStyle='#ff7ad1'; w.lineWidth=3;
    w.beginPath(); w.moveTo(x*TILE+4, y*TILE+TILE/2); w.lineTo(x*TILE+TILE-4, y*TILE+TILE/2); w.stroke(); w.restore();
  }
}
function roundRect(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
renderWalls();

/* ----------------------------------------------------------------------- */
/* Render                                                                  */
/* ----------------------------------------------------------------------- */
function draw(){
  ctx.clearRect(0,0,BW,BH);
  // Hintergrund
  const bg=ctx.createRadialGradient(BW/2,-40,40, BW/2,BH/2,BH);
  bg.addColorStop(0,'#27100a'); bg.addColorStop(.5,'#160a08'); bg.addColorStop(1,'#080410');
  ctx.fillStyle=bg; ctx.fillRect(0,0,BW,BH);
  // Glut-Partikel
  for(const e of embers){ ctx.globalAlpha=e.a; ctx.fillStyle='#ff9a40';
    ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,7); ctx.fill(); }
  ctx.globalAlpha=1;

  // Wände (vorgerendert)
  ctx.drawImage(wallCanvas,0,0);

  if(G){
    drawPellets();
    drawFruit();
    drawPac();
    for(const g of G.ghosts) drawGhost(g);
    drawFloats();
  }

  // Vignette + Scanlines (CrazyFamily-CRT-Look)
  const vg=ctx.createRadialGradient(BW/2,BH/2,BH*0.35, BW/2,BH/2,BH*0.72);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.55)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,BW,BH);
  ctx.globalAlpha=.05; ctx.fillStyle='#000';
  for(let y=0;y<BH;y+=3) ctx.fillRect(0,y,BW,1);
  ctx.globalAlpha=1;
}

function drawPellets(){
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const v=pellets[y][x]; if(!v) continue;
    const cx=centerX(x), cy=centerY(y);
    if(v===1){
      ctx.save(); ctx.shadowColor='rgba(255,210,140,.8)'; ctx.shadowBlur=6;
      ctx.fillStyle='#ffe2a6'; ctx.beginPath(); ctx.arc(cx,cy,2.4,0,7); ctx.fill(); ctx.restore();
    } else {
      const pulse=2.2*Math.sin(modeT*6)+6.5;
      ctx.save(); ctx.shadowColor='#ff7a2b'; ctx.shadowBlur=16;
      const grd=ctx.createRadialGradient(cx,cy,1,cx,cy,pulse);
      grd.addColorStop(0,'#fff1c0'); grd.addColorStop(.5,'#ff9a30'); grd.addColorStop(1,'rgba(255,120,30,0)');
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(cx,cy,pulse,0,7); ctx.fill(); ctx.restore();
    }
  }
}

function drawFruit(){
  if(!G.fruit) return;
  const f=G.fruit; const blink = f.t>7 ? (Math.floor(f.t*6)%2===0) : true;
  if(!blink) return;
  ctx.save(); ctx.translate(f.x,f.y);
  ctx.shadowColor='#ff3b3b'; ctx.shadowBlur=12;
  // Kirsche (eigene Grafik)
  ctx.fillStyle='#ff3b3b';
  ctx.beginPath(); ctx.arc(-4,4,5,0,7); ctx.fill();
  ctx.beginPath(); ctx.arc(5,5,5,0,7); ctx.fill();
  ctx.shadowBlur=0;
  ctx.fillStyle='#ffd0d0'; ctx.beginPath(); ctx.arc(-5,2,1.4,0,7); ctx.fill();
  ctx.strokeStyle='#6abf3a'; ctx.lineWidth=2; ctx.beginPath();
  ctx.moveTo(-4,-1); ctx.quadraticCurveTo(2,-9,8,-9); ctx.moveTo(5,0); ctx.quadraticCurveTo(6,-7,8,-9); ctx.stroke();
  ctx.fillStyle='#6abf3a'; ctx.beginPath(); ctx.ellipse(9,-10,3,1.6,-0.6,0,7); ctx.fill();
  ctx.restore();
}

/* Pac = "Crazy" mit Kappe & wütender Braue */
function drawPac(){
  const p=G.pac;
  let ang=0;
  if(p.dx>0)ang=0; else if(p.dx<0)ang=Math.PI; else if(p.dy<0)ang=-Math.PI/2; else if(p.dy>0)ang=Math.PI/2;
  // Mund-Öffnung
  let open;
  if(mode==='dying'){ open = Math.min(Math.PI, p.dead/1.6*Math.PI); }
  else open = (p.dx||p.dy) ? (0.30+0.30*Math.abs(Math.sin(p.mouth))) : 0.18;
  const R=TILE/2-1;
  ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(ang);
  if(mode==='dying'){ ctx.globalAlpha=Math.max(0,1-p.dead/1.6); }
  // Körper mit Glühen
  ctx.shadowColor='rgba(255,170,40,.8)'; ctx.shadowBlur=14;
  const grd=ctx.createRadialGradient(-3,-4,2,0,0,R);
  grd.addColorStop(0,'#fff3c0'); grd.addColorStop(.6,'#ffb02e'); grd.addColorStop(1,'#e07810');
  ctx.fillStyle=grd;
  ctx.beginPath(); ctx.moveTo(0,0);
  ctx.arc(0,0,R, open*Math.PI, (2-open)*Math.PI); ctx.closePath(); ctx.fill();
  ctx.shadowBlur=0;
  // Auge
  ctx.fillStyle='#201006'; ctx.beginPath(); ctx.arc(-1,-R*0.45,2.4,0,7); ctx.fill();
  // wütende Braue
  ctx.strokeStyle='#7a3008'; ctx.lineWidth=2.4; ctx.beginPath();
  ctx.moveTo(-6,-R*0.72); ctx.lineTo(3,-R*0.5); ctx.stroke();
  // Kappenschirm (CrazyFamily-Orange), zeigt nach "oben/vorn"
  ctx.fillStyle='#c8521a';
  ctx.beginPath(); ctx.ellipse(2,-R*0.78,7,3.2,-0.5,0,7); ctx.fill();
  ctx.restore();
}

/* Geist zeichnen */
function drawGhost(g){
  const R=TILE/2-1, x=g.x, y=g.y;
  const fright = g.state==='fright';
  const eyes = g.state==='eyes';
  const flash = fright && G.fright<2 && Math.floor(G.fright*8)%2===0;
  let body = fright ? (flash?'#ffffff':'#2a44ff') : g.color;

  ctx.save(); ctx.translate(x,y);
  if(!eyes){
    ctx.shadowColor = fright ? 'rgba(80,120,255,.7)' : hexA(g.color,.6);
    ctx.shadowBlur = 12;
    ctx.fillStyle = body;
    // Körper: Kuppel + Wellenfuß
    ctx.beginPath();
    ctx.arc(0,-1,R, Math.PI, 0);
    ctx.lineTo(R, R-2);
    const feet=4;
    for(let i=0;i<feet;i++){
      const x0=R - (2*R/feet)*i;
      const x1=R - (2*R/feet)*(i+0.5);
      const x2=R - (2*R/feet)*(i+1);
      ctx.lineTo(x1, R-7);
      ctx.lineTo(x2, R-2);
    }
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur=0;
    // leichter Glanz
    if(!fright){ ctx.fillStyle=hexA('#ffffff',.12);
      ctx.beginPath(); ctx.arc(-R*0.35,-R*0.4,R*0.45,0,7); ctx.fill(); }
  }
  if(fright){
    // erschrockenes Gesicht
    ctx.fillStyle = flash ? '#ff3b3b' : '#bfe0ff';
    ctx.beginPath(); ctx.arc(-5,-2,2.2,0,7); ctx.arc(5,-2,2.2,0,7); ctx.fill();
    ctx.strokeStyle=flash?'#ff3b3b':'#bfe0ff'; ctx.lineWidth=1.6; ctx.beginPath();
    for(let i=-7;i<=7;i+=3.5){ ctx.lineTo(i, 6 + (Math.abs(i)%7<3.5?0:3)); } ctx.stroke();
  } else {
    // Augen (schauen in Laufrichtung)
    const ex=g.dx*2.2, ey=g.dy*2.2;
    for(const sx of [-5,5]){
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(sx,-2,3.2,4,0,0,7); ctx.fill();
      ctx.fillStyle='#16204a'; ctx.beginPath(); ctx.arc(sx+ex,-2+ey,1.8,0,7); ctx.fill();
    }
  }
  ctx.restore();
}

function drawFloats(){
  for(const f of floats){
    ctx.save(); ctx.globalAlpha=Math.max(0,1-f.t);
    ctx.fillStyle='#fff'; ctx.font='bold 13px Trebuchet MS'; ctx.textAlign='center';
    ctx.shadowColor='#36e0ff'; ctx.shadowBlur=8;
    ctx.fillText(f.v, f.x, f.y); ctx.restore();
  }
}
function hexA(hex,a){
  const n=parseInt(hex.slice(1),16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}

/* "BEREIT!" / "GAME OVER" / "LEVEL!" auf dem Feld */
function drawBanner(){
  if(mode==='ready'){
    centerText('BEREIT!', '#ffd36b', BH*0.62);
  } else if(mode==='levelclear'){
    if(Math.floor(modeT*4)%2===0) centerText('LEVEL GESCHAFFT!', '#7CFFB0', BH*0.5,16);
  }
}
function centerText(t,color,y,size){
  ctx.save(); ctx.font=`900 ${size||20}px Trebuchet MS`; ctx.textAlign='center';
  ctx.fillStyle=color; ctx.shadowColor=color; ctx.shadowBlur=14;
  ctx.fillText(t, BW/2, y); ctx.restore();
}

/* ----------------------------------------------------------------------- */
/* HUD / Overlays                                                          */
/* ----------------------------------------------------------------------- */
const $score=document.getElementById('score'), $hi=document.getElementById('hi'),
      $level=document.getElementById('level'), $lives=document.getElementById('lives'),
      $ov=document.getElementById('ov'), $ovsub=document.getElementById('ovsub'),
      $startBtn=document.getElementById('startBtn'), $ovhint=document.getElementById('ovhint');
function syncHUD(){
  $score.textContent = G?G.score:0;
  $hi.textContent = Math.max(highScore, G?G.score:0);
  $level.textContent = G?G.level:1;
  const lv = G?G.lives:0;
  $lives.innerHTML='';
  for(let i=0;i<lv;i++){ const d=document.createElement('div'); d.className='life'; $lives.appendChild(d); }
}
syncHUD();

function showOverlay(which){
  $ov.classList.remove('hide');
  const logo=$ov.querySelector('.logo');
  if(which==='title'){
    logo.innerHTML='CRAZY&nbsp;CHOMP<small>CRAZYFAMILY ARCADE</small>';
    $ovsub.textContent='Friss die Punkte!';
    $startBtn.textContent='▶ SPIELEN';
    $ovhint.style.display='';
  } else if(which==='gameover'){
    logo.innerHTML=`GAME&nbsp;OVER<small>LEVEL ${G.level} · ${G.score} PUNKTE</small>`;
    $ovsub.textContent = 'FIEBERTRAUM';
    $startBtn.textContent='↻ NOCHMAL';
    $ovhint.style.display='';
  } else if(which==='paused'){
    logo.innerHTML='PAUSE<small>CRAZYFAMILY ARCADE</small>';
    $ovsub.textContent='Kurz durchatmen.';
    $startBtn.textContent='▶ WEITER';
    $ovhint.style.display='none';
  }
}
function hideOverlay(){ $ov.classList.add('hide'); }
$startBtn.onclick=()=>{
  Snd.resume();
  if(mode==='paused'){ mode='play'; hideOverlay(); }
  else startGame();
};

/* ----------------------------------------------------------------------- */
/* Hauptschleife                                                           */
/* ----------------------------------------------------------------------- */
let last=performance.now();
function loop(now){
  let dt=(now-last)/1000; last=now;
  if(dt>0.05) dt=0.05;          // bei Lag begrenzen
  updateEmbers(dt);
  if(mode!=='paused' && mode!=='title'){ update(dt); updateFloats(dt); }
  draw();
  if(G) drawBanner();
  syncHUD();
  requestAnimationFrame(loop);
}
showOverlay('title');
requestAnimationFrame(loop);
</script>

<!-- Bestenlisten-Overlay: erscheint bei Game Over (Event cfgame:final) oder per 🏆-Button.
     Globale Top 10 über die bestehende Highscore-API (assets/api/highscores.php). -->
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

<script src="/assets/js/games/arcade.js" defer></script>
<script>
/* Highscore-Controller (globale Top 10 via highscores.php). Läuft nach dem defer-Skript.
   Das Spiel feuert bei Game Over window.dispatchEvent(new CustomEvent('cfgame:final',{detail:{score}})). */
document.addEventListener('DOMContentLoaded', function () {
  if (!window.CFArcade) return;
  var GAME = 'chomp';

  var board     = document.getElementById('cfBoard');
  var title     = document.getElementById('lbTitle');
  var result    = document.getElementById('lbResult');
  var scoreEl   = document.getElementById('lbScore');
  var submitRow = document.getElementById('lbSubmitRow');
  var nick      = document.getElementById('lbNick');
  var submitBtn = document.getElementById('lbSubmit');
  var list      = document.getElementById('lbList');
  var pendingScore = 0;

  // Solange das Overlay offen ist, dürfen die Spieltasten (WASD/Pfeile/Enter/ESC/P/M)
  // NICHT beim Spiel landen -> Capture-Phase stoppt sie vor den Spiel-Listenern.
  ['keydown', 'keyup'].forEach(function (ev) {
    window.addEventListener(ev, function (e) {
      if (board.hidden) return;
      if (e.code === 'Escape' && ev === 'keydown') { e.stopPropagation(); closeBoard(); return; }
      e.stopPropagation();
      if (CFArcade.isTyping(e.target) && e.code === 'Enter' && ev === 'keydown') submit();
    }, true);
  });

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
    title.textContent = over ? '🏁 Game Over' : '🏆 Bestenliste';
    result.hidden = !over;
    if (over) {
      var record = CFArcade.setLocalBest(GAME, score);
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

  // Spielende -> Ergebnis-/Eintrag-Overlay (kurz den Game-Over-Sound wirken lassen)
  window.addEventListener('cfgame:final', function (e) {
    setTimeout(function () { openBoard('final', Math.floor(e.detail.score)); }, 900);
  });

  document.getElementById('boardBtn').addEventListener('click', function () {
    board.hidden ? openBoard('view') : closeBoard();
  });
  document.getElementById('lbClose').addEventListener('click', closeBoard);
  submitBtn.addEventListener('click', submit);
});
</script>

</body>
</html>
