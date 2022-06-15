import { Component, OnInit } from '@angular/core';
import { alertController } from '@ionic/core';
import { ActivatedRoute } from '@angular/router';

import { WorkOrderService } from 'src/app/domain_layer/work-order.service';
import { WorkOrder } from 'src/app/data_access_layer/work-order';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { PickLaborComponent } from './pick-labor/pick-labor.component';


@Component({
  selector: 'app-wo-details',
  templateUrl: './wo-details.page.html',
  styleUrls: ['./wo-details.page.scss'],
})

export class WoDetailsPage implements OnInit {

  modal: HTMLElement;

  public segment: string = "details";

  wo_id : string;

  private woDoc : AngularFirestoreDocument<WorkOrder>;
  work_order : Observable<WorkOrder>;

  constructor(private woService : WorkOrderService, private activatedRoute : ActivatedRoute, private modalController : ModalController) {
   }

  ngOnInit() {
    this.wo_id = this.activatedRoute.snapshot.paramMap.get('id'); 

    this.woDoc = this.woService.get_work_order(this.wo_id).doc<WorkOrder>('/'+this.wo_id);
    this.work_order = this.woDoc.valueChanges();
  
  }

  segmentChanged(ev) {
    this.segment = ev.detail.value;
    console.log(this.segment)
  }

  async pickLabor() {
    const modal = await this.modalController.create({
      component: PickLaborComponent, 
    });
    return await modal.present()
  }

  async buttonClick() {
    const alert = await alertController.create({
      header: 'Change Work Order Status',
      message: 'Please confirm that you intend to change this work order status to "In progress".',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, 
        {
          text: 'Yes',
          handler: () => {
            console.log("Confirm work order status change. Redirect to WO fill page");
            this.segment = "fill";
          }
        }],
    });

    await alert.present();

  }

}
