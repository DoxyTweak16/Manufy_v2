import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { Asset } from './asset';

@Injectable({
  providedIn: 'root'
})
export class AssetRepoService {

  constructor(private afs : AngularFirestore, private storage : AngularFireStorage) { }

  getAllAssets() {
    return this.afs.collection<Asset>('asset');
  }

  getAsset(id : string) {
    return this.afs.doc<Asset>(`asset/${id}`);
  }

  getAssetImg(img_path : string) {
    const ref = this.storage.ref(img_path);
    return ref.getDownloadURL() as Observable<string | null>;
  }


}
