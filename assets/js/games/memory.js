/* 🧠 Memory – Karten-Paare aufdecken. Neon-Motive, kein Marken-Asset.
 * Score = höher ist besser: weniger Züge + schneller = mehr Punkte. */
(function () {
  'use strict';
  if (!window.CFArcade) return;

  CFArcade.register('memory', function (api) {
    const MOTIFS = ['🎮', '🍎', '📦', '🐍', '🔥', '⭐', '🎧', '🏆']; // 8 Paare = 4×4

    const wrap = document.createElement('div');
    wrap.className = 'cf-game cf-game--memory';
    wrap.innerHTML =
      '<div class="cf-mem-bar"><span class="cf-mem-moves">Züge: 0</span></div>' +
      '<div class="cf-mem-board" role="grid" aria-label="Memory-Karten"></div>';
    const overlay = document.createElement('div');
    overlay.className = 'cf-overlay';
    wrap.appendChild(overlay);
    api.mount.appendChild(wrap);

    const board = wrap.querySelector('.cf-mem-board');
    const movesEl = wrap.querySelector('.cf-mem-moves');

    let cards, first, busy, moves, matched, started, startTime;

    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function reset() {
      first = null; busy = false; moves = 0; matched = 0;
      started = false; startTime = 0;
      movesEl.textContent = 'Züge: 0';
      board.innerHTML = '';
      cards = shuffle(MOTIFS.concat(MOTIFS).map((m, i) => ({ m, i })));
      cards.forEach(card => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cf-mem-card';
        btn.setAttribute('aria-label', 'Verdeckte Karte');
        btn.innerHTML = '<span class="cf-mem-face cf-mem-face--front">?</span>' +
                        '<span class="cf-mem-face cf-mem-face--back">' + card.m + '</span>';
        btn.addEventListener('click', () => flip(btn, card));
        card.el = btn;
        board.appendChild(btn);
      });
      showStart();
    }

    function showStart() {
      overlay.className = 'cf-overlay cf-overlay--on';
      overlay.innerHTML =
        '<div class="cf-overlay__box">' +
        '<h3>🧠 Memory</h3>' +
        '<p>Finde alle 8 Paare – mit möglichst wenigen Zügen!</p>' +
        '<button type="button" class="btn cf-overlay__btn">Start</button>' +
        '</div>';
      overlay.querySelector('.cf-overlay__btn').addEventListener('click', begin);
    }
    function begin() {
      overlay.className = 'cf-overlay'; overlay.innerHTML = '';
      started = true; startTime = performance.now();
    }

    function flip(btn, card) {
      if (!started || busy || card.done || btn === first) return;
      btn.classList.add('cf-mem-card--up');
      btn.setAttribute('aria-label', 'Karte: ' + card.m);
      api.sound('flip');

      if (!first) { first = btn; first._card = card; return; }

      moves++;
      movesEl.textContent = 'Züge: ' + moves;

      if (first._card.m === card.m) {
        // Treffer
        card.done = first._card.done = true;
        first.classList.add('cf-mem-card--done');
        btn.classList.add('cf-mem-card--done');
        api.sound('jingle');
        const r = btn.getBoundingClientRect();
        api.burst(r.left + r.width / 2, r.top + r.height / 2, ['#00F5FF', '#B600FF', '#B6FF00']);
        first = null;
        matched++;
        if (matched === MOTIFS.length) finish();
      } else {
        // Daneben – kurz zeigen, dann verdecken
        busy = true;
        const a = first;
        first = null;
        setTimeout(() => {
          a.classList.remove('cf-mem-card--up');
          btn.classList.remove('cf-mem-card--up');
          a.setAttribute('aria-label', 'Verdeckte Karte');
          btn.setAttribute('aria-label', 'Verdeckte Karte');
          busy = false;
        }, 750);
      }
    }

    function finish() {
      started = false;
      const secs = Math.round((performance.now() - startTime) / 1000);
      // Höher = besser: Basis minus Aufwand
      const score = Math.max(50, 1000 - (moves - MOTIFS.length) * 25 - secs * 4);
      const record = api.gameOver(score);
      api.report(score);
      api.sound('win');
      api.confetti();
      // Aktionen (Nochmal / Zur Auswahl) übernimmt das Ergebnis-Panel der Seite
      overlay.className = 'cf-overlay cf-overlay--on';
      overlay.innerHTML =
        '<div class="cf-overlay__box">' +
        '<h3>🏆 Geschafft!</h3>' +
        '<p>' + moves + ' Züge · ' + secs + ' s<br>Punkte: <strong>' + score + '</strong>' +
        (record ? ' – Neuer Rekord!' : '') + '</p>' +
        '</div>';
    }

    reset();

    return {
      pause() {},
      resume() {},
      destroy() { wrap.remove(); }
    };
  });
})();
