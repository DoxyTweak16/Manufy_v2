import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asset } from 'src/app/data_access_layer/asset';
import { AssetService } from 'src/app/domain_layer/asset.service';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.page.html',
  styleUrls: ['./asset-details.page.scss'],
})
export class AssetDetailsPage implements OnInit {

  private asset_id : string;

  public asset : Observable<Asset>;

  constructor(private activatedRoute : ActivatedRoute, private assetService : AssetService) { }

  ngOnInit() {

    this.asset_id = this.activatedRoute.snapshot.paramMap.get('id'); 
    console.log("Asset ID: ", this.asset_id);

    this.asset = this.assetService.getAsset(this.asset_id).snapshotChanges().pipe(
      map(actions => {

        const $key = actions.payload.id;
        const data = actions.payload.data() as Asset;

        //Obter link da imagem do ativo
        let img_path = data.img;
        data.img     = this.assetService.getAssetImg(img_path);

        return { $key, ...data };

      })
    );

  }

}
