import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PotionView, describeUnlockedPotions } from './potions';
import { SHOP_MODIFIER } from './ingredients';

/** "Your potions": what each unlocked potion currently does, with its upgrades applied. */
@Component({
  selector: 'app-potion-cards',
  templateUrl: './potion-cards.component.html',
  styleUrls: ['./potion-cards.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PotionCardsComponent {
  readonly shopModifier = SHOP_MODIFIER;
  potions: PotionView[] = [];
  loading = true;

  /** Ids of the unlocked research nodes (from the database); null while they're still loading. */
  @Input() set unlocked(value: ReadonlySet<string> | null) {
    this.loading = value === null;
    this.potions = value ? describeUnlockedPotions(value) : [];
  }
}
