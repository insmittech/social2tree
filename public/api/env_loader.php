<?php
// Function to load .env file if getenv() doesn't work (e.g. some shared hosts)
// Function to load .env file
function loadEnv($path) {
    if (!file_exists($path) || !is_readable($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) {
            continue;
        }

        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            // Strip quotes if present
            $value = trim($value, '"\'');

            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
    return true;
}

// Order of preference for .env location
$env_loaded = false;
$env_locations = [
    __DIR__ . '/../../.env', // Root (standard local)
    __DIR__ . '/../.env',    // One level up (standard server if public/api is in api/)
    __DIR__ . '/.env'        // Current directory (fallback)
];

foreach ($env_locations as $location) {
    if (loadEnv($location)) {
        $env_loaded = true;
        break;
    }
}
?>
