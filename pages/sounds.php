<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CRAZYFAMILY – Sounds, Musik & Community-Tracks</title>
  <meta name="description" content="Die offiziellen CRAZYFAMILY Sounds, Intros und Community-Tracks – Musik aus den Streams von Alex & Kevin. Hör rein und fühl den Vibe!" />
  <meta name="keywords" content="CrazyFamily Sounds, CRAZYFAMILY Musik, Community Songs, Alex und Kevin, Stream Intro, Outro, CRAZYFAMILYLP Musik" />
  <meta name="author" content="CRAZYFAMILY" />
  <!-- Canonical -->
  <link rel="canonical" href="https://crazyfamily.info/pages/sounds.php" />
  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="CRAZYFAMILY – Sounds, Musik & Community-Tracks" />
  <meta property="og:description" content="Offizielle CRAZYFAMILY Sounds, Intros & Musik von Alex & Kevin – direkt aus der Community für die Community!" />
  <meta property="og:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
  <meta property="og:image:alt" content="CRAZYFAMILY Sounds &amp; Musik" />
  <meta property="og:image:width" content="1000" />
  <meta property="og:image:height" content="750" />
  <meta property="og:url" content="https://crazyfamily.info/pages/sounds.php" />
  <meta property="og:site_name" content="CRAZYFAMILY" />
  <meta property="og:locale" content="de_DE" />
  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CRAZYFAMILY – Sounds, Musik & Community-Tracks" />
  <meta name="twitter:description" content="Hör dir die CRAZYFAMILY Sounds und Musikstücke an – Soundtrack zu Streams & Spaß!" />
  <meta name="twitter:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
  <meta name="twitter:image:alt" content="CRAZYFAMILY Sounds &amp; Musik" />
  <!-- Theme & Manifest -->
  <meta name="theme-color" content="#0B0E14" />
  <link rel="manifest" href="/manifest.json" />
  <!-- Stylesheet, Font & Favicon -->
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

  <!-- Equalizer Hintergrund (wird per JS befüllt) -->
  <div id="eqBg" class="eq-bg" aria-hidden="true"></div>

  <!-- Main -->
  <main id="main" class="section">
    <div class="container">
      <h1>CRAZYFAMILY Sounds 🎧</h1>
      <p class="bio">Hier findest du unsere Songs, Intros und Community-Sounds – direkt zum Reinhören!</p>

      <div id="sounds-container" class="cards"></div>

      <div class="cross-link-row">
        <p>Mehr CRAZYFAMILY Content? Schau dir unsere <a href="/pages/videos.php" class="neon-link">Videos & Clips →</a> an!</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/partials/footer.php'; ?>

  <!-- Media Player -->
  <div id="soundPlayer" class="sound-player" role="region" aria-label="Musik-Player">
    <div class="sound-player__track" id="playerTitle">—</div>
    <div class="sound-player__controls">
      <button id="playerPrev" aria-label="Vorheriger Track">⏮</button>
      <button id="playerPlay" aria-label="Abspielen / Pause">▶</button>
      <button id="playerNext" aria-label="Nächster Track">⏭</button>
    </div>
    <div class="sound-player__progress" id="playerProgress">
      <div class="sound-player__fill" id="playerFill"></div>
    </div>
    <div class="sound-player__time">
      <span id="playerCurrent">0:00</span>
      <span id="playerDuration">0:00</span>
    </div>
  </div>

  <script src="../js/main.js" defer></script>
  <script src="/assets/js/sounds.js" defer></script>
  <script src="/assets/js/seasonal.js" defer></script>
</body>
</html>
