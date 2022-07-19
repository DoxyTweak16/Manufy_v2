import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asset } from 'src/app/data_access_layer/asset';
import { AssetService } from 'src/app/domain_layer/asset.service';
import { LocationPickerPage } from '../location-picker/location-picker/location-picker.page';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.page.html',
  styleUrls: ['./asset-details.page.scss'],
})
export class AssetDetailsPage implements OnInit {

  private asset_id : string;
  private loading : any = null;

  public asset : Observable<Asset>;
  public state_icon_color : string;
  public state_icon_name  : string;


  constructor(private activatedRoute : ActivatedRoute, private assetService : AssetService, private modalController : ModalController, private loadingCtrl : LoadingController, private alertController : AlertController, private toastController : ToastController) { }

  ngOnInit() {

    this.asset_id = this.activatedRoute.snapshot.paramMap.get('id'); 
    console.log("Asset ID: ", this.asset_id);

    this.asset = this.assetService.getAsset(this.asset_id).snapshotChanges().pipe(
      map(actions => {

        const $key = actions.payload.id;
        const data = actions.payload.data() as Asset;
        data.location_history.reverse(); //Para ficar por ordem decrescente a nível de datas - mais recente primeiro e mais antigo em último

        //Obter link da imagem do ativo
        let img_path = data.img;
        data.img     = this.assetService.getAssetImg(img_path);

        //Definir propriedades do icon que indica o estado do ativo (Operational ou Spare/Warehouse)
        this.setStateIcon(data.state);

        return { $key, ...data };

      })
    );

  }

  setStateIcon(asset_state : string) {
    if (asset_state === 'Operational') {
      this.state_icon_color = "secondary";
      this.state_icon_name  = "chevron-up-circle";
    } else {
      this.state_icon_color = "medium";
      this.state_icon_name  = "remove-circle";
    }
  }

  async changeLocation() {
    console.log("User wants to change location");

    this.showLoading();

    const modal = await this.modalController.create({
      component: LocationPickerPage
    });

    modal.onDidDismiss().then( async (location) => {
      console.log("Returned location: ", location.data);
      const location_data = location.data;

      if (location.data === 'N/A') {
        return await modal.present().then( () => {
          this.loading.dismiss();
          }
        );
      }

      this.assetService.updateAssetLocation(this.asset_id, location_data)
        .then( () => {
          this.assetToast("Asset location updated with success.");
        })
        .catch( err => {
          console.log("Uh oh... Something went wrong: ", err);
          const err_msg = "Uh oh... Something went wrong. Please try again later.";
          this.showAlert(err_msg);
        })
      }
    );

    return await modal.present().then( () => {
      this.loading.dismiss();
      }
    );
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Loading...",
      spinner: 'crescent'
    });
    this.loading.present();
  }

  async showAlert(msg : string) {
    const alert  = await this.alertController.create({
      header: 'Scan Alert',
      message: msg,
      buttons: ['OK'],
    });
    alert .present();
  }

  async assetToast(msg: string, color = "secondary") {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: color
    });
    toast.present();
  }


}
