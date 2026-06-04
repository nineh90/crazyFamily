/* 📦 Kisten-Smash – Reaktionsspiel: Kisten antippen, TNT meiden. 30 Sekunden. */
(function () {
  'use strict';
  if (!window.CFArcade) return;

  CFArcade.register('smash', function (api) {
    const HOLES = 9;          // 3×3 Raster
    const GAME_TIME = 30000;  // ms

    const wrap = document.createElement('div');
    wrap.className = 'cf-game cf-game--smash';
    wrap.innerHTML =
      '<div class="cf-smash-bar">' +
        '<span class="cf-smash-time">⏱ 30</span>' +
        '<span class="cf-smash-lives">❤️❤️❤️</span>' +
      '</div>' +
      '<div class="cf-smash-board" role="grid" aria-label="Kisten-Feld"></div>';
    const overlay = document.createElement('div');
    overlay.className = 'cf-overlay';
    wrap.appendChild(overlay);
    api.mount.appendChild(wrap);

    const board = wrap.querySelector('.cf-smash-board');
    const timeEl = wrap.querySelector('.cf-smash-time');
    const livesEl = wrap.querySelector('.cf-smash-lives');

    const holes = [];
    for (let i = 0; i < HOLES; i++) {
      const h = document.createElement('div');
      h.className = 'cf-hole';
      board.appendChild(h);
      holes.push(h);
    }

    let score, lives, started, alive, timeLeft, spawnAcc, spawnEvery, ticker;

    function reset() {
      score = 0; lives = 3; started = false; alive = true;
      timeLeft = GAME_TIME; spawnAcc = 0; spawnEvery = 850;
      clearCrates();
      timeEl.textContent = '⏱ 30';
      livesEl.textContent = '❤️❤️❤️';
      api.report(0);
      showStart();
    }

    function clearCrates() {
      holes.forEach(h => { h.innerHTML = ''; if (h._t) clearTimeout(h._t); h._t = null; });
    }

    function showStart() {
      overlay.className = 'cf-overlay cf-overlay--on';
      overlay.innerHTML =
        '<div class="cf-overlay__box">' +
        '<h3>📦 Kisten-Smash</h3>' +
        '<p>Tippe Kisten so schnell wie möglich.<br>💥 TNT kostet ein Leben!</p>' +
        '<button type="button" class="btn cf-overlay__btn">Start</button>' +
        '</div>';
      overlay.querySelector('.cf-overlay__btn').addEventListener('click', begin);
    }
    function showOver() {
      // Aktionen (Nochmal / Zur Auswahl) übernimmt das Ergebnis-Panel der Seite
      alive = false;
      clearCrates();
      const record = api.gameOver(score);
      api.sound('lose');
      overlay.className = 'cf-overlay cf-overlay--on';
      overlay.innerHTML =
        '<div class="cf-overlay__box">' +
        '<h3>Zeit um!</h3>' +
        '<p>Punkte: <strong>' + score + '</strong>' + (record ? ' – 🏆 Neuer Rekord!' : '') + '</p>' +
        '</div>';
    }
    function begin() {
      overlay.className = 'cf-overlay'; overlay.innerHTML = '';
      started = true; alive = true;
    }

    function spawn() {
      const free = holes.filter(h => !h.firstChild);
      if (!free.length) return;
      const h = free[(Math.random() * free.length) | 0];
      const tnt = Math.random() < 0.2;
      const crate = document.createElement('button');
      crate.type = 'button';
      crate.className = 'cf-smash-crate' + (tnt ? ' cf-smash-crate--tnt' : '');
      crate.textContent = tnt ? '💥' : '!';
      crate.setAttribute('aria-label', tnt ? 'TNT – nicht antippen!' : 'Kiste zerschlagen');
      const hit = (e) => {
        e.preventDefault();
        if (crate.dataset.gone) return;
        crate.dataset.gone = '1';
        const r = crate.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (tnt) {
          lives--;
          livesEl.textContent = '❤️'.repeat(Math.max(0, lives));
          api.sound('boom');
          api.burst(cx, cy, ['#FF0033', '#FF7300', '#FFD700']);
          document.body.classList.add('cf-shake');
          document.body.addEventListener('animationend',
            () => document.body.classList.remove('cf-shake'), { once: true });
          if (lives <= 0) { showOver(); return; }
        } else {
          score += 10;
          api.report(score);
          api.sound('crack');
          api.burst(cx, cy, ['#C8740A', '#FF7300', '#B6FF00']);
        }
        crate.classList.add('cf-smash-crate--hit');
        if (h._t) clearTimeout(h._t);
        setTimeout(() => { h.innerHTML = ''; }, 180);
      };
      crate.addEventListener('click', hit);
      h.appendChild(crate);
      requestAnimationFrame(() => crate.classList.add('cf-smash-crate--up'));
      // Kiste verschwindet nach kurzer Zeit von selbst
      const life = Math.max(550, spawnEvery + 250);
      h._t = setTimeout(() => { if (!crate.dataset.gone) h.innerHTML = ''; }, life);
    }

    reset();

    ticker = api.loop(function (dt) {
      if (!started || !alive) return;
      timeLeft -= dt;
      if (timeLeft <= 0) { timeEl.textContent = '⏱ 0'; showOver(); return; }
      timeEl.textContent = '⏱ ' + Math.ceil(timeLeft / 1000);
      spawnAcc += dt;
      if (spawnAcc >= spawnEvery) {
        spawnAcc = 0; spawn();
        if (spawnEvery > 480) spawnEvery -= 8; // wird schneller
      }
    });

    return {
      pause() { ticker.pause(); },
      resume() { ticker.resume(); },
      destroy() {
        ticker.stop();
        clearCrates();
        wrap.remove();
      }
    };
  });
})();
