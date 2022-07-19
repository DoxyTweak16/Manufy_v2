import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { PurchaseOrder } from 'src/app/data_access_layer/purchase-order';
import { PurchaseService } from 'src/app/domain_layer/purchase.service';

import { map } from 'rxjs/operators';
import { ModalController, ToastController } from '@ionic/angular';
import { CreatePurchOrderPage } from './create-purch-order/create-purch-order.page';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {

  private purchaseOrdersCollection: AngularFirestoreCollection<PurchaseOrder>;
  public purchaseOrders : Observable<PurchaseOrder[]>;

  public managerProfile = true;    //TODO: Automatizar reconhecimento de utilizador com perfil de gestor ou não
  private userName = "afoliveira"; //TODO: Automatizar obtenção do username da sessão

  constructor(private poService : PurchaseService, public toastController : ToastController, private modalController : ModalController ) { }

  ngOnInit() {
    this.purchaseOrdersCollection = this.poService.getAllPurchaseOrders();
    this.purchaseOrders = this.purchaseOrdersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as PurchaseOrder; 
        data.date  = data.date.toDate();       
        return { $key, ...data };
      }))
    );
  }

  approve_po(item) {
    const newStatus = "Approved";
    console.log("Approve WO: ", item);
    this.poService.approvePO(item, this.userName);
  }

  reject_po(item) {
    const newStatus = "Rejected";
    console.log("Reject WO: ", item);
    this.poService.rejectPO(item, this.userName);
    this.presentToast(newStatus);
  }

  handleInput(event : any) {
    const query = event.target.value;
    console.log(query);

    this.purchaseOrdersCollection = this.poService.getAllPurchaseOrders(query);
    this.purchaseOrders = this.purchaseOrdersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as PurchaseOrder; 
        data.date  = data.date.toDate();       
        return { $key, ...data };
      }))
    );

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

  async createPO() {
    const modal = await this.modalController.create({
      component: CreatePurchOrderPage
    });

    //TODO: Não esquecer eventual método para receber dados após dismiss

    return await modal.present();

  }

}
