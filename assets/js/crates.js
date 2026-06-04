(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Config ───────────────────────────────────────────────
  const MAX_CRATES   = 2;                  // gleichzeitig sichtbar
  const CRATE_LIFE   = 22000;              // ms bis ungeklickte Kiste verschwindet
  // Spawn-Intervall: 30–60 s → ~1–2 Kisten pro Minute, völlig wahllos
  const crateDelay   = () => 30000 + Math.random() * 30000;
  const firstDelay   = () => 8000  + Math.random() * 9000;

  let crateTimer, fruitTimer;
  let paused = localStorage.getItem('cf_paused') === '1';

  const TYPES = [
    { id: 'normal',   label: '!',   weight: 6 },
    { id: 'question', label: '?',   weight: 3 },
    { id: 'tnt',      label: 'TNT', weight: 1 },
  ];

  // Fixed edge positions, safe below the 60px header
  const POSITIONS = [
    { bottom: '110px', left: '14px'  },
    { bottom: '110px', right: '14px' },
    { top: '42%',      left: '8px'   },
    { top: '58%',      right: '8px'  },
    { bottom: '210px', left: '64px'  },
    { top: '32%',      right: '14px' },
    { top: '70%',      left: '10px'  },
  ];

  const QUOTES = [
    'Ich hasse Walle!',
    'Meine Hände sind Wasser.',
    'Fiebertraum!',
    'Hör doch mal auf hier so rumzuzappeln.',
    'Für Gondor!',
    'Team Kevin!',
    'Team Alex!',
    'Ich hasse Wasserlevel.',
  ];

  // Master-Belohnungs-Schwellen (gesammelte Kisten)
  const MILESTONES = [10, 25, 50, 100, 250, 500];

  let score      = parseInt(localStorage.getItem('cf_crates') || '0');
  let fruitScore = parseInt(localStorage.getItem('cf_fruit')  || '0');
  let masterSeen = parseInt(localStorage.getItem('cf_master') || '0');

  // ── Helpers ──────────────────────────────────────────────
  // Stream-Tage = Mo/Mi/Fr → TNT-Kisten spawnen dann häufiger
  function isStreamDay() { const d = new Date().getDay(); return d === 1 || d === 3 || d === 5; }

  function pickType() {
    const streamDay = isStreamDay();
    const weighted = TYPES.map(t => ({ ...t, weight: t.id === 'tnt' && streamDay ? 3 : t.weight }));
    const total = weighted.reduce((s, t) => s + t.weight, 0);
    let r = Math.random() * total;
    for (const t of weighted) { r -= t.weight; if (r <= 0) return t; }
    return TYPES[0];
  }

  // ── Web Audio smash sounds ───────────────────────────────
  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      if (type === 'tnt') {
        // Deep boom + noise
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(18, ctx.currentTime + 0.55);
        g.gain.setValueAtTime(0.7, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.6);

        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++)
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
        const ns = ctx.createBufferSource();
        ns.buffer = buf;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.55, ctx.currentTime);
        ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        ns.connect(ng); ng.connect(ctx.destination); ns.start();

      } else if (type === 'question') {
        // Bright two-tone jingle
        [820, 1240].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g   = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const t0 = ctx.currentTime + i * 0.13;
          g.gain.setValueAtTime(0, t0);
          g.gain.linearRampToValueAtTime(0.28, t0 + 0.04);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.38);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(t0); osc.stop(t0 + 0.38);
        });

      } else if (type === 'fruit') {
        // Kurzer, heller Sammel-Blip
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1550, ctx.currentTime + 0.12);
        g.gain.setValueAtTime(0.25, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.22);

      } else {
        // Wood crack: noise burst
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++)
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.4);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.45, ctx.currentTime);
        src.connect(g); g.connect(ctx.destination); src.start();
      }
    } catch (_) { /* AudioContext not available, silently skip */ }
  }

  // ── Particle burst ───────────────────────────────────────
  function burstAt(cx, cy, type) {
    const palette = {
      normal:   ['#C8740A', '#FF7300', '#B6FF00', '#FF3EA5'],
      question: ['#00F5FF', '#B600FF', '#B6FF00', '#EDEDED'],
      tnt:      ['#FF0033', '#FF7300', '#FFD700', '#FF3EA5'],
      fruit:    ['#FF0033', '#FF7300', '#FFD700', '#B6FF00'],
    }[type] || ['#FF7300'];

    const count = type === 'tnt' ? 22 : (type === 'fruit' ? 14 : 12);
    const dist  = type === 'tnt' ? 140 : 85;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'cf-particle';
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const d = dist + Math.random() * 55;
      p.style.cssText =
        `left:${cx}px;top:${cy}px;` +
        `background:${palette[i % palette.length]};` +
        `--dx:${Math.cos(angle) * d}px;--dy:${Math.sin(angle) * d}px`;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  }

  function burst(el, type) {
    const r = el.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + r.height / 2, type);
  }

  // ── Screen shake (TNT) ───────────────────────────────────
  function shake() {
    document.body.classList.add('cf-shake');
    document.body.addEventListener('animationend', () =>
      document.body.classList.remove('cf-shake'), { once: true });
  }

  // ── Quote bubble ("?" crate) ────────────────────────────
  function showQuote(text) {
    const el = document.createElement('div');
    el.className = 'cf-quote-pop';
    el.textContent = `„${text}"`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('cf-quote-pop--on')));
    setTimeout(() => {
      el.classList.remove('cf-quote-pop--on');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, 2700);
  }

  // ── Crate score counter ──────────────────────────────────
  function updateScore() {
    let el = document.getElementById('cf-score');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cf-score';
      el.className = 'cf-score';
      document.body.appendChild(el);
    }
    el.style.display = paused ? 'none' : '';
    el.textContent = `🪵 ${score}`;
    el.classList.remove('cf-score--bump');
    void el.offsetWidth;
    el.classList.add('cf-score--bump');
  }

  // ── Fruit score counter ──────────────────────────────────
  function updateFruitScore() {
    let el = document.getElementById('cf-fruit-score');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cf-fruit-score';
      el.className = 'cf-fruit-score';
      document.body.appendChild(el);
    }
    el.style.display = paused ? 'none' : '';
    el.textContent = `🍎 ${fruitScore}`;
    el.classList.remove('cf-fruit-score--bump');
    void el.offsetWidth;
    el.classList.add('cf-fruit-score--bump');
  }

  // ── Master badge overlay ─────────────────────────────────
  function showMaster(text) {
    let el = document.querySelector('.cf-master');
    if (!el) {
      el = document.createElement('div');
      el.className = 'cf-master';
      el.innerHTML = '<div class="cf-master__inner"></div>';
      document.body.appendChild(el);
    }
    el.querySelector('.cf-master__inner').textContent = text;
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('on'), 1800);
  }

  function checkMaster() {
    const hit = MILESTONES.filter(m => m <= score && m > masterSeen).pop();
    if (hit) {
      masterSeen = hit;
      localStorage.setItem('cf_master', hit);
      showMaster('MASTER · ' + hit);
    }
  }

  // ── Confetti rain (Konami) ───────────────────────────────
  function confettiRain() {
    if (reduce) return;
    const colors = ['#FF7300', '#FF3EA5', '#00F5FF', '#B600FF', '#B6FF00', '#FFD700'];
    for (let i = 0; i < 90; i++) {
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

  // ── Crash runner (every 5th crate) ──────────────────────
  function triggerRunner() {
    if (document.querySelector('.cf-runner')) return;
    const runner = document.createElement('div');
    runner.className = 'cf-runner';
    runner.innerHTML = '<span class="cf-leg cf-leg--l"></span><span class="cf-leg cf-leg--r"></span>';
    document.body.appendChild(runner);
    runner.addEventListener('animationend', (e) => {
      if (e.target === runner) runner.remove();
    }, { once: true });
  }

  // ── Smash interaction ────────────────────────────────────
  function smash(el, type) {
    if (el.dataset.gone) return;
    el.dataset.gone = '1';
    el.style.pointerEvents = 'none';
    clearTimeout(el._despawn);

    playSound(type);
    burst(el, type);
    if (type === 'tnt') shake();
    if (type === 'question') showQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    score++;
    localStorage.setItem('cf_crates', score);
    updateScore();
    checkMaster();

    el.classList.add('cf-crate--smash');
    el.addEventListener('animationend', () => el.remove(), { once: true });

    if (score % 5 === 0) setTimeout(triggerRunner, 750);
  }

  // ── Create a single crate ────────────────────────────────
  function makeCrate(pos, forceType, posIdx) {
    const t  = forceType ? (TYPES.find(x => x.id === forceType) || TYPES[0]) : pickType();
    const el = document.createElement('div');
    el.className = `cf-crate cf-crate--${t.id}`;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Versteckte Kiste – draufklicken!');
    if (posIdx != null) el.dataset.posIdx = posIdx;

    const lbl = document.createElement('span');
    lbl.className = 'cf-crate__lbl';
    lbl.textContent = t.label;
    el.appendChild(lbl);

    Object.assign(el.style, { position: 'fixed', ...pos });

    el.addEventListener('click', () => smash(el, t.id));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); smash(el, t.id); }
    });

    document.body.appendChild(el);

    // Ungeklickte Kisten verschwinden nach kurzer Zeit wieder leise
    el._despawn = setTimeout(() => despawnCrate(el), CRATE_LIFE);
    return el;
  }

  // Sanft ausblenden (nicht geklickt)
  function despawnCrate(el) {
    if (el.dataset.gone) return;
    el.dataset.gone = '1';
    el.style.pointerEvents = 'none';
    if (reduce) { el.remove(); return; }
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    el.style.opacity = '0';
    el.style.transform = 'scale(.6)';
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }

  // Eine zufällige Spruch-Kiste an freier Position spawnen
  function spawnCrate() {
    if (paused) return;
    const live = [...document.querySelectorAll('.cf-crate')].filter(c => !c.dataset.gone);
    if (live.length >= MAX_CRATES) return;

    const used = new Set(live.map(c => c.dataset.posIdx));
    const free = POSITIONS.map((p, i) => ({ p, i })).filter(o => !used.has(String(o.i)));
    if (!free.length) return;

    const pick = free[Math.floor(Math.random() * free.length)];
    makeCrate(pick.p, 'question', pick.i); // nur Spruch-Kisten
  }

  function scheduleCrate(delay) {
    clearTimeout(crateTimer);
    crateTimer = setTimeout(() => {
      spawnCrate();
      scheduleCrate(crateDelay());
    }, delay);
  }

  // ── Collectible falling fruit ────────────────────────────
  function spawnFruit() {
    if (paused || reduce) return;
    if (document.querySelectorAll('.cf-fruit').length >= 2) return;

    const f = document.createElement('div');
    f.className = 'cf-fruit';
    f.textContent = '🍎';
    f.setAttribute('role', 'button');
    f.setAttribute('tabindex', '0');
    f.setAttribute('aria-label', 'Frucht fangen!');
    f.style.left = (6 + Math.random() * 84) + 'vw';
    f.style.animationDuration = (6 + Math.random() * 4) + 's';

    const grab = () => catchFruit(f);
    f.addEventListener('click', grab);
    f.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); grab(); }
    });
    // Vom Boden verpasst → still entfernen
    f.addEventListener('animationend', () => { if (!f.dataset.caught) f.remove(); }, { once: true });

    document.body.appendChild(f);
  }

  function catchFruit(f) {
    if (f.dataset.caught) return;
    f.dataset.caught = '1';

    // Frucht an aktueller Position einfrieren, dann zerplatzen
    const r = f.getBoundingClientRect();
    f.style.animation = 'none';
    f.style.top = r.top + 'px';
    f.style.left = r.left + 'px';
    f.style.transform = 'none';
    void f.offsetWidth;
    f.classList.add('cf-fruit--pop');

    burstAt(r.left + r.width / 2, r.top + r.height / 2, 'fruit');
    playSound('fruit');

    fruitScore++;
    localStorage.setItem('cf_fruit', fruitScore);
    updateFruitScore();

    f.addEventListener('animationend', () => f.remove(), { once: true });
  }

  function fruitLoop() {
    spawnFruit();
    fruitTimer = setTimeout(fruitLoop, 11000 + Math.random() * 9000);
  }

  // ── Idle wiggle (30s ohne Aktivität) ─────────────────────
  let idleTimer;
  function wiggleCrate() {
    const crates = [...document.querySelectorAll('.cf-crate')].filter(c => !c.dataset.gone);
    if (crates.length) {
      const c = crates[Math.floor(Math.random() * crates.length)];
      c.classList.remove('cf-crate--attention');
      void c.offsetWidth;
      c.classList.add('cf-crate--attention');
      c.addEventListener('animationend',
        () => c.classList.remove('cf-crate--attention'), { once: true });
    }
    resetIdle();
  }
  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(wiggleCrate, 30000);
  }

  // ── Konami: tippe "crazyfamily" ─────────────────────────
  let buf = '';
  function onKey(e) {
    if (e.key && e.key.length === 1) {
      buf = (buf + e.key.toLowerCase()).slice(-16);
      if (buf.endsWith('crazyfamily')) { buf = ''; party(); }
    }
  }
  function party() {
    POSITIONS.forEach((p, i) => makeCrate(p, null, i));   // alle Kisten gleichzeitig, bunt gemischt
    confettiRain();
    showMaster('CRAZY!');
    playSound('question');
  }

  // ── Steuerung: Pause + Punkte löschen ────────────────────
  function buildControls() {
    if (document.querySelector('.cf-controls')) return;
    const wrap = document.createElement('div');
    wrap.className = 'cf-controls';

    const pauseBtn = document.createElement('button');
    pauseBtn.type = 'button';
    pauseBtn.className = 'cf-ctrl cf-ctrl--pause';
    pauseBtn.addEventListener('click', togglePause);

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'cf-ctrl cf-ctrl--reset';
    resetBtn.textContent = '🗑';
    resetBtn.title = 'Punktestand löschen';
    resetBtn.setAttribute('aria-label', 'Punktestand zurücksetzen');
    resetBtn.addEventListener('click', resetScore);

    wrap.appendChild(pauseBtn);
    wrap.appendChild(resetBtn);
    document.body.appendChild(wrap);
    syncPauseBtn();
  }

  function syncPauseBtn() {
    const wrap = document.querySelector('.cf-controls');
    const b = document.querySelector('.cf-ctrl--pause');
    if (!b) return;
    b.textContent = paused ? '▶' : '⏸';
    b.title = paused ? 'Spiel fortsetzen' : 'Spiel pausieren';
    b.setAttribute('aria-label', paused ? 'Easter-Egg-Spiel fortsetzen' : 'Easter-Egg-Spiel pausieren');
    if (wrap) wrap.classList.toggle('cf-controls--paused', paused);

    // Counter bei Pause ausblenden (Steuer-Panel bleibt sichtbar)
    ['cf-score', 'cf-fruit-score'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = paused ? 'none' : '';
    });
  }

  function stopGame() {
    clearTimeout(crateTimer);
    clearTimeout(fruitTimer);
    clearTimeout(idleTimer);
    document.querySelectorAll('.cf-crate, .cf-fruit').forEach(el => el.remove());
  }

  function startGame() {
    scheduleCrate(firstDelay());
    if (!reduce) {
      fruitTimer = setTimeout(fruitLoop, 5000 + Math.random() * 4000);
      resetIdle();
    }
  }

  function togglePause() {
    paused = !paused;
    localStorage.setItem('cf_paused', paused ? '1' : '0');
    syncPauseBtn();
    paused ? stopGame() : startGame();
  }

  function resetScore() {
    score = fruitScore = masterSeen = 0;
    localStorage.setItem('cf_crates', '0');
    localStorage.setItem('cf_fruit',  '0');
    localStorage.setItem('cf_master', '0');
    updateScore();
    updateFruitScore();
  }

  // ── Boot ─────────────────────────────────────────────────
  function init() {
    buildControls();
    if (score > 0) updateScore();
    if (fruitScore > 0) updateFruitScore();

    window.addEventListener('keydown', onKey);

    if (!reduce) {
      ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(ev =>
        window.addEventListener(ev, resetIdle, { passive: true }));
    }

    if (!paused) startGame();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
