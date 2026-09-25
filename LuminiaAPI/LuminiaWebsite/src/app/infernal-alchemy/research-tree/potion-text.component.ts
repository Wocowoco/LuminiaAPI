import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DescriptionPart } from './potions';

/** Renders a potion description: bold runs, and upgraded values highlighted. */
@Component({
  selector: 'app-potion-text',
  template: `
    @for (paragraph of paragraphs; track $index) {
      <p>
        @for (part of paragraph; track $index) {
          @if (part.upgraded) {
            <mark [title]="part.tip ?? ''" [class.bold]="part.bold">{{part.text}}</mark>
          } @else if (part.bold) {
            <strong>{{part.text}}</strong>
          } @else {
            <ng-container>{{part.text}}</ng-container>
          }
        }
      </p>
    }
  `,
  styles: `
    :host { display: block; }
    p { margin: 0 0 8px; }
    p:last-child { margin-bottom: 0; }
    mark {
      padding: 0 4px;
      border-radius: 4px;
      background: var(--potion-highlight-bg, rgba(240, 195, 90, 0.4));
      color: var(--potion-highlight-text, inherit);
      box-shadow: inset 0 -2px 0 var(--potion-highlight-line, #d9a93c);
      cursor: help;
    }
    mark.bold { font-weight: 700; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PotionTextComponent {
  @Input({ required: true }) paragraphs: DescriptionPart[][] = [];
}
