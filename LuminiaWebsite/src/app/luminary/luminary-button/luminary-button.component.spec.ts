import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuminaryButtonComponent } from './luminary-button.component';

describe('LuminaryButtonComponent', () => {
  let component: LuminaryButtonComponent;
  let fixture: ComponentFixture<LuminaryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuminaryButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuminaryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
