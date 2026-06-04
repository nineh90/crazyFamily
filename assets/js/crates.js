(function () {
  'use strict';

  // ── Config ───────────────────────────────────────────────
  const CRATE_COUNT = () => 2 + Math.floor(Math.random() * 2); // 2 or 3 per page

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

  let score = parseInt(localStorage.getItem('cf_crates') || '0');

  // ── Helpers ──────────────────────────────────────────────
  function pickType() {
    const total = TYPES.reduce((s, t) => s + t.weight, 0);
    let r = Math.random() * total;
    for (const t of TYPES) { r -= t.weight; if (r <= 0) return t; }
    return TYPES[0];
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
  function burst(el, type) {
    const r  = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;

    const palette = {
      normal:   ['#C8740A', '#FF7300', '#B6FF00', '#FF3EA5'],
      question: ['#00F5FF', '#B600FF', '#B6FF00', '#EDEDED'],
      tnt:      ['#FF0033', '#FF7300', '#FFD700', '#FF3EA5'],
    }[type];

    const count = type === 'tnt' ? 22 : 12;
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

  // ── Wumpa score counter ──────────────────────────────────
  function updateScore() {
    let el = document.getElementById('cf-score');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cf-score';
      el.className = 'cf-score';
      document.body.appendChild(el);
    }
    el.textContent = `🪵 ${score}`;
    el.classList.remove('cf-score--bump');
    void el.offsetWidth;
    el.classList.add('cf-score--bump');
  }

  // ── Crash runner (every 5th crate) ──────────────────────
  function triggerRunner() {
    if (document.querySelector('.cf-runner')) return;
    const runner = document.createElement('div');
    runner.className = 'cf-runner';
    // legs via two inner spans (animated running)
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

    playSound(type);
    burst(el, type);
    if (type === 'tnt') shake();
    if (type === 'question') showQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    score++;
    localStorage.setItem('cf_crates', score);
    updateScore();

    el.classList.add('cf-crate--smash');
    el.addEventListener('animationend', () => el.remove(), { once: true });

    if (score % 5 === 0) setTimeout(triggerRunner, 750);
  }

  // ── Create a single crate ────────────────────────────────
  function makeCrate(pos) {
    const t  = pickType();
    const el = document.createElement('div');
    el.className = `cf-crate cf-crate--${t.id}`;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Versteckte Kiste – draufklicken!');

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
  }

  // ── Boot ─────────────────────────────────────────────────
  function init() {
    if (score > 0) updateScore();
    shuffle([...POSITIONS]).slice(0, CRATE_COUNT()).forEach(makeCrate);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
