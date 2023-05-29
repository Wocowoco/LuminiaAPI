import { TestBed } from '@angular/core/testing';

import { LuminiaApiService } from './luminia-api.service';

describe('LuminiaApiService', () => {
  let service: LuminiaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LuminiaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
