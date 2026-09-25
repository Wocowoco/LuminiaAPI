// Checks the Alchemical Research Tree data for mistakes the page would only show silently
// (missing lines, overlapping nodes, missing icons). Exits with code 1 when there are errors.
//
//   node scripts/research-tree/validate.mjs
//
// Needs Node 22.18+ (imports the .ts data files directly).

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const treeDir = join(root, 'LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree');
const iconDir = join(root, 'LuminiaAPI/LuminiaWebsite/src/assets/images/infernal-alchemy/research');

const { researchTree } = await import(pathToFileURL(join(treeDir, 'research-tree.data.ts')).href);
const { unlockedResearch } = await import(pathToFileURL(join(treeDir, 'research-progress.ts')).href);

const errors = [];
const warnings = [];
const byId = new Map();
const parentsOf = n => (n.parents ?? []).map(p => typeof p === 'string' ? { from: p } : p);

for (const n of researchTree) {
  if (byId.has(n.id)) errors.push(`Duplicate id "${n.id}"`);
  byId.set(n.id, n);
}

const cells = new Map();
for (const n of researchTree) {
  const key = `${n.col},${n.row}`;
  if (cells.has(key)) errors.push(`"${n.id}" and "${cells.get(key)}" are both at col ${n.col}, row ${n.row}`);
  cells.set(key, n.id);

  if (!existsSync(join(iconDir, n.icon))) errors.push(`"${n.id}": icon "${n.icon}" not found in ${iconDir}`);
  if (n.parents?.length && n.cost === undefined) warnings.push(`"${n.id}" has parents but no cost (drawn without a badge, so it's free once its parents are unlocked)`);

  parentsOf(n).forEach((p, i) => {
    const from = byId.get(p.from) ?? researchTree.find(x => x.id === p.from);
    if (!from) {
      errors.push(`"${n.id}": unknown parent "${p.from}"`);
      return;
    }
    if (from.id === n.id) errors.push(`"${n.id}" lists itself as a parent`);
    // Extra ("also requires") parents are the thin diagonals; they always run left to right
    if (i > 0 && from.col >= n.col) warnings.push(`"${n.id}": extra parent "${from.id}" isn't to its left (thin requirement lines run left to right)`);
  });
}

// Lines that run through a node they don't belong to
const route = (from, to, p) => {
  const start = [from.col, from.row];
  const end = [to.col, to.row];
  if (p.via) return [start, ...p.via, end];
  if (p.bus !== undefined) return [start, [p.bus, from.row], [p.bus, to.row], end];
  if (from.row === to.row || from.col === to.col) return [start, end];
  return [start, [to.col, from.row], end];
};
const onSegment = ([x, y], [x1, y1], [x2, y2]) => {
  const cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
  if (Math.abs(cross) > 1e-6) return false;
  return x >= Math.min(x1, x2) - 1e-6 && x <= Math.max(x1, x2) + 1e-6
      && y >= Math.min(y1, y2) - 1e-6 && y <= Math.max(y1, y2) + 1e-6;
};
for (const n of researchTree) {
  for (const p of parentsOf(n)) {
    const from = byId.get(p.from);
    if (!from) continue;
    const pts = route(from, n, p);
    for (const other of researchTree) {
      if (other.id === n.id || other.id === from.id) continue;
      for (let i = 1; i < pts.length; i++) {
        if (onSegment([other.col, other.row], pts[i - 1], pts[i])) {
          errors.push(`Line "${from.id}" -> "${n.id}" runs through "${other.id}" (col ${other.col}, row ${other.row})`);
          break;
        }
      }
    }
  }
}

// Unlocks
const unlocked = new Set(unlockedResearch);
if (unlocked.size !== unlockedResearch.length) warnings.push('research-progress.ts lists an id more than once');
for (const id of unlocked) {
  const n = byId.get(id);
  if (!n) { errors.push(`research-progress.ts: unknown id "${id}"`); continue; }
  const missing = parentsOf(n).filter(p => !unlocked.has(p.from)).map(p => p.from);
  if (missing.length) warnings.push(`"${id}" is unlocked but its parent(s) ${missing.map(m => `"${m}"`).join(', ')} aren't`);
}

const cols = researchTree.map(n => n.col);
const rows = researchTree.map(n => n.row);
console.log(`${researchTree.length} nodes, ${unlocked.size} unlocked, cols ${Math.min(...cols)}-${Math.max(...cols)}, rows ${Math.min(...rows)}-${Math.max(...rows)}`);
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `${errors.length} error(s)` : 'OK');
process.exit(errors.length ? 1 : 0);
