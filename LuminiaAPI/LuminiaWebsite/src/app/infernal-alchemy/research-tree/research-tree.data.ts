/**
 * The Alchemical Research Tree.
 *
 * Positions are grid cells (`col` to the right, `row` downwards; halves are allowed).
 * A node can be unlocked once ALL of its parents are unlocked; the cost badge is drawn
 * on the line from its first parent.
 *
 * Lines run horizontally from the parent, then vertically into the node. `bus` makes a line
 * go right to that column first, along it, then into the node (how hubs fan out). `via` routes
 * a line through explicit grid points instead; `via: []` draws a straight (diagonal) line.
 *
 * Icons live in src/assets/images/infernal-alchemy/research/.
 * Which nodes are unlocked is kept separately in research-progress.ts.
 */

export type GridPoint = [col: number, row: number];

export interface ResearchParent {
  from: string;
  bus?: number;
  via?: GridPoint[];
}

export interface ResearchNode {
  id: string;
  label: string;
  icon: string;
  col: number;
  row: number;
  /** Research Points needed to unlock. Leave out for starting nodes. */
  cost?: number;
  parents?: (string | ResearchParent)[];
  /** Potions and Smoozi types: drawn as a larger square instead of a hexagon. */
  major?: boolean;
  /** Draws an arrow after the node: the branch continues beyond what's shown. */
  continues?: boolean;
  /** Overrides where the cost badge is drawn. */
  badge?: GridPoint;
}

const HEAL = '+1d4+1 Healing';
const SLOT_1 = '+1 Lv.1 Spellslot restored';
const SLOT_2 = '+1 Lv.2 Spellslot restored';
const RADIUS = '+5ft radius';
const LINGER = '+1 turn lingering';
const SAVE_DC = '+1 Save DC';
const DURATION = '+1 turn duration';

const bus = (from: string, col: number): ResearchParent => ({ from, bus: col });

