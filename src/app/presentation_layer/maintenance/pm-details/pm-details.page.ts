import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LaborPicture } from 'src/app/data_access_layer/labor-picture';
import { PreventiveMaintenance } from 'src/app/data_access_layer/preventive-maintenance';
import { Technician } from 'src/app/data_access_layer/technician';
import { LaborService } from 'src/app/domain_layer/labor.service';
import { PreventiveMaintenanceService } from 'src/app/domain_layer/preventive-maintenance.service';
import { LaborPickPage } from '../../work-orders/wo-details/labor-pick/labor-pick.page';

@Component({
  selector: 'app-pm-details',
  templateUrl: './pm-details.page.html',
  styleUrls: ['./pm-details.page.scss'],
})
export class PmDetailsPage implements OnInit {

  private techniciansCollection: AngularFirestoreCollection<Technician>;
  private laborPictureDoc : AngularFirestoreDocument<LaborPicture>;
  private pm_id : string;

  public preventive_maintenance : Observable<PreventiveMaintenance>;
  public procedure : any;
  public pm_status = "Not started";
  public pmLabor: Array<string> = []; //Onde são guardados os nomes do técnicos escolhidos para registo de mão-de-obra.
  public pmFormDisabled : any;
  public labor_technicians : Observable<Technician[]>; //Onde são guardados todos os técnicos existentes
  public profilePictures : Array<any> = [];
  public laborPictures : Observable<LaborPicture>;
  public maintenance_summary : string = '';

  constructor(private activatedRoute : ActivatedRoute, private pmService : PreventiveMaintenanceService, private modalController : ModalController, private labor_service : LaborService, private toastController : ToastController) { }

  ngOnInit() {
    this.pm_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("Preventive Maintenance ID: ", this.pm_id);

    this.preventive_maintenance = this.pmService.getPM(this.pm_id).snapshotChanges().pipe(
      map(actions => {
        const id   = actions.payload.id;
        const data = actions.payload.data() as PreventiveMaintenance;

        this.pm_status = data.status;

        if (this.pm_status === 'Not started') {
          this.pmFormDisabled = true;
        } else if (this.pm_status === 'Closed') {
          this.pmFormDisabled = true;
          this.laborPictures = this.getSavedLaborPictures();
        } else {
          this.pmFormDisabled = false;
        }

        this.procedure = data.procedure;

        return { id, ...data };
      })
    );

    //TODO: Obter lista técnicos

  }

  deleteLaborEntry(technician : string) {
    if (technician !== "N/A") {

      if (this.pmLabor.length === 1) {
        this.pmLabor.push("N/A"); //O array não pode estar vazia para não dar erro firebase
      }

      const idx = this.pmLabor.indexOf(technician);
  
        if (idx > -1) {
          this.pmLabor.splice(idx, 1);
      }   
      console.log(this.pmLabor)
      this.techniciansCollection = this.labor_service.getTechnicians(this.pmLabor);
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
    this.laborPictureDoc = this.labor_service.getAllLaborPicture().doc<LaborPicture>('/'+this.pm_id);
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

  async pickLabor() {
    const modal = await this.modalController.create({
      component: LaborPickPage
    });
    modal.onDidDismiss().then((returnedLabor) => {

      if (returnedLabor.data.length > 0) {
        //console.log("Returned labor not null.")
        for (const idx in returnedLabor.data) {
          if (this.pmLabor.includes( Object.keys(returnedLabor.data[idx])[0]) ) { //Verificar duplicados
            continue;
          }
          this.pmLabor.push( Object.keys(returnedLabor.data[idx])[0] );

          this.profilePictures.push(returnedLabor.data[idx]); //remover se profilePicture solution não resultar
          console.log(this.profilePictures);

        }
        
        //Depois de obter os nomes dos técnicos que participaram na Ordem de Trabalho, devo buscar os seus registos à DB para exibir
        this.techniciansCollection = this.labor_service.getTechnicians(this.pmLabor);

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

  async startPM() {
    console.log("Start PM");
    const alert = await alertController.create({
      header: 'Change Preventive Maintenance Status',
      message: 'Please confirm that you intend to change this preventive maintenance status to "In progress".',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, 
        {
          text: 'Yes',
          handler: () => {
            this.pmService.startPM(this.pm_id);
          }
        }],
    });
    await alert.present();
  }

  async closePM(data: NgForm) {
    const alert = await alertController.create({
      header: 'Change Preventive Maintenance Status',
      message: 'Please confirm that you intend to change this preventive maintenance status to "Closed".',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, 
        {
          text: 'Yes',
          handler: () => {
            console.log(data.value);
            this.pmService.closePM(this.pm_id, this.procedure, data.value, this.pmLabor)
              .then( () => {
                this.labor_service.setLaborPictureDoc(this.pm_id, this.profilePictures)
                  .then( () => {
                    this.laborPictures = this.getSavedLaborPictures();
                  })
                  .catch( (error) => {
                    this.pmToast("Couldn't save labor profile pictures. Please contact system administrator.", "warning");
                  });
              })
              .catch( (err) => {
                this.pmToast(err, "danger");
              });
          }
        }],
    });
    await alert.present();
  }

  async pmToast(msg: string, color = "secondary") {
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
