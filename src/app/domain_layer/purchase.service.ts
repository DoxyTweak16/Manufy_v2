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
    return this.po_repo.getPurchaseOrder(id);
  }

  approvePO(id : string, approver_username : string) {
    const newStatus = "Approved";
    this.po_repo.updatePoStatus(id, {status: newStatus, approver: approver_username});
  }

  rejectPO(id: string, approver_username : string) {
    const newStatus = "Rejected";
    this.po_repo.updatePoStatus(id, {status: newStatus, approver: approver_username});
  }

  getProductImg(full_img_path : string) {
    const img_path = full_img_path.substr(full_img_path.indexOf('product')); 
    return this.po_repo.getProductImg(img_path);
  }

}
