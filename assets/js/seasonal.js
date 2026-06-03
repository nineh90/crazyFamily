document.addEventListener("DOMContentLoaded", async () => {
  const header = document.getElementById("site-header");

  // Hilfsfunktionen
  const mmdd = (d) => String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const inRange = (current, start, end) => {
    return (start <= end) ? (current >= start && current <= end) : (current >= start || current <= end);
  };

  let data = [];
  try {
    const res = await fetch("/assets/data/seasonal.json", { cache: "no-cache" });
    data = await res.json();
  } catch (e) {
    console.warn("seasonal.json konnte nicht geladen werden:", e);
    return;
  }

  const todayStr = mmdd(new Date());
  const matches = data.filter(s => inRange(todayStr, s.start, s.end));

  if (!matches.length) return;
  matches.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  const active = matches[0];

  // Banner-Element erstellen
  const banner = document.createElement("div");
  banner.id = "season-banner";
  banner.className = "season-banner";
  banner.innerHTML = `
    <span class="season-text">${active.message}</span>
  `;

  // Platzierung
  if (active.placement === "underHeader" && header) {
    header.insertAdjacentElement("afterend", banner);
    banner.classList.add("under-header");
    const applyTop = () => {
      const h = header.offsetHeight || 56;
      banner.style.top = h + "px";
    };
    applyTop();
    window.addEventListener("resize", applyTop, { passive: true });
  } else {
    document.body.appendChild(banner);
    banner.classList.add("overlay");
  }

  // Sichtbar machen
requestAnimationFrame(() => banner.classList.add("active"));

// Banner automatisch ausblenden
setTimeout(() => {
  banner.classList.add("hidden");
}, 1500);

  // Effekte
  switch (active.effect) {
  case "snow": startSnow(); break;
  case "hearts": startHearts(); break;
  case "leaves": startLeaves(); break;
  case "flowers": startFlowers(); break;
  case "pumpkin": startPumpkins(); break;
  case "sunglow": startSunGlow(); break;
  case "confetti": startConfetti(); break;
  case "eggs": startEggs(); break;
  case "candle1": startCandles(1); break;
  case "candle2": startCandles(2); break;
  case "candle3": startCandles(3); break;
  case "candle4": startCandles(4); break;
  default: break;
}


  // ===== Effekte =====
  function createFullscreenCanvas(z = 1500) {
    const c = document.createElement("canvas");
    Object.assign(c.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: z });
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return { c, ctx };
  }

  function rafLoop(draw) {
    let id;
    const loop = () => { draw(); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }

  // Schnee
  function startSnow() {
    const { c, ctx } = createFullscreenCanvas(1500);
    const flakes = Array.from({ length: 80 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 2.4 + 0.8,
      d: Math.random() * 0.8 + 0.4
    }));
    rafLoop(() => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      for (const f of flakes) {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        f.y += f.d;
        if (f.y > c.height) { f.y = -5; f.x = Math.random() * c.width; }
      }
      ctx.fill();
    });
  }

  // Herzen
  function startHearts() {
    for (let i = 0; i < 24; i++) {
      const el = document.createElement("div");
      el.textContent = "❤️";
      el.className = "heart-float";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = (Math.random() * 5) + "s";
      document.body.appendChild(el);
    }
  }

  // Herbstblätter
  function startLeaves() {
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("div");
      el.textContent = ["🍁","🍂"][Math.random() > 0.5 ? 1 : 0];
      el.className = "leaf-fall";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = (Math.random() * 8) + "s";
      document.body.appendChild(el);
    }
  }

  // Blumen (Frühling)
  function startFlowers() {
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("div");
      el.textContent = "🌸";
      el.className = "flower-rise";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = (Math.random() * 6) + "s";
      document.body.appendChild(el);
    }
  }

  // 🎃 Kürbisse (Halloween)
  function startPumpkins() {
    for (let i = 0; i < 14; i++) {
      const el = document.createElement("div");
      el.textContent = "🎃";
      el.className = "pumpkin-float";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = (Math.random() * 6) + "s";
      document.body.appendChild(el);
    }
  }

  // ☀️ Sonnen-Glow (Sommer)
  function startSunGlow() {
    const glow = document.createElement("div");
    glow.className = "sun-glow";
    document.body.appendChild(glow);
  }

  // 🎊 Konfetti (Silvester/Neujahr)
  function startConfetti() {
    const { c, ctx } = createFullscreenCanvas(1600);
    const parts = Array.from({ length: 120 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * -c.height,
      s: Math.random() * 4 + 2,
      vy: Math.random() * 3 + 2
    }));
    rafLoop(() => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of parts) {
        ctx.fillStyle = `hsl(${(p.x / c.width) * 360}, 90%, 60%)`;
        ctx.fillRect(p.x, p.y, p.s, p.s);
        p.y += p.vy;
        if (p.y > c.height) {
          p.y = -10; p.x = Math.random() * c.width; p.vy = Math.random() * 3 + 2;
        }
      }
    });
  }

// 🥚 Ostern
function startEggs() {
  const emojis = ["🥚", "🐣", "🐥", "🐇", "🌷"];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement("div");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.className = "egg-rise";
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDelay = (Math.random() * 7) + "s";
    document.body.appendChild(el);
  }
}

// 🕯️ Adventskerzen
function startCandles(count = 1) {
  const holder = document.createElement("div");
  holder.className = "advent-holder";
  for (let i = 0; i < count; i++) {
    const candle = document.createElement("div");
    candle.className = "candle";
    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);
    holder.appendChild(candle);
  }
  document.body.appendChild(holder);
}

});
