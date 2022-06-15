import { TestBed } from '@angular/core/testing';

import { LaborRepoService } from './labor-repo.service';

describe('LaborRepoService', () => {
  let service: LaborRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaborRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
