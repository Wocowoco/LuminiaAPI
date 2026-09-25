import type { Rarity } from '../../general/rarity-card/rarity-card.component';

/**
 * What each potion does, shown in the "Your potions" cards and when tapping a potion in the tree.
 * Keyed by the potion's node id in research-tree.data.ts.
 *
 * `text` uses **bold** and {stat} placeholders. Each stat has a base value; unlocked upgrade nodes
 * add to it through their `effect` (e.g. { damage: 1 }), and values above base are highlighted.
 * A dice stat grows by whole dice: { dice: 2, sides: 4, perDie: 1 } is 2d4+2, one upgrade makes it 3d4+3.
 */

export interface DiceStat {
  dice: number;
  sides: number;
  /** Flat bonus per die, e.g. 1 for 2d4+2. */
  perDie?: number;
}

export interface PotionStat {
  base: number | DiceStat;
  /** How a plain number is written, e.g. 10 -> "10ft". Defaults to the number itself. */
  format?: (value: number) => string;
}

export interface PotionDescription {
  rarity: Rarity;
  text: string;
  stats: Record<string, PotionStat>;
  /** Base retail price of one potion, in gold. */
  retail: number;
  /** Ingredients for one potion (ids from ingredients.ts); halves are fine for potions brewed in pairs. */
  ingredients: Record<string, number>;
  /**
   * Extra ingredients per unlocked upgrade node that changes a stat, e.g. { damage: { emberleaf: 0.5 } }.
   * Special upgrades without a stat use `ingredients` on the node itself (research-tree.data.ts).
   */
  upgradeIngredients?: Record<string, Record<string, number>>;
}

const feet = (value: number) => `${value}ft`;

export const potionDescriptions: Record<string, PotionDescription> = {
  'healing': {
    rarity: 'uncommon',
    text: 'When you drink this potion, you regain **{healing} hitpoints**.',
    stats: {
      healing: { base: { dice: 2, sides: 4, perDie: 1 } },
    },
    retail: 50,
    ingredients: { 'silverdew': 2, 'redberry': 50 },
    upgradeIngredients: {
      healing: { 'silverdew': 1 },
    },
  },
  'mana': {
    rarity: 'uncommon',
    text: 'When you drink this potion, you regain **{slots1}**. This will only regenerate used spellslots, '
      + 'and you can\'t go over your normal maximum amount of spellslots by drinking this potion.',
    stats: {
      slots1: { base: 1, format: n => `${n} level 1 ${n === 1 ? 'spellslot' : 'spellslots'}` },
    },
    retail: 35,
    ingredients: { 'leycap': 2, 'blueberry': 50 },
    upgradeIngredients: {
      slots1: { 'leycap': 1 },
    },
  },
  'bandera': {
    rarity: 'uncommon',
    text: 'As an **action**, you throw this potion to a point within range **(30ft/60ft)**. The potion explodes on impact, '
      + 'dealing **{damage} fire damage** to all creatures **within {radius} of the impact**, '
      + 'or half as much on a successful **DC{dc} Dexterity saving throw**.',
    stats: {
      damage: { base: { dice: 1, sides: 6 } },
      radius: { base: 5, format: feet },
      dc: { base: 12 },
    },
    retail: 20,
    // Brewed in pairs: 1 Sunflower Oil, 1 Emberleaf and 1 Shatterbud make two potions
    ingredients: { 'sunflower-oil': 0.5, 'emberleaf': 0.5, 'shatterbud': 0.5 },
    upgradeIngredients: {
      damage: { 'emberleaf': 0.5 },
      radius: { 'shatterbud': 0.5 },
      dc: { 'redberry': 25 },
      lingering: { 'lingervine': 1 },
    },
    // (Moroz will use Blueberries instead of Redberries for its Save DC upgrades.)
  },
};
