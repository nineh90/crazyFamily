/* 🐍 Snake – Canvas, Pfeile/WASD + Swipe. Eigene Neon-Optik, kein Marken-Asset. */
(function () {
  'use strict';
  if (!window.CFArcade) return;

  CFArcade.register('snake', function (api) {
    const COLS = 17, ROWS = 17;
    const COL_BG = '#0B0E14', COL_GRID = 'rgba(0,245,255,.06)';
    const COL_SNAKE = '#B6FF00', COL_HEAD = '#00F5FF', COL_FOOD = '#FF3EA5';

    // ── DOM ────────────────────────────────────────────────
    const wrap = document.createElement('div');
    wrap.className = 'cf-game cf-game--snake';
    const canvas = document.createElement('canvas');
    canvas.className = 'cf-canvas';
    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('aria-label', 'Snake-Spielfeld');
    const overlay = document.createElement('div');
    overlay.className = 'cf-overlay';
    wrap.appendChild(canvas);
    wrap.appendChild(overlay);
    api.mount.appendChild(wrap);

    const ctx = canvas.getContext('2d');
    let cell = 20;

    function resize() {
      const w = Math.min(wrap.clientWidth || 480, 480);
      cell = Math.floor(w / COLS);
      canvas.width = cell * COLS;
      canvas.height = cell * ROWS;
      draw();
    }

    // ── State ──────────────────────────────────────────────
    let snake, dir, nextDir, food, score, alive, started, acc, speed, ticker;

    function reset() {
      snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      alive = true;
      started = false;
      acc = 0;
      speed = 150; // ms pro Schritt
      placeFood();
      api.report(0);
      showStart();
      draw();
    }

    function placeFood() {
      do {
        food = { x: (Math.random() * COLS) | 0, y: (Math.random() * ROWS) | 0 };
      } while (snake.some(s => s.x === food.x && s.y === food.y));
    }

    function showStart() {
      overlay.className = 'cf-overlay cf-overlay--on';
      overlay.innerHTML =
        '<div class="cf-overlay__box">' +
        '<h3>🐍 Snake</h3>' +
        '<p>Pfeiltasten / WASD – am Handy wischen.</p>' +
        '<button type="button" class="btn cf-overlay__btn">Start</button>' +
        '</div>';
      overlay.querySelector('.cf-overlay__btn').addEventListener('click', begin);
    }

    function showOver() {
      // Aktionen (Nochmal / Zur Auswahl) übernimmt das Ergebnis-Panel der Seite
      const record = api.gameOver(score);
      api.sound('lose');
      overlay.className = 'cf-overlay cf-overlay--on';
      overlay.innerHTML =
        '<div class="cf-overlay__box">' +
        '<h3>Game Over</h3>' +
        '<p>Punkte: <strong>' + score + '</strong>' + (record ? ' – 🏆 Neuer Rekord!' : '') + '</p>' +
        '</div>';
    }

    function begin() {
      overlay.className = 'cf-overlay';
      overlay.innerHTML = '';
      started = true;
      alive = true;
      canvas.focus();
    }

    // ── Tick ───────────────────────────────────────────────
    function tick() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        alive = false;
        showOver();
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        api.report(score);
        api.sound('point');
        const r = canvas.getBoundingClientRect();
        api.burst(r.left + (food.x + 0.5) * cell, r.top + (food.y + 0.5) * cell,
          ['#FF3EA5', '#B6FF00', '#00F5FF']);
        placeFood();
        if (speed > 70) speed -= 4; // wird schneller
      } else {
        snake.pop();
      }
      draw();
    }

    // ── Draw ───────────────────────────────────────────────
    function draw() {
      ctx.fillStyle = COL_BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = COL_GRID;
      ctx.lineWidth = 1;
      for (let i = 1; i < COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
      }
      // Food
      ctx.fillStyle = COL_FOOD;
      ctx.shadowColor = COL_FOOD; ctx.shadowBlur = 12;
      roundRect((food.x + 0.12) * cell, (food.y + 0.12) * cell, cell * 0.76, cell * 0.76, cell * 0.3);
      ctx.fill();
      // Snake
      for (let i = snake.length - 1; i >= 0; i--) {
        const s = snake[i];
        ctx.fillStyle = i === 0 ? COL_HEAD : COL_SNAKE;
        ctx.shadowColor = i === 0 ? COL_HEAD : COL_SNAKE; ctx.shadowBlur = 10;
        roundRect((s.x + 0.06) * cell, (s.y + 0.06) * cell, cell * 0.88, cell * 0.88, cell * 0.28);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    // ── Input ──────────────────────────────────────────────
    function setDir(x, y) {
      // 180°-Wende verhindern
      if (x === -dir.x && y === -dir.y) return;
      nextDir = { x, y };
    }
    function onKey(e) {
      if (api.isTyping(e.target)) return; // Texteingabe (z. B. Namensfeld) nicht blockieren
      const k = e.key.toLowerCase();
      let handled = true;
      if (k === 'arrowup' || k === 'w') setDir(0, -1);
      else if (k === 'arrowdown' || k === 's') setDir(0, 1);
      else if (k === 'arrowleft' || k === 'a') setDir(-1, 0);
      else if (k === 'arrowright' || k === 'd') setDir(1, 0);
      else handled = false;
      if (handled) { e.preventDefault(); if (!started) begin(); }
    }

    let tStart = null;
    function onTouchStart(e) { const t = e.touches[0]; tStart = { x: t.clientX, y: t.clientY }; e.preventDefault(); }
    function onTouchMove(e) { e.preventDefault(); }
    function onTouchEnd(e) {
      if (!tStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - tStart.x, dy = t.clientY - tStart.y;
      tStart = null;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) { if (!started) begin(); return; }
      if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
      else setDir(0, dy > 0 ? 1 : -1);
      if (!started) begin();
    }

    // ── Boot ───────────────────────────────────────────────
    window.addEventListener('keydown', onKey);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    window.addEventListener('resize', resize);

    reset();
    resize();

    ticker = api.loop(function (dt) {
      if (!started || !alive) return;
      acc += dt;
      if (acc >= speed) { acc = 0; tick(); }
    });

    return {
      pause() { ticker.pause(); },
      resume() { ticker.resume(); },
      destroy() {
        ticker.stop();
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', resize);
        wrap.remove();
      }
    };
  });
})();
