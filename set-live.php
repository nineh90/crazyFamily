<?php
// ─────────────────────────────────────────────────────
//  CRAZYFAMILY – Live-Toggle
//  PIN in config.php: define('LIVE_PIN', '...')
//  Seite bookmarken auf dem Handy → vor/nach dem Stream aufrufen
// ─────────────────────────────────────────────────────

$configPath = __DIR__ . '/config.php';
$jsonPath   = __DIR__ . '/assets/data/livestream.json';

if (file_exists($configPath)) include $configPath;
$pin = defined('LIVE_PIN') ? LIVE_PIN : '1234';

$data     = json_decode(file_get_contents($jsonPath), true);
$isLive   = $data['isLive'] ?? false;
$error    = '';
$success  = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (($_POST['pin'] ?? '') === $pin) {
    $action        = $_POST['action'] ?? '';
    $data['isLive'] = ($action === 'on');
    file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    $isLive  = $data['isLive'];
    $success = $isLive ? '🔴 Stream ist jetzt LIVE!' : '⬛ Stream wurde beendet.';
  } else {
    $error = 'Falscher PIN.';
  }
}
?>
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CRAZYFAMILY – Live-Toggle</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0B0E14; --card: #111626; --pink: #FF3EA5;
      --lime: #B6FF00; --text: #EDEDED; --muted: #A9B0BE;
      --orange: #FF7300; --red: #ff0033;
    }
    html, body { height: 100%; }
    body {
      background: var(--bg); color: var(--text);
      font-family: Inter, system-ui, sans-serif;
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem; min-height: 100dvh;
    }
    .card {
      background: var(--card); border-radius: 18px;
      border: 2px solid rgba(255,255,255,.07);
      box-shadow: 4px 4px 0 rgba(0,0,0,.8), 0 0 30px rgba(255,62,165,.15);
      padding: 2rem 2rem 2.5rem;
      width: min(420px, 100%);
      text-align: center;
    }
    .logo { font-family: Arial Black, sans-serif; font-size: 1.2rem;
      color: var(--pink); text-shadow: 0 0 14px var(--pink);
      letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.25rem; }
    .subtitle { color: var(--muted); font-size: .85rem; margin-bottom: 2rem; }

    /* Status-Anzeige */
    .status {
      display: flex; align-items: center; justify-content: center;
      gap: 0.6rem; font-size: 1.1rem; font-weight: 700;
      padding: 0.9rem 1.4rem; border-radius: 12px; margin-bottom: 2rem;
      border: 2px solid; box-shadow: 3px 3px 0 rgba(0,0,0,.7);
    }
    .status.online {
      background: rgba(255,0,51,.12); border-color: var(--red);
      color: var(--red); text-shadow: 0 0 10px var(--red);
    }
    .status.offline {
      background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.15);
      color: var(--muted);
    }
    .dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: currentColor; flex-shrink: 0;
    }
    .status.online .dot { animation: blink 1s ease-in-out infinite; }
    @keyframes blink {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: .4; transform: scale(1.4); }
    }

    /* PIN-Formular */
    label { display: block; font-size: .82rem; color: var(--muted);
      text-align: left; margin-bottom: .4rem; }
    input[type=password] {
      width: 100%; padding: .75rem 1rem; border-radius: 10px;
      background: rgba(255,255,255,.06); border: 1.5px solid rgba(255,255,255,.12);
      color: var(--text); font-size: 1rem; outline: none;
      transition: border-color .2s;
      -webkit-text-security: disc;
    }
    input[type=password]:focus { border-color: var(--pink); }

    /* Buttons */
    .btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: 1.2rem; }
    .btn {
      padding: .85rem; border-radius: 12px; border: 2px solid;
      font-size: 1rem; font-weight: 800; cursor: pointer;
      box-shadow: 3px 3px 0 rgba(0,0,0,.8);
      transition: transform .12s, box-shadow .12s;
    }
    .btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 rgba(0,0,0,.8); }
    .btn-on {
      background: rgba(255,0,51,.15); border-color: var(--red);
      color: var(--red);
    }
    .btn-on:hover { background: rgba(255,0,51,.28); }
    .btn-off {
      background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.2);
      color: var(--muted);
    }
    .btn-off:hover { background: rgba(255,255,255,.1); }

    /* Feedback */
    .msg { margin-top: 1rem; padding: .65rem 1rem; border-radius: 8px;
      font-size: .88rem; font-weight: 700; }
    .msg.ok  { background: rgba(182,255,0,.1); color: var(--lime);
      border: 1px solid rgba(182,255,0,.3); }
    .msg.err { background: rgba(255,62,165,.1); color: var(--pink);
      border: 1px solid rgba(255,62,165,.3); }

    .hint { margin-top: 1.5rem; font-size: .75rem; color: rgba(255,255,255,.2); }
    .hint a { color: rgba(255,255,255,.35); }
  </style>
</head>
<body>
  <div class="card">
    <p class="logo">CRAZYFAMILY</p>
    <p class="subtitle">Live-Stream Steuerung</p>

    <!-- Aktueller Status -->
    <div class="status <?= $isLive ? 'online' : 'offline' ?>">
      <span class="dot"></span>
      <?= $isLive ? '🔴 Gerade LIVE auf TikTok' : '⬛ Kein aktiver Stream' ?>
    </div>

    <!-- Toggle-Formular -->
    <form method="POST" autocomplete="off">
      <label for="pin">PIN eingeben</label>
      <input type="password" id="pin" name="pin" inputmode="numeric"
             placeholder="••••" required autofocus>

      <div class="btn-row">
        <button class="btn btn-on" type="submit" name="action" value="on">
          🔴 GO LIVE
        </button>
        <button class="btn btn-off" type="submit" name="action" value="off">
          ⬛ Stream beenden
        </button>
      </div>
    </form>

    <?php if ($success): ?>
      <p class="msg ok"><?= htmlspecialchars($success) ?></p>
    <?php elseif ($error): ?>
      <p class="msg err"><?= htmlspecialchars($error) ?></p>
    <?php endif; ?>

    <p class="hint">
      Seite bookmarken und vor/nach dem Stream aufrufen.<br>
      <a href="/">← Zur Website</a>
    </p>
  </div>
</body>
</html>
