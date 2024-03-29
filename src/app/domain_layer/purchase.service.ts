import { Injectable } from '@angular/core';
import { PoRepoService } from '../data_access_layer/po-repo.service';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private po_repo : PoRepoService, private userService : UserService) { }

  getAllPurchaseOrders(queryString : string = '') {
    return this.po_repo.getAllPurchaseOrders(queryString);
  }

  getPurchaseOrder(id : string) {
    return this.po_repo.getPurchaseOrder(id);
  }

  approvePO(id : string) {
    let approver_username = this.userService.getCurrentUser();
    const newStatus = "Approved";
    const decision_date = new Date();
    this.po_repo.updatePoStatus(id, {status: newStatus, approver: approver_username, decision_date: decision_date});
  }

  rejectPO(id: string) {
    let approver_username = this.userService.getCurrentUser();
    const newStatus = "Rejected";
    const decision_date = new Date();
    this.po_repo.updatePoStatus(id, {status: newStatus, approver: approver_username, decision_date: decision_date});
  }

  getProductImg(full_img_path : string) {
    const img_path = full_img_path.substr(full_img_path.indexOf('product')); 
    return this.po_repo.getProductImg(img_path);
  }

}
