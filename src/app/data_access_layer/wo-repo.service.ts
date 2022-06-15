import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})

export class WoRepoService {

  constructor(private firestore: AngularFirestore) { }

  getAll(status ?: string, keywords ?:[string]) { 
    return this.firestore.collection('work_orders').snapshotChanges();
  }

  getWO(id : string) {
    // return this.firestore.collection('work_orders').doc(id).get();
    // const work_order_doc = await this.firestore.collection('work_orders').doc(id).get(); // Devolve observable
    return this.firestore.collection('work_orders');
 }
}
