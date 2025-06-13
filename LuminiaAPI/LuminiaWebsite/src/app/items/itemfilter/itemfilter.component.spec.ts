import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemfilterComponent } from './itemfilter.component';

describe('ItemfilterComponent', () => {
  let component: ItemfilterComponent;
  let fixture: ComponentFixture<ItemfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemfilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
