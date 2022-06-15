import { TestBed } from '@angular/core/testing';

import { AssetRepoService } from './asset-repo.service';

describe('AssetRepoService', () => {
  let service: AssetRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
