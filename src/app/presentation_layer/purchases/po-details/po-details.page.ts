import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { kill } from 'process';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PurchaseOrder } from 'src/app/data_access_layer/purchase-order';
import { PurchaseService } from 'src/app/domain_layer/purchase.service';

@Component({
  selector: 'app-po-details',
  templateUrl: './po-details.page.html',
  styleUrls: ['./po-details.page.scss'],
})
export class PoDetailsPage implements OnInit {

  private po_id       : string;
  private poDoc       : any;

  public purch_order : Observable<PurchaseOrder>;
  //public purch_order : PurchaseOrder;

  //public imgUrl;

  constructor(private activatedRoute : ActivatedRoute, private poService : PurchaseService, private alertController : AlertController) {  }

  ngOnInit() {
    //Obter query parameter contendo o ID da Purchase Order
    this.po_id = this.activatedRoute.snapshot.paramMap.get('id'); 
    console.log("Purchase Order ID: ", this.po_id);

    //(ISTO FUNCIONA) Obter do Firestore o documento onde constam os dados desta Work Order
    //this.poDoc       = this.poService.getPurchaseOrder(this.po_id)
    //this.purch_order = this.poDoc.valueChanges();
    //this.imgUrl = this.poService.getProductImg("gs://manufy-b1352.appspot.com/product/diferencial-2-polos-25a-30ma.jpg");
    //console.log(this.imgUrl);

    this.purch_order = this.poService.getPurchaseOrder(this.po_id).snapshotChanges().pipe(
      map(actions => {
        const data = actions.payload.data() as PurchaseOrder;

        //Vamos obter os links para exibir as imagens dos produtos
        for (let p_key in data.products) {
          let img_path = data.products[p_key].img
          data.products[p_key].img = this.poService.getProductImg(img_path);
        }
        const id   = actions.payload.id;
        return { id, ...data};
      })
    );

  }

  async presentPOAlert(action : string) {
    const alert = await this.alertController.create({
      header  : action + ' Purchase Order',
      message : 'Please confirm that you intend to ' + action.toLowerCase() + ' this purchase order.',
      buttons : [
        {
          text    : 'Cancel',
          role    : 'cancel',
          handler : () => { 
            console.log("Dismissed")
           }
        },
        {
          text    : 'OK',
          role    : 'confirm',
          handler : () => { 
            if (action === 'Approve') {
              this.approve_po();
            } else {
              this.reject_po();
            }
           }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    //console.log("Dismissed with role ", role);

  }

  approve_po() {
    const newStatus = "Approved";
    console.log("Approve WO: ", this.po_id);
    this.poService.approvePO(this.po_id, 'afoliveira');
  }

  reject_po() {
    const newStatus = "Approved";
    console.log("Approve WO: ", this.po_id);
    this.poService.rejectPO(this.po_id, 'afoliveira');
  }

}
