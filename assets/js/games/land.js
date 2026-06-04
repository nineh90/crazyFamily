"use strict";
/* =========================================================================
   CrazyFamily Land — ein eigenständiger, farbiger Jump'n'Run-Nachbau
   (inspiriert vom ersten Game-Boy-Klassiker von 1989). Alle Figuren,
   Grafiken und der gesamte Code sind eigene Werke. 4 Welten · 12 Level ·
   Bosse · Superball-Power-up · Münzen · Leben · localStorage-Speicher.
   ========================================================================= */

const TILE = 16;
const VW = 160, VH = 144;                 // interne Auflösung (Game-Boy-Format)
const cv = document.getElementById('screen');
const cx = cv.getContext('2d');
cx.imageSmoothingEnabled = false;

/* Display skalieren (scharfe Pixel) */
function fitScreen(){
  const maxW = Math.min(window.innerWidth*0.96, 720);
  const maxH = window.innerHeight*0.62;
  let s = Math.max(1, Math.floor(Math.min(maxW/VW, maxH/VH)));
  cv.style.width = (VW*s)+'px';
  cv.style.height = (VH*s)+'px';
}
window.addEventListener('resize', fitScreen); fitScreen();

/* ---------------------------------------------------------------------- */
/* Seedbarer Zufall, damit Level bei jedem Laden identisch sind            */
/* ---------------------------------------------------------------------- */
function mulberry32(a){ return function(){
  a |= 0; a = a + 0x6D2B79F5 | 0;
  let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};}

/* ---------------------------------------------------------------------- */
/* Welt-Themen (Farben)                                                   */
/* ---------------------------------------------------------------------- */
/* Düster-intensive CrazyFamily-Paletten: Endzeit-Stimmung statt nur bunt.
   skyTop/skyBot = Verlauf-Himmel · silh = Ruinen-Silhouette · accent = Glüh-Akzent */
const WORLDS = [
  { name:"Glutwüste",   skyTop:"#2a1730", skyBot:"#e0552a", silh:"#3a1f1a", accent:"#ff7a2b",
    sky:"#e0552a", far:"#7a3a22", ground:"#c98a3a", groundDk:"#7a4d1c",
    brick:"#b85a26", brickDk:"#6e2f12", pipe:"#2aa15a", pipeDk:"#155e30", deco:"pyramid" },
  { name:"Sturmsee",    skyTop:"#06121f", skyBot:"#0e3a55", silh:"#04161f", accent:"#36e0ff",
    sky:"#0e3a55", far:"#0a2233", ground:"#2f88ad", groundDk:"#184a62",
    brick:"#3a6a9c", brickDk:"#1f3a62", pipe:"#2aa15a", pipeDk:"#155e30", deco:"wave" },
  { name:"Aschefels",   skyTop:"#15171c", skyBot:"#4a3b3f", silh:"#0e0f12", accent:"#9be0c0",
    sky:"#4a3b3f", far:"#23252b", ground:"#6f7468", groundDk:"#42463e",
    brick:"#6a655a", brickDk:"#3a372f", pipe:"#2aa15a", pipeDk:"#155e30", deco:"moai" },
  { name:"Höllentor",   skyTop:"#1a0618", skyBot:"#8a1838", silh:"#1c0410", accent:"#ff2a6d",
    sky:"#8a1838", far:"#3a0a1c", ground:"#a83a6a", groundDk:"#5e1f3c",
    brick:"#b8305c", brickDk:"#6e163a", pipe:"#7a2db0", pipeDk:"#3e1560", deco:"lantern" },
];

/* ---------------------------------------------------------------------- */
/* Level-Erzeugung: liefert ein 2D-Grid aus Tile-Codes                    */
/* Tile-Codes:                                                            */
/*  0 leer · 1 Boden · 2 Backstein · 3 Fragezeichen(Münze) ·             */
/*  4 Fragezeichen(Power) · 5 Münze · 6 Rohr · 7 fest/Block · 8 Stachel · */
/*  9 Ziel-Tor · 10 harter Stein                                          */
/* ---------------------------------------------------------------------- */
const T = { EMPTY:0, GROUND:1, BRICK:2, QCOIN:3, QPOW:4, COIN:5, PIPE:6, BLOCK:7,
            SPIKE:8, GOAL:9, HARD:10 };
const SOLID = new Set([T.GROUND,T.BRICK,T.QCOIN,T.QPOW,T.PIPE,T.BLOCK,T.HARD]);

function buildLevel(world, stage){
  // Spezialfälle: zwei Auto-Scroll-Shooter-Level (wie im Original-Aufbau)
  if(world===1 && stage===2) return buildShooterLevel(world, stage, 'dive'); // W2-3 U-Boot
  if(world===3 && stage===2) return buildShooterLevel(world, stage, 'fly');  // W4-3 Flieger

  const seed = (world*97 + stage*131 + 7) >>> 0;
  const rnd = mulberry32(seed);
  const R = (n)=> Math.floor(rnd()*n);
  const chance = (p)=> rnd()<p;
  const isBoss = (stage === 2);             // jedes 3. Level ist ein Boss-Level
  const H = 9;                              // 9 Tiles hoch (= 144px), spielbar 0..6
  const groundTop = H-2;                    // zwei Boden-Reihen (7,8)
  // deutlich längere Level als zuvor
  const W = isBoss ? (95 + world*14) : (210 + world*48);
  const g = Array.from({length:H}, ()=> new Array(W).fill(T.EMPTY));
  const enemies = [];
  let powCount = 0;

  const fillGround = (x0,x1)=>{ for(let x=Math.max(0,x0);x<Math.min(W,x1);x++){ g[H-1][x]=T.GROUND; g[H-2][x]=T.GROUND; } };
  const put = (tx,ty,t)=>{ if(tx>=0&&tx<W&&ty>=0&&ty<H) g[ty][tx]=t; };
  const addEn = (type,tx,ty,extra)=>{ if(tx>2 && tx<W-3) enemies.push(Object.assign({type, x:tx*TILE, y:ty*TILE, w:world}, extra||{})); };
  const qpow = ()=>{ powCount++; return T.QPOW; };

  // füllt Spalten von Reihe 'top' bis zum Boden (für erhöhtes Gelände)
  const ground = (x0,x1,top)=>{ top=(top==null?groundTop:top);
    for(let xx=Math.max(0,x0);xx<Math.min(W,x1);xx++) for(let y=top;y<H;y++) g[y][xx]=T.GROUND; };
  const foe = ()=> chance(0.28)?'hopper':'walker';

  // ---- Startfläche + garantiertes frühes Power-up ----
  fillGround(0, 20);
  put(13, groundTop-3, T.BRICK);
  put(14, groundTop-3, qpow());             // erstes Power-up immer da
  put(15, groundTop-3, T.QCOIN);
  put(16, groundTop-3, T.BRICK);
  let x = 20;
  const safeEnd = isBoss ? (W-22) : (W-14);

  // -------- Segment-Bibliothek (jedes legt seinen Boden, gibt neues x) --------
  function segFlat(){ const len=7+R(5); fillGround(x,x+len);
    const n=1+R(2);
    for(let i=0;i<n;i++) addEn(foe(), x+3+i*3, groundTop-1, {dir: chance(0.5)?-1:1});
    if(chance(0.45)) for(let i=0;i<3+R(3);i++) put(x+2+i,groundTop-3,T.COIN);
    return x+len; }

  function segPlateau(){ const flat=4+R(4), len=flat+5, top=groundTop-2;
    fillGround(x,x+len);
    ground(x+2, x+2+flat, top);              // erhöhtes Plateau (2 hoch, hüpfbar)
    addEn(foe(), x+3, top-1, {dir:-1});
    if(chance(0.6)) for(let i=0;i<Math.min(flat,4);i++) put(x+3+i, top-2, T.COIN);
    if(chance(0.35)) { put(x+3, top-3, T.BRICK); put(x+4, top-3, qpow()); }
    return x+len; }

  function segSpikePit(){ const pre=3; fillGround(x,x+pre);
    const sp=2+R(2); fillGround(x+pre, x+pre+sp);
    for(let i=0;i<sp;i++) put(x+pre+i, groundTop-1, T.SPIKE);   // drüberspringen
    fillGround(x+pre+sp, x+pre+sp+4);
    if(chance(0.6)) for(let i=0;i<sp+1;i++) put(x+pre+i, groundTop-3, T.COIN);
    return x+pre+sp+5; }

  function segSteppingStones(){ const pre=3; fillGround(x,x+pre); let xx=x+pre;
    const stones=2+R(2);
    for(let i=0;i<stones;i++){ const sx=xx+i*2; put(sx,groundTop-1,T.HARD);
      if(chance(0.6)) put(sx,groundTop-3,T.COIN); }
    xx += stones*2; fillGround(xx,xx+4);
    if(chance(0.4)) addEn('flyer', xx-1, groundTop-3,{baseY:(groundTop-3)*TILE});
    return xx+4; }

  function segPipeField(){ const n=2+R(2); fillGround(x,x+n*4+5); let xx=x+2;
    for(let i=0;i<n;i++){ const ph=2+R(3);
      for(let hh=0;hh<ph;hh++){ put(xx,groundTop-hh,T.PIPE); put(xx+1,groundTop-hh,T.PIPE);}
      if(chance(0.55)) addEn(foe(), xx+3, groundTop-1, {dir:-1});
      if(chance(0.3)) put(xx, groundTop-ph-1, T.COIN);
      xx+=4; }
    return x+n*4+5; }

  function segBricks(){ const len=9+R(4); fillGround(x,x+len);
    const cy=groundTop-3-R(2);
    put(x+2,cy,T.BRICK);
    put(x+3,cy, chance(0.5)?qpow():T.QCOIN);
    put(x+4,cy,T.BRICK);
    if(chance(0.6)) put(x+5,cy,T.QCOIN);
    if(chance(0.4)) put(x+6,cy,T.BRICK);
    addEn(foe(), x+len-3, groundTop-1, {dir:-1});
    if(chance(0.3)) addEn('flyer', x+5, cy-2, {baseY:(cy-2)*TILE});
    return x+len; }

  function segHighRoad(){ const len=10+R(4); fillGround(x,x+len);
    const hy=groundTop-4;
    for(let s=0;s<3;s++) for(let yy=0;yy<=s;yy++) put(x+s, groundTop-1-yy, T.HARD);  // Aufgang
    for(let i=3;i<len-2;i++) put(x+i, hy, T.HARD);                                    // hoher Pfad
    for(let i=3;i<len-2;i++) if(chance(0.6)) put(x+i, hy-1, T.COIN);                  // Belohnung
    addEn('walker', x+3, groundTop-1,{dir:-1}); addEn(foe(), x+len-3, groundTop-1,{dir:1});
    return x+len; }

  function segStairsBig(){ const n=3+R(2), len=n*2+3; fillGround(x,x+len);
    for(let s=0;s<n;s++) for(let yy=0;yy<=s;yy++) put(x+1+s, groundTop-1-yy, T.HARD);          // hoch
    for(let s=0;s<n;s++) for(let yy=0;yy<=(n-1-s);yy++) put(x+1+n+s, groundTop-1-yy, T.HARD);  // runter
    if(chance(0.6)) put(x+n, groundTop-n-1, T.COIN);
    addEn('walker', x+1, groundTop-1,{dir:1});
    return x+len; }

  function segCoinArc(){ const len=8+R(3); fillGround(x,x+len);
    const cy=groundTop-2; for(let i=0;i<5;i++) put(x+2+i, cy-(i<3?i:4-i)-1, T.COIN);
    if(chance(0.5)) addEn('flyer', x+4, groundTop-4, {baseY:(groundTop-4)*TILE});
    return x+len; }

  function segCorridor(){ const len=11+R(4); fillGround(x,x+len);
    const ceil=groundTop-4;
    for(let i=0;i<len-2;i++){ put(x+1+i, ceil, (i===3)? qpow() : (chance(0.4)?T.QCOIN:T.BRICK)); }
    for(let i=0;i<len-3;i++) if(chance(0.45)) put(x+2+i, groundTop-1, T.COIN);
    addEn('walker', x+2, groundTop-1,{dir:-1}); addEn(foe(), x+len-3, groundTop-1,{dir:1});
    return x+len; }

  function segRealGap(){ const pre=4; fillGround(x,x+pre);
    const gap=2+R(2);                                  // echte Grube (2-3 breit, mit Anlauf)
    const post=5; fillGround(x+pre+gap, x+pre+gap+post);
    for(let i=0;i<gap;i++) put(x+pre+i, groundTop-3, T.COIN);   // Münzbogen über der Grube
    if(chance(0.4)) addEn('flyer', x+pre+gap, groundTop-4,{baseY:(groundTop-4)*TILE});
    return x+pre+gap+post; }

  function segGauntlet(){ const len=10+R(3); fillGround(x,x+len);
    addEn('walker', x+3, groundTop-1,{dir:-1});
    addEn('hopper', x+6, groundTop-1,{dir:-1});
    addEn(foe(), x+len-3, groundTop-1,{dir:1});
    addEn('flyer', x+(len>>1), groundTop-4, {baseY:(groundTop-4)*TILE});
    if(chance(0.5)){ put(x+5,groundTop-3,T.BRICK); put(x+6,groundTop-3, chance(0.5)?qpow():T.QCOIN); }
    return x+len; }

  const segs=[segFlat,segPlateau,segSpikePit,segSteppingStones,segRealGap,segPipeField,
              segBricks,segHighRoad,segStairsBig,segCoinArc,segCorridor,segGauntlet];

  let lastIdx=-1;
  while(x < safeEnd){
    let idx; do { idx=R(segs.length); } while(idx===lastIdx);   // nie zweimal dasselbe
    lastIdx=idx;
    const nx = segs[idx]();
    x = Math.max(nx, x+5);
    fillGround(x, x+1);                      // Mini-Brücke gegen Lücken zwischen Segmenten
    // verteilte Power-up-Garantie: je eines im ersten, zweiten und letzten Drittel
    if(!isBoss && ((powCount<2 && x>W*0.33) || (powCount<3 && x>W*0.6) || (powCount<4 && x>W*0.8))){
      fillGround(x,x+6); put(x+2,groundTop-3,T.BRICK); put(x+3,groundTop-3,qpow()); put(x+4,groundTop-3,T.QCOIN); x+=6;
    }
  }

  if(isBoss){
    // ---- Boss-Anlauf ----
    fillGround(x, W);
    // Waffenkammer vor der Arena: 3 verteilte Power-up-Kisten (klein -> groß -> BLUME garantiert)
    put(W-23, groundTop-3, T.BRICK);
    put(W-22, groundTop-3, qpow());
    put(W-20, groundTop-3, T.QCOIN);
    put(W-18, groundTop-3, qpow());
    put(W-16, groundTop-3, qpow());
    put(W-15, groundTop-3, T.BRICK);
    const arenaX0 = W-12;
    put(arenaX0+1, groundTop-3, T.HARD); put(arenaX0+2, groundTop-3, T.HARD);
    put(W-5, groundTop-3, T.HARD); put(W-6, groundTop-3, T.HARD);
    enemies.push({type:'boss', x:(W-9)*TILE, y:(groundTop-3)*TILE});
    return { grid:g, W, H, enemies, world, stage, isBoss:true, arenaX0 };
  }

  // ---- Zielbereich: Treppe + Tor ----
  fillGround(x, W);
  for(let s=0;s<4;s++){ for(let yy=0;yy<=s;yy++) put(W-10+s, groundTop-1-yy, T.HARD); }
  put(W-4, groundTop-1, T.GOAL);
  put(W-4, groundTop-2, T.GOAL);

  // ein paar Münzen am Himmel
  for(let i=0;i<12;i++){ const cx0=24+R(Math.max(1,W-48)), cy=2+R(2);
    if(g[cy][cx0]===T.EMPTY && g[cy+1][cx0]===T.EMPTY) g[cy][cx0]=T.COIN; }

  return { grid:g, W, H, enemies, world, stage, isBoss:false, goal:{x:W-4} };
}

