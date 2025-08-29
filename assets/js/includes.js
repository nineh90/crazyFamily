(async function loadIncludes() {
  const slots = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(slots.map(async (slot) => {
    const url = slot.getAttribute('data-include');
    const res = await fetch(url, { cache: 'no-cache' });
    const html = await res.text();
    // outerHTML ersetzt den Platzhalter direkt
    slot.outerHTML = html;
  }));

  // Warten, bis DOM die neuen Knoten kennt
  requestAnimationFrame(initHeaderInteractions);

  function initHeaderInteractions() {
    const header = document.getElementById('site-header');
    const nav = document.getElementById('primaryNav');
    const toggle = document.getElementById('navToggle');

    if (!header || !nav || !toggle) return;

    // Burger Toggle
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

    // Sticky Header (falls noch nicht per CSS gelöst)
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('is-sticky');
      else header.classList.remove('is-sticky');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
