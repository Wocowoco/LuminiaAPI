---
name: research-tree
description: Edit the Alchemical Research Tree on the Infernal Alchemy page - unlock or re-lock nodes, add upgrade nodes, add a new potion or Smoozi type (making room by shifting the layout), move or re-route nodes, and add icons. Use whenever the user wants to change what's in the research tree, what's unlocked, or how it's laid out.
argument-hint: "[what to change, e.g. 'unlock bandera-fire-2' or 'add a Frost potion between Mana and Smoozies']"
---

# Edit the Alchemical Research Tree

The tree is static data compiled into the Angular app. Changes go live with the next release (no database).

| What | Where |
|---|---|
| Layout, nodes, costs, lines | `LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree/research-tree.data.ts` |
| Which nodes are unlocked | `LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree/research-progress.ts` |
| Node icons (96x96) | `LuminiaAPI/LuminiaWebsite/src/assets/images/infernal-alchemy/research/` |
| Rendering (states, colours, pan/zoom) | `research-tree.component.{ts,html,css}` in the same folder; normally untouched |
| Helper scripts | `scripts/research-tree/` (below) |

Always run the validator after an edit and fix what it reports:

```powershell
node scripts/research-tree/validate.mjs
```

It reports unknown or duplicate ids, two nodes on one cell, lines that run through another node, missing icons, unknown ids in the progress file, extra parents that aren't to the left of their node, and unlocked nodes whose parents aren't unlocked.

## How the data works

Each node is one object in `researchTree`:

```ts
{ id: 'bandera-fire-2', label: '+1d6 fire damage', icon: 'fire-damage.jpg', col: 5, row: 8, cost: 1,
  parents: ['bandera-fire-1', { from: 'bandera-lingering-1', via: [] }] },
```

- **`col` / `row`:** grid cell. Columns run to the right and rows run downwards. Halves are allowed (e.g. `row: 11.5`). One column is 104 SVG units and one row is 120.
- **`parents`:** a node is unlockable once **all** parents are unlocked.
  - The **first** parent is the main line, and the node's `cost` badge is drawn on it.
  - Any **extra** parents are the thin "also requires" lines. They always run **left to right**: the parent must be in a column to the left of the node. Use `{ from: 'id', via: [] }` for a straight diagonal.
- **Line routing** (per parent):
  - Default: straight if the node is in the same row or column as the parent, otherwise horizontal from the parent, then vertical into the node.
  - `bus('id', col)`: go right to column `col`, along it, then into the node. This is how hubs fan out: Smoozies uses bus column 1, Bandera uses 3, Hybrid uses 2.5.
  - `{ from: 'id', via: [[c, r], ...] }`: explicit bend points. Use `via: []` for a straight line.
