import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AugmentRuneCardComponent } from './augment-rune-card.component';

describe('AugmentRuneCardComponent', () => {
  let component: AugmentRuneCardComponent;
  let fixture: ComponentFixture<AugmentRuneCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AugmentRuneCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AugmentRuneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
