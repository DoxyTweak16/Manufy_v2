import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { Technician } from './technician';

@Injectable({
  providedIn: 'root'
})
export class LaborRepoService {

  constructor(private firestore: AngularFirestore, private storage : AngularFireStorage) { }

  getAllTechnicians(queryString : string = '') {
    if (queryString != '') {
      return this.firestore.collection<Technician>('technician', ref => ref.where('name', '>=', queryString).where('name', '<=', queryString+'\uF7FF'));
    } else {
      return this.firestore.collection<Technician>('technician');
    }
  }

  getTechnicians(names : string[]) {
      return this.firestore.collection<Technician>("technician", ref => ref.where("username", "in", names) );
  }

  getTechnicianByID(id : string) {
   
  }

  getTechnicianByUsername(username : string) {
    return this.firestore.collection<Technician>("technician", ref => ref.where("username", "==", username) );
  }

  getProfileImg(img_path : string) {
    const ref = this.storage.ref(img_path);
    return ref.getDownloadURL() as Observable<string | null>;
  };

}
