import { TestBed } from '@angular/core/testing';

import { WoRepoService } from './wo-repo.service';

describe('WoRepoService', () => {
  let service: WoRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WoRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
