import { ResearchNode, researchTree } from './research-tree.data';
import { DiceStat, PotionStat, potionDescriptions } from './potion-descriptions';
import type { Rarity } from '../../general/rarity-card/rarity-card.component';
import { SHOP_MODIFIER, ingredients as ingredientList } from './ingredients';

/** A run of description text; `upgraded` marks a stat that unlocked upgrades raised above its base. */
export interface DescriptionPart {
  text: string;
  bold: boolean;
  upgraded: boolean;
  tip?: string;
}

export interface PotionView {
  node: ResearchNode;
  rarity: Rarity;
  icon: string;
  paragraphs: DescriptionPart[][];
  /** The upgrades applied to this view, grouped by label in tree order (ids of the nodes behind each label). */
  upgradeGroups: UpgradeGroup[];
  brewing: BrewingView;
}

/** Upgrades with the same label, e.g. both "+1d6 fire damage" nodes. */
export interface UpgradeGroup {
  label: string;
  ids: string[];
}

export interface IngredientLine {
  name: string;
  amount: string;
  /** Raised above the base recipe by unlocked upgrades. */
  upgraded: boolean;
  tip?: string;
}

/** What one potion takes to brew: its ingredients, or buying them from a store. */
export interface BrewingView {
  retail: string;
  retailUpgraded: boolean;
  /** The base retail price before upgrades, e.g. "20g". */
  retailBase: string;
  retailTip: string;
  /** Buying the materials from a store: SHOP_MODIFIER x retail. */
  store: string;
  ingredients: IngredientLine[];
}

const byId = new Map(researchTree.map(n => [n.id, n]));
const firstParent = (n: ResearchNode): ResearchNode | undefined => {
  const p = n.parents?.[0];
  return p === undefined ? undefined : byId.get(typeof p === 'string' ? p : p.from);
};
const majorAncestor = (n: ResearchNode): ResearchNode | undefined => {
  let p = firstParent(n);
  while (p && !p.major) p = firstParent(p);
  return p;
};

/** The potion (or group, like Smoozies) a node belongs to: itself for potion nodes, else its nearest potion up the chain. */
export function sectionOf(n: ResearchNode): ResearchNode | undefined {
  return n.major ? n : majorAncestor(n);
}

/** The potions an upgrade node applies to (see `effect` in research-tree.data.ts). */
export function potionsFor(n: ResearchNode): string[] {
  if (n.major) return [];
  const potion = majorAncestor(n);
  if (!potion) return [];
  if (potionDescriptions[potion.id]) return [potion.id];
  // A group like Smoozies: apply to every potion whose chain leads back to it
  const members = researchTree.filter(m => m.major && m.id !== potion.id && majorAncestor(m)?.id === potion.id);
  return members.length ? members.map(m => m.id) : [potion.id];
}

export function describePotion(id: string, unlocked: ReadonlySet<string>): PotionView | null {
  const node = byId.get(id);
  const description = potionDescriptions[id];
  if (!node || !description) return null;

  const upgrades = researchTree.filter(n => unlocked.has(n.id) && potionsFor(n).includes(id));
  const bonus = new Map<string, { amount: number, from: string[] }>();
  for (const up of upgrades) {
    for (const [stat, amount] of Object.entries(up.effect ?? {})) {
      const b = bonus.get(stat) ?? { amount: 0, from: [] };
      b.amount += amount;
      b.from.push(up.label);
      bonus.set(stat, b);
    }
  }

  const texts = [description.text, ...upgrades.map(u => u.effectText).filter((t): t is string => !!t)];
  const paragraphs = texts.map(text => parse(text, stat => {
    const def = description.stats[stat];
    if (!def) return null;
    const b = bonus.get(stat);
    const value = format(def, b?.amount ?? 0);
    return b && b.amount !== 0
      ? { text: value, upgraded: true, tip: `Base ${format(def, 0)}, upgraded by ${group(b.from).join(', ')}` }
      : { text: value, upgraded: false };
  }));

  return {
    node,
    rarity: description.rarity,
    icon: `assets/images/infernal-alchemy/research/${node.icon}`,
    paragraphs,
    upgradeGroups: groupNodes(upgrades),
    brewing: brewing(id, upgrades),
  };
}

/** Unlocked potions that have a description, in tree order. */
export function describeUnlockedPotions(unlocked: ReadonlySet<string>): PotionView[] {
  return researchTree
    .filter(n => n.major && unlocked.has(n.id))
    .map(n => describePotion(n.id, unlocked))
    .filter((p): p is PotionView => p !== null);
}

function format(def: PotionStat, extra: number): string {
  if (typeof def.base === 'number') {
    const value = def.base + extra;
    return def.format ? def.format(value) : String(value);
  }
  const d: DiceStat = def.base;
  const dice = d.dice + extra;
  return d.perDie ? `${dice}d${d.sides}+${dice * d.perDie}` : `${dice}d${d.sides}`;
}

