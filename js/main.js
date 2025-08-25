// Splash → ausblenden
const splash = document.getElementById('splash');
window.addEventListener('load', () => setTimeout(() => splash.classList.add('hide'), 800));

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

// Random Quotes
const quotes = [
  "Guter Ping, schlechte Entscheidungen.",
  "Wenn’s laggt, liegt’s am Skill. Klar.",
  "AFK? Nur, wenn die Pizza klingelt.",
  "Mic check: 1, 2 – wo ist mein Loot?",
  "GG? Eher WTF."
];
const quoteEl = document.getElementById('quote');
let qi = 0;
setInterval(() => {
  qi = (qi + 1) % quotes.length;
  quoteEl.textContent = `„${quotes[qi]}“`;
}, 12000);

// Links
document.querySelectorAll('.btn-yt').forEach(a => a.href = 'https://www.youtube.com/@CrazyFamilyLP/featured');
document.querySelectorAll('.btn-tt').forEach(a => a.href = 'https://www.tiktok.com/@crazyfamilylp?is_from_webapp=1&sender_device=pc');
document.querySelectorAll('.btn-dc').forEach(a => a.href = 'https://discord.gg/H4TT6yR78w');
