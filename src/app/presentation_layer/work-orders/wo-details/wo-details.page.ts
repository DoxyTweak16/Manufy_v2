import { Component, OnInit } from '@angular/core';
import { alertController } from '@ionic/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { WorkOrderService } from 'src/app/domain_layer/work-order.service';
import { WorkOrder } from 'src/app/data_access_layer/work-order';
import { Observable, pipe } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
import { LaborPickPage } from './labor-pick/labor-pick.page';

import { Technician } from 'src/app/data_access_layer/technician';
import { LaborService } from 'src/app/domain_layer/labor.service';
import { NgForm } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { AssetService } from 'src/app/domain_layer/asset.service';
import { LaborPicture } from 'src/app/data_access_layer/labor-picture';


@Component({
  selector: 'app-wo-details',
  templateUrl: './wo-details.page.html',
  styleUrls: ['./wo-details.page.scss'],
})

export class WoDetailsPage implements OnInit {

  private woDoc : AngularFirestoreDocument<WorkOrder>;
  private techniciansCollection: AngularFirestoreCollection<Technician>;
  private laborPictureDoc : AngularFirestoreDocument<LaborPicture>;

  public modal: HTMLElement;
  public segment: string = "details";
  public wo_id : string;
  public work_order : Observable<WorkOrder>;
  public work_order_status : string;
  public maintenance_summary : string = ''; //Valor do relatório de intervenção.
  public labor_technicians : Observable<Technician[]>; //Onde são guardados todos os técnicos existentes
  public woLabor : Array<string> = []; //Onde são guardados os nomes do técnicos escolhidos para registo de mão-de-obra.
  public disableInputs = false; // Controla se o botão de adiconar labor está ativo (para OT's In Progress) ou desabilitado (OT's fechadas)
  public profilePictures : Array<any> = []; //Array onde são guardas as profile pictures de técnicos cujos registos mão-de-obrsa já estejam guardados em db.
  public savedLabor = {};

  public laborPictures : Observable<LaborPicture>;


  constructor(private woService : WorkOrderService, private assetService : AssetService, private labor_service : LaborService, private activatedRoute : ActivatedRoute, private modalController : ModalController, private toastController : ToastController) { }


  ngOnInit() {
    //Obter query parameter contendo o ID da Work Order
    this.wo_id = this.activatedRoute.snapshot.paramMap.get('id'); 

    //Obter do Firestore o documento onde constam os dados desta Work Order
    this.woDoc = this.woService.get_work_order().doc<WorkOrder>('/'+this.wo_id);
    this.work_order = this.woDoc.snapshotChanges().pipe(
      map( a => {
        const $key = a.payload.id;
        const data = a.payload.data() as WorkOrder;

        data.date = data.date.toDate();

        //Obter link da imagem do asset
        let img_path = data.asset_img;
        data.asset_img = this.assetService.getAssetImg(img_path);

        this.work_order_status = data.status;

        if (this.work_order_status === 'Closed') {
          this.laborPictures = this.getSavedLaborPictures(); //Vai buscar as fotos dos técnicos que constam no registo de mão-de-obra.
        }
        
        this.disableInputs = (data.status === "In progress") ? false : true ;
        return { $key, ...data };
      }))      
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
        this.profilePictures.splice(idx, 1);
      }   

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

  getSavedLaborPictures() {
    //Obter do Firestore o documento onde constam os dados desta Work Order
    this.laborPictureDoc = this.labor_service.getAllLaborPicture().doc<LaborPicture>('/'+this.wo_id);
    return this.laborPictureDoc.snapshotChanges().pipe(
      map( a => {
        const data = a.payload.data() as LaborPicture;

        for (let i = 0; i < data.labor.length; i++) {
          //console.log(data.labor[i]); //É o objeto {afoliveira: 'photolink'}
          let username  = Object.keys(data.labor[i])[0];

          let profilePicture = Object.values(data.labor[i])[0];
          profilePicture = this.labor_service.getProfileImg(profilePicture);

          data.labor[i][username] = profilePicture;

          //console.log(data.labor[i]);

        }

        return {...data};

      }))
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
            this.woService.woToInProgress(this.wo_id);
            this.segment = "fill";
          }
        }],
    });

    await alert.present();
  }

  async pickLabor() {
    const modal = await this.modalController.create({
      component: LaborPickPage
    });

    modal.onDidDismiss().then((returnedLabor) => {
      if (returnedLabor.data.length > 0) {
        for (const idx in returnedLabor.data) {
          //if (this.woLabor.includes(returnedLabor.data[idx])) { //Verificar duplicados
          if (this.woLabor.includes( Object.keys(returnedLabor.data[idx])[0]) ) {
            continue;
          }
          //this.woLabor.push(returnedLabor.data[idx]);
          this.woLabor.push( Object.keys(returnedLabor.data[idx])[0] );
          
          this.profilePictures.push(returnedLabor.data[idx]); //remover se profilePicture solution não resultar
          console.log(this.profilePictures);
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
        //console.log(this.woLabor);
      }
    });
    return await modal.present();
  }

  async closeWorkOrder(data: NgForm) {
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
            this.segment = "fill";
            this.woService.woToClosed(this.wo_id, data.value, this.woLabor)
              .then( () => {
                this.labor_service.setLaborPictureDoc(this.wo_id, this.profilePictures)
                  .then( () => {
                    this.laborPictures = this.getSavedLaborPictures();
                  })
                  .catch( (error) => {
                    this.woToast("Couldn't save labor profile pictures. Please contact system administrator.", "warning");
                  });
              })
              .catch( (err) => {
                this.woToast(err, "danger");
              });
          }
        }],
    });

    await alert.present();

  }

  async woToast(msg: string, color = "secondary") {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      color: color,
      buttons: [ {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    toast.present();
  }

}
