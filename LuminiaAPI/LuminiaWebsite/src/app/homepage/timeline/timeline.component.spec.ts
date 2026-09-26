import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineComponent, TimelineRow, formatYear } from './timeline.component';
import { TimelineCardComponent } from './timeline-card/timeline-card.component';

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
      ['Balik', 'Cara', 'Lily', 'Mino', 'Nova', 'Shadow', "Vak'Nor", 'Varis', 'Anya', 'Eynho', 'Fasca']);
    expect(viaNova.characters.filter(c => c.minor).map(c => c.name)).toEqual(['Anya', 'Eynho', 'Fasca']);
  });

  it('should wrap the non-canon one-shots in a single fork', () => {
    expect(component.rows.filter(row => row.kind === 'fork').length).toBe(1);
    expect(component.rows.filter(row => row.kind === 'branch-end').length).toBe(1);
  });
});
