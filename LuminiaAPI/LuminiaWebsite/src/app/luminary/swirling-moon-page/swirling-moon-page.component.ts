import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AUGMENT_RUNES, AUGMENT_RUNE_GROUPS, AugmentRune, DEFAULT_SOCKETS, LOCKED_SOCKETS } from './augment-runes.data';

/** Slotted runes are only kept in this browser for now (rune ids, in socket order). */
const SOCKETS_STORAGE_KEY = 'luminia-swirling-moon-sockets';
const SOCKET_COUNT = 3;

/** A spell's stat block, as changed by the slotted runes. */
interface SpellDescription {
  castTime: string;
  range: string;
  components: string;
  damage: string;
  text: string;
  /** Stat block properties a rune changed, see SpellInfoBlockComponent.highlighted */
  changed: string[];
}

/** Marks text that a slotted rune added or changed. */
function rune(text: string): string {
  return `<span class="highlight">${text}</span>`;
}

@Component({
    selector: 'app-swirling-moon-page',
    templateUrl: './swirling-moon-page.component.html',
    styleUrls: ['./swirling-moon-page.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SwirlingMoonPageComponent implements OnInit {

  constructor() { }

  public readonly runeGroups = AUGMENT_RUNE_GROUPS.map(g => ({ ...g, runes: AUGMENT_RUNES.filter(r => r.group === g.group) }));

  /** One entry per socket: the slotted rune, or null when empty. Locked sockets stay empty. */
  public sockets: (AugmentRune | null)[] = Array(SOCKET_COUNT).fill(null);

  /** Slotted general runes, once each, with their text for the number of copies slotted. */
  public generalRunes: { rune: AugmentRune; text: string }[] = [];
  public moonerang!: SpellDescription;
  public lunarShield!: SpellDescription;

  ngOnInit(): void {
    this.loadSockets();
    this.buildDescriptions();
  }

  navigate(navigateTo: string): void {
    const element = document.getElementById(navigateTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  isLocked(index: number): boolean {
    return LOCKED_SOCKETS.includes(index);
  }

  isSlotted(rune: AugmentRune): boolean {
    return this.sockets.includes(rune);
  }

  get socketsFull(): boolean {
    return this.freeSocket() < 0;
  }

  /** Whether the rune fits in another socket: a free one, and not already slotted unless it stacks. */
  canSlot(rune: AugmentRune): boolean {
    return !this.socketsFull && (!this.isSlotted(rune) || !!rune.stackedDescription);
  }

  /** Puts the rune in the first empty unlocked socket. */
  slotRune(rune: AugmentRune): void {
    if (this.canSlot(rune)) {
      this.sockets[this.freeSocket()] = rune;
      this.socketsChanged();
    }
  }

  /** Takes the rune out of the last socket it's in. */
  removeRune(rune: AugmentRune): void {
    const index = this.sockets.lastIndexOf(rune);
    if (index >= 0) {
      this.sockets[index] = null;
      this.socketsChanged();
    }
  }

  /** Index of the first empty unlocked socket, or -1. */
  private freeSocket(): number {
    return this.sockets.findIndex((r, i) => !r && !this.isLocked(i));
  }

  clickSocket(index: number): void {
    if (this.isLocked(index)) {
      return;
    }
    if (this.sockets[index]) {
      this.sockets[index] = null;
      this.socketsChanged();
    } else {
      this.navigate('augment-runes');
    }
  }

  private socketsChanged(): void {
    this.sockets = [...this.sockets];
    this.saveSockets();
    this.buildDescriptions();
  }

  private loadSockets(): void {
    let ids: (string | null)[] = DEFAULT_SOCKETS;
    try {
      const stored = localStorage.getItem(SOCKETS_STORAGE_KEY);
      if (stored !== null) {
        ids = JSON.parse(stored);
      }
    } catch { }
    if (!Array.isArray(ids)) {
      return;
    }
    const sockets: (AugmentRune | null)[] = Array(SOCKET_COUNT).fill(null);
    ids.slice(0, SOCKET_COUNT).forEach((id, i) => {
      const found = AUGMENT_RUNES.find(r => r.id === id);
      if (found && !this.isLocked(i) && (!sockets.includes(found) || found.stackedDescription)) {
        sockets[i] = found;
      }
    });
    this.sockets = sockets;
  }

  private saveSockets(): void {
    try {
      localStorage.setItem(SOCKETS_STORAGE_KEY, JSON.stringify(this.sockets.map(r => r?.id ?? null)));
    } catch { }
  }

  /** Rewrites the weapon's description with the changes of the slotted runes. */
  private buildDescriptions(): void {
    const has = (id: string) => this.sockets.some(r => r?.id === id);

    const general = this.sockets.filter((r): r is AugmentRune => r?.group === 'general');
    this.generalRunes = [...new Set(general)].map(r => {
      const count = general.filter(g => g === r).length;
      return { rune: r, text: count > 1 && r.stackedDescription ? r.stackedDescription(count) : r.description };
    });

    // Moonerang
    const moonerangChanged: string[] = [];
    const distant = has('distant');
    const bouncy = has('bouncy');
    if (distant) {
      moonerangChanged.push('range');
    }
    const precisionText = has('precision')
      ? ' ' + rune('Before you make the attack roll, you can choose to take a -5 penalty to it. If the attack hits, it deals an extra 10 damage.')
      : '';
    const chainText = has('chainerang')
      ? rune(', plus 1 radiant damage for each time the Moonerang bounced before hitting it')
      : '';
    const returnText = bouncy
      ? `and the Moonerang ${rune('doesn\'t need to return to you. After each hit, you can choose one of the following options')}:`
      : 'and the Moonerang arcs back toward you.\n  <br><br>\n  When the Moonerang returns, you can choose one of the following options:';
    const shieldBreakerText = has('shield-breaker')
      ? `\n  <br><br>\n  ${rune('Moonerang deals no damage to creatures that have temporary hit points. When the spell ends, each creature it hit loses all of its temporary hit points.')}`
      : '';
    const bounceTarget = bouncy ? rune('another creature within range') : 'another creature within 20 feet';
    const dejaVuText = has('deja-vu')
      ? ' ' + rune('This can be a creature the Moonerang already hit, as long as it isn\'t the creature it just hit.')
      : '';
    const firstReturn = bouncy ? rune('If the Moonerang has only hit its first target') : 'If this is the first time the Moonerang has returned';

    this.moonerang = {
      castTime: '1 action',
      range: distant ? '40 ft.' : '20 ft.',
      components: 'V, S',
      damage: '3d6 radiant damage',
      changed: moonerangChanged,
      text: `
  You conjure a crescent wave of radiant moonlight shaped like a boomerang and hurl it at a creature within range. Make a ranged spell attack against the target.${precisionText} On a hit, the target takes <b>3d6 radiant damage</b>${chainText}, ${returnText}
  <br>
  <ul>
  <li><b>End the Spell.</b> ${firstReturn}, you can choose to end the spell and regain the spell slot used to cast it.</li>
  <li><b>Bounce the Spell.</b> You redirect the Moonerang toward ${bounceTarget}.${dejaVuText} Make a new ranged spell attack against the new target. For each previous target the spell has struck, you take <b>1d6 radiant damage</b> before making the new attack.</li>
  </ul>
  The spell ends after you choose to end it or after it fails to hit a target on a bounce.${shieldBreakerText}
  <br><br>
  <b>At Higher Levels.</b> When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d6 for each slot level above 2nd.
  `,
    };

    // Lunar Shield. Lone Moon drops the sphere, so Expanded Moon does nothing next to it.
    const shieldChanged: string[] = [];
    const lone = has('lone-moon');
    const expanded = has('expanded-moon') && !lone;
    const hasty = has('hasty-moon');
    const newMoon = has('new-moon');
    if (hasty) {
      shieldChanged.push('castTime');
    }
    if (newMoon) {
      shieldChanged.push('components');
    }
    if (lone || expanded) {
      shieldChanged.push('range');
    }
    if (lone) {
      shieldChanged.push('damage');
    }

    const targetText = lone
      ? rune('You gain temporary hit points equal to <b>4d6 + your spellcasting ability modifier</b>.')
      : `Choose any number of creatures within ${expanded ? rune('20 feet') : '10 feet'} of you. Each chosen creature gains temporary hit points equal to <b>2d6 + your spellcasting ability modifier</b>.`;
    const refreshingText = has('refreshing-moon')
      ? ' ' + rune(lone
        ? 'You also regain hit points equal to your spellcasting ability modifier.'
        : 'Each chosen creature also regains hit points equal to your spellcasting ability modifier.')
      : '';
    const fullMoonText = has('full-moon')
      ? ' ' + rune('When you roll the temporary hit points, you can reroll any number of the dice. You must use the new rolls.')
      : '';

    this.lunarShield = {
      castTime: hasty ? '1 bonus action' : '1 action',
      range: lone ? 'Self' : expanded ? 'Self, 20 ft. sphere' : 'Self, 10 ft. sphere',
      components: newMoon ? 'V, S' : 'V, S, M (moonlight)',
      damage: lone ? '(4d6+spellcast mod) temp hp' : '(2d6+spellcast mod) temp hp',
      changed: shieldChanged,
      text: `
  You draw upon the moonlight, absorbing its celestial energy and releasing it in a burst of radiant starlight. ${targetText}${refreshingText}${fullMoonText}
  <br><br>
  <b>At Higher Levels.</b> When you cast this spell using a spell slot of 3rd level or higher, the temporary hit points increase by 1d6 for each slot level above 2nd.
  `,
    };
  }
}
