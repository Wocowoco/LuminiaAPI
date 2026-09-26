import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MAJOR_ENTRY_TYPES, SEASONS, TIMELINE_ENTRIES, TIMELINE_FALLBACK_CURRENT_YEAR, TIMELINE_START_YEAR, TimelineEntry } from './timeline.data';

export interface TimelineCharacter {
  name: string;
  minor: boolean;
}

export type TimelineRow =
  | { kind: 'start'; year: string }
  | { kind: 'gap'; years: number }
  | { kind: 'fork' }
  | { kind: 'branch-end' }
  | {
      kind: 'entry';
      entry: TimelineEntry;
      season?: string;
      year: string;
      characters: TimelineCharacter[];
      alternate?: TimelineCharacter[];
    };

/** Years between two timeline points before a "N years pass" marker is shown. */
const GAP_THRESHOLD = 10;

const nameCollator = new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true });

export function formatYear(year: number): string {
  if (year === 0) {
    return 'The Nova';
  }
  return year < 0 ? `${-year} PN` : `${year} AN`;
}

/** "(Name)" marks a minor character. Main characters first, then minor ones, each group alphabetical. */
function toCharacters(names: string[] = []): TimelineCharacter[] {
  return names
    .map(name => {
      const minor = /^\(.*\)$/.test(name.trim());
      return { name: minor ? name.trim().slice(1, -1) : name.trim(), minor };
    })
    .sort((a, b) => Number(a.minor) - Number(b.minor) || nameCollator.compare(a.name, b.name));
}

function seasonIndex(entry: TimelineEntry): number {
  return entry.season ? SEASONS.indexOf(entry.season) : -1;
}

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TimelineComponent {
  @Input() currentYear: number = TIMELINE_FALLBACK_CURRENT_YEAR;
  @Input() todayLabel: string = '';

  public readonly rows: TimelineRow[] = TimelineComponent.buildRows(TIMELINE_ENTRIES);

  isMajor(entry: TimelineEntry): boolean {
    return MAJOR_ENTRY_TYPES.includes(entry.type);
  }

  public get nowYear(): string {
    return formatYear(this.currentYear);
  }

  private static buildRows(entries: TimelineEntry[]): TimelineRow[] {
    const sorted = [...entries].sort((a, b) => a.startYear - b.startYear || seasonIndex(a) - seasonIndex(b));
    const rows: TimelineRow[] = [{ kind: 'start', year: formatYear(TIMELINE_START_YEAR) }];
    let lastYear = TIMELINE_START_YEAR;
    let inBranch = false;

    for (const entry of sorted) {
      const isBranch = !!entry.alternateCharacters?.length;
      if (inBranch && !isBranch) {
        rows.push({ kind: 'branch-end' });
      }
      if (entry.startYear - lastYear >= GAP_THRESHOLD) {
        rows.push({ kind: 'gap', years: entry.startYear - lastYear });
      }
      if (isBranch && !inBranch) {
        rows.push({ kind: 'fork' });
      }
      inBranch = isBranch;

      const year = entry.endYear !== undefined
        ? `${formatYear(entry.startYear)} – ${formatYear(entry.endYear)}`
        : formatYear(entry.startYear);
      rows.push({
        kind: 'entry',
        entry,
        season: entry.season,
        year,
        characters: toCharacters(entry.characters),
        alternate: isBranch ? toCharacters(entry.alternateCharacters) : undefined,
      });
      lastYear = entry.endYear ?? entry.startYear;
    }
    if (inBranch) {
      rows.push({ kind: 'branch-end' });
    }
    return rows;
  }
}
