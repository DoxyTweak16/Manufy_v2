import { Injectable } from '@angular/core';
import { AssetRepoService } from '../data_access_layer/asset-repo.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private asset_repo : AssetRepoService) { }

  getAllAssets() {
    return this.asset_repo.getAllAssets();
  }

  getAsset(id : string) {
    return this.asset_repo.getAsset(id);
  }

  getAssetImg(full_img_path : string) {
    const img_path = full_img_path.substr(full_img_path.indexOf('asset')); 
    return this.asset_repo.getAssetImg(img_path);
  }

}
