import { Component, OnInit } from '@angular/core';
import { alertController } from '@ionic/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { WorkOrderService } from 'src/app/domain_layer/work-order.service';
import { WorkOrder } from 'src/app/data_access_layer/work-order';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { LaborPickPage } from './labor-pick/labor-pick.page';

import { Technician } from 'src/app/data_access_layer/technician';
import { LaborService } from 'src/app/domain_layer/labor.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';


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

  woLabor = ["N/A"];

  private techniciansCollection: AngularFirestoreCollection<Technician>;
  technicians : Observable<Technician[]>;

  myForm : FormGroup;
  

  constructor(private fb: FormBuilder, private woService : WorkOrderService, private labor_service : LaborService, private activatedRoute : ActivatedRoute, private modalController : ModalController) {
    this.myForm = new FormGroup({
      maintenance_summary : new FormControl(
        '', [
          Validators.required,
          Validators.minLength(6)
        ]
      )
    });
   }

  ngOnInit() {
    //Obter query parameter contendo o ID da Work Order
    this.wo_id = this.activatedRoute.snapshot.paramMap.get('id'); 

    this.techniciansCollection = this.labor_service.getTechnicians(this.woLabor);
    this.technicians = this.techniciansCollection.valueChanges();

    //Obter do Firestore o documento onde constam os dados desta Work Order
    this.woDoc = this.woService.get_work_order(this.wo_id).doc<WorkOrder>('/'+this.wo_id);
    this.work_order = this.woDoc.valueChanges();
  
  }

  segmentChanged(ev) {
    this.segment = ev.detail.value;
    console.log(this.segment)
  }

  deleteLaborEntry(technician : string) {

    console.log(technician);

    if (technician !== "N/A") {

      if (this.woLabor.length === 1) {
        this.woLabor.push("N/A"); //O array não pode estar vazia para não dar erro firebase
      }

      const idx = this.woLabor.indexOf(technician);
  
        if (idx > -1) {
          this.woLabor.splice(idx, 1);
      }   
      console.log(this.woLabor)
    }
  }

  async pickLabor() {
    const modal = await this.modalController.create({
      component: LaborPickPage
    });
    modal.onDidDismiss().then((returnedLabor) => {
      console.log("onDidDismiss")
      if (returnedLabor.data.length > 0) {
        console.log("Returned labor is null.")
        for (const idx in returnedLabor.data) {
          if (this.woLabor.includes(returnedLabor.data[idx])) { //Verificar duplicados
            continue;
          }
          this.woLabor.push(returnedLabor.data[idx]);
        }
        console.log("Finished pushing technician names to labor array.")
        console.log(this.woLabor);
        if (this.woLabor.includes("N/A")) { //Se tiver "N/A" significa que se trata da primeira submition de valores
          this.woLabor.shift();
        }

      }
    });
    return await modal.present();
  }

  async buttonClick(data: NgForm) {
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
            console.log(data);
          }
        }],
    });

    await alert.present();

  }

}
