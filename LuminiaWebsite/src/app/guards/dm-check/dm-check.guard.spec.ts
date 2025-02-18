import { TestBed } from '@angular/core/testing';

import { DmCheckGuard } from './dm-check.guard';

describe('DmCheckGuard', () => {
  let guard: DmCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DmCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
