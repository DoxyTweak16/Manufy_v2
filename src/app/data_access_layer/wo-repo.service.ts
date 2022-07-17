import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { WorkOrder } from './work-order';

@Injectable({
  providedIn: 'root'
})

export class WoRepoService {

  constructor(private afs: AngularFirestore) { }

  getAll(status ?: string, keywords ?:[string]) { 
    return this.afs.collection<WorkOrder>('work_orders');
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