function groupNodes(nodes: ResearchNode[]): UpgradeGroup[] {
  const groups = new Map<string, string[]>();
  for (const n of nodes) groups.set(n.label, [...(groups.get(n.label) ?? []), n.id]);
  return [...groups].map(([label, ids]) => ({ label, ids }));
}

function group(labels: string[]): string[] {
  const counts = new Map<string, number>();
  for (const l of labels) counts.set(l, (counts.get(l) ?? 0) + 1);
  return [...counts].map(([label, count]) => count > 1 ? `${label} ×${count}` : label);
}

/** Splits "**bold** and {stat}" text into parts; unknown placeholders are left as written. */
function parse(text: string, stat: (name: string) => { text: string, upgraded: boolean, tip?: string } | null): DescriptionPart[] {
  const parts: DescriptionPart[] = [];
  text.split('**').forEach((chunk, i) => {
    const bold = i % 2 === 1;
    chunk.split(/(\{\w+\})/).forEach(piece => {
      if (!piece) return;
      const match = /^\{(\w+)\}$/.exec(piece);
      const value = match ? stat(match[1]) : null;
      parts.push(value ? { ...value, bold } : { text: piece, bold, upgraded: false });
    });
  });
  return parts;
}

/** Extra ingredients one upgrade node adds to one potion of the given kind. */
function extrasFor(id: string, node: ResearchNode): Map<string, number> {
  const description = potionDescriptions[id];
  const extras = new Map<string, number>();
  const recipes = [
    ...Object.keys(node.effect ?? {}).map(stat => description?.upgradeIngredients?.[stat] ?? {}),
    node.ingredients ?? {},
  ];
  for (const recipe of recipes) {
    for (const [ingredient, amount] of Object.entries(recipe)) extras.set(ingredient, (extras.get(ingredient) ?? 0) + amount);
  }
  return extras;
}

const price = (ingredient: string) => ingredientList[ingredient]?.price ?? 0;
const cost = (recipe: Map<string, number>) => [...recipe].reduce((sum, [ingredient, amount]) => sum + amount * price(ingredient), 0);

/**
 * One potion's recipe with its unlocked upgrades applied: each upgrade adds the potion's
 * `upgradeIngredients` for every stat it changes, plus its own `ingredients`. The retail price
 * rises by the market price of those extras; a store sells the materials at SHOP_MODIFIER x retail.
 * Both prices are rounded up to whole gold (the store price from the rounded retail price).
 */
function brewing(id: string, upgrades: ResearchNode[]): BrewingView {
  const description = potionDescriptions[id];
  const base = new Map(Object.entries(description.ingredients));
  const total = new Map(base);
  for (const up of upgrades) {
    for (const [ingredient, amount] of extrasFor(id, up)) total.set(ingredient, (total.get(ingredient) ?? 0) + amount);
  }

  const extraCost = cost(total) - cost(base);
  const exact = description.retail + extraCost;
  const retail = roundUp(exact);

  return {
    retail: gold(retail),
    retailUpgraded: extraCost > 0.001,
    retailBase: gold(description.retail),
    retailTip: `Base ${gold(description.retail)} + ${gold(extraCost)} for the upgrades' extra ingredients`
      + (retail - exact > 0.001 ? ', rounded up' : ''),
    store: gold(roundUp(retail * SHOP_MODIFIER)),
    ingredients: [...total].map(([ingredient, amount]) => ({
      name: ingredientList[ingredient]?.name ?? ingredient,
      amount: trim(amount),
      upgraded: amount > (base.get(ingredient) ?? 0) + 0.001,
      tip: amount > (base.get(ingredient) ?? 0) + 0.001 ? `Base ${trim(base.get(ingredient) ?? 0)}, raised by upgrades` : undefined,
    })),
  };
}

/**
 * What an upgrade node adds to brewing each potion it applies to, e.g.
 * "+0.5× Emberleaf per potion". Prefixed with the potion's name when it applies
 * to several potions (like "+1 Save DC to all Smoozies"). Empty when it adds nothing.
 */
export function upgradeCosts(node: ResearchNode): string[] {
  const potions = potionsFor(node).filter(id => potionDescriptions[id]);
  return potions.flatMap(id => {
    const extras = extrasFor(id, node);
    if (!extras.size) return [];
    const list = [...extras].map(([ingredient, amount]) => `+${trim(amount)}× ${ingredientList[ingredient]?.name ?? ingredient}`).join(", ");
    const line = `${list} per potion`;
    return [potions.length > 1 ? `${byId.get(id)?.label ?? id}: ${line}` : line];
  });
}

/** Rounds up to whole gold, ignoring floating-point noise (28.000000000000004 stays 28). */
function roundUp(value: number): number {
  return Math.ceil(value - 1e-9);
}

/** Gold with cents only when needed: 48 -> "48g", 12.5 -> "12.50g". */
function gold(value: number): string {
  const cents = Math.round(value * 100);
  return cents % 100 === 0 ? `${cents / 100}g` : `${(cents / 100).toFixed(2)}g`;
}

function trim(value: number): string {
  return String(Math.round(value * 100) / 100);
}
