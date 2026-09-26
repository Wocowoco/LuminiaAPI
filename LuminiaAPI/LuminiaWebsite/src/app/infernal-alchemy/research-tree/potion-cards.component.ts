import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PotionView, UpgradeGroup, describePotion, describeUnlockedPotions } from './potions';
import { SHOP_MODIFIER } from './ingredients';

interface PotionCard {
  id: string;
  /** Every unlocked upgrade of this potion, grouped by label. */
  groups: UpgradeGroup[];
  /** Upgrade node ids the viewer left out, to see the potion brewed without them. */
  off: Set<string>;
  /** The potion with only the selected upgrades applied. */
  view: PotionView;
}

/**
 * "Unlocked Potions": what each unlocked potion does, with its upgrades applied. The upgrade chips are
 * toggles, so players can check the text and brewing cost of a potion made without some upgrades.
 */
@Component({
  selector: 'app-potion-cards',
  templateUrl: './potion-cards.component.html',
  styleUrls: ['./potion-cards.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PotionCardsComponent {
  readonly shopModifier = SHOP_MODIFIER;
  cards: PotionCard[] = [];
  loading = true;
  private unlockedIds: ReadonlySet<string> = new Set();

  /** Ids of the unlocked research nodes (from the database); null while they're still loading. */
  @Input() set unlocked(value: ReadonlySet<string> | null) {
    this.loading = value === null;
    this.unlockedIds = value ?? new Set();
    this.cards = describeUnlockedPotions(this.unlockedIds).map(view => ({
      id: view.node.id,
      groups: view.upgradeGroups,
      off: new Set<string>(),
      view,
    }));
  }

  /** How many upgrades of a group are selected. */
  active(card: PotionCard, group: UpgradeGroup): number {
    return group.ids.filter(id => !card.off.has(id)).length;
  }

  /** Single upgrades: switch on or off. */
  toggle(card: PotionCard, group: UpgradeGroup): void {
    this.select(card, group, this.active(card, group) > 0 ? 0 : group.ids.length);
  }

  /** Repeated upgrades (e.g. "+1d6 fire damage ×2"): one more or one fewer. */
  step(card: PotionCard, group: UpgradeGroup, delta: number): void {
    this.select(card, group, this.active(card, group) + delta);
  }

  resetUpgrades(card: PotionCard): void {
    card.off.clear();
    this.refresh(card);
  }

  private select(card: PotionCard, group: UpgradeGroup, count: number): void {
    count = Math.max(0, Math.min(group.ids.length, count));
    // Keep the first upgrades of the chain and leave out the later ones
    group.ids.forEach((id, i) => i < count ? card.off.delete(id) : card.off.add(id));
    this.refresh(card);
  }

  private refresh(card: PotionCard): void {
    const selected = new Set([...this.unlockedIds].filter(id => !card.off.has(id)));
    card.view = describePotion(card.id, selected) ?? card.view;
  }
}
