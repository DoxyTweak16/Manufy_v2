import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { Technician } from 'src/app/data_access_layer/technician';
import { LaborService } from 'src/app/domain_layer/labor.service';

import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-labor-pick',
  templateUrl: './labor-pick.page.html',
  styleUrls: ['./labor-pick.page.scss'],
})

export class LaborPickPage implements OnInit {


  private techniciansCollection: AngularFirestoreCollection<Technician>;
  technicians : Observable<Technician[]>;

  public woLabor = [];

  constructor(private labor_service : LaborService, public modalController : ModalController) { }

  ngOnInit() {
    this.techniciansCollection = this.labor_service.getAllTechnicians();
    this.technicians = this.techniciansCollection.valueChanges();
  }

  laborSelection(data: NgForm) {
    for (const property in data) {
      if (data[property] === true) {
        console.log(`${property} selected as WO labor.`);
        this.woLabor.push(property);
      }
    }

    this.dismissModal();
  }

  dismissModal() {
    this.modalController.dismiss(this.woLabor);

  }

  handleInput(ev) {
    console.log("123");
  }


}