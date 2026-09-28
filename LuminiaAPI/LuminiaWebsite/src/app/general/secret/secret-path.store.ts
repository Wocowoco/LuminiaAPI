/**
 * Browser-side bookkeeping for path secrets (secrets solved by visiting pages in order):
 * which ones this player has started (read the directions of), and which pages they visited.
 * Storage can be unavailable (private windows, blocked site data), so every access is guarded.
 */

const ACTIVE_KEY = 'luminia-secret-paths';
const VISITED_KEY = 'luminia-secret-visited';
const MAX_VISITED = 20;

/** Path secrets this player has started, as secretKey -> number of pages in the path. */
export function activePathSecrets(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function activatePathSecret(secretKey: string, pathLength: number): void {
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify({ ...activePathSecrets(), [secretKey]: pathLength }));
  } catch { }
}

export function deactivatePathSecret(secretKey: string): void {
  try {
    const active = activePathSecrets();
    delete active[secretKey];
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
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
