import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
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
  private loading : any;
  private asset_scan_options = {
    resultDisplayDuration: 0,
    prompt: "Place device tag inside scan area."
  };

  public assets : Observable<Asset[]>;

  constructor(private assetService : AssetService, private barcodeScanner : BarcodeScanner, private router : Router, private toastController: ToastController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.assetsCollection = this.assetService.getAllAssets('')
    this.assets           = this.assetsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as Asset;

        //Obter link da imagem do asset
        let img_path = data.img;
        data.img = this.assetService.getAssetImg(img_path);

        return { $key, ...data };
      }))
    );
  }

  async scanDeviceTag() {
    await this.loadingScanResults();
    this.barcodeScanner.scan(this.asset_scan_options)
      .then( barcodeData => {
        const device_tag_content = barcodeData.text;
        console.log("Barcode data: ", device_tag_content);
        this.assetService.getAsset(device_tag_content).get().subscribe(snap => {
          this.loading.dismiss();
          if (snap.data()) {
            this.router.navigate(['/asset-details', device_tag_content]);
          } else {
            this.assetToast("Device not found.", "warning");
          }
        });
      })
      .catch( err => {
        console.log("Error: ", err);
        this.loading.dismiss();
        this.assetToast(err, "danger");
      });
  }

  handleInput(event : any) {
    const query = event.target.value;
    console.log(query);
    this.assetsCollection = this.assetService.getAllAssets(query);
    this.assets           = this.assetsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as Asset;

        //Obter link da imagem do asset
        let img_path = data.img;
        data.img = this.assetService.getAssetImg(img_path);

        return { $key, ...data };
      }))
    );
  }

  async loadingScanResults() {
    this.loading = await this.loadingCtrl.create({
      message: 'Searching devices...',
    });
    this.loading.present();
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
