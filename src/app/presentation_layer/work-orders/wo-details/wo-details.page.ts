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
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';


@Component({
  selector: 'app-wo-details',
  templateUrl: './wo-details.page.html',
  styleUrls: ['./wo-details.page.scss'],
})

export class WoDetailsPage implements OnInit {

  private woDoc : AngularFirestoreDocument<WorkOrder>;
  private techniciansCollection: AngularFirestoreCollection<Technician>;

  public modal: HTMLElement;
  public segment: string = "details";
  public wo_id : string;
  public work_order : Observable<WorkOrder>;
  public woLabor = []; //Onde são guardados os nomes dos técnicos que participaram na Ordem de Trabalho. Esta lista é usada para fazer query à DB.
  public labor_technicians : Observable<Technician[]>; //Onde são guardados todos os técnicos existentes
  public fillWOForm : FormGroup;
  

  constructor(private fb: FormBuilder, private woService : WorkOrderService, private labor_service : LaborService, private activatedRoute : ActivatedRoute, private modalController : ModalController) { }


  ngOnInit() {
    //Obter query parameter contendo o ID da Work Order
    this.wo_id = this.activatedRoute.snapshot.paramMap.get('id'); 

    //Obter do Firestore o documento onde constam os dados desta Work Order
    this.woDoc = this.woService.get_work_order(this.wo_id).doc<WorkOrder>('/'+this.wo_id);
    this.work_order = this.woDoc.valueChanges();

    this.initializeForm();
  
  }

  initializeForm() {
    this.fillWOForm = this.fb.group({
      maintenance_summary: '',
      laborRecords: this.fb.array([]),
      unavailability_startTime: '',
      unavailability_endTime: ''
    });
  }

  get laborRecords() {
    return this.fillWOForm.get('laborRecords') as FormArray;
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
      this.techniciansCollection = this.labor_service.getTechnicians(this.woLabor);
        this.labor_technicians = this.techniciansCollection.snapshotChanges().pipe(
          map(actions => actions.map( a => {
            const $key = a.payload.doc.id;
            const data = a.payload.doc.data() as Technician;
            //Obter link das imagens de profile de cada técnico
            let img_path = data.img;
            data.img = this.labor_service.getProfileImg(img_path);
            return { $key, ...data };
          })), 
          take(1));
    }
  }

  async pickLabor() {
    const modal = await this.modalController.create({
      component: LaborPickPage
    });
    modal.onDidDismiss().then((returnedLabor) => {

      if (returnedLabor.data.length > 0) {
        console.log("Returned labor not null.")
        for (const idx in returnedLabor.data) {
          //if (this.woLabor.includes(returnedLabor.data[idx])) { //Verificar duplicados
          //  continue;
          //}
          this.woLabor.push(returnedLabor.data[idx]);

          const laborRecord = this.fb.group({
            technician_name: ['', Validators.required],
            hours          : ['', Validators.required]
          });

          console.log("laborRecord push");
          this.laborRecords.push(laborRecord);

        }
        
        //Depois de obter os nomes dos técnicos que participaram na Ordem de Trabalho, devo buscar os seus registos à DB para exibir
        this.techniciansCollection = this.labor_service.getTechnicians(this.woLabor);
        this.labor_technicians = this.techniciansCollection.snapshotChanges().pipe(
          map(actions => actions.map( a => {
            const $key = a.payload.doc.id;
            const data = a.payload.doc.data() as Technician;
            //Obter link das imagens de profile de cada técnico
            let img_path = data.img;
            data.img = this.labor_service.getProfileImg(img_path);
            return { $key, ...data };
          })), 
          take(1));
        console.log(this.woLabor);
      }
    });
    return await modal.present();
  }

  async closeWorkOrder(data: NgForm) {
    console.log(this.fillWOForm.value);
    const alert = await alertController.create({
      header: 'Change Work Order Status',
      message: 'Please confirm that you intend to change this work order status to "Closed".',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, 
        {
          text: 'Yes',
          handler: () => {
            console.log("Confirm work order status change");
            this.segment = "fill";
            console.log(data);
          }
        }],
    });

    await alert.present();

  }

  async startWorkOrder() {
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
            this.woService.woToInProgress(this.wo_id, 'afoliveira');
            this.segment = "fill";
          }
        }],
    });

    await alert.present();
  }

}
