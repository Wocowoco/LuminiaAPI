import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellInfoBlockComponent } from './spell-info-block.component';

describe('SpellInfoBlockComponent', () => {
  let component: SpellInfoBlockComponent;
  let fixture: ComponentFixture<SpellInfoBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellInfoBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellInfoBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
