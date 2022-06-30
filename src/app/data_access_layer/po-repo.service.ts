import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';

import { PurchaseOrder } from './purchase-order';

@Injectable({
  providedIn: 'root'
})
export class PoRepoService {

  constructor(private afs : AngularFirestore) { }

  getAllPurchaseOrders() {
    return this.afs.collection<PurchaseOrder>('purchase_orders');

  }

  getPurchaseOrder(id : string) {

  }

  updatePoStatus(id: string, changes: Partial<PurchaseOrder>) {
    this.afs.doc(`purchase_orders/${id}`).update(changes);
  }


}
