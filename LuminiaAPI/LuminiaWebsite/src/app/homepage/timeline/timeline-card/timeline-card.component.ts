import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DEFAULT_GAME_SYSTEM, MAJOR_ENTRY_TYPES, TimelineEntry } from '../timeline.data';
import { TimelineCharacter } from '../timeline.component';

const TYPE_LABELS: Record<TimelineEntry['type'], string> = {
  campaign: 'Campaign',
  'story-arc': 'Story Arc',
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

  public get isMajor(): boolean {
    return MAJOR_ENTRY_TYPES.includes(this.entry.type);
  }

  public get system(): string {
    return this.entry.system ?? DEFAULT_GAME_SYSTEM;
  }

  public get label(): string {
    return this.entry.label ?? TYPE_LABELS[this.entry.type];
  }

  characterTitle(character: TimelineCharacter): string | null {
    const notes = [character.minor ? 'Minor character' : '', character.died ? 'Died during this story' : ''].filter(Boolean);
    return notes.length ? notes.join(' · ') : null;
  }

  toggleStory() {
    this.isStoryOpen = !this.isStoryOpen;
  }
}
