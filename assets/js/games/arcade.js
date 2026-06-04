/*
 * CFArcade – geteilte Basis für die CrazyFamily Mini-Games.
 *
 * Stellt window.CFArcade bereit: Web-Audio-Sounds, Partikel-Bursts, Konfetti,
 * eine Spiel-Registry + Loader, einen requestAnimationFrame-Loop-Helper sowie
 * die Highscore-Anbindung (lokal via localStorage + global via PHP-API).
 *
 * Bewusste, kleine Duplikation der Sound-/Partikel-Technik aus assets/js/crates.js,
 * damit das stabile Easter-Egg-Modul nicht umgebaut werden muss.
 */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const API = '/assets/api/highscores.php';

  // True, wenn der Fokus in einem Eingabefeld liegt – dann Tasten NICHT abfangen,
  // damit z. B. der Spitzname (auch mit w/a/s/d) eingetippt werden kann.
  function isTyping(target) {
    if (!target) return false;
    const tag = target.tagName;
    return target.isContentEditable ||
      tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  // ── Web Audio (kein Copyright, alles selbst erzeugt) ─────────
  let actx = null;
  function ctx() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (_) { actx = null; }
    }
    // Manche Browser starten den Context suspended bis zur User-Geste
    if (actx && actx.state === 'suspended') { try { actx.resume(); } catch (_) {} }
    return actx;
  }

  function tone(freq, dur, type, gain, slideTo) {
    const c = ctx(); if (!c) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, c.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
    g.gain.setValueAtTime(gain || 0.25, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(); osc.stop(c.currentTime + dur);
  }

  function noise(dur, gain, pow) {
    const c = ctx(); if (!c) return;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, pow || 1.4);
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(gain || 0.45, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    src.connect(g); g.connect(c.destination); src.start();
  }

  function sound(type) {
    try {
      switch (type) {
        case 'pickup':                                  // Frucht/Apfel gefangen
          tone(900, 0.18, 'sine', 0.25, 1550); break;
        case 'point':                                   // Snake frisst
          tone(660, 0.12, 'square', 0.18, 1000); break;
        case 'crack':                                   // Kiste smash
          noise(0.16, 0.4, 1.4); break;
        case 'boom':                                    // TNT / Fehler
          tone(90, 0.55, 'sine', 0.6, 18); noise(0.35, 0.5, 2); break;
        case 'jingle':                                  // Treffer / Memory-Paar
          tone(820, 0.32, 'sine', 0.26); setTimeout(() => tone(1240, 0.3, 'sine', 0.24), 120); break;
        case 'win':                                     // Sieg
          [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.3, 'sine', 0.25), i * 110)); break;
        case 'lose':                                    // Game Over
          [440, 330, 220].forEach((f, i) => setTimeout(() => tone(f, 0.32, 'sawtooth', 0.2), i * 130)); break;
        case 'flip':                                    // Memory-Karte umdrehen
          tone(520, 0.08, 'triangle', 0.15, 700); break;
        default:
          tone(700, 0.12, 'sine', 0.2);
      }
    } catch (_) { /* still */ }
  }

  // ── Partikel-Burst (an Viewport-Koordinaten) ─────────────────
  function burst(cx, cy, palette) {
    if (reduce) return;
    const colors = palette || ['#FF7300', '#FF3EA5', '#00F5FF', '#B6FF00'];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'cf-particle';
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 70 + Math.random() * 55;
      p.style.cssText =
        `left:${cx}px;top:${cy}px;` +
        `background:${colors[i % colors.length]};` +
        `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px`;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  }

  // ── Konfetti-Regen (Sieg) ────────────────────────────────────
  function confetti() {
    if (reduce) return;
    const colors = ['#FF7300', '#FF3EA5', '#00F5FF', '#B600FF', '#B6FF00', '#FFD700'];
    for (let i = 0; i < 80; i++) {
      const c = document.createElement('div');
      c.className = 'cf-confetti';
      c.style.cssText =
        `left:${Math.random() * 100}vw;` +
        `background:${colors[i % colors.length]};` +
        `animation-duration:${2.4 + Math.random() * 2.2}s;` +
        `animation-delay:${Math.random() * 0.6}s`;
      document.body.appendChild(c);
      c.addEventListener('animationend', () => c.remove(), { once: true });
    }
  }

  // ── Game-Loop-Helper (rAF) ───────────────────────────────────
  // step(dt) wird mit der vergangenen Zeit in ms aufgerufen.
  function loop(step) {
    let raf = 0, last = 0, running = true;
    function frame(t) {
      if (!running) return;
      if (!last) last = t;
      const dt = Math.min(t - last, 100); // Sprünge (Tab-Wechsel) begrenzen
      last = t;
      step(dt);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return {
      stop() { running = false; cancelAnimationFrame(raf); },
      pause() { running = false; cancelAnimationFrame(raf); },
      resume() { if (!running) { running = true; last = 0; raf = requestAnimationFrame(frame); } }
    };
  }

  // ── Highscore: lokal (localStorage) ──────────────────────────
  function getLocalBest(game) {
    return parseInt(localStorage.getItem('cf_hs_' + game) || '0', 10);
  }
  function setLocalBest(game, score) {
    score = Math.floor(score);
    if (score > getLocalBest(game)) {
      localStorage.setItem('cf_hs_' + game, String(score));
      return true; // neuer persönlicher Rekord
    }
    return false;
  }
  function getNick() { return localStorage.getItem('cf_nick') || ''; }
  function setNick(n) { localStorage.setItem('cf_nick', n); }

  // ── Highscore: global (PHP-API) ──────────────────────────────
  async function loadGlobal(game) {
    try {
      const res = await fetch(API + '?game=' + encodeURIComponent(game), { cache: 'no-cache' });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.scores) ? data.scores : [];
    } catch (_) { return []; }
  }
  async function submitGlobal(game, name, score) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, name, score: Math.floor(score) })
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.scores) ? data.scores : [];
    } catch (_) { return []; }
  }

  // ── Spiel-Registry + Loader ──────────────────────────────────
  const games = {};
  let current = null; // { id, instance }

  function register(id, factory) { games[id] = factory; }

  // Startet ein Spiel in mount (Element). Beendet ggf. das laufende Spiel.
  // hooks: { onScore(score), onGameOver(score) } – optional, für HUD/Bestenliste.
  function start(id, mount, hooks) {
    quit();
    const factory = games[id];
    if (!factory) return;
    hooks = hooks || {};
    // factory(api) liefert ein Spielobjekt mit optionalem destroy()/pause()/resume()
    const instance = factory({
      mount,
      reduce, isTyping,
      sound, burst, confetti, loop,
      getLocalBest, setLocalBest,
      getNick, setNick,
      loadGlobal, submitGlobal,
      // Laufenden Punktestand ans HUD melden
      report(score) { if (hooks.onScore) hooks.onScore(Math.floor(score)); },
      // Spielende melden (HUD/Bestenliste); liefert ob neuer lokaler Rekord
      gameOver(score) {
        score = Math.floor(score);
        const record = setLocalBest(id, score);
        if (hooks.onGameOver) hooks.onGameOver(score, record);
        return record;
      },
    });
    current = { id, instance };
    return instance;
  }

  function quit() {
    if (current && current.instance && typeof current.instance.destroy === 'function') {
      try { current.instance.destroy(); } catch (_) {}
    }
    current = null;
  }

  // Laufendes Spiel anhalten/fortsetzen (z. B. solange das Bestenlisten-Panel offen ist)
  function pauseCurrent()  { if (current && current.instance && current.instance.pause)  current.instance.pause(); }
  function resumeCurrent() { if (current && current.instance && current.instance.resume) current.instance.resume(); }

  // Pausieren bei Tab-Wechsel
  document.addEventListener('visibilitychange', () => {
    if (!current || !current.instance) return;
    const inst = current.instance;
    if (document.hidden) { if (inst.pause) inst.pause(); }
    else { if (inst.resume) inst.resume(); }
  });

  window.CFArcade = {
    reduce, isTyping,
    sound, burst, confetti, loop,
    getLocalBest, setLocalBest, getNick, setNick,
    loadGlobal, submitGlobal,
    register, start, quit,
    pause: pauseCurrent, resume: resumeCurrent,
    get current() { return current ? current.id : null; },
  };
})();
