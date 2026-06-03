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

  // === Renderer ===
  sounds.forEach((sound, i) => {
    const card = document.createElement('article');
    card.className = 'card sound-card';
    card.innerHTML = `
      <h3>${sound.titel}</h3>
      <p class="bio">${sound.beschreibung}</p>
      <button class="btn btn-sound" data-index="${i}">▶ Abspielen</button>
      <audio id="audio-${i}" src="${sound.source}" preload="none"></audio>
    `;
    container.appendChild(card);
  });

  // === Abspiel-Logik ===
  const buttons = container.querySelectorAll('.btn-sound');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.dataset.index;
      const audio = document.getElementById(`audio-${index}`);

      // Alle anderen Audios stoppen & Buttons zurücksetzen
      document.querySelectorAll('audio').forEach((a, j) => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
          const otherBtn = document.querySelector(`.btn-sound[data-index="${j}"]`);
          if (otherBtn) {
            otherBtn.textContent = '▶ Abspielen';
            otherBtn.classList.remove('playing');
          }
        }
      });

      // Zustand toggeln (aktueller Track)
      if (audio.paused) {
        audio.play();
        btn.textContent = '⏸ Pause';
        btn.classList.add('playing');
      } else {
        audio.pause();
        btn.textContent = '▶ Abspielen';
        btn.classList.remove('playing');
      }

      // Beim Ende automatisch zurücksetzen
      audio.onended = () => {
        btn.textContent = '▶ Abspielen';
        btn.classList.remove('playing');
      };
    });
  });
})();
