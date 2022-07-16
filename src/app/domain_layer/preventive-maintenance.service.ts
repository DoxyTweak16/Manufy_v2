import { Injectable } from '@angular/core';
import { PmRepoService } from '../data_access_layer/pm-repo.service';

@Injectable({
  providedIn: 'root'
})
export class PreventiveMaintenanceService {

  constructor(private pmRepo : PmRepoService) { }

  getMaintenanceListByDate(selectedDate : Date) {
   return this.pmRepo.getMaintenanceListByDate(selectedDate);
  }

  getMaintenanceByMonth(month, year) {
    return this.pmRepo.getMaintenanceByMonth(month, year);
  }

  getMaintenanceListByDay(day, month, year) {
    return this.pmRepo.getMaintenanceListByDay(day, month, year);
  }

  getPM(pm_id) {
    return this.pmRepo.getPM(pm_id);
  }

}
