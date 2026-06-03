(async function () {
  if (window.__liveChecked) return; // Guard: nicht doppelt ausführen
  window.__liveChecked = true;

  try {
    const res = await fetch('/assets/data/livestream.json', { cache: 'no-store' });
    const { isLive, message, url } = await res.json();
    if (!isLive) return;

    // ── 1. Großer Hero-Badge (nur index.php) ─────────────────────
    const heroBadge = document.getElementById('hero-live-badge');
    if (heroBadge) {
      heroBadge.innerHTML = `
        <a href="${url}" class="hero-live-card" target="_blank" rel="noopener noreferrer"
           aria-label="Jetzt live auf TikTok">
          <span class="live-pulse-ring"></span>
          <span class="live-badge-icon">● LIVE</span>
          <span class="hero-live-text">${message}</span>
          <span class="hero-live-arrow">→</span>
        </a>`;
    }

    // ── 2. Schmaler Fix-Banner unter dem Header (alle Seiten) ─────
    const banner = document.createElement('a');
    banner.href = url;
    banner.target = '_blank';
    banner.rel = 'noopener noreferrer';
    banner.className = 'live-banner';
    banner.setAttribute('aria-label', 'Jetzt live auf TikTok');
    banner.innerHTML = `
      <span class="live-dot"></span>
      <span class="live-badge">LIVE</span>
      <span>${message}</span>
    `;
    document.body.prepend(banner);

    // Body-Klasse für CSS-Offset (Inhalt schiebt sich unter Banner)
    document.body.classList.add('is-live');

  } catch (e) {
    // silent fail
  }
})();
