(async function () {
  const container = document.getElementById('mods-container');
  if (!container) return;

  let mods = [];
  try {
    const res = await fetch('/assets/data/mods.json', { cache: 'no-store' });
    mods = await res.json();
  } catch {
    container.innerHTML = `<div class="news-item">Fehler beim Laden der Moderatoren.</div>`;
    return;
  }

  const PLATFORMEN = {
    tiktok: {
      icon: '/assets/images/tiktok_logo_icon.png',
      label: 'TikTok'
    },
    youtube: {
      icon: '/assets/images/youtube2_icon.png',
      label: 'YouTube'
    },
    amazon: {
      icon: '/assets/images/amazon_icon.png',
      label: 'Amazon'
    },
    discord: {
      icon: '/assets/images/discord_icon.png',
      label: 'Discord'
    },
    website: {
      icon: '/assets/images/link.png',
      label: 'Webseite'
    }
  };

  function renderLinks(links = {}) {
    return Object.entries(links)
      .filter(([_, url]) => url)
      .map(([key, url]) => {
        const p = PLATFORMEN[key];
        if (!p) return '';
        return `
          <a href="${url}" target="_blank" rel="noopener" class="btn">
            <img class="logo_hero" src="${p.icon}" alt="${p.label}">
          </a>
        `;
      })
      .join('');
  }

  container.innerHTML = '';
  mods.forEach(m => {
    const card = document.createElement('article');
    card.className = 'card';

    const linksHTML = m.links ? `
      <p class="bio links">
        ${renderLinks(m.links)}
      </p>
    ` : '';

    card.innerHTML = `
      <img src="${m.bild}" alt="${m.name} – ${m.rolle}" class="avatar" loading="lazy">
      <h3>${m.name}</h3>
      <p class="role">${m.rolle}</p>
      <p class="bio">${m.beschreibung ?? ''}</p>
      ${linksHTML}
    `;

    container.appendChild(card);
  });
})();
