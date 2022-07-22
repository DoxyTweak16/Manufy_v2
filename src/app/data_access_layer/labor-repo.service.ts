import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { arrayUnion } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { LaborPicture } from './labor-picture';
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

  getTechnicianByUsername(username : string) {
    return this.firestore.collection<Technician>("technician", ref => ref.where("username", "==", username) );
  }

  getProfileImg(img_path : string) {
    const ref = this.storage.ref(img_path);
    return ref.getDownloadURL() as Observable<string | null>;
  };

  setLaborPictureDoc(id, laborPictures) {
    console.log("id: ", id); 
    console.log("laborPicture: ", laborPictures);

    const docData = {
      labor : laborPictures
    }

    this.firestore.collection<LaborPicture>('labor_pictures').doc(id).set(docData)
      .then( () => {
        return Promise.resolve();
      })
      .catch( (err) => {
        return Promise.reject(err);
      })
  }

  getAllLaborPicture() {
    return this.firestore.collection<Technician>('labor_pictures');
  }

}
