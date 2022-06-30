import { Injectable } from '@angular/core';
import { LaborRepoService } from '../data_access_layer/labor-repo.service';

@Injectable({
  providedIn: 'root'
})
export class LaborService {

  constructor(private labor_repo : LaborRepoService) { }

  getAllTechnicians() {
    return this.labor_repo.getAllTechnicians();
  }

  getTechnicians(names : string[]) {
    return this.labor_repo.getTechnicians(names);
  }

  getTechnicianByID(id : string) {
   return this.labor_repo.getTechnicianByID(id);
  }

}
