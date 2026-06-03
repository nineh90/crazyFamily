(async function loadIncludes() {
  const slots = Array.from(document.querySelectorAll('[data-include]'));
  
  // Wenn keine Include-DIVs vorhanden sind, einfach normal fortfahren
  if (!slots.length) {
    requestAnimationFrame(initHeaderInteractions);
    return;
  }

  try {
    await Promise.all(slots.map(async (slot) => {
      const url = slot.getAttribute('data-include');
      const res = await fetch(url, { cache: 'no-cache' });
      const html = await res.text();
      slot.outerHTML = html; // ersetzt Platzhalter
    }));
  } catch (err) {
    console.warn("Include konnte nicht geladen werden:", err);
  }

  // Nach dem Einfügen der Includes Interaktionen initialisieren
  requestAnimationFrame(initHeaderInteractions);

  function initHeaderInteractions() {
    const header = document.getElementById('site-header');
    const nav = document.getElementById('primaryNav');
    const toggle = document.getElementById('navToggle');

    // Wenn kein Header existiert (z. B. Shopseite), beende Funktion still
    if (!header || !nav || !toggle) return;

    // Burger-Menü
    toggle.addEventListener('click', () => {
      const collapsed = nav.getAttribute('data-collapsed') === 'true';
      nav.setAttribute('data-collapsed', String(!collapsed));
      toggle.setAttribute('aria-expanded', String(collapsed));
      document.body.classList.toggle('nav-open', collapsed);
    });

    // Menü schließen bei Linkklick (mobil)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.setAttribute('data-collapsed', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });

    // Sticky Header
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('is-sticky');
      else header.classList.remove('is-sticky');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