/* ---------------------------------------------------------------------- */
/* Shooter-Level (Auto-Scroll): 'dive' = U-Boot, 'fly' = Flieger          */
/* ---------------------------------------------------------------------- */
function buildShooterLevel(world, stage, kind){
  const seed = (world*131 + stage*97 + kind.length*13 + 3) >>> 0;
  const rnd = mulberry32(seed);
  const R = (n)=> Math.floor(rnd()*n);
  const scrollLen = 3200 + world*500;        // Strecke bis zum Boss
  const spawns = [];
  let at = 220;
  while(at < scrollLen-200){
    const r = rnd();
    const y = 18 + R(VH-46);
    if(r < 0.46)      spawns.push({at, type:'enemy',   y});
    else if(r < 0.66) spawns.push({at, type:'shooter', y});
    else if(r < 0.84){ for(let i=0;i<5;i++) spawns.push({at:at+i*22, type:'coin', y: 24+((y+i*10)%(VH-48))}); }
    else              spawns.push({at, type:'mine',    y});
    at += 80 + R(120);
  }
  spawns.sort((a,b)=>a.at-b.at);
  return { mode:'shooter', kind, world, stage, isBoss:false,
    scrollLen, scrollSpeed: 0.95 + world*0.1, scrollDist:0, spawnIdx:0, bossSpawned:false,
    spawns, W:0, H:9, enemies:[] };
}

/* ---------------------------------------------------------------------- */
/* Eingaben                                                               */
/* ---------------------------------------------------------------------- */
const keys = { left:false, right:false, jump:false, run:false, down:false, pause:false, enter:false, quit:false };
const keyMap = {
  ArrowLeft:'left', KeyA:'left', ArrowRight:'right', KeyD:'right',
  ArrowUp:'jump', KeyW:'jump', Space:'jump', KeyK:'jump',
  ArrowDown:'down', KeyS:'down',
  ShiftLeft:'run', ShiftRight:'run', KeyJ:'run',
  KeyP:'pause', Enter:'enter', Escape:'quit',
};
addEventListener('keydown', e=>{
  const k = keyMap[e.code];
  if(k){ if(k==='jump'||k==='enter'||k==='pause'||k==='run'||k==='quit'){ if(!e.repeat) edge(k,true); } keys[k]=true; e.preventDefault(); }
});
addEventListener('keyup', e=>{ const k = keyMap[e.code]; if(k){ keys[k]=false; e.preventDefault(); } });

/* Edge-Buffer für Sprung/Enter (frische Tastendrücke) */
const pressed = {};
function edge(k,v){ if(v) pressed[k]=true; }
function consume(k){ if(pressed[k]){ pressed[k]=false; return true; } return false; }

/* Touch-Buttons */
function bind(id, key, isEdge){
  const el = document.getElementById(id);
  const on = e=>{ e.preventDefault(); keys[key]=true; if(isEdge) edge(key,true); };
  const off = e=>{ e.preventDefault(); keys[key]=false; };
  el.addEventListener('touchstart',on,{passive:false});
  el.addEventListener('touchend',off,{passive:false});
  el.addEventListener('touchcancel',off,{passive:false});
  el.addEventListener('mousedown',on); el.addEventListener('mouseup',off); el.addEventListener('mouseleave',off);
}
bind('bL','left'); bind('bR','right'); bind('bA','jump',true); bind('bB','run',true);

/* ---------------------------------------------------------------------- */
/* Speicherstand (localStorage)                                           */
/* ---------------------------------------------------------------------- */
const SAVE_KEY = 'crazyfamily_land_save_v1';
function loadSave(){
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(s && typeof s.world==='number') return s; } catch(e){}
  return null;
}
function writeSave(state){
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch(e){}
}
function clearSave(){ try{ localStorage.removeItem(SAVE_KEY);}catch(e){} }

/* ---------------------------------------------------------------------- */
/* Audio (kleine Beeps, ohne Assets)                                      */
/* ---------------------------------------------------------------------- */
let AC = null;
function actx(){ if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }
function beep(freq, dur, type, vol){
  const a = actx(); if(!a) return;
  const o = a.createOscillator(), gn = a.createGain();
  o.type = type||'square'; o.frequency.value = freq;
  gn.gain.value = vol||0.06;
  o.connect(gn); gn.connect(a.destination);
  const t = a.currentTime;
  gn.gain.setValueAtTime(gn.gain.value, t);
  gn.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.start(t); o.stop(t+dur);
}
const SFX = {
  jump:()=>beep(520,0.12,'square',0.05),
  coin:()=>{beep(880,0.06,'square',0.05); setTimeout(()=>beep(1180,0.09,'square',0.05),60);},
  stomp:()=>beep(200,0.09,'square',0.06),
  power:()=>{beep(440,0.08); setTimeout(()=>beep(660,0.08),80); setTimeout(()=>beep(880,0.1),160);},
  shoot:()=>beep(700,0.05,'sawtooth',0.04),
  hit:()=>{beep(180,0.18,'sawtooth',0.07);},
  die:()=>{beep(330,0.15); setTimeout(()=>beep(220,0.15),140); setTimeout(()=>beep(130,0.3),280);},
  win:()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.14),i*120));},
  boss:()=>beep(120,0.25,'sawtooth',0.07),
};

/* ---------------------------------------------------------------------- */
/* Spielzustand                                                           */
/* ---------------------------------------------------------------------- */
const SCENE = { TITLE:0, PLAY:1, TRANSITION:2, GAMEOVER:3, WIN:4 };
const game = {
  scene: SCENE.TITLE,
  world:0, stage:0,            // 0-indiziert (Welt 0..3, Stage 0..2)
  lives:3, coins:0, score:0,
  power:0,                     // 0 klein, 1 groß, 2 superball
  titleSel:0,                  // 0 = Fortsetzen / Neues Spiel
  hasSave:false,
  flash:0, transT:0, transMsg:"",
};

