import { TestBed } from '@angular/core/testing';

import { PmRepoService } from './pm-repo.service';

describe('PmRepoService', () => {
  let service: PmRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
