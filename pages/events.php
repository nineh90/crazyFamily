<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CRAZYFAMILY – Events & Stream-Kalender</title>
  <meta name="description" content="CRAZYFAMILY Stream-Kalender: Montags, Mittwochs und Freitags ab 17 Uhr live auf TikTok mit Alex & Kevin. Alle Events, Challenges und Specials auf einen Blick." />
  <meta name="keywords" content="CrazyFamily Events, CRAZYFAMILY Kalender, Stream-Termine, Alex und Kevin live, TikTok Stream Termine, Gaming Events Deutschland" />
  <meta name="author" content="CRAZYFAMILY" />
  <link rel="canonical" href="https://crazyfamily.info/pages/events.php" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="CRAZYFAMILY – Events & Stream-Kalender" />
  <meta property="og:description" content="Alle CRAZYFAMILY Stream-Termine und Special Events auf einen Blick – verpasse keinen Stream von Alex & Kevin!" />
  <meta property="og:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
  <meta property="og:image:alt" content="CRAZYFAMILY Events &amp; Stream-Kalender" />
  <meta property="og:image:width" content="1000" />
  <meta property="og:image:height" content="750" />
  <meta property="og:url" content="https://crazyfamily.info/pages/events.php" />
  <meta property="og:site_name" content="CRAZYFAMILY" />
  <meta property="og:locale" content="de_DE" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CRAZYFAMILY Events & Stream-Kalender" />
  <meta name="twitter:description" content="Mo, Mi, Fr ab 17 Uhr live auf TikTok – alle Termine und Specials im CRAZYFAMILY Kalender!" />
  <meta name="twitter:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
  <meta name="twitter:image:alt" content="CRAZYFAMILY Events &amp; Stream-Kalender" />
  <meta name="theme-color" content="#0B0E14" />
  <link rel="manifest" href="/manifest.json" />
  <!-- Stylesheet & Font -->
  <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <meta name="msapplication-TileColor" content="#0B0E14" />
  <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
</head>

<body>
  <!-- Header -->
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/partials/header.php'; ?>

  <!-- Main -->
  <main id="main" class="section">
    <div class="container">
      <p><a href="/" class="back-link">← Zurück zur Startseite</a></p>
      <h1>Events & Stream-Kalender</h1>
      <p class="bio">
        Reguläre Streams: <strong>Montag, Mittwoch & Freitag ab 17 Uhr</strong> live auf TikTok.<br>
        Sterne markieren besondere Events und Challenges!
      </p>

      <!-- Kalender Navigation -->
      <div class="calendar-nav">
        <button id="calPrev" aria-label="Vorheriger Monat">‹</button>
        <span id="calMonthLabel" class="calendar-month-label">Lade...</span>
        <button id="calNext" aria-label="Nächster Monat">›</button>
      </div>

      <!-- Kalender Grid -->
      <div id="calendarGrid" class="calendar-grid" role="grid" aria-label="Stream-Kalender"></div>

      <!-- Legende -->
      <div class="calendar-legend" aria-label="Legende">
        <span>🎮 Stream-Tag</span>
        <span>⭐ Special Event</span>
        <span style="border:2px solid var(--pink); border-radius:6px; padding:0 6px;">Heute</span>
      </div>

      <!-- Special Events Liste -->
      <div style="margin-top:3rem;">
        <h2>Kommende Events</h2>
        <div id="eventsList" class="cards"></div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/partials/footer.php'; ?>

  <script src="../js/main.js" defer></script>
  <script src="/assets/js/calendar.js" defer></script>
  <script src="/assets/js/seasonal.js" defer></script>
  <script>
  // Upcoming events list
  (async function() {
    const container = document.getElementById('eventsList');
    if (!container) return;
    try {
      const res = await fetch('/assets/data/events.json', { cache: 'no-cache' });
      const events = await res.json();
      const today = new Date().toISOString().slice(0, 10);
      const upcoming = events
        .filter(e => e.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

      if (!upcoming.length) {
        container.innerHTML = '<p class="bio">Aktuell keine besonderen Events geplant. Reguläre Streams: Mo, Mi, Fr ab 17 Uhr!</p>';
        return;
      }
      container.innerHTML = upcoming.map(ev => {
        const d = new Date(ev.date + 'T00:00:00');
        const fmt = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        return `
          <article class="card" style="flex:1;min-width:260px;max-width:360px;">
            <p class="role">⭐ ${fmt}</p>
            <h3>${ev.title}</h3>
            ${ev.note ? `<p class="bio">${ev.note}</p>` : ''}
            <p class="bio">
              <a href="https://www.tiktok.com/@crazyfamilylp" target="_blank" rel="noopener" class="neon-link">Zum TikTok-Stream →</a>
            </p>
          </article>`;
      }).join('');
    } catch(e) {
      container.innerHTML = '<p class="bio">Events konnten nicht geladen werden.</p>';
    }
  })();
  </script>
</body>
</html>
