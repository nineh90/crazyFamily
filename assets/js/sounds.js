(async function () {
  const container = document.getElementById('sounds-container');
  if (!container) return;

  let sounds = [];
  try {
    const res = await fetch('/assets/data/sounds.json', { cache: 'no-store' });
    sounds = await res.json();
  } catch (err) {
    container.innerHTML = `<div class="news-item">Fehler beim Laden der Sounds.</div>`;
    return;
  }

  let currentIndex = -1;
  let currentAudio = null;

  // === Player-Elemente ===
  const player          = document.getElementById('soundPlayer');
  const playerTitle     = document.getElementById('playerTitle');
  const playerPlay      = document.getElementById('playerPlay');
  const playerPrev      = document.getElementById('playerPrev');
  const playerNext      = document.getElementById('playerNext');
  const playerProgress  = document.getElementById('playerProgress');
  const playerFill      = document.getElementById('playerFill');
  const playerCurrent   = document.getElementById('playerCurrent');
  const playerDuration  = document.getElementById('playerDuration');
  const eqBg            = document.getElementById('eqBg');

  // === Equalizer-Balken generieren ===
  if (eqBg) {
    for (let i = 0; i < 28; i++) {
      const bar = document.createElement('span');
      bar.className = 'eq-bar';
      bar.style.animationDuration = (0.3 + Math.random() * 0.7).toFixed(2) + 's';
      bar.style.animationDelay    = (-Math.random()).toFixed(2) + 's';
      bar.style.height            = (15 + Math.random() * 55).toFixed(0) + '%';
      eqBg.appendChild(bar);
    }
  }

  // === Cards rendern ===
  sounds.forEach((sound, i) => {
    const card = document.createElement('article');
    card.className = 'card sound-card';
    card.id = `sound-${i}`;
    card.innerHTML = `
      <h3>${sound.titel}</h3>
      <p class="bio">${sound.beschreibung}</p>
      <div class="sound-card-actions">
        <button class="btn btn-sound" data-index="${i}">▶ Abspielen</button>
        <button class="btn-share" data-index="${i}" aria-label="Link zu diesem Track kopieren">🔗 Teilen</button>
      </div>
      <audio id="audio-${i}" src="${sound.source}" preload="none"></audio>
    `;
    container.appendChild(card);
  });

  // === Hilfsfunktionen ===
  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  function setCardState(index, playing) {
    const btn = container.querySelector(`.btn-sound[data-index="${index}"]`);
    if (!btn) return;
    btn.textContent = playing ? '⏸ Pause' : '▶ Abspielen';
    btn.classList.toggle('playing', playing);
  }

  function resetAllCards() {
    container.querySelectorAll('.btn-sound').forEach(b => {
      b.textContent = '▶ Abspielen';
      b.classList.remove('playing');
    });
  }

  // === Audio-Events (als named functions für removeEventListener) ===
  function onTimeUpdate() {
    if (!currentAudio.duration) return;
    const pct = (currentAudio.currentTime / currentAudio.duration) * 100;
    playerFill.style.width = pct + '%';
    playerCurrent.textContent = formatTime(currentAudio.currentTime);
  }

  function onMetadata() {
    playerDuration.textContent = formatTime(currentAudio.duration);
  }

  function onEnded() {
    const next = currentIndex + 1;
    if (next < sounds.length) {
      playTrack(next); // Autoplay
    } else {
      // Playlist fertig
      resetAllCards();
      playerPlay.textContent = '▶';
      playerFill.style.width = '0%';
      playerCurrent.textContent = '0:00';
      if (eqBg) eqBg.classList.remove('playing');
      currentIndex = -1;
    }
  }

  // === Track abspielen ===
  function playTrack(index) {
    if (index < 0 || index >= sounds.length) return;

    // Altes Audio stoppen & Events entfernen
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.removeEventListener('timeupdate', onTimeUpdate);
      currentAudio.removeEventListener('loadedmetadata', onMetadata);
      currentAudio.removeEventListener('ended', onEnded);
    }

    resetAllCards();
    currentIndex = index;
    currentAudio = document.getElementById(`audio-${index}`);

    currentAudio.addEventListener('timeupdate', onTimeUpdate);
    currentAudio.addEventListener('loadedmetadata', onMetadata);
    currentAudio.addEventListener('ended', onEnded);
    currentAudio.play();

    setCardState(index, true);

    // Player UI aktualisieren
    playerTitle.textContent = sounds[index].titel;
    playerPlay.textContent = '⏸';
    player.classList.add('active');
    document.body.classList.add('player-active');
    if (eqBg) eqBg.classList.add('playing');

    // URL aktualisieren (kein Seitenneuladen)
    const url = new URL(window.location);
    url.searchParams.set('track', index);
    history.replaceState(null, '', url);

    // Card sanft in Sicht scrollen
    const card = document.getElementById(`sound-${index}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function pauseTrack() {
    if (!currentAudio) return;
    currentAudio.pause();
    playerPlay.textContent = '▶';
    setCardState(currentIndex, false);
    if (eqBg) eqBg.classList.remove('playing');
  }

  function resumeTrack() {
    if (!currentAudio) return;
    currentAudio.play();
    playerPlay.textContent = '⏸';
    setCardState(currentIndex, true);
    if (eqBg) eqBg.classList.add('playing');
  }

  // === Klicks auf Cards (Event Delegation) ===
  container.addEventListener('click', e => {
    const playBtn  = e.target.closest('.btn-sound');
    const shareBtn = e.target.closest('.btn-share');

    if (playBtn) {
      const index = parseInt(playBtn.dataset.index);
      if (currentIndex === index && currentAudio && !currentAudio.paused) {
        pauseTrack();
      } else {
        playTrack(index);
      }
    }

    if (shareBtn) {
      const index = parseInt(shareBtn.dataset.index);
      const url = new URL(window.location);
      url.searchParams.set('track', index);
      navigator.clipboard.writeText(url.toString()).then(() => {
        shareBtn.textContent = '✓ Kopiert!';
        shareBtn.classList.add('copied');
        setTimeout(() => {
          shareBtn.textContent = '🔗 Teilen';
          shareBtn.classList.remove('copied');
        }, 1800);
      });
    }
  });

  // === Player-Steuerung ===
  playerPlay.addEventListener('click', () => {
    if (!currentAudio) return;
    currentAudio.paused ? resumeTrack() : pauseTrack();
  });

  playerPrev.addEventListener('click', () => {
    if (currentIndex > 0) playTrack(currentIndex - 1);
  });

  playerNext.addEventListener('click', () => {
    if (currentIndex < sounds.length - 1) playTrack(currentIndex + 1);
  });

  // Fortschrittsbalken klickbar (seekbar)
  playerProgress.addEventListener('click', e => {
    if (!currentAudio || !currentAudio.duration) return;
    const rect = playerProgress.getBoundingClientRect();
    currentAudio.currentTime = ((e.clientX - rect.left) / rect.width) * currentAudio.duration;
  });

  // === URL-Parameter beim Laden prüfen ===
  const trackParam = new URLSearchParams(window.location.search).get('track');
  if (trackParam !== null) {
    const index = parseInt(trackParam);
    if (!isNaN(index) && index >= 0 && index < sounds.length) {
      setTimeout(() => playTrack(index), 400);
    }
  }
})();
