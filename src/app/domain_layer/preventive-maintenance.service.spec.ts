import { TestBed } from '@angular/core/testing';

import { PreventiveMaintenanceService } from './preventive-maintenance.service';

describe('PreventiveMaintenanceService', () => {
  let service: PreventiveMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreventiveMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