let level=null, player=null, camera=0, enemies=[], particles=[], balls=[], items=[];
let coinAnim=0, time=0;

function startLevel(world, stage){
  level = buildLevel(world, stage);
  if(level.mode==='shooter'){
    enemies=[]; particles=[]; balls=[]; items=[];
    player = { x:24, y:VH/2-6, vx:0, vy:0, w:18, h:12, dir:1,
      invuln:0, dead:false, win:false, winT:0, anim:0, shootCd:0, isVehicle:true, onGround:false };
    camera=0; game.world=world; game.stage=stage; return;
  }
  enemies = level.enemies.map(e=>{
    const isB = e.type==='boss', isF = e.type==='flyer';
    const dir = (e.dir!=null)? e.dir : -1;
    const spd = isF ? -0.6 : (0.4 + (world*0.06)) * dir;
    return { ...e, alive:true, dir, vx: isB?0:spd, vy:0,
      w: isB?24 : (isF?12:TILE-2), h: isB?22 : (isF?10:TILE-2),
      hp: isB?6:1, maxHp: isB?6:1, t:Math.random()*6.28, shell:false, hurt:0 };
  });
  particles=[]; balls=[]; items=[];
  player = {
    x: 2*TILE, y:(level.H-4)*TILE, vx:0, vy:0,
    w:12, h:(game.power>0?28:14), onGround:false, dir:1,
    invuln:0, dead:false, win:false, winT:0, anim:0, ducking:false,
    coyote:0, jumpBuf:0,
  };
  camera=0;
  game.world=world; game.stage=stage;
}

function gotoTransition(msg, next){
  game.scene = SCENE.TRANSITION; game.transT = 0; game.transMsg = msg; game._next = next;
}

/* ---------------------------------------------------------------------- */
/* Kollision mit Tiles                                                    */
/* ---------------------------------------------------------------------- */
function tileAt(tx,ty){
  if(ty<0||ty>=level.H||tx<0) return T.EMPTY;
  if(tx>=level.W) return T.GROUND;          // Wand am Levelende
  return level.grid[ty][tx];
}
function solidAt(tx,ty){ return SOLID.has(tileAt(tx,ty)); }

function rectVsWorld(o, dx, dy){
  // X
  o.x += dx;
  let x0 = Math.floor(o.x/TILE), x1 = Math.floor((o.x+o.w-1)/TILE);
  let y0 = Math.floor(o.y/TILE), y1 = Math.floor((o.y+o.h-1)/TILE);
  if(dx>0){ for(let ty=y0;ty<=y1;ty++) if(solidAt(x1,ty)){ o.x=x1*TILE-o.w; o.vx=0; break; } }
  else if(dx<0){ for(let ty=y0;ty<=y1;ty++) if(solidAt(x0,ty)){ o.x=(x0+1)*TILE; o.vx=0; break; } }
  // Y
  o.y += dy;
  o.onGround=false;
  x0 = Math.floor(o.x/TILE); x1 = Math.floor((o.x+o.w-1)/TILE);
  y0 = Math.floor(o.y/TILE); y1 = Math.floor((o.y+o.h-1)/TILE);
  if(dy>0){ for(let tx=x0;tx<=x1;tx++) if(solidAt(tx,y1)){ o.y=y1*TILE-o.h; o.vy=0; o.onGround=true; break; } }
  else if(dy<0){ for(let tx=x0;tx<=x1;tx++){ if(solidAt(tx,y0)){ o.y=(y0+1)*TILE; o.vy=0; if(o.isPlayer) hitBlock(tx,y0); break; } } }
}

function hitBlock(tx,ty){
  const t = tileAt(tx,ty);
  if(t===T.QCOIN){ level.grid[ty][tx]=T.BLOCK; game.coins++; game.score+=100; SFX.coin();
    spawnBounceCoin(tx,ty); checkOneUp(); }
  else if(t===T.QPOW){ level.grid[ty][tx]=T.BLOCK; SFX.power();
    // generisches Power-up; Effekt wird erst beim Einsammeln festgelegt
    const toward = (player.x < tx*TILE) ? -0.6 : 0.6;
    items.push({type:'power', x:tx*TILE+1, y:(ty-1)*TILE, vx:toward, vy:0, w:14, h:14, born:0}); }
  else if(t===T.BRICK){
    if(game.power>0){ level.grid[ty][tx]=T.EMPTY; game.score+=50; SFX.stomp();
      for(let i=0;i<4;i++) particles.push({x:tx*TILE+8,y:ty*TILE+8,vx:(Math.random()-0.5)*3,vy:-2-Math.random()*2,life:30,c:WORLDS[game.world].brickDk}); }
    else { SFX.stomp(); }
  }
}
function spawnBounceCoin(tx,ty){
  particles.push({coin:true,x:tx*TILE+4,y:ty*TILE,vx:0,vy:-4,life:28,c:'#ffd23f'});
}
function checkOneUp(){ if(game.coins>=100){ game.coins-=100; game.lives++; SFX.power(); } }

/* ---------------------------------------------------------------------- */
/* Update                                                                 */
/* ---------------------------------------------------------------------- */
function update(dt){
  time += dt; coinAnim = (coinAnim+dt*6)%4;
  if(game.flash>0) game.flash--;
  updateEmbers();                        // Glut-Ambiente immer aktiv

  if(game.scene===SCENE.TITLE){ updateTitle(); return; }
  if(game.scene===SCENE.GAMEOVER){ if(consume('enter')){ resetToTitle(); } return; }
  if(game.scene===SCENE.WIN){ if(consume('enter')){ resetToTitle(); } return; }
  if(game.scene===SCENE.TRANSITION){
    game.transT += dt;
    if(game.transT>1.4){ game._next(); }
    return;
  }
  if(consume('quit')){ game.paused=false; resetToTitle(); return; }   // ESC = Spiel verlassen
  if(consume('pause')){ game.paused=!game.paused; }
  if(game.paused){ return; }
  if(level && level.mode==='shooter') updateShooter(dt);
  else updatePlay(dt);
}

function updateTitle(){
  game.hasSave = !!loadSave();
  if(keys.left||keys.right){ /* nichts */ }
  if(consume('jump')||consume('enter')){
    if(game.titleSel===0 && game.hasSave){
      const s = loadSave();
      game.lives=s.lives; game.coins=s.coins; game.score=s.score; game.power=s.power;
      startLevel(s.world, s.stage); game.scene=SCENE.PLAY; game.paused=false;
    } else {
      clearSave();
      game.lives=3; game.coins=0; game.score=0; game.power=0;
      startLevel(0,0); game.scene=SCENE.PLAY; game.paused=false;
    }
  }
  // Auswahl wechseln
  if(consume('run')){ if(game.hasSave) game.titleSel = game.titleSel?0:1; }
}

function resetToTitle(){ game.scene=SCENE.TITLE; game.titleSel = loadSave()?0:1; }

function updatePlay(dt){
  const p = player;
  p.isPlayer=true;
  p.anim += Math.abs(p.vx)*dt*8;

  if(p.dead){
    p.vy += 0.4; p.y += p.vy;
    p.winT += dt;
    if(p.winT>1.4){ onLifeLost(); }
    return;
  }
  if(p.win){
    p.winT += dt; p.vx=0;
    if(p.winT>1.2){ onLevelComplete(); }
    return;
  }

  // --- Steuerung ---
  const run = keys.run;
  const accel = run?0.55:0.4, maxv = run?2.6:1.7;
  if(keys.left){ p.vx -= accel; p.dir=-1; }
  else if(keys.right){ p.vx += accel; p.dir=1; }
  else { p.vx *= 0.8; if(Math.abs(p.vx)<0.05) p.vx=0; }
  p.vx = Math.max(-maxv, Math.min(maxv, p.vx));

  // Sprung mit Eingabe-Puffer (jump buffering) + Coyote-Time
  if(consume('jump')) p.jumpBuf = 9;          // ~150ms: Druck kurz vor Landung zählt
  if(p.jumpBuf>0) p.jumpBuf--;
  if(p.coyote>0)  p.coyote--;
  if(p.jumpBuf>0 && (p.onGround || p.coyote>0)){
    p.vy = -7.4; p.onGround=false; p.coyote=0; p.jumpBuf=0; SFX.jump();
  }
  if(!keys.jump && p.vy<-2) p.vy = -2;       // variabler Sprung (loslassen = kürzer)

  // Superball schießen
  if(game.power===2 && consume('run') && balls.length<2){
    balls.push({x:p.x+(p.dir>0?p.w:-6), y:p.y+6, vx:p.dir*3.4, vy:2, w:6,h:6, life:90, bounces:0});
    SFX.shoot();
  }

  // Schwerkraft
  p.vy += 0.42; if(p.vy>9) p.vy=9;
  p.h = game.power>0 ? 28 : 14;
  rectVsWorld(p, p.vx, 0);
  rectVsWorld(p, 0, p.vy);
  if(p.onGround) p.coyote = 6;               // ~100ms Gnadenfrist nach Kanten

  // In Abgrund gefallen
  if(p.y > level.H*TILE + 20){ playerDie(); }

  // Ziel erreicht?
  if(!level.isBoss && level.goal){
    if(Math.floor((p.x+p.w/2)/TILE) >= level.goal.x){ p.win=true; p.winT=0; SFX.win(); }
  }

  // Kamera
  const target = p.x - VW*0.4;
  camera = Math.max(0, Math.min(level.W*TILE - VW, target));
  if(camera<0) camera=0;

  // Münzen-Tiles einsammeln
  collectCoinTiles(p);

  // Power-up-Items
  updateItems(dt);

  // Gegner
  updateEnemies(dt);

  // Superbälle
  updateBalls(dt);

  // Partikel
  updateParticles(dt);

  if(p.invuln>0) p.invuln--;

  // Autosave-Trigger passiert bei Levelabschluss
}

function collectCoinTiles(p){
  const x0=Math.floor(p.x/TILE), x1=Math.floor((p.x+p.w-1)/TILE);
  const y0=Math.floor(p.y/TILE), y1=Math.floor((p.y+p.h-1)/TILE);
  for(let ty=y0;ty<=y1;ty++) for(let tx=x0;tx<=x1;tx++){
    if(tileAt(tx,ty)===T.COIN){ level.grid[ty][tx]=T.EMPTY; game.coins++; game.score+=100; SFX.coin(); checkOneUp(); }
    if(tileAt(tx,ty)===T.SPIKE){ playerHurt(); }
  }
}

