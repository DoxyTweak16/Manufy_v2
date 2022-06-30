import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { PurchaseOrder } from 'src/app/data_access_layer/purchase-order';
import { PurchaseService } from 'src/app/domain_layer/purchase.service';

import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {

  private purchaseOrdersCollection: AngularFirestoreCollection<PurchaseOrder>;
  purchaseOrders : Observable<PurchaseOrder[]>;

  public managerProfile = true; //TODO: Automatizar reconhecimento de utilizador com perfil de gestor ou não

  constructor(private poService : PurchaseService, public toastController : ToastController) { }

  ngOnInit() {
    this.purchaseOrdersCollection = this.poService.getAllPurchaseOrders();
    this.purchaseOrders = this.purchaseOrdersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key   = a.payload.doc.id;
        const data = a.payload.doc.data() as PurchaseOrder;        
        return { $key, ...data };
      }))
    );
  }

  approve_po(item) {
    const newStatus = "Approved";
    console.log("Approve WO: ", item);
    this.poService.approvePO(item);
  }

  reject_po(item) {
    const newStatus = "Rejected";
    console.log("Reject WO: ", item);
    this.poService.rejectPO(item);
    this.presentToast(newStatus);
  }

  async presentToast(newStatus : string) {
    const msg = "Purchase order " + newStatus.toLowerCase() + "."
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: "secondary"
    });
    toast.present();
  }

}
