document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".video-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));
});


document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("youtube-videos");
  const API_KEY = window.YOUTUBE_API_KEY || "";
  const CHANNEL_ID = "UCqo-UK8eO4L5G19V8fQuvVQ"; // CrazyFamilyLP Channel-ID
  const MAX_RESULTS = 6; // z. B. die letzten 6 Videos

  async function loadVideos() {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`
      );
      const data = await res.json();

      if (!data.items) {
        container.innerHTML = `<p class="bio">Fehler beim Laden der Videos 😢</p>`;
        return;
      }

      container.innerHTML = data.items
        .filter(item => item.id.kind === "youtube#video")
        .map(
          item => `
          <div class="video-card">
            <div class="video-thumb" onclick="playVideo('${item.id.videoId}')">
              <img src="${item.snippet.thumbnails.high.url}" alt="${item.snippet.title}">
              <div class="video-overlay">▶</div>
            </div>
            <h3>${item.snippet.title}</h3>
          </div>
        `
        )
        .join("");
    } catch (err) {
      container.innerHTML = `<p class="bio">Fehler beim Laden der YouTube-Videos.</p>`;
      console.error(err);
    }
  }

  window.playVideo = (id) => {
    const modal = document.createElement("div");
    modal.className = "video-modal";
    modal.innerHTML = `
      <div class="video-modal-content">
        <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allowfullscreen></iframe>
        <button class="close-modal">✕</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());
  };

  loadVideos();
});
