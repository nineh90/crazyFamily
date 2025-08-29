// Splash → ausblenden
const splash = document.getElementById('splash');
window.addEventListener('load', () => setTimeout(() => splash.classList.add('hide'), 1800));

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

// Random Quotes als Chip im Hero
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

const quoteEl = document.getElementById('quote');
let qi = 0;
setInterval(() => {
  qi = (qi + 1) % quotes.length;
  // zufällige Chip-Farbe (1–3)
  const variant = Math.floor(Math.random() * 3) + 1;
  quoteEl.className = `quote chip chip--${variant}`;
  quoteEl.textContent = `„${quotes[qi]}“`;
}, 6000);


// Links
document.querySelectorAll('.btn-yt').forEach(a => a.href = 'https://www.youtube.com/@CrazyFamilyLP/featured');
document.querySelectorAll('.btn-tt').forEach(a => a.href = 'https://www.tiktok.com/@crazyfamilylp?is_from_webapp=1&sender_device=pc');
document.querySelectorAll('.btn-dc').forEach(a => a.href = 'https://discord.gg/H4TT6yR78w');

// === Insider Sprüche als Chips ===
(function(){
  const insider = [
    "Ich hasse Walle.",
    "Fiebertraum!",
    "Ich hasse Wasserlevel.",
    "Meine Hände sind Wasser.",
    "Hör doch mal auf hier so rumzuzappeln.",
    "Team Kevin",
    "Team Alex",
    "Für Fortnite",
    "für Gondor!"
  ];

  function renderChips(containerId){
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = "";
    insider.forEach((txt, i) => {
      const span = document.createElement("span");
      span.className = `chip chip--${(i % 3)+1}`;
      span.textContent = txt;
      el.appendChild(span);
    });
  }
  renderChips("insider-family");
})();