function updateItems(dt){
  for(const it of items){
    it.born += dt;
    // Schwerkraft
    it.vy += 0.3; if(it.vy>5) it.vy=5;
    // horizontal mit Wandabprall
    let nx = it.x + it.vx;
    let sx = Math.floor((nx + (it.vx>0?it.w:0))/TILE), sy = Math.floor((it.y+it.h/2)/TILE);
    if(solidAt(sx,sy)) it.vx*=-1; else it.x = nx;
    // vertikal
    it.y += it.vy;
    let fy=Math.floor((it.y+it.h)/TILE), fx=Math.floor((it.x+it.w/2)/TILE);
    if(solidAt(fx,fy)){ it.y=fy*TILE-it.h; it.vy=0; }
    // an Abgrundkanten umkehren -> Power-up läuft nie in eine Grube
    if(it.vy===0){
      let aheadX = Math.floor((it.x + (it.vx>0?it.w+1:-1))/TILE), belowY = Math.floor((it.y+it.h+2)/TILE);
      if(!solidAt(aheadX,belowY)) it.vx*=-1;
    }
    // Aufsammeln — Effekt richtet sich nach AKTUELLER Power:
    // 1. Power-up -> groß, nächstes -> Superball (Blume). Reihenfolge egal.
    if(aabb(it, player)){
      it.dead=true;
      if(game.power===0)      growPlayer(1);   // -> groß
      else if(game.power===1) growPlayer(2);   // -> Superball
      else                    game.score+=1000;
      SFX.power(); game.score+=1000;
    }
  }
  items = items.filter(i=>!i.dead);
}

function growPlayer(level){
  const prev = game.power;
  game.power = Math.max(game.power, level);
  if(level>prev && prev===0){ player.y -= 14; }    // wächst nach oben
  game.flash=20;
}

function updateEnemies(dt){
  for(const e of enemies){
    if(!e.alive) continue;
    if(e.type==='boss'){ updateBoss(e,dt); continue; }
    e.t += dt;
    if(e.type==='flyer'){
      e.x += e.vx;
      e.y = e.baseY + Math.sin(e.t*3)*18;
      // an Spielerseite drehen gelegentlich
      if(e.x < camera-20) e.alive=false;
    } else {
      // walker / shell
      e.vy += 0.4; if(e.vy>8)e.vy=8;
      // horizontale Wandprüfung
      let nx = e.x + e.vx;
      let sx = Math.floor((nx + (e.vx>0?e.w:0))/TILE);
      let sy = Math.floor((e.y+e.h/2)/TILE);
      if(solidAt(sx,sy)){ e.vx*=-1; e.dir*=-1; }
      else e.x = nx;
      // vertikal
      e.y += e.vy;
      let fy=Math.floor((e.y+e.h)/TILE), fx=Math.floor((e.x+e.w/2)/TILE);
      if(solidAt(fx,fy)){ e.y=fy*TILE-e.h; e.vy=0; }
      // Hüpf-Gegner springt periodisch, wenn er auf dem Boden steht
      if(e.type==='hopper'){ e.hopT=(e.hopT||0)+dt; if(e.vy===0 && e.hopT>0.8){ e.vy=-4.6; e.hopT=0; } }
      // Kantenstopp (nicht in Abgrund laufen) für gemütliche Gegner
      if(e.vx!==0 && !e.shell){
        let aheadX = Math.floor((e.x + (e.vx>0?e.w+1:-1))/TILE);
        let belowY = Math.floor((e.y+e.h+2)/TILE);
        if(!solidAt(aheadX,belowY)){ e.vx*=-1; e.dir*=-1; }
      }
    }
    if(e.hurt>0) e.hurt--;
    // Spieler-Kollision
    if(player.invuln<=0 && !player.dead && aabb(e, player)){
      const stomp = player.vy>0 && (player.y+player.h) - e.y < 12;
      if(stomp){
        if(e.type==='shell' || (e.shell)){
          // Schale wegkicken
          e.shell=true; e.vx = (player.x < e.x?2.5:-2.5); player.vy=-5; SFX.stomp();
        } else if(e.canShell){
          e.shell=true; e.canShell=false; e.vx=0; player.vy=-5; SFX.stomp();
        } else {
          e.alive=false; player.vy=-5; game.score+=100; SFX.stomp();
          for(let i=0;i<4;i++) particles.push({x:e.x+8,y:e.y+8,vx:(Math.random()-0.5)*3,vy:-Math.random()*3,life:24,c:'#fff'});
        }
      } else {
        playerHurt();
      }
    }
  }
  // Schalen treffen andere Gegner
  for(const e of enemies){
    if(e.alive && e.shell && Math.abs(e.vx)>1){
      for(const o of enemies){
        if(o!==e && o.alive && o.type!=='boss' && Math.abs(o.x-e.x)<14 && Math.abs(o.y-e.y)<14){
          o.alive=false; game.score+=100;
          for(let i=0;i<4;i++) particles.push({x:o.x+8,y:o.y+8,vx:(Math.random()-0.5)*3,vy:-Math.random()*3,life:24,c:'#fff'});
        }
      }
    }
  }
  enemies = enemies.filter(e=> e.alive || e.type==='boss');
}

function updateBoss(b,dt){
  b.t += dt;
  // hüpft hin und her und wirft gelegentlich Projektile
  b.vy += 0.4;
  b.vx = Math.sin(b.t*0.8)*1.2;
  b.x += b.vx;
  // Grenzen der Arena
  const arenaMin = (level.arenaX0||1)*TILE;
  b.x = Math.max(arenaMin, Math.min((level.W-2)*TILE, b.x));
  b.y += b.vy;
  let fy=Math.floor((b.y+b.h)/TILE), fx=Math.floor((b.x+b.w/2)/TILE);
  if(solidAt(fx,fy)){ b.y=fy*TILE-b.h; b.vy = (Math.random()<0.02? -6: 0); }
  if(b.hurt>0) b.hurt--;

  // Projektil
  b.shootT = (b.shootT||0)+dt;
  if(b.shootT>1.6){ b.shootT=0;
    enemies.push({type:'bossball', x:b.x, y:b.y+6, vx:-1.6, vy:-1, w:8,h:8, alive:true, t:0});
    SFX.boss();
  }

  // Boss-Projektile fliegen
  for(const e of enemies){
    if(e.type==='bossball' && e.alive){
      e.vy += 0.15; e.x += e.vx; e.y += e.vy;
      if(e.x < camera-20 || e.y>level.H*TILE) e.alive=false;
      if(player.invuln<=0 && !player.dead && aabb(e,player)){ e.alive=false; playerHurt(); }
    }
  }

  // Kollision Spieler vs Boss — Stampfen schadet (auch ohne Superball besiegbar)
  if(!player.dead && aabb(b,player)){
    const stomp = player.vy>0 && (player.y+player.h)-b.y < 16;
    if(stomp){
      player.vy=-7;
      if(b.hurt<=0){ b.hp--; b.hurt=30; SFX.hit();
        if(b.hp<=0) defeatBoss(b); }
    } else if(player.invuln<=0){ playerHurt(); }
  }
}

function updateBalls(dt){
  for(const ball of balls){
    ball.life--;
    ball.vy += 0.25;
    // X
    ball.x += ball.vx;
    let sx=Math.floor((ball.x+(ball.vx>0?ball.w:0))/TILE), sy=Math.floor((ball.y+ball.h/2)/TILE);
    if(solidAt(sx,sy)){ ball.vx*=-1; ball.bounces++; }
    // Y
    ball.y += ball.vy;
    let fy=Math.floor((ball.y+ball.h)/TILE), fx=Math.floor((ball.x+ball.w/2)/TILE);
    if(solidAt(fx,fy)){ ball.y=fy*TILE-ball.h; ball.vy=-3.2; ball.bounces++; }
    if(ball.bounces>6) ball.life=0;
    // Gegner treffen
    for(const e of enemies){
      if(e.alive && e.type!=='bossball' && aabb(ball,e)){
        if(e.type==='boss'){
          if(e.hurt<=0){ e.hp--; e.hurt=30; SFX.hit();
            if(e.hp<=0){ defeatBoss(e); } }
        } else {
          e.alive=false; game.score+=100; SFX.stomp();
          for(let i=0;i<4;i++) particles.push({x:e.x+8,y:e.y+8,vx:(Math.random()-0.5)*3,vy:-Math.random()*3,life:24,c:'#fff'});
        }
        ball.life=0;
      }
    }
  }
  balls = balls.filter(b=>b.life>0);
}

function defeatBoss(b){
  b.alive=false; SFX.win(); game.score+=5000;
  for(let i=0;i<20;i++) particles.push({x:b.x+12,y:b.y+12,vx:(Math.random()-0.5)*5,vy:-Math.random()*5,life:40,c:['#ffd23f','#ff6b35','#fff'][i%3]});
  // Tor freischalten → Spieler-Sieg auslösen
  player.win=true; player.winT=0;
}

function updateParticles(dt){
  for(const pa of particles){
    pa.vy += pa.coin?0.3:0.25; pa.x+=pa.vx; pa.y+=pa.vy; pa.life--;
  }
  particles = particles.filter(p=>p.life>0);
}

function playerHurt(){
  if(player.invuln>0||player.dead) return;
  if(game.power>0){ game.power = game.power-1; player.invuln=90; game.flash=20; SFX.hit();
    if(game.power===0){ player.y += 14; } }
  else { playerDie(); }
}
function playerDie(){ if(player.dead) return; player.dead=true; player.vy=-6; player.winT=0; SFX.die(); }

/* Highscore-Bridge: meldet den Endstand an die Seite (Bestenlisten-Overlay
   in pages/crazyfamily-land.php, globale Top 10 via assets/api/highscores.php) */
function announceFinal(won){
  try { window.dispatchEvent(new CustomEvent('cfland:final', { detail: { score: game.score, won: !!won } })); }
  catch(e){}
}

function onLifeLost(){
  game.lives--;
  if(game.lives<0){ game.scene=SCENE.GAMEOVER; clearSave(); announceFinal(false); return; }
  // Power verlieren, Level neu starten
  game.power = 0;
  startLevel(game.world, game.stage);
}

function onLevelComplete(){
  game.score += 2000;
  let w=game.world, s=game.stage+1;
  if(s>2){ s=0; w++; }
  if(w>3){
    // Spiel durchgespielt
    game.scene=SCENE.WIN; clearSave(); announceFinal(true); return;
  }
  // Speichern
  writeSave({ world:w, stage:s, lives:game.lives, coins:game.coins, score:game.score, power:game.power });
  gotoTransition(`WELT ${w+1}-${s+1}`, ()=>{ startLevel(w,s); game.scene=SCENE.PLAY; });
}

function aabb(a,b){ return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }

/* ---------------------------------------------------------------------- */
/* Rendering                                                              */
/* ---------------------------------------------------------------------- */
function px(x,y,w,h,c){ cx.fillStyle=c; cx.fillRect(Math.round(x),Math.round(y),w,h); }

