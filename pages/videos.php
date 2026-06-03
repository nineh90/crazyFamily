<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>CRAZYFAMILY – Videos & Livestream-Highlights</title>
  <meta name="description" content="CRAZYFAMILY Videos – Livestreams, Highlights & TikTok-Clips von Alex & Kevin. Unterhaltung, Chaos & Community pur!" />
  <meta name="keywords" content="CrazyFamily, Alex und Kevin, Videos, Livestreams, Highlights, TikTok Clips, YouTube Shorts, CRAZYFAMILYLP" />
  <meta name="author" content="CRAZYFAMILY" />
  <!-- Canonical -->
  <link rel="canonical" href="https://crazyfamily.info/pages/videos.php" />
  <!-- Open Graph / Social Sharing -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="CRAZYFAMILY – Videos & Livestream-Highlights" />
  <meta property="og:description" content="Erlebe die besten CRAZYFAMILY Videos: Livestream-Momente, Challenges & Highlights von Alex & Kevin auf YouTube und TikTok." />
  <meta property="og:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
  <meta property="og:image:alt" content="CRAZYFAMILY Videos &amp; Livestream-Highlights" />
  <meta property="og:image:width" content="1000" />
  <meta property="og:image:height" content="750" />
  <meta property="og:url" content="https://crazyfamily.info/pages/videos.php" />
  <meta property="og:site_name" content="CRAZYFAMILY" />
  <meta property="og:locale" content="de_DE" />
  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CRAZYFAMILY – Videos & Livestream-Highlights" />
  <meta name="twitter:description" content="Highlights & TikTok-Clips von Alex & Kevin – CRAZYFAMILYLP auf YouTube & TikTok!" />
  <meta name="twitter:image" content="https://crazyfamily.info/assets/images/logo-duo.png" />
  <meta name="twitter:image:alt" content="CRAZYFAMILY Videos &amp; Livestream-Highlights" />
  <!-- Theme & Manifest -->
  <meta name="theme-color" content="#0B0E14" />
  <link rel="manifest" href="/manifest.json" />
  <!-- Stylesheet, Font & Icons -->
  <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/style.css" />

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <meta name="msapplication-TileColor" content="#0B0E14" />
  <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

  <?php
  if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/config.php')) {
    include $_SERVER['DOCUMENT_ROOT'] . '/config.php';
  }
  ?>
  <script>window.YOUTUBE_API_KEY = "<?= defined('YOUTUBE_API_KEY') ? htmlspecialchars(YOUTUBE_API_KEY, ENT_QUOTES) : '' ?>";</script>
</head>

<body>
  <!-- Header -->
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/partials/header.php'; ?>

  <!-- Main -->
  <main id="main">
    <section class="section video-section">
      <div class="container">
        <h1>CRAZYFAMILY Videos</h1>
        <p class="bio">Unsere neuesten Highlights von YouTube & TikTok – automatisch aktuell und voller Chaos, Spaß & Community!</p>
      </div>
    </section>

    <!-- TikTok -->
    <section class="section section--alt video-section">
      <div class="container">
        <h2>TikTok Clips</h2>
        <div class="tiktok-embed-wrapper neon-border">
          <blockquote class="tiktok-embed"
            cite="https://www.tiktok.com/@crazyfamilylp"
            data-unique-id="crazyfamilylp"
            data-embed-type="creator"
            style="max-width: 720px;min-width: 320px;">
            <section></section>
          </blockquote>
          <script async src="https://www.tiktok.com/embed.js"></script>
        </div>
      </div>
    </section>

    <!-- YouTube -->
    <section class="section video-section">
      <div class="container">
        <h2>YouTube Highlights</h2>
        <div id="youtube-videos" class="video-grid"></div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/partials/footer.php'; ?>

  <script src="../js/main.js" defer></script>
  <script src="/assets/js/videos.js" defer></script>
  <script src="/assets/js/seasonal.js" defer></script>
</body>
</html>
