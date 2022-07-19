import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';

import { PurchaseOrder } from './purchase-order';

@Injectable({
  providedIn: 'root'
})
export class PoRepoService {

  constructor(private afs : AngularFirestore, private storage : AngularFireStorage) { }

  getAllPurchaseOrders(queryString : string = '') {
    if (queryString != '') {
      return this.afs.collection<PurchaseOrder>('purchase_orders', ref => ref.where('name', '>=', queryString).where('name', '<=', queryString+'\uF7FF'));
    } else {
      return this.afs.collection<PurchaseOrder>('purchase_orders', ref => ref.orderBy('date', 'desc'));
    }
   

  }

  getPurchaseOrder(id : string) {
    return this.afs.doc<PurchaseOrder>(`purchase_orders/${id}`);
  }

  getProductImg(img_path : string) {
    const ref = this.storage.ref(img_path);
    return ref.getDownloadURL() as Observable<string | null>;
  }

  updatePoStatus(id: string, changes: Partial<PurchaseOrder>) {
    this.afs.doc(`purchase_orders/${id}`).update(changes);
  }


}
