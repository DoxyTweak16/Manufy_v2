import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from 'src/app/data_access_layer/location';
import { LocationService } from 'src/app/domain_layer/location.service';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.page.html',
  styleUrls: ['./location-picker.page.scss'],
})
export class LocationPickerPage implements OnInit {

  constructor(private modalController : ModalController, private location_service : LocationService) { }

  public locations : Observable<Location[]>;
  public selectedLocation : any;
  public formInvalid = false;

  ngOnInit() {
    //this.locationsCollection = this.location_service.getAllLocations();
    this.locations = this.location_service.getAllLocations().snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as unknown as Location;      
        return { $key, ...data };
      }))
    );
  }

  submitSelection() {
    if (this.selectedLocation === undefined || this.selectedLocation === '') {
      console.log(this.selectedLocation);
      this.formInvalid = true;
    } else {
      this.dismissModal();
    }
  }

  handleInput(event : any) {
    const query = event.target.value;
    this.locations = this.location_service.getAllLocations(query).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as unknown as Location;
        return { $key, ...data };
      }))
    );
  }


  dismissModal() {
    if(this.selectedLocation === undefined || this.selectedLocation === '') {
      this.modalController.dismiss("N/A");
    } else {
      this.modalController.dismiss(this.selectedLocation);
    }
  }

}
