import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

  private pm_id : string;

  public preventive_maintenance : Observable<PreventiveMaintenance>;
  public procedure : any;
  public pm_status = "Not started";
  public pmLabor: Array<string> = []; //Onde são guardados os nomes do técnicos escolhidos para registo de mão-de-obra.
  public pmFormDisabled : any;

  private techniciansCollection: AngularFirestoreCollection<Technician>;
  public labor_technicians : Observable<Technician[]>; //Onde são guardados todos os técnicos existentes
  
  constructor(private activatedRoute : ActivatedRoute, private pmService : PreventiveMaintenanceService, private modalController : ModalController, private labor_service : LaborService) { }

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

  async pickLabor() {
    const modal = await this.modalController.create({
      component: LaborPickPage
    });
    modal.onDidDismiss().then((returnedLabor) => {

      if (returnedLabor.data.length > 0) {
        //console.log("Returned labor not null.")
        for (const idx in returnedLabor.data) {
          if (this.pmLabor.includes(returnedLabor.data[idx])) { //Verificar duplicados
            continue;
          }
          this.pmLabor.push(returnedLabor.data[idx]);
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
            this.pmService.closePM(this.pm_id, this.procedure, data.value);
          }
        }],
    });
    await alert.present();
  }

}
