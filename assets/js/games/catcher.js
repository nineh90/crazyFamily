/* 🍎 Frucht-Fänger – Korb fängt fallende Früchte, Bomben meiden. Eigene Optik. */
(function () {
  'use strict';
  if (!window.CFArcade) return;

  CFArcade.register('catcher', function (api) {
    const GOOD = ['🍎', '🍌', '🍓', '🍇', '🍊'];
    const BAD = '💣';

    const wrap = document.createElement('div');
    wrap.className = 'cf-game cf-game--catcher';
    const canvas = document.createElement('canvas');
    canvas.className = 'cf-canvas';
    canvas.setAttribute('tabindex', '0');
    canvas.setAttribute('aria-label', 'Frucht-Fänger-Spielfeld');
    const overlay = document.createElement('div');
    overlay.className = 'cf-overlay';
    wrap.appendChild(canvas);
    wrap.appendChild(overlay);
    api.mount.appendChild(wrap);

    const ctx = canvas.getContext('2d');
    let W = 400, H = 460;

    function resize() {
      W = Math.min(wrap.clientWidth || 440, 440);
      H = Math.round(W * 1.12);
      canvas.width = W; canvas.height = H;
      basket.w = Math.max(64, W * 0.18);
      basket.y = H - basket.h - 10;
      if (basket.x + basket.w > W) basket.x = W - basket.w;
      draw();
    }

    const basket = { x: 160, y: 0, w: 80, h: 34 };
    let items, score, lives, started, alive, spawnAcc, spawnEvery, fallBase, ticker;

    function reset() {
      items = [];
      score = 0;
      lives = 3;
      started = false;
      alive = true;
      spawnAcc = 0;
      spawnEvery = 900;   // ms zwischen Spawns
      fallBase = 0.09;    // px/ms
      basket.x = (W - basket.w) / 2;
      api.report(0);
      showStart();
      draw();
    }

    function showStart() {
      overlay.className = 'cf-overlay cf-overlay--on';
      overlay.innerHTML =
        '<div class="cf-overlay__box">' +
        '<h3>🍎 Frucht-Fänger</h3>' +
        '<p>Früchte fangen, 💣 Bomben meiden!<br>← → / Maus / Finger.</p>' +
        '<button type="button" class="btn cf-overlay__btn">Start</button>' +
        '</div>';
      overlay.querySelector('.cf-overlay__btn').addEventListener('click', begin);
    }
    function showOver() {
      // Aktionen (Nochmal / Zur Auswahl) übernimmt das Ergebnis-Panel der Seite
      alive = false;
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
      overlay.className = 'cf-overlay'; overlay.innerHTML = '';
      started = true; alive = true; canvas.focus();
    }

    function spawn() {
      const bad = Math.random() < 0.22;
      items.push({
        x: 20 + Math.random() * (W - 40),
        y: -24,
        vy: fallBase + Math.random() * 0.05,
        bad,
        emoji: bad ? BAD : GOOD[(Math.random() * GOOD.length) | 0],
        r: 16,
      });
    }

    function update(dt) {
      spawnAcc += dt;
      if (spawnAcc >= spawnEvery) {
        spawnAcc = 0; spawn();
        if (spawnEvery > 420) spawnEvery -= 12; // wird dichter
        fallBase += 0.0006;                     // wird schneller
      }
      const bx = basket.x, bw = basket.w, by = basket.y;
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.vy * dt;
        // Fang prüfen (Korb-Oberkante)
        if (it.y + it.r >= by && it.y - it.r <= by + basket.h &&
            it.x >= bx - it.r && it.x <= bx + bw + it.r) {
          items.splice(i, 1);
          const r = canvas.getBoundingClientRect();
          if (it.bad) {
            lives--;
            api.sound('boom');
            api.burst(r.left + it.x, r.top + it.y, ['#FF0033', '#FF7300', '#FFD700']);
            if (lives <= 0) { showOver(); return; }
          } else {
            score += 10;
            api.report(score);
            api.sound('pickup');
            api.burst(r.left + it.x, r.top + it.y, ['#FF3EA5', '#B6FF00', '#00F5FF']);
          }
          continue;
        }
        // Unten raus
        if (it.y - it.r > H) {
          items.splice(i, 1);
          if (!it.bad) { // gute Frucht verpasst → Leben verlieren
            lives--;
            api.sound('lose');
            if (lives <= 0) { showOver(); return; }
          }
        }
      }
      draw();
    }

    function draw() {
      ctx.fillStyle = '#0B0E14';
      ctx.fillRect(0, 0, W, H);
      // Items
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '28px serif';
      items.forEach(it => ctx.fillText(it.emoji, it.x, it.y));
      // Korb (eigene Kisten-Optik)
      const g = ctx.createLinearGradient(0, basket.y, 0, basket.y + basket.h);
      g.addColorStop(0, '#FF9A3C'); g.addColorStop(1, '#B85C00');
      ctx.fillStyle = g;
      ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
      ctx.shadowColor = '#FF7300'; ctx.shadowBlur = 14;
      rr(basket.x, basket.y, basket.w, basket.h, 8);
      ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
      // Herzen (Leben)
      ctx.font = '16px serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('❤️'.repeat(Math.max(0, lives)), 8, 8);
    }
    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    // ── Input ──────────────────────────────────────────────
    function clampBasket() {
      basket.x = Math.max(0, Math.min(W - basket.w, basket.x));
    }
    function moveTo(clientX) {
      const r = canvas.getBoundingClientRect();
      basket.x = (clientX - r.left) * (W / r.width) - basket.w / 2;
      clampBasket();
    }
    let keyLeft = false, keyRight = false;
    function onKey(e) {
      if (api.isTyping(e.target)) return; // Texteingabe (z. B. Namensfeld) nicht blockieren
      const k = e.key.toLowerCase(), down = e.type === 'keydown';
      if (k === 'arrowleft' || k === 'a') { keyLeft = down; e.preventDefault(); if (down && !started) begin(); }
      else if (k === 'arrowright' || k === 'd') { keyRight = down; e.preventDefault(); if (down && !started) begin(); }
    }
    function onMouse(e) { if (!started) begin(); moveTo(e.clientX); }
    function onTouch(e) { e.preventDefault(); if (!started) begin(); moveTo(e.touches[0].clientX); }

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('touchmove', onTouch, { passive: false });
    window.addEventListener('resize', resize);

    reset();
    resize();

    ticker = api.loop(function (dt) {
      if (!started || !alive) return;
      const sp = 0.5 * dt; // Tastatur-Geschwindigkeit
      if (keyLeft) basket.x -= sp;
      if (keyRight) basket.x += sp;
      if (keyLeft || keyRight) clampBasket();
      update(dt);
    });

    return {
      pause() { ticker.pause(); },
      resume() { ticker.resume(); },
      destroy() {
        ticker.stop();
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('keyup', onKey);
        window.removeEventListener('resize', resize);
        wrap.remove();
      }
    };
  });
})();
