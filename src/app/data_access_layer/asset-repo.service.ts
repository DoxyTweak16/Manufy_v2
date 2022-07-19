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

  getAllAssets(queryString : string = '') {
    //The \uF7FF value used here is the last Unicode character that exists, so this:
    //Orders all documents by their name value
    //Finds the first document that starts with 'mi'
    //returns all documents, until it reaches one that's bigger than 'mi'
    //Retirado de: https://stackoverflow.com/questions/59334306/checking-if-any-documents-in-firestore-contain-a-substrin
    if (queryString != '') {
      return this.afs.collection<Asset>('asset', ref => ref.where('name', '>=', queryString).where('name', '<=', queryString+'\uF7FF') );
    } else {
      return this.afs.collection<Asset>('asset');
    }
  }

  getAsset(id : string) {
    return this.afs.doc<Asset>(`asset/${id}`);
  }

  getAssetImg(img_path : string) {
    const ref = this.storage.ref(img_path);
    return ref.getDownloadURL() as Observable<string | null>;
  }

  updateAsset(asset_id, changes) {
    return this.afs.doc(`asset/${asset_id}`).update(changes);
  }
  
}
