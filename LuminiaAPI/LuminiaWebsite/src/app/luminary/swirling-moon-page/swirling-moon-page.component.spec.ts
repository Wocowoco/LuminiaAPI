import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwirlingMoonPageComponent } from './swirling-moon-page.component';

describe('SwirlingMoonPageComponent', () => {
  let component: SwirlingMoonPageComponent;
  let fixture: ComponentFixture<SwirlingMoonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwirlingMoonPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwirlingMoonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
