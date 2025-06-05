import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemstoneExchangeComponent } from './gemstone-exchange.component';

describe('GemstoneExchangeComponent', () => {
  let component: GemstoneExchangeComponent;
  let fixture: ComponentFixture<GemstoneExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GemstoneExchangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GemstoneExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
