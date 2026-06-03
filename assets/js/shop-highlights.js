document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("shopHighlightGrid");
  if (!container) return;

  try {
    const res = await fetch("/assets/data/shop-highlights.json", { cache: "no-cache" });
    const items = await res.json();

    const active = items
      .filter(i => i.isActive)
      .sort((a, b) => b.priority - a.priority);

    container.innerHTML = active.map((item, idx) => {
  const hasMultiple = item.images.length > 1;

  return `
    <article class="card product-card" data-prod="${idx}">
    ${item.badge ? `<div class="product-badge">${item.badge}</div>` : ""}


      ${hasMultiple ? `
            <div class="slider" data-index="0">
            <div class="slides">
                ${item.images.map(img => `
                <img src="${img}" alt="${item.name}" loading="lazy">
                `).join("")}
            </div>

            <button class="slider-btn prev">‹</button>
            <button class="slider-btn next">›</button>

            <div class="dots">
                ${item.images.map((_, i) => `
                <span class="dot ${i === 0 ? "active" : ""}"></span>
                `).join("")}
            </div>
            </div>
        ` : `
            <div class="single-image">
            <img src="${item.images[0]}" alt="${item.name}" loading="lazy">
            </div>
        `}

        <h3>${item.name}</h3>
        <p class="role">${item.price.toFixed(2)} €</p>
        <p class="bio">${item.description}</p>

        <p class="product-cta">
          <a href="${item.link}" target="_blank" class="btn btn-shop">Zum Shop</a>
        </p>

        </article>
    `;
    }).join("");

    initProductSliders();
      // === Dynamisches JSON-LD Schema für Google ===
// === Dynamisches JSON-LD Schema für Google ===
try {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": active.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": item.name,
        "image": item.images,
        "description": item.description,

        // Google braucht eindeutige URL → wir erzeugen eine Fake-Produkt-URL
        "url": `https://crazyfamily.info/pages/shop.php?product=${item.id}`,

        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "price": item.price.toFixed(2),
          "availability": "https://schema.org/InStock",
          "url": item.link       // echter Link für Nutzer
        },
        "brand": {
          "@type": "Brand",
          "name": "CRAZYFAMILY"
        }
      }
    }))
  };

  document.getElementById("shopHighlightsSchema").textContent =
    JSON.stringify(schema, null, 2);

} catch (err) {
  console.error("Fehler beim JSON-LD Schema:", err);
}

  } catch (e) {
    console.error("Shop-Highlights konnten nicht geladen werden:", e);
  }
});

function initProductSliders() {


  document.querySelectorAll(".product-card").forEach(card => {
    const slider = card.querySelector(".slider");
    if (!slider) return; // nur Slider, wenn mehrere Bilder!

    const slides = slider.querySelector(".slides");
    const imgs = slides.querySelectorAll("img");
    const dots = slider.querySelectorAll(".dot");
    let index = 0;

    function updateSlider() {
      slides.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    slider.querySelector(".next").addEventListener("click", () => {
      index = (index + 1) % imgs.length;
      updateSlider();
    });

    slider.querySelector(".prev").addEventListener("click", () => {
      index = (index - 1 + imgs.length) % imgs.length;
      updateSlider();
    });

    // Touch / Swipe only if multiple images
    let startX = 0;
    slides.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    slides.addEventListener("touchend", e => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 50) slider.querySelector(".next").click();
      if (endX > startX + 50) slider.querySelector(".prev").click();
    });
  });
}

