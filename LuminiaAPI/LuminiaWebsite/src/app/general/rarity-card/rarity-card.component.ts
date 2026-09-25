import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Card for an item with a rarity (augment runes, potions, ...): icon, rarity label and name,
 * with the description as projected content. Put `card-footer` on an element to pin it to the bottom.
 *
 *   <app-rarity-card rarity="uncommon" name="Mana Potion" icon="assets/...png">
 *     Description text
 *     <div card-footer>...</div>
 *   </app-rarity-card>
 *
 * Size it from the outside with --rarity-card-max-width and --rarity-card-min-height.
 */
@Component({
  selector: 'app-rarity-card',
  templateUrl: './rarity-card.component.html',
  styleUrls: ['./rarity-card.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RarityCardComponent {
  @Input() rarity: Rarity = 'common';
  @Input({ required: true }) name = '';
  @Input() icon?: string;
  @Input() iconAlt = '';
}
