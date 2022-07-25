import { Injectable } from '@angular/core';
import { arrayUnion } from '@angular/fire/firestore';
import { AssetRepoService } from '../data_access_layer/asset-repo.service';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private asset_repo : AssetRepoService) { }

  getAllAssets(queryString : string) {
    return this.asset_repo.getAllAssets(queryString);
  }

  getAsset(id : string) {
    return this.asset_repo.getAsset(id);
  }

  getAssetImg(full_img_path : string) {
    const img_path = full_img_path.substr(full_img_path.indexOf('asset')); 
    return this.asset_repo.getAssetImg(img_path);
  }

  updateAssetLocation(asset_id, location_data) {

    //location_id
    const location_id   = location_data.substr(0, location_data.indexOf('@@')); 
    console.log("location_id: ", location_id);

    //location_desc
    const location_desc = location_data.split('@@')[1]; 
    console.log("location_desc: ", location_desc);

    //Adicionar entry ao array de alterações de localizações
    console.log("New date: ", new Date().toLocaleString('en-GB').slice(0, -3).replace(',',''))
    const loc_history_entry = {date: new Date().toLocaleString().slice(0, -3).replace(',',''), location: location_id, technician: 'afoliveira'};

    const newPartialAssetData = {location: location_id, location_desc: location_desc, location_history: arrayUnion(loc_history_entry)};

    newPartialAssetData["state"] = (location_desc === 'Spare/Warehouse') ? 'Spare/Warehouse' : 'Operational';

    return this.asset_repo.updateAsset(asset_id, newPartialAssetData);
    
  }

}