export const researchTree: ResearchNode[] = [
  // Healing
  { id: 'healing', label: 'Potion of Healing', icon: 'potion-healing.png', col: 0, row: 0, major: true },
  { id: 'healing-1', label: HEAL, icon: 'healing.jpg', col: 1, row: 0, cost: 1, parents: ['healing'] },
  { id: 'greater-healing', label: 'Potion of Greater Healing', icon: 'potion-greater-healing.png', col: 2, row: 0, cost: 2, parents: ['healing-1'], major: true },
  { id: 'greater-healing-1', label: HEAL, icon: 'healing.jpg', col: 3, row: 0, cost: 1, parents: ['greater-healing'] },
  { id: 'greater-healing-2', label: HEAL, icon: 'healing.jpg', col: 4, row: 0, cost: 2, parents: ['greater-healing-1'] },
  { id: 'greater-healing-3', label: HEAL, icon: 'healing.jpg', col: 5, row: 0, cost: 2, parents: ['greater-healing-2'], continues: true },

  // Hybrid
  { id: 'hybrid', label: 'Hybrid Potion', icon: 'potion-hybrid.png', col: 2, row: 2, cost: 2, major: true,
    parents: [bus('healing-1', 1), bus('mana-1', 1)] },
  { id: 'hybrid-heal-1', label: HEAL, icon: 'healing.jpg', col: 3, row: 1, cost: 1, parents: [bus('hybrid', 2.5)], badge: [2.5, 1.5] },
  { id: 'hybrid-heal-2', label: HEAL, icon: 'healing.jpg', col: 4, row: 1, cost: 2, parents: ['hybrid-heal-1'] },
  { id: 'hybrid-heal-3', label: HEAL, icon: 'healing.jpg', col: 5, row: 1, cost: 2, parents: ['hybrid-heal-2'] },
  { id: 'hybrid-slot-1', label: SLOT_1, icon: 'spellslot-1.jpg', col: 3, row: 3, cost: 1, parents: [bus('hybrid', 2.5)], badge: [2.5, 2.5] },
  { id: 'hybrid-slot-2', label: SLOT_1, icon: 'spellslot-1.jpg', col: 4, row: 3, cost: 3, parents: ['hybrid-slot-1'] },
  { id: 'hybrid-slot-3', label: SLOT_1, icon: 'spellslot-1.jpg', col: 5, row: 3, cost: 3, parents: ['hybrid-slot-2'] },
  { id: 'hybrid-slot2-1', label: SLOT_2, icon: 'spellslot-2.jpg', col: 4, row: 2, cost: 2, parents: ['hybrid-slot-2'] },
  { id: 'hybrid-slot2-2', label: SLOT_2, icon: 'spellslot-2.jpg', col: 5, row: 2, cost: 3, parents: ['hybrid-slot2-1'] },

  // Mana
  { id: 'mana', label: 'Mana Potion', icon: 'potion-mana.png', col: 0, row: 4, major: true },
  { id: 'mana-1', label: SLOT_1, icon: 'spellslot-1.jpg', col: 1, row: 4, cost: 1, parents: ['mana'] },
  { id: 'mana-2', label: SLOT_1, icon: 'spellslot-1.jpg', col: 1, row: 5, cost: 2, parents: ['mana-1'] },
  { id: 'mana-3', label: SLOT_1, icon: 'spellslot-1.jpg', col: 1, row: 6, cost: 3, parents: ['mana-2'] },
  { id: 'mana-4', label: SLOT_1, icon: 'spellslot-1.jpg', col: 1, row: 7, cost: 4, parents: ['mana-3'] },
  { id: 'greater-mana', label: 'Greater Mana Potion', icon: 'potion-greater-mana.png', col: 2, row: 4, cost: 2, parents: ['mana-1'], major: true },
  { id: 'greater-mana-1', label: SLOT_2, icon: 'spellslot-2.jpg', col: 3, row: 4, cost: 2, parents: ['greater-mana'], continues: true },
  { id: 'greater-mana-2', label: SLOT_2, icon: 'spellslot-2.jpg', col: 3, row: 5, cost: 3, parents: ['greater-mana-1'] },
  { id: 'greater-mana-3', label: SLOT_2, icon: 'spellslot-2.jpg', col: 3, row: 6, cost: 4, parents: ['greater-mana-2'] },

  // Smoozies
  { id: 'smoozies', label: 'Smoozies', icon: 'smoozies.png', col: 0, row: 14, major: true },
  { id: 'catapult', label: 'Catapultable Smoozies', icon: 'catapult.jpg', col: 2, row: 11.5, cost: 5, parents: [bus('smoozies', 1)] },
  { id: 'save-dc-all', label: '+1 Save DC to all Smoozies', icon: 'save-dc-all.jpg', col: 2, row: 16.5, cost: 7, parents: [bus('smoozies', 1)] },

  // Bandera Smoozi (fire)
  { id: 'bandera', label: 'Bandera Smoozi', icon: 'smoozi-bandera.png', col: 2, row: 9, cost: 2, parents: [bus('smoozies', 1)], major: true },
  { id: 'bandera-radius-1', label: RADIUS, icon: 'fire-radius.jpg', col: 4, row: 7, cost: 1, parents: [bus('bandera', 3)] },
  { id: 'bandera-radius-2', label: RADIUS, icon: 'fire-radius.jpg', col: 5, row: 7, cost: 1, parents: ['bandera-radius-1'] },
  { id: 'bandera-radius-3', label: RADIUS, icon: 'fire-radius.jpg', col: 6, row: 7, cost: 2, parents: ['bandera-radius-2'] },
  { id: 'bandera-fire-1', label: '+1d6 fire damage', icon: 'fire-damage.jpg', col: 4, row: 8, cost: 1, parents: [bus('bandera', 3)] },
  { id: 'bandera-fire-2', label: '+1d6 fire damage', icon: 'fire-damage.jpg', col: 5, row: 8, cost: 1, parents: ['bandera-fire-1', { from: 'bandera-lingering-1', via: [] }] },
  { id: 'bandera-fire-3', label: '+1d6 fire damage', icon: 'fire-damage.jpg', col: 6, row: 8, cost: 2, parents: ['bandera-fire-2'] },
  { id: 'bandera-fire-4', label: '+1d6 fire damage', icon: 'fire-damage.jpg', col: 7, row: 8, cost: 2, parents: ['bandera-fire-3', { from: 'bandera-radius-3', via: [] }] },
  { id: 'bandera-fire-5', label: '+1d6 fire damage', icon: 'fire-damage.jpg', col: 8, row: 8, cost: 3, parents: ['bandera-fire-4', { from: 'bandera-dc-4', via: [[8, 9.4]] }] },
  { id: 'bandera-lingering-1', label: LINGER, icon: 'fire-lingering.jpg', col: 4, row: 9, cost: 1, parents: [bus('bandera', 3)] },
  { id: 'bandera-lingering-2', label: LINGER, icon: 'fire-lingering.jpg', col: 5, row: 9, cost: 1, parents: ['bandera-lingering-1'] },
  { id: 'bandera-lingering-3', label: LINGER, icon: 'fire-lingering.jpg', col: 6, row: 9, cost: 2, parents: ['bandera-lingering-2'] },
  { id: 'bandera-dc-1', label: SAVE_DC, icon: 'save-dc.jpg', col: 4, row: 10, cost: 1, parents: [bus('bandera', 3)] },
  { id: 'bandera-dc-2', label: SAVE_DC, icon: 'save-dc.jpg', col: 5, row: 10, cost: 1, parents: ['bandera-dc-1'] },
  { id: 'bandera-dc-3', label: SAVE_DC, icon: 'save-dc.jpg', col: 6, row: 10, cost: 1, parents: ['bandera-dc-2'] },
  { id: 'bandera-dc-4', label: SAVE_DC, icon: 'save-dc.jpg', col: 7, row: 10, cost: 1, parents: ['bandera-dc-3'] },
  { id: 'bandera-dc-5', label: SAVE_DC, icon: 'save-dc.jpg', col: 8, row: 10, cost: 2, parents: ['bandera-dc-4'] },
  { id: 'bandera-dc-6', label: SAVE_DC, icon: 'save-dc.jpg', col: 9, row: 10, cost: 2, parents: ['bandera-dc-5'] },
  { id: 'bandera-set-on-fire', label: 'Set targets on fire', icon: 'set-on-fire.jpg', col: 4, row: 11, cost: 3, parents: [bus('bandera', 3)] },

  // Moroz Smoozi (cold)
  { id: 'moroz', label: 'Moroz Smoozi', icon: 'smoozi-moroz.png', col: 2, row: 14, cost: 3, parents: [bus('smoozies', 1)], major: true },
  { id: 'moroz-radius-1', label: RADIUS, icon: 'cold-radius.jpg', col: 3, row: 13, cost: 1, parents: ['moroz'] },
  { id: 'moroz-radius-2', label: RADIUS, icon: 'cold-radius.jpg', col: 4, row: 13, cost: 1, parents: ['moroz-radius-1'] },
  { id: 'moroz-radius-3', label: RADIUS, icon: 'cold-radius.jpg', col: 5, row: 13, cost: 1, parents: ['moroz-radius-2'] },
  { id: 'moroz-dc-2', label: '+2 Save DC', icon: 'save-dc.jpg', col: 3, row: 12, cost: 2, parents: ['moroz-radius-1'] },
  { id: 'moroz-spiky', label: 'Spiky Crystals', icon: 'spiky-crystals.jpg', col: 4, row: 12, cost: 2, parents: ['moroz-radius-2'] },
  { id: 'moroz-dc-a', label: SAVE_DC, icon: 'save-dc.jpg', col: 5, row: 12, cost: 1, parents: [{ from: 'moroz-radius-2', via: [] }] },
  { id: 'moroz-dc-b', label: SAVE_DC, icon: 'save-dc.jpg', col: 6, row: 12, cost: 1, parents: ['moroz-dc-a'] },
  { id: 'moroz-dc-c', label: SAVE_DC, icon: 'save-dc.jpg', col: 7, row: 12, cost: 2, parents: ['moroz-dc-b'] },
  { id: 'moroz-lingering-1', label: LINGER, icon: 'cold-lingering.jpg', col: 4, row: 14, cost: 1, parents: ['moroz'], badge: [3.5, 14] },
  { id: 'moroz-lingering-2', label: LINGER, icon: 'cold-lingering.jpg', col: 5, row: 14, cost: 2, parents: ['moroz-lingering-1'] },
  { id: 'moroz-lingering-3', label: LINGER, icon: 'cold-lingering.jpg', col: 6, row: 14, cost: 2, parents: ['moroz-lingering-2'] },
  { id: 'moroz-cold-1', label: '+1d4 cold damage', icon: 'cold-damage.jpg', col: 3, row: 15, cost: 1, parents: ['moroz'] },
  { id: 'moroz-cold-2', label: '+1d4 cold damage', icon: 'cold-damage.jpg', col: 4, row: 15, cost: 1, parents: ['moroz-cold-1'] },
  { id: 'moroz-cold-3', label: '+1d4 cold damage', icon: 'cold-damage.jpg', col: 5, row: 15, cost: 2, parents: ['moroz-cold-2'] },
  { id: 'moroz-cold-4', label: '+1d4 cold damage', icon: 'cold-damage.jpg', col: 3, row: 16, cost: 2, parents: ['moroz-cold-1'] },
  { id: 'moroz-dc-d', label: SAVE_DC, icon: 'save-dc.jpg', col: 5, row: 16, cost: 2, parents: ['moroz-cold-4'] },
  { id: 'moroz-feet-freezing', label: 'Feet Freezing', icon: 'feet-freezing.jpg', col: 7, row: 16, cost: 2, parents: ['moroz-dc-d'] },
  { id: 'moroz-encasing-ice', label: 'Encasing Ice', icon: 'encasing-ice.jpg', col: 8, row: 15, cost: 2, badge: [8, 16],
    parents: [{ from: 'moroz-feet-freezing', via: [[8, 16]] },
              { from: 'moroz-cold-3', via: [[5.25, 15.25], [7.75, 15.25]] },
              { from: 'moroz-dc-b', via: [[6, 13.6]] }] },

  // Halima Smoozi (psychic)
  { id: 'halima', label: 'Halima Smoozi', icon: 'smoozi-halima.png', col: 2, row: 19, cost: 5, parents: [bus('smoozies', 1)], major: true },
  { id: 'halima-deafness', label: 'Deafness', icon: 'deafness.jpg', col: 3, row: 19, cost: 1, parents: ['halima'] },
  { id: 'halima-dc-top', label: SAVE_DC, icon: 'save-dc.jpg', col: 3, row: 17, cost: 1, parents: ['halima-deafness'], badge: [3, 17.5] },
  { id: 'halima-duration-a', label: DURATION, icon: 'duration.jpg', col: 4, row: 18, cost: 1, parents: [bus('halima-deafness', 3)] },
  { id: 'halima-dc-a', label: SAVE_DC, icon: 'save-dc.jpg', col: 5, row: 18, cost: 2, parents: ['halima-duration-a'] },
  { id: 'halima-duration-b', label: DURATION, icon: 'duration.jpg', col: 5, row: 17, cost: 1, parents: [bus('halima-duration-a', 4)], badge: [4, 17] },
  { id: 'halima-blindness', label: 'Blindness', icon: 'blindness.jpg', col: 6, row: 17, cost: 2, parents: ['halima-duration-b'] },
  { id: 'halima-duration-1', label: DURATION, icon: 'duration.jpg', col: 4, row: 19, cost: 1, parents: ['halima-deafness'] },
  { id: 'halima-duration-2', label: DURATION, icon: 'duration.jpg', col: 5, row: 19, cost: 1, parents: ['halima-duration-1'] },
  { id: 'halima-dc-1', label: SAVE_DC, icon: 'save-dc.jpg', col: 6, row: 19, cost: 2, parents: ['halima-duration-2'] },
  { id: 'halima-psychic-top', label: '+1d8 psychic damage', icon: 'psychic-damage.jpg', col: 6, row: 18, cost: 3, parents: ['halima-dc-1'] },
  { id: 'halima-berserk', label: 'Berserk', icon: 'berserk.jpg', col: 8, row: 19, cost: 3,
    parents: ['halima-dc-1', { from: 'halima-blindness', via: [] }, { from: 'halima-charming', via: [[7, 20]] }] },
  { id: 'halima-psychic-1', label: '+1d8 psychic damage', icon: 'psychic-damage.jpg', col: 3, row: 21, cost: 1, parents: ['halima-deafness'] },
  { id: 'halima-duration-c', label: DURATION, icon: 'duration.jpg', col: 5, row: 21, cost: 1, parents: ['halima-psychic-1'] },
  { id: 'halima-dc-b', label: SAVE_DC, icon: 'save-dc.jpg', col: 6, row: 21, cost: 2, parents: ['halima-duration-c'] },
  { id: 'halima-dc-c', label: SAVE_DC, icon: 'save-dc.jpg', col: 7, row: 21, cost: 3, parents: ['halima-dc-b'] },
  { id: 'halima-psychic-2', label: '+1d8 psychic damage', icon: 'psychic-damage.jpg', col: 4, row: 20, cost: 1, parents: [bus('halima-psychic-1', 4)], badge: [4, 20.5] },
  { id: 'halima-dc-e', label: SAVE_DC, icon: 'save-dc.jpg', col: 5, row: 20, cost: 1, parents: ['halima-psychic-2'] },
  { id: 'halima-charming', label: 'Charming', icon: 'charming.jpg', col: 6, row: 20, cost: 2, parents: ['halima-dc-e'] },
];
