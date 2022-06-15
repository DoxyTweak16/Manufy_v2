import { TestBed } from '@angular/core/testing';

import { PoRepoService } from './po-repo.service';

describe('PoRepoService', () => {
  let service: PoRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
