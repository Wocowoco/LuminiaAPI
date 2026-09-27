import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineComponent, TimelineRow, formatYear } from './timeline.component';
import { TimelineCardComponent } from './timeline-card/timeline-card.component';
import { TIMELINE_AGES, TimelineAge } from './timeline.data';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;

  const entryRows = () => component.rows.filter((row): row is Extract<TimelineRow, { kind: 'entry' }> => row.kind === 'entry');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineComponent, TimelineCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format PN, The Nova and AN years', () => {
    expect(formatYear(-100)).toBe('100 PN');
    expect(formatYear(0)).toBe('The Nova');
    expect(formatYear(7346)).toBe('7346 AN');
  });

  it('should list main characters alphabetically, then minor characters alphabetically', () => {
    const viaNova = entryRows().find(row => row.entry.id === 'vianova')!;
    expect(viaNova.characters.map(c => c.name)).toEqual(
      ['Balik Hrungnorsson', 'Cara', 'Lily', 'Mino', 'Nova', 'Shadow', "Vak'Nor", 'Varis', 'Anya', 'Eynho', 'Fasca']);
    expect(viaNova.characters.filter(c => c.minor).map(c => c.name)).toEqual(['Anya', 'Eynho', 'Fasca']);
  });

  it('should mark characters who died', () => {
    const viaNova = entryRows().find(row => row.entry.id === 'vianova')!;
    expect(viaNova.characters.filter(c => c.died).map(c => c.name)).toEqual(['Cara', 'Nova', 'Shadow']);
  });

  it('should wrap the non-canon one-shots in a single fork', () => {
    expect(component.rows.filter(row => row.kind === 'fork').length).toBe(1);
    expect(component.rows.filter(row => row.kind === 'branch-end').length).toBe(1);
  });

  it('should put every entry after the header of its Age', () => {
    let currentAge: TimelineAge | undefined;
    for (const row of component.rows) {
      if (row.kind === 'age') {
        currentAge = row.age;
      } else if (row.kind === 'entry') {
        expect(currentAge).toBeDefined();
        expect(row.entry.startYear).toBeGreaterThanOrEqual(currentAge!.startYear);
      }
    }
    const ageIds = component.rows.flatMap(row => row.kind === 'age' ? [row.age.id] : []);
    expect(ageIds).toEqual(TIMELINE_AGES.map(age => age.id));
  });

  it('should show The Nova right before the Age it started', () => {
    const index = component.rows.findIndex(row => row.kind === 'entry' && row.entry.id === 'the-nova');
    expect(component.rows[index + 1]).toEqual(jasmine.objectContaining({ kind: 'age', age: jasmine.objectContaining({ id: 'age-of-mist' }) }));
  });

  it('should split gaps at the start of an Age', () => {
    const kinds = component.rows.map(row => row.kind);
    expect(kinds.some((kind, i) => kind === 'gap' && kinds[i + 1] === 'gap')).toBeFalse();
    // The Age of Darkness starts with the Blackfall (2381), 1090 years after the Accord of the Peak (1291)
    const index = component.rows.findIndex(row => row.kind === 'age' && row.age.id === 'age-of-darkness');
    expect(component.rows[index - 1]).toEqual({ kind: 'gap', years: 1090 });
    expect(component.rows[index + 1].kind).toBe('entry');
  });

  it('should only show stories or world events when filtered, and drop empty Ages', () => {
    component.setFilter('stories');
    expect(entryRows().every(row => row.entry.type !== 'event')).toBeTrue();
    expect(component.rows.some(row => row.kind === 'age' && row.age.id === 'age-of-lumin')).toBeFalse();

    component.setFilter('history');
    expect(entryRows().every(row => row.entry.type === 'event')).toBeTrue();
    expect(component.rows.some(row => row.kind === 'fork')).toBeFalse();
  });

  it('should hide the entries of a collapsed Age', () => {
    const presentAge = TIMELINE_AGES.find(age => age.id === 'present-age')!;
    component.toggleAge(presentAge);
    const header = component.rows.find(row => row.kind === 'age' && row.age.id === 'present-age');
    expect(header).toEqual(jasmine.objectContaining({ collapsed: true }));
    expect(entryRows().some(row => row.entry.id === 'gate-of-slithers')).toBeFalse();
    expect(component.rows.some(row => row.kind === 'fork')).toBeFalse();

    component.toggleAge(presentAge);
    expect(entryRows().some(row => row.entry.id === 'gate-of-slithers')).toBeTrue();
  });
});