function draw(){
  if(game.scene===SCENE.TITLE){ drawTitle(); drawEmbers(); drawPostFX(); return; }
  if(game.scene===SCENE.GAMEOVER){ drawGameOver(); drawEmbers(); drawPostFX(); return; }
  if(game.scene===SCENE.WIN){ drawWin(); drawEmbers(); drawPostFX(); return; }

  if(level && level.mode==='shooter') drawShooter();
  else drawPlatform();

  drawEmbers();                          // treibende Glut über der Szene
  drawPostFX();                          // Vignette + Scanlines (CRT-Look)

  if(game.scene===SCENE.TRANSITION){ drawTransition(); }
  if(game.paused){ overlay("PAUSE","P = weiter · ESC = beenden"); }
}

/* --- Glut-Partikel (Ambiente, über das ganze Bild) --- */
let embers=[];
function updateEmbers(){
  if(embers.length<30 && Math.random()<0.6)
    embers.push({x:Math.random()*VW, y:VH+2, vy:-(0.18+Math.random()*0.5), vx:(Math.random()-0.5)*0.25,
      t:0, max:130+Math.random()*120, c: Math.random()<0.45?'#ff7a2b':(Math.random()<0.6?'#ffd23f':'#ff3a4a')});
  for(const e of embers){ e.t++; e.y+=e.vy; e.x+=e.vx+Math.sin(e.t*0.07)*0.18; }
  embers = embers.filter(e=>e.y>-4 && e.t<e.max);
}
function drawEmbers(){
  for(const e of embers){ const a=(1-e.t/e.max);
    cx.globalAlpha=a*0.85; px(e.x,e.y,1,1,e.c);
    if(a>0.5){ cx.globalAlpha=a*0.3; px(e.x-1,e.y,3,1,e.c); px(e.x,e.y-1,1,3,e.c); } }
  cx.globalAlpha=1;
}

/* --- Post-Processing: Vignette + Scanlines --- */
let _vig=null;
function drawPostFX(){
  if(!_vig){ _vig=cx.createRadialGradient(VW/2,VH*0.45,VH*0.30, VW/2,VH*0.5,VH*0.9);
    _vig.addColorStop(0,'rgba(0,0,0,0)'); _vig.addColorStop(0.7,'rgba(0,0,0,0.15)'); _vig.addColorStop(1,'rgba(8,2,10,0.55)'); }
  cx.fillStyle=_vig; cx.fillRect(0,0,VW,VH);
  cx.fillStyle='rgba(0,0,0,0.10)';
  for(let y=0;y<VH;y+=2) cx.fillRect(0,y,VW,1);
}
/* sanfter Leucht-Halo hinter glühenden Dingen */
function glow(x,y,r,c){ cx.save(); cx.globalAlpha=0.5; cx.fillStyle=c;
  cx.beginPath(); cx.arc(x,y,r,0,6.2832); cx.fill(); cx.restore(); }

function drawPlatform(){
  const W = WORLDS[game.world];
  drawSky(W);
  drawBackground(W);

  // Tiles
  const startTx = Math.floor(camera/TILE);
  const endTx = startTx + Math.ceil(VW/TILE)+1;
  for(let tx=startTx; tx<endTx; tx++){
    for(let ty=0; ty<level.H; ty++){
      const t = tileAt(tx,ty); if(t===T.EMPTY) continue;
      drawTile(t, tx*TILE-camera, ty*TILE, W);
    }
  }

  // Items
  for(const it of items) drawItem(it);
  // Gegner
  for(const e of enemies) drawEnemy(e, W);
  // Superbälle
  for(const ball of balls){ drawBall(ball.x-camera, ball.y); }
  // Spieler
  drawPlayer();
  // Partikel
  for(const pa of particles){
    if(pa.coin){ drawCoinSprite(pa.x-camera, pa.y); }
    else px(pa.x-camera, pa.y, 3,3, pa.c);
  }

  drawHUD();
}

/* Verlauf-Himmel pro Welt */
function drawSky(W){
  const g = cx.createLinearGradient(0,0,0,VH);
  g.addColorStop(0, W.skyTop); g.addColorStop(1, W.skyBot);
  cx.fillStyle=g; cx.fillRect(0,0,VW,VH);
}

function drawBackground(W){
  // glühende Sonnen-/Mondscheibe mit Halo (leichtes Pulsieren)
  const sunX = VW*0.7 - (camera*0.05)%VW, sunY = VH*0.34;
  const pulse = 1 + Math.sin(time*1.5)*0.06;
  glow(sunX, sunY, 26*pulse, W.accent);
  glow(sunX, sunY, 15*pulse, W.accent);
  cx.save(); cx.globalAlpha=0.85; cx.fillStyle=W.accent;
  cx.beginPath(); cx.arc(sunX, sunY, 11, 0, 6.2832); cx.fill(); cx.restore();

  // ferne, zerklüftete Ruinen-/Bergsilhouette (langsamer Parallax)
  const off = (camera*0.25)%48;
  cx.fillStyle = W.far;
  for(let i=-1;i<5;i++){ const bx=i*48-off;
    cx.beginPath(); cx.moveTo(bx, VH-30);
    cx.lineTo(bx+8, VH-44); cx.lineTo(bx+14, VH-36); cx.lineTo(bx+22, VH-56);
    cx.lineTo(bx+30, VH-40); cx.lineTo(bx+40, VH-50); cx.lineTo(bx+48, VH-32);
    cx.lineTo(bx+48, VH); cx.lineTo(bx, VH); cx.closePath(); cx.fill(); }

  // nähere Skyline aus zerstörten Türmen (Silhouette), schneller Parallax
  const off2 = (camera*0.5)%80;
  cx.fillStyle = W.silh;
  for(let i=-1;i<4;i++){ const dx=i*80-off2+10;
    drawRuin(W, dx, VH-26);
    if(W.deco==='pyramid'){ cx.fillStyle=W.silh;
      cx.beginPath(); cx.moveTo(dx+40,VH-22); cx.lineTo(dx+56,VH-50); cx.lineTo(dx+72,VH-22); cx.closePath(); cx.fill(); }
    else if(W.deco==='moai'){ px(dx+44,VH-50,14,28,W.silh); px(dx+46,VH-52,10,6,W.silh); }
    else if(W.deco==='lantern'){ px(dx+50,VH-58,3,30,W.silh); glow(dx+52,VH-56,5,W.accent); px(dx+48,VH-58,8,8,W.accent); }
    else if(W.deco==='wave'){ cx.fillStyle=W.silh; for(let k=0;k<3;k++) px(dx+40+k*10,VH-24+ (k%2)*2,8,3,W.silh); }
    cx.fillStyle = W.silh;
  }
  // ein paar glühende Fenster in der Skyline
  cx.fillStyle=W.accent; cx.globalAlpha=0.5;
  for(let i=0;i<10;i++){ const fx=((i*53 - camera*0.5)%VW+VW)%VW; px(fx, VH-22+(i%3)*4, 1,1, W.accent); }
  cx.globalAlpha=1;
}

/* zerstörter Turm als Silhouette */
function drawRuin(W, x, baseY){
  cx.fillStyle=W.silh;
  px(x, baseY-18, 10, 20, W.silh);            // Turmkörper
  px(x+2, baseY-24, 6, 8, W.silh);            // oberer Stumpf
  px(x+14, baseY-12, 7, 14, W.silh);          // kleinerer Turm
  px(x+24, baseY-22, 9, 24, W.silh);
  px(x+26, baseY-28, 4, 8, W.silh);
}

function drawTile(t, x, y, W){
  switch(t){
    case T.GROUND:
      px(x,y,TILE,TILE,W.ground); px(x,y,TILE,3,"rgba(255,255,255,.18)");
      px(x,y+TILE-3,TILE,3,W.groundDk);
      px(x+2,y+6,3,3,W.groundDk); px(x+9,y+10,3,3,W.groundDk);
      break;
    case T.HARD:
      px(x,y,TILE,TILE,W.groundDk); px(x+1,y+1,TILE-2,TILE-2,W.ground);
      px(x+3,y+3,2,2,W.groundDk);
      break;
    case T.BRICK:
      px(x,y,TILE,TILE,W.brick); px(x,y,TILE,2,"rgba(255,255,255,.25)");
      px(x,y+7,TILE,2,W.brickDk); px(x+7,y,2,7,W.brickDk); px(x+3,y+9,2,7,W.brickDk);
      break;
    case T.QCOIN: case T.QPOW: {
      const blink = (Math.floor(time*3)%2);
      const base = t===T.QPOW ? (blink?"#ffd23f":"#ff9e2a") : "#e0a82a";
      // Kistenkörper mit umlaufendem 3D-Rahmen
      px(x,y,TILE,TILE,base);
      px(x,y,TILE,2,"rgba(255,255,255,.45)");      // oben hell
      px(x,y,2,TILE,"rgba(255,255,255,.25)");      // links hell
      px(x,y+TILE-2,TILE,2,"#9a6a10");             // unten dunkel
      px(x+TILE-2,y,2,TILE,"#9a6a10");             // rechts dunkel
      px(x+2,y+2,2,2,"#fff8"); px(x+TILE-4,y+TILE-4,2,2,"#7a4f08"); // Nieten-Akzente
      drawQ(x, y, t===T.QPOW?"#5a3a06":"#7a4f08"); // „?" sauber in der Mitte
      break; }
    case T.BLOCK:
      px(x,y,TILE,TILE,"#9a6a10"); px(x+1,y+1,TILE-2,TILE-2,"#caa24a");
      px(x+2,y+2,2,2,"#7a4f08"); px(x+TILE-4,y+2,2,2,"#7a4f08");
      px(x+2,y+TILE-4,2,2,"#7a4f08"); px(x+TILE-4,y+TILE-4,2,2,"#7a4f08");
      break;
    case T.PIPE:
      px(x,y,TILE,TILE,W.pipe); px(x,y,3,TILE,"rgba(255,255,255,.3)");
      px(x+TILE-3,y,3,TILE,W.pipeDk);
      break;
    case T.COIN: drawCoinSprite(x,y+2); break;
    case T.SPIKE:
      cx.fillStyle="#cfd6e0";
      for(let i=0;i<4;i++){ cx.beginPath(); cx.moveTo(x+i*4,y+TILE); cx.lineTo(x+i*4+2,y+8); cx.lineTo(x+i*4+4,y+TILE); cx.closePath(); cx.fill(); }
      break;
    case T.GOAL: {
      // glühendes „Höllentor" statt Zielfahne
      const ac = WORLDS[game.world].accent;
      glow(x+8, y-2, 12, ac); glow(x+8, y-2, 7, ac);
      cx.save(); cx.globalAlpha=0.85; cx.fillStyle=ac;
      cx.beginPath(); cx.ellipse(x+8, y-2, 7, TILE, 0, 0, 6.2832); cx.fill(); cx.restore();
      px(x+6, y-TILE, 5, TILE*2-2, "rgba(255,255,255,.5)");   // heller Kern
      px(x+1,y-TILE-3,3,TILE*2+3,"#1a1015"); px(x+12,y-TILE-3,3,TILE*2+3,"#1a1015"); // Torpfosten
      break; }
  }
}

