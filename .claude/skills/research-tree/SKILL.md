---
name: research-tree
description: Edit the Alchemical Research Tree and the "Your Potions" descriptions on the Infernal Alchemy page - unlock or re-lock nodes, add upgrade nodes, add a new potion or Smoozi type (making room by shifting the layout), move or re-route nodes, add icons, and write or change what potions and upgrades do. Use whenever the user wants to change what's in the research tree, what's unlocked, how it's laid out, or a potion's description text.
argument-hint: "[what to change, e.g. 'unlock bandera-fire-2' or 'add a Frost potion between Mana and Smoozies']"
---

# Edit the Alchemical Research Tree

The tree is static data compiled into the Angular app. Changes go live with the next release (no database).

| What | Where |
|---|---|
| Layout, nodes, costs, lines | `LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree/research-tree.data.ts` |
| Which nodes are unlocked | **Database**, table `luminia.alchemicalresearchtreeunlocks` (one row per node id), via `GET`/`PUT api/InfernalAlchemy/research-unlocks`. The DM edits it on the DM page (`/dm/<code>`, "Research unlocks" card). Table script: `scripts/sql/research-unlocks.sql` |
| What potions do: text, stats, rarity, retail price and recipe | `LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree/potion-descriptions.ts` |
| Ingredient prices and the shop modifier (0.8) | `LuminiaAPI/LuminiaWebsite/src/app/infernal-alchemy/research-tree/ingredients.ts` |
| Node icons (96x96) | `LuminiaAPI/LuminiaWebsite/src/assets/images/infernal-alchemy/research/` |
| Rendering | `research-tree.component.*` (tree), `potion-cards.component.*` and `potion-text.component.ts` (descriptions), `potions.ts` (applies upgrades to the text); normally untouched |
| Helper scripts | `scripts/research-tree/` (below) |

Always run the validator after an edit and fix what it reports:

```powershell
node scripts/research-tree/validate.mjs
node scripts/research-tree/validate.mjs --unlocked healing,healing-1,mana   # also check a list of unlocked ids
```

It reports unknown or duplicate ids, two nodes on one cell, lines that run through another node, missing icons, unknown ids in the progress file, extra parents that aren't to the left of their node, and unlocked nodes whose parents aren't unlocked. For descriptions it reports unknown `{placeholders}`, upgrade stats a description doesn't use yet, unlocked potions without a description, and unlocked special upgrades that add nothing to the text.

## How the data works

Each node is one object in `researchTree`:

```ts
{ id: 'bandera-fire-2', label: '+1d6 fire damage', icon: 'fire-damage.jpg', col: 5, row: 8, cost: 1,
  parents: ['bandera-fire-1', { from: 'bandera-lingering-1', via: [] }] },
```

- **`col` / `row`:** grid cell. Columns run to the right and rows run downwards. Halves are allowed (e.g. `row: 11.5`). One column is 104 SVG units and one row is 120.
- **`parents`:** a node is unlockable once **all** parents are unlocked.
  - The **first** parent is the main line, and the node's `cost` badge is drawn on it.
  - Any **extra** parents are the thin "also requires" lines. They always run **left to right**: the parent must be in a column to the left of the node. Use `{ from: 'id', via: [] }` for a straight diagonal. Add `thick: true` to an extra parent when it should be a full line instead (like Hybrid Potion's line from `mana-1`: it needs both potions' upgrades equally).
- **Line routing** (per parent):
  - Default: straight if the node is in the same row or column as the parent, otherwise horizontal from the parent, then vertical into the node.
  - `bus('id', col)`: go right to column `col`, along it, then into the node. This is how hubs fan out: Smoozies uses bus column 1, Bandera uses 3, Hybrid uses 2.5.
  - `{ from: 'id', via: [[c, r], ...] }`: explicit bend points. Use `via: []` for a straight line.
