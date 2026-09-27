import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import {
  MAJOR_ENTRY_TYPES, SEASONS, TIMELINE_AGES, TIMELINE_ENTRIES, TIMELINE_FALLBACK_CURRENT_YEAR, TIMELINE_START_YEAR, TimelineAge, TimelineEntry,
} from './timeline.data';

export interface TimelineCharacter {
  name: string;
  minor: boolean;
  /** Died during this story. */
  died: boolean;
}

export type TimelineFilter = 'all' | 'stories' | 'history';

export const TIMELINE_FILTERS: { value: TimelineFilter; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'stories', label: 'Stories' },
  { value: 'history', label: 'World history' },
];

export type TimelineRow =
  | { kind: 'start'; year: string }
  | { kind: 'age'; age: TimelineAge; years: string; collapsed: boolean; hiddenCount: number }
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

/** Non-breaking spaces keep each year together, so a range that doesn't fit wraps after the dash ("1177 AN –" / "1291 AN"). */
function formatRange(startYear: number, endYear: number): string {
  const keepTogether = (year: number) => formatYear(year).replace(/ /g, ' ');
  return `${keepTogether(startYear)} – ${keepTogether(endYear)}`;
}

/** "(Name)" marks a minor character and "†Name" one who died ("(†Name)" for both). Main characters first, then minor ones, each group alphabetical. */
function toCharacters(names: string[] = []): TimelineCharacter[] {
  return names
    .map(raw => {
      let name = raw.trim();
      const minor = /^\(.*\)$/.test(name);
      if (minor) {
        name = name.slice(1, -1).trim();
      }
      const died = name.startsWith('†');
      if (died) {
        name = name.slice(1).trim();
      }
      return { name, minor, died };
    })
    .sort((a, b) => Number(a.minor) - Number(b.minor) || nameCollator.compare(a.name, b.name));
}

function seasonIndex(entry: TimelineEntry): number {
  return entry.season ? SEASONS.indexOf(entry.season) : -1;
}

function matchesFilter(entry: TimelineEntry, filter: TimelineFilter): boolean {
  return filter === 'all' || (filter === 'history') === (entry.type === 'event');
}

/** The last Age that started on or before the entry. An event that started an Age belongs to the Age before it. */
function ageIndexOf(entry: TimelineEntry): number {
  const next = TIMELINE_AGES.findIndex(age => age.startYear > entry.startYear || (entry.startsAge && age.startYear === entry.startYear));
  return Math.max(0, (next === -1 ? TIMELINE_AGES.length : next) - 1);
}

const SORTED_ENTRIES = [...TIMELINE_ENTRIES].sort((a, b) => a.startYear - b.startYear || seasonIndex(a) - seasonIndex(b));

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

  public readonly filters = TIMELINE_FILTERS;
  public filter: TimelineFilter = 'all';
  private readonly collapsedAges = new Set<string>();

  public rows: TimelineRow[] = this.buildRows();

  isMajor(entry: TimelineEntry): boolean {
    return MAJOR_ENTRY_TYPES.includes(entry.type);
  }

  public get nowYear(): string {
    return formatYear(this.currentYear);
  }

  setFilter(filter: TimelineFilter) {
    this.filter = filter;
    this.rows = this.buildRows();
  }

  toggleAge(age: TimelineAge) {
    if (!this.collapsedAges.delete(age.id)) {
      this.collapsedAges.add(age.id);
    }
    this.rows = this.buildRows();
  }

  /** Each Age gets a header row; Ages with nothing to show under the current filter are left out. */
  private buildRows(): TimelineRow[] {
    const rows: TimelineRow[] = [{ kind: 'start', year: formatYear(TIMELINE_START_YEAR) }];
    const visible = SORTED_ENTRIES.filter(entry => matchesFilter(entry, this.filter));
    let lastYear = TIMELINE_START_YEAR;
    let inBranch = false;

    const closeBranch = () => {
      if (inBranch) {
        rows.push({ kind: 'branch-end' });
        inBranch = false;
      }
    };
    const pushGap = (year: number) => {
      if (year - lastYear >= GAP_THRESHOLD) {
        rows.push({ kind: 'gap', years: year - lastYear });
      }
      lastYear = Math.max(lastYear, year);
    };

    TIMELINE_AGES.forEach((age, index) => {
      const entries = visible.filter(entry => ageIndexOf(entry) === index);
      if (!entries.length) {
        return;
      }
      closeBranch();
      pushGap(age.startYear);
      const nextAge = TIMELINE_AGES[index + 1];
      const collapsed = this.collapsedAges.has(age.id);
      rows.push({
        kind: 'age',
        age,
        years: nextAge ? formatRange(age.startYear, nextAge.startYear) : `${formatYear(age.startYear).replace(/ /g, ' ')} – today`,
        collapsed,
        hiddenCount: collapsed ? entries.length : 0,
      });

      for (const entry of entries) {
        if (!collapsed) {
          const isBranch = !!entry.alternateCharacters?.length;
          if (!isBranch) {
            closeBranch();
          }
          pushGap(entry.startYear);
          if (isBranch && !inBranch) {
            rows.push({ kind: 'fork' });
          }
          inBranch = isBranch;

          rows.push({
            kind: 'entry',
            entry,
            season: entry.season,
            year: entry.endYear !== undefined ? formatRange(entry.startYear, entry.endYear) : formatYear(entry.startYear),
            characters: toCharacters(entry.characters),
            alternate: isBranch ? toCharacters(entry.alternateCharacters) : undefined,
          });
        }
        lastYear = entry.endYear ?? entry.startYear;
      }
    });
    closeBranch();
    return rows;
  }
}
