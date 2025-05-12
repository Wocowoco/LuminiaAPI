import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'spell-info-block',
  templateUrl: './spell-info-block.component.html',
  styleUrls: ['./spell-info-block.component.css'],
})

export class SpellInfoBlockComponent implements OnInit {

  constructor() { }

  @Input() spellName: string = 'Spell Template';
  @Input() level: string = '---';
  @Input() castTime: string = '---';
  @Input() range: string = '---';
  @Input() components: string = '---';
  @Input() duration: string = '---';
  @Input() school: string = '---';
  @Input() attack: string = '---';
  @Input() damage: string = '---';
  @Input() spellText: string = 'No description available.';

  ngOnInit(): void {
  }

}
