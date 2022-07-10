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

  getAllTechnicians() {
    return this.firestore.collection<Technician>("technician");
  }

  getTechnicians(names : string[]) {
      return this.firestore.collection<Technician>("technician", ref => ref.where("username", "in", names) );
  }

  getTechnicianByID(id : string) {
   
  }

  getProfileImg(img_path : string) {
    const ref = this.storage.ref(img_path);
    return ref.getDownloadURL() as Observable<string | null>;
  };

}
