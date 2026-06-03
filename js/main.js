// Splash → ausblenden
const splash = document.getElementById('splash');
window.addEventListener('load', () => setTimeout(() => splash.classList.add('hide'), 900));

// Header shrink on scroll (throttled)
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      document.body.classList.toggle('scrolled', window.scrollY > 10);
      ticking = false;
    });
    ticking = true;
  }
});

// Burger-Menü
const nav = document.getElementById('primaryNav');
const toggle = document.getElementById('navToggle');
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.dataset.collapsed = expanded ? 'true' : 'false';
  toggle.setAttribute('aria-label', expanded ? 'Menü öffnen' : 'Menü schließen');
});
// Auto-close on link tap (mobile)
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (getComputedStyle(toggle).display !== 'none') {
    toggle.click();
  }
}));

// === CRAZYFAMILY Quotes & Insider Chips ===
(function initCrazyQuotes() {
  const quotes = [
    "Ich hasse Walle.",
    "Fiebertraum!",
    "Ich hasse Wasserlevel.",
    "Meine Hände sind Wasser.",
    "Hör doch mal auf hier so rumzuzappeln.",
    "Team Kevin.",
    "Team Alex.",
    "Für Fortnite",
    "für Gondor!"
  ];

  /** Rotierender Quote im Hero (nur wenn #quote existiert) **/
  const quoteEl = document.getElementById("quote");
  if (quoteEl) {
    let qi = Math.floor(Math.random() * quotes.length);

    const renderQuote = () => {
      const variant = Math.floor(Math.random() * 3) + 1; // 1–3
      quoteEl.className = `quote chip chip--${variant}`;
      quoteEl.textContent = `„${quotes[qi]}“`;
      qi = (qi + 1) % quotes.length;
    };

    renderQuote();
    const timer = setInterval(renderQuote, 6000);
    window.addEventListener("pagehide", () => clearInterval(timer));
  }

  /** Insider-Chips-Liste (nur wenn #insider-family existiert) **/
  const insiderEl = document.getElementById("insider-family");
  if (insiderEl) {
    insiderEl.innerHTML = "";
    quotes.forEach((txt, i) => {
      const span = document.createElement("span");
      span.className = `chip chip--${(i % 3) + 1}`;
      span.textContent = txt;
      insiderEl.appendChild(span);
    });
  }
})();
