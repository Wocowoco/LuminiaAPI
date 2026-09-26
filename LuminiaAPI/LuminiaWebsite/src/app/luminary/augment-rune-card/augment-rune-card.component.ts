import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Rarity } from '../../general/rarity-card/rarity-card.component';

@Component({
    selector: 'augment-rune-card',
    templateUrl: './augment-rune-card.component.html',
    styleUrls: ['./augment-rune-card.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AugmentRuneCardComponent implements OnInit {

  @Input() iconName: string = "locked";
  @Input() augmentName: string = "Undiscovered";
  @Input() description: string = "This augment is not yet discovered.";
  @Input() rarity: Rarity = "uncommon";

  constructor() { }

  ngOnInit(): void {
  }

}
