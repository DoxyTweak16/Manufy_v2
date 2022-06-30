import { Injectable } from '@angular/core';
import { PoRepoService } from '../data_access_layer/po-repo.service';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private po_repo : PoRepoService) { }

  getAllPurchaseOrders() {
    return this.po_repo.getAllPurchaseOrders();
  }

  getPurchaseOrder(id : string) {

  }

  approvePO(id: string) {
    const newStatus = "Approved";
    this.po_repo.updatePoStatus(id, {status: newStatus});
  }

  rejectPO(id: string) {
    const newStatus = "Rejected";
    this.po_repo.updatePoStatus(id, {status: newStatus});
  }

}
