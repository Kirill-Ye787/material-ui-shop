export function readStorage(key, fallback) {
  try { const raw = localStorage.getItem(`forma:${key}`); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
export function writeStorage(key, value) {
  try { localStorage.setItem(`forma:${key}`, JSON.stringify(value)); return true; }
  catch { return false; }
}
