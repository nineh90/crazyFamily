<?php
/*
 * Highscore-API für die CrazyFamily Mini-Games.
 *
 * Leichtgewichtig, ohne Accounts/Login – nur ein frei wählbarer Spitzname.
 * GET  ?game=<id>                 → { "scores": [ {name, score}, ... ] }  (Top 10)
 * POST { game, name, score }      → speichert (validiert) + liefert aktuelle Top 10
 *
 * Hinweis: Bei reinen Client-Games sind Scores nicht manipulationssicher.
 * Diese Validierung ist "best effort" (Whitelist, Cap, Sanitize) – für eine
 * kleine Spaß-Zone bewusst ausreichend, keine harte Betrugssicherheit.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// Erlaubte Spiele + plausibles Score-Maximum je Spiel
$GAMES = [
    'snake'   => 100000,
    'catcher' => 100000,
    'smash'   => 100000,
    'memory'  => 1000,
    'land'    => 999999,   // CrazyFamily Land (HUD zeigt max. 6 Stellen)
    'chomp'   => 999999,   // CrazyFamily Chomp (Labyrinth-Arcade)
    'rush'    => 999999,   // CrazyFamily Rush (3D-Endlosläufer)
    // CrazyFamily Doom hat keinen auslesbaren Score -> bewusst keine Bestenliste
];

$FILE = __DIR__ . '/../data/highscores.json';
$TOP  = 10;

function load_all($file) {
    if (!is_file($file)) return [];
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function top_for($all, $game, $top) {
    $list = isset($all[$game]) && is_array($all[$game]) ? $all[$game] : [];
    usort($list, fn($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));
    return array_slice($list, 0, $top);
}

function fail($code, $msg) {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $game = $_GET['game'] ?? '';
    if (!isset($GAMES[$game])) fail(400, 'unknown game');
    echo json_encode(['scores' => top_for(load_all($FILE), $game, $TOP)]);
    exit;
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body)) fail(400, 'invalid body');

    $game  = $body['game'] ?? '';
    $name  = $body['name'] ?? '';
    $score = $body['score'] ?? null;

    if (!isset($GAMES[$game])) fail(400, 'unknown game');

    // Score: ganzzahlig, 0..Cap
    if (!is_numeric($score)) fail(400, 'invalid score');
    $score = (int) $score;
    if ($score < 0) $score = 0;
    if ($score > $GAMES[$game]) $score = $GAMES[$game];

    // Name: säubern, 3–16 Zeichen, sonst "Anonym"
    $name = trim(strip_tags((string) $name));
    $name = preg_replace('/[\x00-\x1F\x7F]/u', '', $name); // Steuerzeichen raus
    if (function_exists('mb_substr')) $name = mb_substr($name, 0, 16);
    else $name = substr($name, 0, 16);
    if (mb_strlen($name) < 1) $name = 'Anonym';
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');

    // Schreiben mit Sperre, nur Top 10 je Spiel behalten
    $dir = dirname($FILE);
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    $fp = @fopen($FILE, 'c+');
    if (!$fp) fail(500, 'storage unavailable');
    flock($fp, LOCK_EX);
    $raw  = stream_get_contents($fp);
    $all  = json_decode($raw, true);
    if (!is_array($all)) $all = [];
    if (!isset($all[$game]) || !is_array($all[$game])) $all[$game] = [];

    $all[$game][] = ['name' => $name, 'score' => $score, 'ts' => time()];
    usort($all[$game], fn($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));
    $all[$game] = array_slice($all[$game], 0, $TOP);

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($all, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    echo json_encode(['scores' => top_for($all, $game, $TOP)]);
    exit;
}

fail(405, 'method not allowed');
