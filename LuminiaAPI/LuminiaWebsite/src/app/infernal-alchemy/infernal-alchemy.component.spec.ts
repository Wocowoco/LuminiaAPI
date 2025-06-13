import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfernalAlchemyComponent } from './infernal-alchemy.component';

describe('InfernalAlchemyComponent', () => {
  let component: InfernalAlchemyComponent;
  let fixture: ComponentFixture<InfernalAlchemyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfernalAlchemyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfernalAlchemyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
