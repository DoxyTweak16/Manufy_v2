import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class LocationRepoService {

  constructor(private afs: AngularFirestore) { }

  getAllLocations(queryString : string = '') {
    if (queryString != '') {
      return this.afs.collection<Location>('location', ref => ref.where('name', '>=', queryString).where('name', '<=', queryString+'\uF7FF') );
    } else {
      return this.afs.collection<Location>('location');
    }
  }

  getLocation(id : string) {
    return this.afs.doc<Location>(`location/${id}`);
  }

}
