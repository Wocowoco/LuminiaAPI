/**
 * Brewing ingredients and their market price in gold, used for the potions' brewing costs
 * (see `ingredients` in potion-descriptions.ts).
 */
export const ingredients: Record<string, { name: string, price: number }> = {
  'blueberry': { name: 'Blueberry', price: 0.01 },
  'emberleaf': { name: 'Emberleaf', price: 25 },
  'gloomberry': { name: 'Gloomberry', price: 0.01 },
  'leycap': { name: 'Leycap', price: 8 },
  'lingervine': { name: 'Lingervine', price: 20 },
  'moonbloom': { name: 'Moonbloom', price: 75 },
  'moonstone': { name: 'Moonstone', price: 10 },
  'redberry': { name: 'Redberry', price: 0.01 },
  'shatterbud': { name: 'Shatterbud', price: 5 },
  'silverdew': { name: 'Silverdew', price: 10 },
  'snowberry': { name: 'Snowberry', price: 0.01 },
  'sunflower-oil': { name: 'Sunflower Oil', price: 0.5 },
  'void-mint': { name: 'Void Mint', price: 20 },
  'white-krolt': { name: 'White Krolt', price: 15 },
  'yellowleaf': { name: 'Yellowleaf', price: 0.01 },
};

/**
 * Buying the raw materials for a potion from the shop costs this times the potion's retail price.
 * A potion's retail price is its base retail price plus the market price of the extra ingredients
 * its unlocked upgrades need.
 */
export const SHOP_MODIFIER = 0.8;
