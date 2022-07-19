import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { WorkOrder } from './work-order';

@Injectable({
  providedIn: 'root'
})

export class WoRepoService {

  constructor(private afs: AngularFirestore) { }

  getAll(queryString : string = '') { 
    if (queryString != '') {
      return this.afs.collection<WorkOrder>('work_orders', ref => ref.where('title', '>=', queryString).where('title', '<=', queryString+'\uF7FF'));
    } else {
      return this.afs.collection<WorkOrder>('work_orders', ref => ref.orderBy('date', 'desc'));
    }
  }

  getWO(id : string) {
    // return this.firestore.collection('work_orders').doc(id).get();
    // const work_order_doc = await this.firestore.collection('work_orders').doc(id).get(); // Devolve observable
    return this.afs.collection('work_orders');
 }

 updateWorkOrderStatus(id: string, changes: Partial<WorkOrder>) {
  this.afs.doc(`work_orders/${id}`).update(changes);
}

}
