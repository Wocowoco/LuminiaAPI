import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuminaryComponent } from './luminary.component';

describe('LuminaryComponent', () => {
  let component: LuminaryComponent;
  let fixture: ComponentFixture<LuminaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuminaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuminaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