function drawCoinSprite(x,y){
  glow(x+5, y+6, 6, "#ffcf3f");
  const f = Math.floor(coinAnim);
  const w = [10,7,3,7][f];
  const ox = (10-w)/2;
  px(x+1+ox, y, w, 12, "#ffd23f");
  px(x+1+ox, y, w, 3, "#fff6c0");
  px(x+1+ox+Math.floor(w/2)-1, y+2, 2, 8, "#c98a10");
}

function drawBall(x,y){
  glow(x+3, y+3, 6, "#ff8a3a");
  cx.fillStyle="#ff5e3a"; cx.beginPath(); cx.arc(x+3,y+3,3.5,0,6.3); cx.fill();
  px(x+1,y+1,2,2,"#fff0b0");
}

/* Pixel-„?" (5×7 Raster, 2px-Zellen) — sitzt mittig in der Kiste */
const QPAT = ["01110","10001","00010","00100","00100","00000","00100"];
function drawQ(x,y,col){
  for(let r=0;r<QPAT.length;r++){ const row=QPAT[r];
    for(let c=0;c<5;c++){ if(row[c]==='1') px(x+3+c*2, y+1+r*2, 2,2, col); } }
}

/* --- Held „Crazy": CrazyFamily-Typ (Cap, Bart, Hoodie, Jeans, Sneakers) --- */
/* Farben nach den CrazyFamily-Figuren */
const CF = {
  capO:"#e87d2a", capLt:"#f4a85a", capDk:"#bb5e15",   // orange Trucker-Cap
  skin:"#e8b888", hair:"#4a3220", beard:"#3a2616",
  hoodie:"#3c424d", hoodieDk:"#2a2f38", logo:"#f2f2f2",
  jeans:"#3f5f93", jeansDk:"#2c4468",
  shoe:"#dfe3ea", shoeDk:"#4a4f59",
  eye:"#2a2a2a", eyeGlow:"#5fd0ff",                    // Kampfform = leuchtende Augen
};
function drawPlayer(){
  const p=player; const x=Math.round(p.x-camera), y=Math.round(p.y);
  if(p.invuln>0 && Math.floor(time*16)%2) return;     // blinkt bei Unverwundbarkeit
  const facing = p.dir;
  cx.save();
  cx.translate(x+ (facing<0? p.w:0), 0);
  cx.scale(facing<0?-1:1, 1);
  drawHeroSprite(0, y, game.power, p);
  cx.restore();
}

/* Zeichnet den Helden in lokalen Koordinaten (nach rechts blickend).
   pow: 0 klein · 1 groß · 2 Kampfform (leuchtende Augen). */
function drawHeroSprite(x, y, pow, p){
  // FIX: lokale Variable hieß "glow" und überschattete die globale glow()-Funktion
  // -> TypeError beim ersten Frame (Titelbild zeichnet den Helden in Kampfform).
  const big = pow>0, fight = pow===2;
  const eye = fight ? CF.eyeGlow : CF.eye;
  const run = p && p.onGround && Math.abs(p.vx)>0.3 && Math.floor(p.anim)%2;
  if(big){
    // ---- Trucker-Cap ----
    px(x+2,y,8,2,CF.capO); px(x+3,y-1,6,1,CF.capO);
    px(x+4,y,4,2,CF.capLt);                       // helles Frontpanel
    px(x+2,y+2,9,1,CF.capDk);                      // Schirm
    // ---- Kopf ----
    px(x+3,y+3,7,4,CF.skin);
    px(x+3,y+3,1,3,CF.hair); px(x+9,y+4,1,2,CF.hair);
    if(fight){ glow(x+7,y+5,4,CF.eyeGlow); }        // leuchtende Augen (Kampfform)
    px(x+7,y+4,2,2,eye);
    if(fight){ px(x+6,y+4,1,1,"#dffbff"); }         // Augen-Schimmer
    px(x+3,y+6,7,1,CF.beard); px(x+4,y+5,4,1,CF.beard);  // Bart
    // ---- Oberkörper (Hoodie, muskulös) ----
    px(x+1,y+7,10,7,CF.hoodie);
    px(x+1,y+7,10,1,CF.hoodieDk);
    px(x+4,y+8,4,3,CF.logo);                        // heller "CF"-Aufdruck
    px(x+5,y+9,1,1,CF.hoodie);
    px(x,y+8,2,5,CF.hoodie); px(x+10,y+8,2,5,CF.hoodie);   // Arme
    px(x,y+12,2,2,CF.skin); px(x+10,y+12,2,2,CF.skin);     // Hände
    if(fight){ px(x-1,y+11,2,2,"#bff0ff44"); }
    // ---- Jeans + Sneaker (Füße reichen bis zur Kollisionsbox, h=28) ----
    if(run){
      px(x+2,y+14,3,11,CF.jeans); px(x+7,y+14,3,11,CF.jeans);
      px(x+1,y+25,4,2,CF.shoe);   px(x+8,y+24,4,2,CF.shoe);
      px(x+1,y+26,4,1,CF.shoeDk); px(x+8,y+25,4,1,CF.shoeDk);
    } else {
      px(x+2,y+14,3,11,CF.jeans); px(x+7,y+14,3,11,CF.jeans);
      px(x+5,y+14,2,11,CF.jeansDk);
      px(x+1,y+25,4,2,CF.shoe);   px(x+7,y+25,4,2,CF.shoe);
      px(x+1,y+26,4,1,CF.shoeDk); px(x+7,y+26,4,1,CF.shoeDk);
    }
  } else {
    // ---- kleine Version (14px) ----
    px(x+2,y,8,2,CF.capO); px(x+4,y,4,2,CF.capLt); px(x+2,y+2,9,1,CF.capDk);
    px(x+3,y+3,7,3,CF.skin); px(x+3,y+3,1,2,CF.hair);
    px(x+7,y+3,2,2,eye); if(fight) px(x+6,y+3,1,1,"#bff0ff");
    px(x+4,y+5,5,1,CF.beard);
    px(x+1,y+6,10,5,CF.hoodie); px(x+1,y+6,10,1,CF.hoodieDk);
    px(x+4,y+7,4,2,CF.logo);
    px(x,y+7,1,3,CF.hoodie); px(x+11,y+7,1,3,CF.hoodie);
    px(x,y+10,1,1,CF.skin);  px(x+11,y+10,1,1,CF.skin);
    if(run){
      px(x+2,y+11,3,2,CF.jeans); px(x+7,y+11,3,2,CF.jeans);
      px(x+1,y+13,4,1,CF.shoe);  px(x+8,y+13,4,1,CF.shoe);
    } else {
      px(x+3,y+11,2,2,CF.jeans); px(x+7,y+11,2,2,CF.jeans);
      px(x+2,y+13,4,1,CF.shoe);  px(x+7,y+13,4,1,CF.shoe);
    }
  }
}

function drawEnemy(e, W){
  if(!e.alive) return;
  const x=Math.round(e.x-camera), y=Math.round(e.y);
  if(x<-20||x>VW+20) return;
  if(e.type==='boss'){ drawBoss(e,x,y); return; }
  if(e.type==='bossball'){ px(x,y,8,8,"#ff3a3a"); px(x+2,y+2,3,3,"#ffd0d0"); return; }
  if(e.hurt>0 && Math.floor(time*16)%2) {/*blink*/}
  if(e.type==='flyer'){
    // fliegender Gegner („Fledermaus-Käfer")
    px(x+4,y+2,6,6,"#8e44ad"); px(x+5,y+3,2,2,"#fff");
    const flap = Math.floor(time*10)%2;
    px(x, y+(flap?1:4), 5,3,"#5e2d70"); px(x+9,y+(flap?1:4),5,3,"#5e2d70");
    return;
  }
  if(e.shell){
    px(x+1,y+4,12,9,"#2e9e5a"); px(x+2,y+5,10,2,"#7fe0a0"); px(x+3,y+8,8,2,"#1f6e3b");
    return;
  }
  if(e.type==='hopper'){
    // Hüpf-Gegner („Sprungflummi") — zieht sich beim Springen zusammen
    const air = e.vy<0;
    px(x+2,y+(air?0:2),10,(air?11:9),"#19b3a6");        // Körper
    px(x+3,y+(air?-1:1),2,3,"#19b3a6"); px(x+9,y+(air?-1:1),2,3,"#19b3a6"); // Ohren
    px(x+4,y+4,2,2,"#fff"); px(x+8,y+4,2,2,"#fff");
    px(x+4,y+5,1,1,"#000"); px(x+8,y+5,1,1,"#000");
    px(x+5,y+8,4,1,"#0e7f76");
    if(!air){ px(x+2,y+11,3,2,"#0e7f76"); px(x+9,y+11,3,2,"#0e7f76"); } // Beine am Boden
    return;
  }
  // Lauf-Gegner („Pilz-Wicht")
  px(x+2,y,10,7,"#c0392b"); px(x+2,y,10,3,"#e57368"); // Hut
  px(x+4,y+2,2,2,"#fff"); px(x+8,y+2,2,2,"#fff");
  px(x+3,y+7,8,5,"#f0d8b0"); px(x+4,y+9,2,2,"#222"); px(x+8,y+9,2,2,"#222");
  const step = Math.floor(time*6)%2;
  px(x+3,y+12,3,2,"#7a4a1e"); px(x+9,y+12,3,2,"#7a4a1e");
  if(step){ px(x+3,y+13,3,1,"#000"); } else { px(x+9,y+13,3,1,"#000"); }
}

function drawBoss(b,x,y){
  const blink = b.hurt>0 && Math.floor(time*16)%2;
  const body = blink? "#ffffff" : "#b03060";
  // großer Endgegner („Schädelkönig") mit bedrohlichem Glühen
  glow(x+12, y+11, 20, "#ff2a5a"); glow(x+12, y+11, 12, "#ff2a5a");
  px(x,y,24,22,body); px(x+2,y+2,20,18,"#7a2044");
  glow(x+7,y+8,3,"#ff2a2a"); glow(x+17,y+8,3,"#ff2a2a");   // glühende Augenhöhlen
  px(x+5,y+6,4,4,"#fff"); px(x+15,y+6,4,4,"#fff");
  px(x+6,y+7,2,2,"#ff2a2a"); px(x+16,y+7,2,2,"#ff2a2a");
  px(x+8,y+14,8,3,"#fff");      // Zähne
  px(x+9,y+14,1,3,"#000"); px(x+12,y+14,1,3,"#000"); px(x+15,y+14,1,3,"#000");
  // Hörner
  px(x-2,y-2,4,6,"#caa24a"); px(x+22,y-2,4,6,"#caa24a");
  // HP-Balken
  px(x, y-7, 24, 4, "#000");
  px(x+1, y-6, Math.max(0,Math.round((b.hp/(b.maxHp||6))*22)), 2, "#37d35a");
}

