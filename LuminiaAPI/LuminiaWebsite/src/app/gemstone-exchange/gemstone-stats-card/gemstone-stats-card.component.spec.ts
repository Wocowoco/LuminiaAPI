import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemstoneStatsCardComponent } from './gemstone-stats-card.component';

describe('GemstoneStatsCardComponent', () => {
  let component: GemstoneStatsCardComponent;
  let fixture: ComponentFixture<GemstoneStatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GemstoneStatsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GemstoneStatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
