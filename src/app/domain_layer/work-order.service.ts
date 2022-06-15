import { Injectable } from '@angular/core';
import { WoRepoService } from '../data_access_layer/wo-repo.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(private wo_repo : WoRepoService) { }

  get_all_work_orders(status ?: string, keywords ?:[string]) {
    //VERIFICAR SE status E keywords NÃO SÃO NULOS OU UNDEFINED
    return this.wo_repo.getAll();
  }

  get_work_order(id : string) {
    return this.wo_repo.getWO(id);
  }

}