function drawItem(it){
  const x=Math.round(it.x-camera), y=Math.round(it.y);
  // zeigt, was dieses Power-up dir JETZT bringt: klein -> Pilz (groß), sonst -> Blume (Superball)
  if(game.power===0){
    glow(x+7, y+6, 8, "#ff5e3a");
    px(x+1,y,12,7,"#e0533a"); px(x+3,y+1,3,3,"#fff"); px(x+8,y+1,3,3,"#fff");
    px(x+2,y+7,10,6,"#f0d8b0");
  } else {
    glow(x+7, y+6, 8, "#ff7ac0");
    px(x+2,y,10,10,"#ff7ac0"); px(x+5,y+3,4,4,"#fff");
    px(x+5,y+9,4,4,"#39b54a");
  }
}

/* --- HUD ---------------------------------------------------------------- */
function drawHUD(){
  const ac = WORLDS[game.world] ? WORLDS[game.world].accent : "#ff7a2b";
  cx.fillStyle="rgba(6,4,10,.72)"; cx.fillRect(0,0,VW,12);
  px(0,12,VW,1, ac);                                   // glühende Akzentlinie
  cx.globalAlpha=0.4; px(0,13,VW,1, ac); cx.globalAlpha=1;
  cx.font="8px monospace"; cx.textBaseline="top"; cx.textAlign="left";
  // Leben (kleiner Cap-Kopf als Icon)
  px(2,3,6,2,ac); px(2,5,6,3,"#e8b888");
  cx.fillStyle="#fff"; cx.fillText("x"+game.lives, 9, 2);
  drawCoinSprite(34,1);
  cx.fillStyle="#ffd23f"; cx.fillText("x"+String(game.coins).padStart(2,'0'), 46, 2);
  cx.fillStyle=ac; cx.fillText((WORLDS[game.world]?WORLDS[game.world].name:"")+" "+(game.world+1)+"-"+(game.stage+1), 72, 2);
  cx.fillStyle="#fff"; cx.fillText(String(game.score).padStart(6,'0'), 130, 2);
}

/* --- Overlays / Screens ------------------------------------------------- */
function overlay(title, sub){
  cx.fillStyle="rgba(0,0,0,.65)"; cx.fillRect(0,0,VW,VH);
  ctext(title, VH/2-12, "#ffd36b", 16);
  if(sub) ctext(sub, VH/2+8, "#fff", 8);
}
function ctext(s,y,c,size){
  cx.fillStyle=c; cx.font=`${size||8}px monospace`; cx.textAlign="center"; cx.textBaseline="middle";
  cx.fillText(s, VW/2, y); cx.textAlign="left";
}

function drawTitle(){
  // düsterer Endzeit-Himmel
  const grd = cx.createLinearGradient(0,0,0,VH);
  grd.addColorStop(0,"#160418"); grd.addColorStop(0.55,"#5a0e22"); grd.addColorStop(1,"#e0552a");
  cx.fillStyle=grd; cx.fillRect(0,0,VW,VH);
  // glühende Sonne
  glow(VW*0.5, 92, 34, "#ff7a2b"); glow(VW*0.5, 92, 20, "#ffd23f");
  cx.fillStyle="#ffce5a"; cx.beginPath(); cx.arc(VW*0.5,92,13,0,6.2832); cx.fill();
  // brennende Skyline-Silhouette
  cx.fillStyle="#160410";
  for(let i=0;i<7;i++){ const bx=i*26-6, hh=18+((i*7)%22); px(bx, VH-hh, 12+(i%3)*4, hh, "#160410"); }
  for(let i=0;i<7;i++){ const bx=i*26-6; if(i%2) glow(bx+6, VH-30, 4, "#ff5e3a"); }

  // Logo mit Flacker-Glow
  const flick = 0.8 + Math.sin(time*9)*0.06 + (Math.random()<0.06?0.15:0);
  cx.save(); cx.globalAlpha=flick*0.6;
  ctext("CRAZYFAMILY", 32, "#ff3a4a", 17); ctext("CRAZYFAMILY", 32, "#ff3a4a", 17);
  cx.restore();
  ctext("CRAZYFAMILY", 31, "#ffe24a", 16);
  ctext("L · A · N · D", 50, "#ff6b9c", 11);

  // Held in Kampfform (leuchtende Augen)
  drawHeroSprite(VW/2-6, 62, 2, {onGround:true, vx:0, anim:0});
  ctext("» WIR SIND CRAZY «", 88, "#ffce5a", 7);

  game.hasSave = !!loadSave();
  const sel = game.titleSel;
  const ac = "#ff7a2b";
  const drawOpt=(label,yy,active,dim)=>{
    if(active){ cx.save(); cx.globalAlpha=0.5; px(VW/2-46, yy-5, 92, 11, ac); cx.restore(); }
    ctext(label, yy, dim?"#7a6a66":(active?"#fff":"#caa"), 8);
  };
  if(game.hasSave) drawOpt((sel===0?"▶ ":"")+"FORTSETZEN", 106, sel===0, false);
  else ctext("— kein Spielstand —", 106, "#6a5a56", 8);
  drawOpt((sel===1||!game.hasSave?"▶ ":"")+"NEUES SPIEL", 120, sel===1||!game.hasSave, false);
  ctext("A/Enter = Start  ·  B = Auswahl", 134, "#caa48f", 7);
}
function drawTitleHero(x,y){
  drawHeroSprite(x, y, 2, {onGround:true, vx:0, anim:0});
}

function drawTransition(){
  const grd = cx.createLinearGradient(0,0,0,VH);
  grd.addColorStop(0,"#0a0410"); grd.addColorStop(1,"#2a0a18");
  cx.fillStyle=grd; cx.fillRect(0,0,VW,VH);
  const ac = WORLDS[Math.min(3,game.world)].accent;
  glow(VW/2, VH/2+12, 26, ac);
  const nm = WORLDS[Math.min(3,game.world)].name;
  ctext(nm.toUpperCase(), VH/2-18, ac, 11);
  ctext(game.transMsg, VH/2-2, "#fff", 16);
  drawHeroSprite(VW/2-6, VH/2+8, 2, {onGround:true, vx:0, anim:0});
  ctext("CRAZY x"+game.lives, VH/2+34, "#fff", 8);
}
function drawGameOver(){
  const grd = cx.createLinearGradient(0,0,0,VH);
  grd.addColorStop(0,"#1a0206"); grd.addColorStop(1,"#3a0810");
  cx.fillStyle=grd; cx.fillRect(0,0,VW,VH);
  glow(VW/2, VH/2-6, 30, "#ff2a2a");
  ctext("GAME OVER", VH/2-10, "#ff3a3a", 16);
  ctext("Punkte: "+game.score, VH/2+10, "#fff", 8);
  ctext("Enter = Titelbildschirm", VH/2+26, "#caa", 7);
}
function drawWin(){
  const grd = cx.createLinearGradient(0,0,0,VH);
  grd.addColorStop(0,"#2a1b40"); grd.addColorStop(1,"#7a2d4f");
  cx.fillStyle=grd; cx.fillRect(0,0,VW,VH);
  for(let i=0;i<30;i++){ const sx=(i*41+Math.floor(time*12))%160, sy=(i*29)%144;
    px(sx,sy,2,2,["#ffd23f","#ff6b9c","#37d35a","#fff"][i%4]); }
  ctext("GESCHAFFT!", 50, "#ffd23f", 16);
  ctext("Du hast CrazyFamily Land", 74, "#fff", 8);
  ctext("durchgespielt!", 86, "#fff", 8);
  ctext("Punkte: "+game.score, 104, "#ffd36b", 8);
  ctext("Enter = Titelbildschirm", 124, "#9aa", 7);
}

/* ====================================================================== */
/* SHOOTER-MODUS (Auto-Scroll): U-Boot-Tauchlevel & Flieger-Level         */
/* ====================================================================== */
function shooterHurt(){
  if(player.invuln>0 || player.dead) return;
  if(game.power>0){ game.power--; player.invuln=100; game.flash=20; SFX.hit(); }
  else playerDie();
}
function explode(x,y,col){
  for(let i=0;i<8;i++) particles.push({x,y,vx:(Math.random()-0.5)*4,vy:(Math.random()-0.5)*4,life:24,c:col||(['#ffd23f','#ff6b35','#fff'][i%3])});
}

function updateShooter(dt){
  const p = player;
  if(p.dead){ p.vy += 0.3; p.y += p.vy; p.winT += dt; if(p.winT>1.4) onLifeLost(); return; }
  if(p.win){ p.winT += dt; if(p.winT>1.6) onLevelComplete(); return; }
  if(p.invuln>0) p.invuln--;

  // --- freie 2D-Bewegung ---
  const sp = 2.0;
  const mx = (keys.right?1:0) - (keys.left?1:0);
  const my = ((keys.down||keys.run)?1:0) - (keys.jump?1:0);
  p.x += mx*sp; p.y += my*sp;
  p.x = Math.max(6, Math.min(VW*0.66, p.x));
  p.y = Math.max(13, Math.min(VH-15, p.y));

  // --- Dauerfeuer nach vorne ---
  if(p.shootCd>0) p.shootCd--;
  if(p.shootCd<=0){ balls.push({x:p.x+p.w, y:p.y+p.h/2-2, vx:4.2, vy:0, w:7, h:4, life:70, ply:true}); p.shootCd=11; SFX.shoot(); }

  // --- Scrollen + Gegner einblenden ---
  level.scrollDist += level.scrollSpeed;
  while(level.spawnIdx < level.spawns.length && level.spawns[level.spawnIdx].at <= level.scrollDist){
    spawnShooterEntity(level.spawns[level.spawnIdx]); level.spawnIdx++;
  }
  // --- Boss erscheint am Ende der Strecke ---
  if(!level.bossSpawned && level.scrollDist >= level.scrollLen && enemies.every(e=>e.type!=='sboss')){
    level.bossSpawned = true;
    enemies.push({type:'sboss', x:VW+12, y:VH/2-16, w:28, h:32, hp:10, maxHp:10, alive:true, t:0, vx:0, vy:0, hurt:0, entering:true, shootT:0});
    SFX.boss();
  }

  updateShooterEntities(dt);
  // Spielerschüsse
  for(const b of balls){
    b.x += b.vx; b.life--;
    for(const e of enemies){
      if(!e.alive) continue;
      if(e.type==='scoin' || e.type==='ofball') continue;
      if(aabb(b,e)){
        b.life = 0;
        if(e.type==='sboss'){
          if(!e.entering && e.hurt<=0){ e.hp--; e.hurt=18; SFX.hit(); if(e.hp<=0) defeatShooterBoss(e); }
        } else {
          e.hp--; SFX.stomp();
          if(e.hp<=0){ e.alive=false; game.score+=100; explode(e.x+e.w/2,e.y+e.h/2); }
        }
        break;
      }
    }
  }
  balls = balls.filter(b=>b.life>0 && b.x<VW+24);
  updateParticles(dt);
}

