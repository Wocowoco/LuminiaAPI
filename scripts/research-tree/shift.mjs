// Moves part of the Alchemical Research Tree to make room (or close a gap).
// Every row (or column) value >= --from is moved by --by: node positions, `via` points
// and `badge` positions (and, for columns, `bus` columns too). Lines follow automatically.
//
//   node scripts/research-tree/shift.mjs --rows --from 12 --by 3            # 3 empty rows before row 12
//   node scripts/research-tree/shift.mjs --cols --from 5 --by 1 --dry-run   # show what would change
//
// Only touches research-tree.data.ts. Run validate.mjs afterwards.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = name => args.includes(name);
const value = name => {
  const i = args.indexOf(name);
  return i >= 0 ? Number(args[i + 1]) : NaN;
};

const axis = flag('--rows') ? 'row' : flag('--cols') ? 'col' : null;
const from = value('--from');
const by = value('--by');
if (!axis || Number.isNaN(from) || Number.isNaN(by) || by === 0) {
  console.error('Usage: node scripts/research-tree/shift.mjs (--rows|--cols) --from <n> --by <n> [--dry-run]');
  process.exit(2);
}

const file = join(dirname(fileURLToPath(import.meta.url)), '..', '..',
  'LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree/research-tree.data.ts');
const source = readFileSync(file, 'utf8');
const num = '(-?\\d+(?:\\.\\d+)?)';
const shift = v => {
  const n = Number(v);
  return String(n >= from ? n + by : n);
};

let changes = 0;
const lines = source.split('\n').map((line, i) => {
  // Only data lines: skip comments and the type declarations at the top
  if (/^\s*(\/\/|\*|\/\*\*)/.test(line) || !/(col|row|via|badge|bus)\b/.test(line)) return line;
  let out = line
    .replace(new RegExp(`\\b${axis}: ${num}`, 'g'), (_, v) => `${axis}: ${shift(v)}`)
    .replace(new RegExp(`\\[${num}, ${num}\\]`, 'g'), (_, c, r) =>
      axis === 'row' ? `[${c}, ${shift(r)}]` : `[${shift(c)}, ${r}]`);
  if (axis === 'col') {
    out = out
      .replace(new RegExp(`\\bbus: ${num}`, 'g'), (_, v) => `bus: ${shift(v)}`)
      .replace(new RegExp(`\\bbus\\(('[^']+'), ${num}\\)`, 'g'), (_, id, v) => `bus(${id}, ${shift(v)})`);
  }
  if (out !== line) {
    changes++;
    if (flag('--dry-run')) console.log(`${i + 1}: ${out.trim()}`);
  }
  return out;
});

if (flag('--dry-run')) {
  console.log(`${changes} line(s) would change (dry run)`);
} else {
  writeFileSync(file, lines.join('\n'));
  console.log(`Shifted ${axis}s >= ${from} by ${by}: ${changes} line(s) changed`);
}
