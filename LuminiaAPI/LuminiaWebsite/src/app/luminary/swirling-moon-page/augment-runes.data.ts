import { Rarity } from '../../general/rarity-card/rarity-card.component';

export type AugmentRuneGroup = 'general' | 'moonerang' | 'lunarShield';

export interface AugmentRune {
  id: string;
  name: string;
  /** File name (without .png) in assets/images/luminary/ */
  icon: string;
  rarity: Rarity;
  group: AugmentRuneGroup;
  description: string;
  /** Set for runes that can be slotted in more than one socket: the text for that many copies. */
  stackedDescription?: (count: number) => string;
}

/** Indexes (0-2, left to right) of the sockets the players haven't unlocked yet. */
export const LOCKED_SOCKETS = [1];

/** Rune ids in each socket for a player who hasn't changed their sockets yet. */
export const DEFAULT_SOCKETS: (string | null)[] = [null, null, 'luana-blessing'];

export const AUGMENT_RUNE_GROUPS: { group: AugmentRuneGroup; title: string; anchor: string }[] = [
  { group: 'general', title: 'General', anchor: 'ar-general' },
  { group: 'moonerang', title: 'Moonerang', anchor: 'ar-moonerang' },
  { group: 'lunarShield', title: 'Lunar Shield', anchor: 'ar-lunar-shield' },
];

/**
 * The augment runes that fit in the Swirling Moon's sockets. What a slotted rune changes in the
 * weapon's description is written out in SwirlingMoonPageComponent (buildDescriptions).
 */
export const AUGMENT_RUNES: AugmentRune[] = [
  // General
  { id: 'luana-blessing', group: 'general', icon: 'luanaBlessing', name: "Luana's Blessing", rarity: 'legendary',
    description: "Whenever you gain temporary hit points, you can choose to add them to any temporary hit points you already have. Your total amount of temporary hit points can't exceed your hit point maximum." },
  { id: 'improved-critical', group: 'general', icon: 'precision', name: 'Improved Critical', rarity: 'epic',
    description: 'Your spell attacks score a critical hit on a roll of 19 or 20.' },
  { id: 'improved-defences', group: 'general', icon: 'blueBlock', name: 'Improved Defences', rarity: 'rare',
    description: 'You gain a +1 bonus to AC and saving throws.' },
  { id: 'improved-magic', group: 'general', icon: 'blueMan', name: 'Improved Magic', rarity: 'rare',
    description: 'You gain a +1 bonus to spell attack rolls and to your spell save DC.' },
  { id: 'improved-reserve', group: 'general', icon: 'purpleOrb', name: 'Improved Reserve', rarity: 'uncommon',
    description: 'You gain one additional 2nd-level spell slot. This slot is regained when you finish a long rest.' },
  { id: 'missmatch', group: 'general', icon: 'glitch', name: 'Missmatch', rarity: 'uncommon',
    description: 'Your hit point maximum increases by 5.',
    stackedDescription: count => `Your hit point maximum increases by ${5 * count}.` },

  // Moonerang
  { id: 'shield-breaker', group: 'moonerang', icon: 'shieldbreak', name: 'Shield Breaker', rarity: 'legendary',
    description: 'Moonerang no longer deals damage to creatures with temporary hit points. At the end your spell, each creature that got hit by Moonerang loses all their temporary hit points.' },
  { id: 'bouncy', group: 'moonerang', icon: 'blueClaw', name: 'Bouncy', rarity: 'epic',
    description: 'Moonerang no longer needs to return to you between bounces. Instead, it can bounce freely between creatures within range.' },
  { id: 'deja-vu', group: 'moonerang', icon: 'redMark', name: 'Déjà Vu', rarity: 'epic',
    description: 'Moonerang can hit the same creature more than once, but a different creature must be hit between each instance.' },
  { id: 'chainerang', group: 'moonerang', icon: 'chains', name: 'Chainerang', rarity: 'rare',
    description: 'Moonerang deals an additional radiant damage for each time it has bounced before hitting a target.' },
  { id: 'precision', group: 'moonerang', icon: 'shattering', name: 'Precision', rarity: 'rare',
    description: 'Before you make a spell attack with Moonerang, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the damage.' },
  { id: 'distant', group: 'moonerang', icon: 'sharp', name: 'Distant', rarity: 'uncommon',
    description: 'The range of Moonerang is increased by 20 ft.' },

  // Lunar Shield
  { id: 'new-moon', group: 'lunarShield', icon: 'purpleSpark', name: 'New Moon', rarity: 'legendary',
    description: 'You can cast Lunar Shield without providing its material component (moonlight).' },
  { id: 'hasty-moon', group: 'lunarShield', icon: 'yellowSpin', name: 'Hasty Moon', rarity: 'epic',
    description: 'You can cast Lunar Shield using a bonus action, rather than its normal casting time.' },
  { id: 'lone-moon', group: 'lunarShield', icon: 'cyanMan', name: 'Lone Moon', rarity: 'rare',
    description: 'Lunar Shield no longer targets a sphere around you. Instead, when you cast the spell, you gain an additional 2d6 temporary hit points.' },
  { id: 'refreshing-moon', group: 'lunarShield', icon: 'healing', name: 'Refreshing Moon', rarity: 'rare',
    description: 'When you cast Lunar Shield, each target of the spell regains hit points equal to your spellcasting ability modifier.' },
  { id: 'expanded-moon', group: 'lunarShield', icon: 'purpleBoom', name: 'Expanded Moon', rarity: 'uncommon',
    description: "The radius of Lunar Shield's protective sphere is increased by 10 ft." },
  { id: 'full-moon', group: 'lunarShield', icon: 'bubble', name: 'Full Moon', rarity: 'uncommon',
    description: 'When you roll temporary hit points for Lunar Shield, you can reroll any number of the dice. You must use the new rolls.' },
];