function spawnShooterEntity(s){
  const spd = level.scrollSpeed;
  if(s.type==='coin'){
    enemies.push({type:'scoin', x:VW+10, y:s.y, w:11, h:12, vx:-(spd+0.2), alive:true});
  } else if(s.type==='mine'){
    enemies.push({type:'smine', x:VW+10, y:s.y, w:13, h:13, vx:-(spd+0.25), alive:true, hp:2, t:0});
  } else if(s.type==='shooter'){
    enemies.push({type:'sfoe', shoots:true, x:VW+10, y:s.y, baseY:s.y, w:14, h:11, vx:-(spd+0.5), alive:true, hp:1, t:Math.random()*6, shootT:0});
  } else {
    enemies.push({type:'sfoe', x:VW+10, y:s.y, baseY:s.y, w:14, h:11, vx:-(spd+0.9), alive:true, hp:1, t:Math.random()*6});
  }
}

function updateShooterEntities(dt){
  for(const e of enemies){
    if(!e.alive) continue;
    e.t += dt;
    if(e.type==='sboss'){ updateShooterBoss(e,dt); continue; }
    if(e.type==='ofball'){
      e.x += e.vx; e.y += e.vy;
      if(e.x < -12 || e.y < -12 || e.y > VH+12) e.alive=false;
      else if(player.invuln<=0 && !player.dead && aabb(e,player)){ e.alive=false; shooterHurt(); }
      continue;
    }
    e.x += e.vx;
    if(e.type==='sfoe') e.y = e.baseY + Math.sin(e.t*3)*16;
    if(e.shoots){ e.shootT += dt; if(e.shootT>1.3 && e.x<VW-10 && e.x>0){ e.shootT=0;
      enemies.push({type:'ofball', x:e.x, y:e.y+4, vx:-2.6, vy:0, w:6, h:6, alive:true}); } }
    if(e.x < -18){ e.alive=false; continue; }
    if(e.type==='scoin'){
      if(!player.dead && aabb(e,player)){ e.alive=false; game.coins++; game.score+=100; SFX.coin(); checkOneUp(); }
      continue;
    }
    if(player.invuln<=0 && !player.dead && aabb(e,player)) shooterHurt();
  }
  enemies = enemies.filter(e=>e.alive);
}

function updateShooterBoss(b,dt){
  if(b.entering){ b.x -= 1.1; if(b.x <= VW-52){ b.x = VW-52; b.entering=false; } }
  else {
    b.y = (VH/2-16) + Math.sin(b.t*1.1)*38;
    b.shootT += dt;
    if(b.shootT>1.05){ b.shootT=0;
      for(let k=-1;k<=1;k++) enemies.push({type:'ofball', x:b.x, y:b.y+14, vx:-2.7, vy:k*0.85, w:7, h:7, alive:true});
      SFX.boss();
    }
  }
  if(b.hurt>0) b.hurt--;
  if(!b.entering && player.invuln<=0 && !player.dead && aabb(b,player)) shooterHurt();
}

function defeatShooterBoss(b){
  b.alive=false; game.score+=5000; SFX.win();
  for(let i=0;i<24;i++) particles.push({x:b.x+14,y:b.y+16,vx:(Math.random()-0.5)*5,vy:(Math.random()-0.5)*5,life:42,c:['#ffd23f','#ff6b35','#fff'][i%3]});
  player.win=true; player.winT=0;
}

/* ---------- Shooter-Rendering ---------- */
function drawShooter(){
  const dive = level.kind==='dive';
  const grd = cx.createLinearGradient(0,0,0,VH);
  if(dive){ grd.addColorStop(0,"#2b86c5"); grd.addColorStop(1,"#082c4a"); }
  else    { grd.addColorStop(0,"#79c4f2"); grd.addColorStop(1,"#d3edff"); }
  cx.fillStyle=grd; cx.fillRect(0,0,VW,VH);

  // Parallax: Blasen (Tauchen) bzw. Wolken (Flug)
  const sd = level.scrollDist;
  if(dive){
    cx.fillStyle="rgba(255,255,255,.22)";
    for(let i=0;i<18;i++){ let bx=(i*47 - sd*0.7); bx=((bx%(VW+30))+(VW+30))%(VW+30)-15;
      px(bx, (i*31+ (Math.floor(time*8)%20))%VH, 2,2, "rgba(255,255,255,.5)"); }
    // dunkle Felsen am Boden/Decke
    cx.fillStyle="rgba(8,30,50,.6)";
    for(let i=0;i<6;i++){ let bx=(i*60 - sd*0.9); bx=((bx%(VW+60))+(VW+60))%(VW+60)-30;
      cx.beginPath(); cx.moveTo(bx,VH); cx.lineTo(bx+14,VH-12); cx.lineTo(bx+28,VH); cx.fill();
      cx.beginPath(); cx.moveTo(bx+8,0); cx.lineTo(bx+22,12); cx.lineTo(bx+36,0); cx.fill(); }
  } else {
    for(let i=0;i<6;i++){ let bx=(i*64 - sd*0.4); bx=((bx%(VW+50))+(VW+50))%(VW+50)-25;
      const wy=12+(i%3)*26; cx.fillStyle="rgba(255,255,255,.85)";
      cx.fillRect(bx,wy,18,6); cx.fillRect(bx+6,wy-4,12,6); }
  }

  for(const e of enemies) drawShooterEnemy(e, dive);
  for(const b of balls) drawShot(b);
  drawVehicle(dive);
  for(const pa of particles){ if(pa.coin) drawCoinSprite(pa.x,pa.y); else px(pa.x,pa.y,3,3,pa.c); }

  drawHUD();
  // Fortschritts-/Bossanzeige
  const w = Math.round(Math.min(1, level.scrollDist/level.scrollLen)*(VW-24));
  px(12, VH-6, VW-24, 3, "rgba(0,0,0,.4)"); px(12, VH-6, w, 3, "#37d35a");
  if(level.bossSpawned) ctext("★ BOSS ★", VH-12, "#ff5e3a", 7);
}

function drawVehicle(dive){
  const p=player; const x=Math.round(p.x), y=Math.round(p.y);
  if(p.invuln>0 && Math.floor(time*16)%2) return;
  if(dive){
    // gelbes U-Boot mit CrazyFamily-Held im Fenster
    px(x,y+1,18,10,"#ffd23f"); px(x,y+1,18,2,"#fff0a0"); px(x,y+9,18,2,"#c98a10");
    px(x-3,y+4,3,4,"#c98a10");                  // Heck
    px(x+5,y-2,5,3,"#c98a10");                   // Turm
    px(x+11,y+2,5,6,"#bfe9ff");                  // Bullauge
    px(x+12,y+3,2,2,CF.skin); px(x+12,y+3,2,1,CF.capO); // Gesicht + Cap
    px(x+16,y+4,3,4,"#9c7a2e");                  // Bug
  } else {
    // oranger Flieger mit Held im Cockpit
    px(x,y+3,16,6,"#e0533a"); px(x,y+3,16,2,"#ff8a6a"); px(x,y+8,16,1,"#7a2517");
    px(x+15,y+4,4,3,"#caa24a");                  // Nase/Propeller
    px(x+3,y,7,4,"#bfe9ff");                      // Cockpit
    px(x+5,y+1,2,2,CF.skin); px(x+5,y+1,2,1,CF.capO);
    px(x+2,y+9,9,2,"#7a2517");                    // Tragfläche
    px(x-2,y+2,3,5,"#caa24a");                     // Leitwerk
  }
}

function drawShot(b){ px(b.x,b.y,7,3,"#fff2a0"); px(b.x+4,b.y-1,3,5,"#ffd23f"); }

function drawShooterEnemy(e, dive){
  const x=Math.round(e.x), y=Math.round(e.y);
  const blink = e.hurt>0 && Math.floor(time*16)%2;
  if(e.type==='sboss'){ drawShooterBoss(e,x,y,dive,blink); return; }
  if(e.type==='ofball'){ px(x,y, e.w,e.h, dive?"#8fffd6":"#ff5e3a"); px(x+1,y+1,2,2,"#fff"); return; }
  if(e.type==='scoin'){ drawCoinSprite(x,y); return; }
  if(e.type==='smine'){
    px(x+5,y,3,e.h,"#888"); px(x,y+5,e.w,3,"#888");           // Stacheln
    px(x+3,y+3,7,7,"#555"); px(x+5,y+5,3,3,"#c0392b");
    return;
  }
  // Standard-Gegner
  if(dive){ // Fisch
    px(x+3,y+1,8,8,"#3aa15a"); px(x+1,y+3,3,4,"#2e7d46");      // Körper + Schwanz
    px(x+9,y+2,2,2,"#fff"); px(x+10,y+2,1,1,"#000");
    px(x+5,y+9,4,1,"#1f6e3b");
  } else {  // Vogel/Käfer
    px(x+3,y+3,8,5,"#8e44ad"); px(x+10,y+3,2,2,"#fff");
    const flap = Math.floor(time*10)%2;
    px(x,y+(flap?1:4),5,3,"#5e2d70"); px(x+8,y+(flap?1:4),5,3,"#5e2d70");
  }
  if(e.shoots) px(x+5,y-2,2,2,"#ff3a3a");                       // Schütze-Markierung
}

function drawShooterBoss(b,x,y,dive,blink){
  const body = blink? "#ffffff" : (dive? "#1f8f6a" : "#9b59b6");
  const dark = dive? "#0f5e44" : "#6e2d86";
  px(x,y,28,32,body); px(x+2,y+2,24,28,dark);
  px(x+18,y+8,6,6,"#fff"); px(x+20,y+9,3,3,"#000");            // Auge
  px(x+4,y+12,8,3,"#fff"); px(x+5,y+12,1,3,"#000"); px(x+8,y+12,1,3,"#000"); // Zähne/Maul
  if(dive){ px(x-3,y+10,3,5,dark); px(x-3,y+18,3,5,dark); }    // Flossen
  else { const fl=Math.floor(time*8)%2; px(x-5,y+(fl?4:10),6,8,dark); px(x+27,y+(fl?4:10),6,8,dark); } // Flügel
  // HP-Leiste
  px(x, y-7, 28, 4, "#000");
  px(x+1, y-6, Math.max(0,Math.round((b.hp/(b.maxHp||10))*26)), 2, "#37d35a");
}

/* ---------------------------------------------------------------------- */
/* Hauptschleife (feste Zeitschritte)                                     */
/* ---------------------------------------------------------------------- */
let last=performance.now(), acc=0;
const STEP=1/60;
function loop(now){
  let dt=(now-last)/1000; last=now; if(dt>0.1)dt=0.1; acc+=dt;
  while(acc>=STEP){ update(STEP); acc-=STEP; }
  cx.clearRect(0,0,VW,VH);
  draw();
  requestAnimationFrame(loop);
}

// Startzustand
game.titleSel = loadSave()?0:1;
requestAnimationFrame(loop);

// AudioContext bei erster Interaktion aufwecken
['keydown','touchstart','mousedown'].forEach(ev=>
  addEventListener(ev, ()=>{ const a=actx(); if(a&&a.state==='suspended') a.resume(); }, {once:false}));