- **`cost`:** Research Points. Leave it out for starting nodes. A node with parents but no cost is free (the validator warns about it).
- **`major: true`:** potions and Smoozi types, drawn as a large rounded square instead of a hexagon.
- **`continues: true`:** draws an arrow after the node ("more to come").
- **`badge: [c, r]`:** moves the cost badge. Use it when the default spot (the middle of the main line's last segment) lands on a junction or another badge.
- **`effect: { stat: amount }`:** what the upgrade adds to its potion's description stats once unlocked, e.g. `{ damage: 1 }` (one extra damage die), `{ radius: 5 }`, `{ dc: 1 }`, `{ healing: 1 }`, `{ slots1: 1 }`, `{ lingering: 1 }`, `{ duration: 1 }`. The potion is the nearest `major` node up the chain of first parents. Under a group without its own description (Smoozies), the upgrade applies to every potion in the group, which is how "+1 Save DC to all Smoozies" works.
- **`effectText`:** a sentence added to the potion's description once the upgrade is unlocked. Use it for special upgrades (Set targets on fire, Blindness, …). It can use the potion's `{stat}` placeholders and `**bold**`.
- Shared labels use the constants at the top (`HEAL`, `SLOT_1`, `SLOT_2`, `RADIUS`, `LINGER`, `SAVE_DC`, `DURATION`). Add a constant when a new label repeats.
- **Ids** are `<section>-<effect>[-<n>]`, e.g. `moroz-cold-3` or `halima-dc-b`. The database stores unlocks by id, so don't rename an existing id without giving the user the matching SQL, e.g. `UPDATE luminia.alchemicalresearchtreeunlocks SET NodeId = 'new-id' WHERE NodeId = 'old-id';`. Removing a node leaves a stale row, which the page ignores; give the `DELETE` too.

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

Unlocks live in the production database, not in the code, so don't try to change them yourself. The DM ticks nodes on the DM page (`/dm/<code>` → "Research unlocks", then Save). If the user asks you to unlock something, point them there, or give them SQL for the MySQL database:

```sql
INSERT IGNORE INTO luminia.alchemicalresearchtreeunlocks (NodeId, CreationUser, CreationDate) VALUES ('bandera-fire-2', 'LuminiaDb', NOW());
DELETE FROM luminia.alchemicalresearchtreeunlocks WHERE NodeId = 'bandera-fire-2';
```

Many labels repeat ("+1 Save DC" appears 16 times), so if the user names a node by label, find the matching id by section and position. If it's still ambiguous, confirm with AskUserQuestion. Starting nodes (no cost) need a row too once the party has them. To check a list of unlocked ids (e.g. from `SELECT NodeId FROM luminia.alchemicalresearchtreeunlocks`) against the tree, run the validator with `--unlocked id1,id2,...`. It warns about unlocked nodes whose parents aren't unlocked.

### Add upgrade nodes to an existing branch

1. Pick a free cell. Usually that's the next column in the chain's row; for a new branch, a new row under the hub.
2. Add the node object near its section, with the parents, cost, icon and `effect` (or `effectText`) so it shows up in its potion's description. Reuse an existing icon where the effect matches (list the icon folder).
3. If a chain continues past the node, move `continues: true` from the old last node to the new one.
4. If there's no free row, shift the layout first (next task).
5. Validate.

### Write or change what a potion does

Potion descriptions show in the "Your Potions" cards (every unlocked potion that has a description) and in the tree's details strip when a potion node is tapped. They live in `potion-descriptions.ts`, keyed by the potion's node id:

```ts
'bandera': {
  rarity: 'uncommon',
  text: 'As an **action**, you throw this potion ... dealing **{damage} fire damage** to all creatures '
    + '**within {radius} of the impact**, or half as much on a successful **DC{dc} Dexterity saving throw**.',
  stats: {
    damage: { base: { dice: 1, sides: 6 } },    // dice stat: each +1 adds a die -> 2d6
    radius: { base: 5, format: feet },           // number stat with a formatter -> "10ft"
    dc: { base: 12 },                            // plain number -> "13"
  },
},
```

- The user usually pastes the text from Obsidian (`**bold**` and `<mark>` highlights). Keep their `**bold**`, drop the `<mark>` styling, and write the **base** (un-upgraded) values as `{stat}` placeholders. The page highlights values that upgrades raised on its own, with a tooltip giving the base value.
- `rarity`: `common`, `uncommon`, `rare`, `epic` or `legendary`. It sets the card's colour and label (the shared `<app-rarity-card>` from `general/rarity-card/`). Ask the user if they didn't say.
- Dice stats: `{ dice, sides, perDie? }`. `perDie: 1` gives "2d4+2" and grows to "3d4+3".
- Number stats take an optional `format`, e.g. for units or plurals (see `slots1` on the Mana Potion).
- Make sure the upgrade nodes carry matching `effect` names. The validator warns about stats that upgrades change but a description doesn't use yet (e.g. Bandera's `lingering`). Ask the user for the wording, then add a placeholder to the text, or an `effectText` on the upgrade.
- Special upgrades without a number (Set targets on fire, Spiky Crystals, Berserk, …) get an `effectText` once the user supplies the rule text. Until then they show only as a chip on the potion's card.
- If a potion that isn't unlocked yet gets a description, it only shows in the tree's details strip until it's unlocked.

### Brewing costs (recipes, retail prices, ingredient prices)

Each potion card shows, for **one** potion: its **retail price**, the price for **buying the materials from a store** (`SHOP_MODIFIER`, 0.8 in `ingredients.ts`, × retail), and the **ingredient list** (amounts only). Players either gather the ingredients themselves or skip ahead by buying from the store. Herb prices aren't shown; they only drive how much upgrades raise the retail price.

The rules, all per potion:

- `retail` is the base retail price. Each unlocked upgrade raises it by the market price of the extra ingredients it needs, so the shop price rises by 0.8 × that. Both prices on the card are rounded **up** to whole gold; the store price is 0.8 × the rounded retail price, rounded up again.
- Tapping an upgrade node in the tree shows the ingredients it adds per potion (e.g. "+0.5× Emberleaf per potion"). The tree never shows gold prices; those are only on the potion cards.
- `ingredients` is the base recipe for one potion. Potions brewed in pairs use halves (Bandera: 1 Oil + 1 Emberleaf + 1 Shatterbud make two, so 0.5 each).
- `upgradeIngredients: { stat: { ingredient: amount } }`: extras per unlocked upgrade node that changes that stat. Bandera: `damage` +0.5 Emberleaf, `radius` +0.5 Shatterbud, `dc` +25 Redberry, `lingering` +1 Lingervine. The per-potion keying is how the same kind of upgrade can cost different things on different potions: Moroz's Save DC upgrades use Blueberries instead of Redberries.
- Special upgrades without a stat put `ingredients: { ... }` on the node itself (Set targets on fire: +1 Emberleaf).
- Ingredient ids and market prices live in `ingredients.ts`. Add new herbs there; the validator reports unknown ids.
- Amounts raised by upgrades, and the upgraded retail price, get the gold highlight. Tooltips show the base values.

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
