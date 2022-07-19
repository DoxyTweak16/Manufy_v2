import { Component, OnInit } from '@angular/core';

import { WorkOrderService } from 'src/app/domain_layer/work-order.service';
import { WorkOrder } from 'src/app/data_access_layer/work-order';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetService } from 'src/app/domain_layer/asset.service';


@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.page.html',
  styleUrls: ['./work-orders.page.scss'],
})
export class WorkOrdersPage implements OnInit {

  private workOrdersCollection: AngularFirestoreCollection<WorkOrder>;
  public work_orders: Observable<WorkOrder[]>;

  constructor(private woService : WorkOrderService, private assetService : AssetService) { }

  ngOnInit() {
    this.workOrdersCollection = this.woService.get_all_work_orders();
    this.work_orders = this.workOrdersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as WorkOrder;

        data.date = data.date.toDate();

        //Obter link da imagem do asset
        let img_path = data.asset_img;
        data.asset_img = this.assetService.getAssetImg(img_path);

        return { $key, ...data};
      }))
    );
  }

  handleInput(event : any) {
    const query = event.target.value;

    this.workOrdersCollection = this.woService.get_all_work_orders(query);
    this.work_orders = this.workOrdersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const $key = a.payload.doc.id;
        const data = a.payload.doc.data() as WorkOrder;

        data.date = data.date.toDate();

        //Obter link da imagem do asset
        let img_path = data.asset_img;
        data.asset_img = this.assetService.getAssetImg(img_path);

        return { $key, ...data};
      }))
    );
  }

}
