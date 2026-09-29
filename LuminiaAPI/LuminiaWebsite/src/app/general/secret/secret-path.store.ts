/**
 * Browser-side bookkeeping for secrets solved by doing steps in order: path secrets (visiting pages)
 * and sequence secrets (clicking things on a page). Tracks which ones this player has started
 * (read the directions of), and which pages they visited.
 * Storage can be unavailable (private windows, blocked site data), so every access is guarded.
 */

export type WalkedKind = 'path' | 'sequence';

const ACTIVE_KEYS: Record<WalkedKind, string> = {
  path: 'luminia-secret-paths',
  sequence: 'luminia-secret-sequences',
};
const VISITED_KEY = 'luminia-secret-visited';
const MAX_VISITED = 20;

/** Secrets of this kind the player has started, as secretKey -> number of steps. */
export function activeSecrets(kind: WalkedKind): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_KEYS[kind]) ?? '{}');
  } catch {
    return {};
  }
}

export function activateSecret(kind: WalkedKind, secretKey: string, length: number): void {
  try {
    localStorage.setItem(ACTIVE_KEYS[kind], JSON.stringify({ ...activeSecrets(kind), [secretKey]: length }));
  } catch { }
}

export function deactivateSecret(kind: WalkedKind, secretKey: string): void {
  try {
    const active = activeSecrets(kind);
    delete active[secretKey];
    localStorage.setItem(ACTIVE_KEYS[kind], JSON.stringify(active));
  } catch { }
}

/**
 * Adds a page to the pages visited in this tab and returns them, oldest first.
 * Kept in sessionStorage so typing an address (a full page load) doesn't lose the trail.
 */
export function recordVisit(page: string): string[] {
  let visited: string[] = [];
  try {
    visited = JSON.parse(sessionStorage.getItem(VISITED_KEY) ?? '[]');
  } catch { }

  if (visited[visited.length - 1] !== page) {
    visited = [...visited, page].slice(-MAX_VISITED);
  }

  try {
    sessionStorage.setItem(VISITED_KEY, JSON.stringify(visited));
  } catch { }
  return visited;
}

/** '/infernal-alchemy?x=1#top' -> 'infernal-alchemy'; '/' -> 'home'. */
export function pageOf(url: string): string {
  const path = url.split(/[?#]/)[0].replace(/^\/+|\/+$/g, '');
  return path === '' ? 'home' : path;
}
