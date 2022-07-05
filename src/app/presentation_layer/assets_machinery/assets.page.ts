import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asset } from 'src/app/data_access_layer/asset';
import { AssetService } from 'src/app/domain_layer/asset.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.page.html',
  styleUrls: ['./assets.page.scss'],
})
export class AssetsPage implements OnInit {

  private assetsCollection : AngularFirestoreCollection<Asset>; //reference to Firestore Collection
  assets : Observable<Asset[]>;

  constructor(private assetService : AssetService) { }

  ngOnInit() {
    this.assetsCollection = this.assetService.getAllAssets()
    this.assets           = this.assetsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as Asset;

        //Obter link da imagem do asset
        let img_path = data.img
        data.img = this.assetService.getAssetImg(img_path);

        return { $key, ...data };
      }))
    );
  }

}
