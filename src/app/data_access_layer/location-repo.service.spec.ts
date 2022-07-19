import { TestBed } from '@angular/core/testing';

import { LocationRepoService } from './location-repo.service';

describe('LocationRepoService', () => {
  let service: LocationRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
