import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'augment-rune-card',
    templateUrl: './augment-rune-card.component.html',
    styleUrls: ['./augment-rune-card.component.css'],
    standalone: false
})
export class AugmentRuneCardComponent implements OnInit {

  @Input() iconName: string = "locked";
  @Input() augmentName: string = "Undiscovered";
  @Input() description: string = "This augment is not yet discovered.";
  @Input() rarity: string = "uncommon";

  constructor() { }

  ngOnInit(): void {
  }

}
