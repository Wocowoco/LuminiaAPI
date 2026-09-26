import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DEFAULT_GAME_SYSTEM, TimelineEntry } from '../timeline.data';
import { TimelineCharacter } from '../timeline.component';

const TYPE_LABELS: Record<TimelineEntry['type'], string> = {
  campaign: 'Campaign',
  oneshot: 'One-shot',
  event: 'World event',
};

@Component({
    selector: 'app-timeline-card',
    templateUrl: './timeline-card.component.html',
    styleUrls: ['./timeline-card.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TimelineCardComponent {
  @Input({ required: true }) entry!: TimelineEntry;
  @Input() characters: TimelineCharacter[] = [];
  /** 'alternate' shows only the non-canon group of a branching entry. */
  @Input() variant: 'default' | 'alternate' = 'default';

  public isStoryOpen: boolean = false;

  public get system(): string {
    return this.entry.system ?? DEFAULT_GAME_SYSTEM;
  }

  public get label(): string {
    return this.entry.label ?? TYPE_LABELS[this.entry.type];
  }

  toggleStory() {
    this.isStoryOpen = !this.isStoryOpen;
  }
}
