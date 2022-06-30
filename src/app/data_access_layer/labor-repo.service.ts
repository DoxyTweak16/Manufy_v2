import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Technician } from './technician';

@Injectable({
  providedIn: 'root'
})
export class LaborRepoService {

  constructor(private firestore: AngularFirestore) { }

  getAllTechnicians() {
    return this.firestore.collection<Technician>("technician");
  }

  getTechnicians(names : string[]) {
      return this.firestore.collection<Technician>("technician", ref => ref.where("username", "in", names) );
  }

  getTechnicianByID(id : string) {
   
  }

}
