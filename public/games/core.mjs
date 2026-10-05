export const VERSION = '0.0.8';
export const catalogTones = ['words','letters','numbers','patterns','paths','focus'];
export const safeId = value => typeof value === 'string' && /^[a-z][a-z0-9_]{0,47}$/.test(value);
export const languageOf = value => String(value || 'en').toLowerCase().split(/[-_]/)[0];
export function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export function dayNumber(date) {
  if (!validDate(date)) throw new Error('INVALID_DATE');
  return Math.floor(Date.parse(date) / 86400000);
}
export function hash(text) {
  let n = 2166136261;
  for (const c of text) n = Math.imul(n ^ c.codePointAt(0), 16777619);
  return n >>> 0;
}
export function shuffle(items, seed) {
  const out = [...items]; let n = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    n ^= n << 13; n ^= n >>> 17; n ^= n << 5;
    const j = (n >>> 0) % (i + 1); [out[i],out[j]] = [out[j],out[i]];
  }
  return out;
}
// A date-indexed cycle guarantees adjacent days cannot select the same set.
// The seed still varies ordering daily. Keep a published version immutable.
export function dailyIndex(gameId, date, version, count) {
  if (!Number.isInteger(count) || count < 2) throw new Error('DATASET_TOO_SMALL');
  return ((dayNumber(date) + hash(`${gameId}:${version}`)) % count + count) % count;
}
export function validateCatalog(raw, host = {}) {
  if (!Array.isArray(raw)) throw new Error('INVALID_CATALOG');
  const seen = new Set();
  return raw.filter(g => {
    if (!g || !safeId(g.id) || seen.has(g.id)) return false;
    seen.add(g.id);
    if (typeof g.enabled !== 'boolean' || !g.enabled || !safeId(g.nameKey) ||
      !safeId(g.path) || !/^icons\/[a-z0-9_]+\.svg$/.test(g.icon) ||
      !Number.isSafeInteger(g.sortOrder) || !Number.isInteger(g.minBridgeVersion) || g.minBridgeVersion < 1) return false;
    if (g.tone !== undefined && !catalogTones.includes(g.tone)) return false;
    if (g.apps !== undefined && (!Array.isArray(g.apps) || !g.apps.every(x => typeof x === 'string'))) return false;
    if (g.languages !== undefined && g.languages !== 'all' && (!Array.isArray(g.languages) || !g.languages.every(x => typeof x === 'string'))) return false;
    return g.minBridgeVersion <= (host.bridgeVersion ?? 1) &&
      (!g.apps || g.apps.includes(host.appId ?? 'standalone')) &&
      (!g.languages || g.languages === 'all' || g.languages.includes(languageOf(host.language)));
  }).sort((a,b) => a.sortOrder-b.sortOrder || a.id.localeCompare(b.id));
}
export function validateHost(input) {
  if (!input || typeof input !== 'object' || !Number.isInteger(input.bridgeVersion) || input.bridgeVersion < 1 ||
    typeof input.appId !== 'string' || !/^[\w.-]{1,100}$/.test(input.appId) ||
    !validDate(input.date) || typeof input.timezone !== 'string' ||
    typeof input.language !== 'string' || !/^[a-zA-Z]{2,3}([-_][a-zA-Z0-9]{2,8})*$/.test(input.language)) throw new Error('INVALID_HOST');
  try { new Intl.DateTimeFormat('en', {timeZone:input.timezone}); } catch { throw new Error('INVALID_TIMEZONE'); }
  const completions = Object.create(null);
  for (const [id,date] of Object.entries(input.completions || {})) if (safeId(id) && validDate(date)) completions[id] = date;
  return {...input, completions};
}
export function completionStore(storage) {
  const key = 'smartup.games.completions.v1';
  return {
    read() { try { const value = JSON.parse(storage.getItem(key) || '{}'); return Object.fromEntries(Object.entries(value || {}).filter(([id,date]) => safeId(id) && validDate(date))); } catch { return {}; } },
    write(value) { try { storage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } }
  };
}