- **`cost`:** Research Points. Leave it out for starting nodes. A node with parents but no cost is free (the validator warns about it).
- **`major: true`:** potions and Smoozi types, drawn as a large rounded square instead of a hexagon.
- **`continues: true`:** draws an arrow after the node ("more to come").
- **`badge: [c, r]`:** moves the cost badge. Use it when the default spot (the middle of the main line's last segment) lands on a junction or another badge.
- Shared labels use the constants at the top (`HEAL`, `SLOT_1`, `SLOT_2`, `RADIUS`, `LINGER`, `SAVE_DC`, `DURATION`). Add a constant when a new label repeats.
- **Ids** are `<section>-<effect>[-<n>]`, e.g. `moroz-cold-3` or `halima-dc-b`. Ids are what the progress file references, so don't rename existing ids unless the progress file is updated too.

Node states on the page follow from the data: unlocked (gold), available (teal: all parents unlocked), locked (grey). A dotted teal line means the parent is unlocked but the node still needs another parent.

### Current layout

| Section | Rows | Notes |
|---|---|---|
| Healing | 0 | `healing` (0,0) → `healing-1` → Greater Healing chain along row 0 |
| Hybrid | 1-3 | `hybrid` (2,2) needs `healing-1` and `mana-1` (both via bus col 1); its branches use bus col 2.5 |
| Mana | 4-7 | `mana` (0,4); `mana-*` down col 1; Greater Mana chain along row 4, then down col 3 |
| Smoozies hub | 7-21 | root `smoozies` (0,14); bus col 1 feeds the Smoozi types in col 2 |
| Bandera (fire) | 7-11 | `bandera` (2,9); bus col 3 → one branch per row, starting in col 4 |
| Catapultable / +1 DC all | 11.5 / 16.5 | single nodes on the Smoozies bus |
| Moroz (cold) | 12-16 | `moroz` (2,14); children start in col 3 |
| Halima (psychic) | 17-21 | `halima` (2,19); `halima-deafness` (3,19) is the hub for its branches |

Re-read the data file before relying on this table; it may have changed.

### Spacing rules

- A label (up to 2 lines) sits **above** each node. A node directly below another in the same column needs a full row between them, and never a half row.
- Half rows are fine for a node whose column is clear above and below (like Catapultable at 11.5).
- Keep at least one empty row between sections.
- Keep the Smoozi types and potions (`major`) in col 2 and their upgrades from col 3/4 rightwards, so the columns stay aligned.

## Tasks

### Change what's unlocked

Edit the `unlockedResearch` list in `research-progress.ts`: add ids to unlock, remove ids to re-lock. Many labels repeat ("+1 Save DC" appears 16 times), so if the user names a node by label, find the matching id by section and position. If it's still ambiguous, confirm with AskUserQuestion. Starting nodes (no cost) need to be listed too once the party has them. Run the validator: a warning that an unlocked node's parents aren't unlocked usually means an id was forgotten.

### Add upgrade nodes to an existing branch

1. Pick a free cell. Usually that's the next column in the chain's row; for a new branch, a new row under the hub.
2. Add the node object near its section, with the parents, cost and icon. Reuse an existing icon where the effect matches (list the icon folder).
3. If a chain continues past the node, move `continues: true` from the old last node to the new one.
4. If there's no free row, shift the layout first (next task).
5. Validate.

### Insert a new potion or Smoozi type (make room)

1. Sketch the new section on the grid: which rows and columns it needs, and where it attaches (a parent node, or a hub's bus).
2. Make room by shifting everything from the insertion row down by the section's height plus one spacing row. Dry-run first:

   ```powershell
   node scripts/research-tree/shift.mjs --rows --from <row> --by <n> --dry-run
   node scripts/research-tree/shift.mjs --rows --from <row> --by <n>
   ```

   This moves every `row`, and every `via` and `badge` point, at or below `<row>`. Lines and bus columns follow automatically. Use `--cols` the same way to make horizontal room (it also moves `bus` columns). A negative `--by` closes a gap.
3. Add the section's nodes: the potion or Smoozi type is `major: true` in col 2, attached to its parent (e.g. `bus('smoozies', 1)`), with its upgrades to the right.
4. Check the parent hub still looks centred. The Smoozies root sits level with a middle Smoozi type; move it (`row`) if the hub's range grew lopsided.
5. Validate.

### Move or re-route

Change `col`/`row` on the node; lines follow. Then check any `via`, `badge` or `bus` values that referenced the old position, including on the node's children. Validate, since it catches lines crossing nodes.

### Add an icon

Icons come from the packs in `D:\DnD\Icons` (potions: `potionicons`; effects: `skilliconpack`, `spellbookpage01`-`09`, `witchcrafticons`, `necromancericons`).

1. Render numbered contact sheets and look at them with the Read tool:

   ```powershell
   ./scripts/research-tree/icon-sheet.ps1 -Pack skilliconpack
   ```

   This prints the sheet PNGs plus a `.txt` index (number → file path).
2. Pick an icon. If the user hasn't chosen one, suggest a pick or two and let them decide.
3. Import it:

   ```powershell
   ./scripts/research-tree/icon.ps1 -Name frost-nova -Source '<path from the index>'
   ```

   Transparent icons become `.png` and opaque ones `.jpg`. The script prints the file name to use as `icon`.

   Name icons by effect (`cold-damage`) or potion (`potion-mana`), and reuse one icon for every node with the same effect.

## Verify and wrap up

1. `node scripts/research-tree/validate.mjs` must print `OK`. Mention any warnings to the user.
2. For layout changes, look at the result: start the `website-live-api` preview (production build against the live API, read-only here), open `/infernal-alchemy`, and pan to the changed area. Check that labels don't overlap lines or badges, and that line colours are right (gold = unlocked path, teal = available).
3. Summarise what changed: nodes added or moved, and unlocks by label and section, not just ids.
4. Don't commit unless the user asks. Changes reach the site with the next release (see the `bump-version` skill and `./scripts/package.ps1`).

If you change how lines are routed in `research-tree.component.ts` (`route()`), make the same change in `scripts/research-tree/validate.mjs`, which has its own copy for the line-crossing check.
