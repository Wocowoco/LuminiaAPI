import { TestBed } from '@angular/core/testing';

import { LuminaryService } from './luminary.service';

describe('LuminaryService', () => {
  let service: LuminaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuminaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
