import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WoRepoService } from '../data_access_layer/wo-repo.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  closeWorkOrder(data: NgForm) {
    console.log(data)
  }

  constructor(private wo_repo : WoRepoService) { }

  get_all_work_orders(status ?: string, keywords ?:[string]) {
    //VERIFICAR SE status E keywords NÃO SÃO NULOS OU UNDEFINED
    return this.wo_repo.getAll();
  }

  get_work_order(id : string) {
    return this.wo_repo.getWO(id);
  }

  woToInProgress(id : string, technician_username : string) {
    const newStatus = "In progress";
    this.wo_repo.updateWorkOrderStatus(id, {status: newStatus, owner: technician_username});
  }

  woToClosed(id: string, technician_username : string) {
    const newStatus = "Closed";
    this.wo_repo.updateWorkOrderStatus(id, {status: newStatus, owner: technician_username});
  }

}
