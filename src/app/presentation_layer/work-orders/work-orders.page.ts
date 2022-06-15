import { Component, OnInit } from '@angular/core';

import { WorkOrderService } from 'src/app/domain_layer/work-order.service';
import { WorkOrder } from 'src/app/data_access_layer/work-order';


@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.page.html',
  styleUrls: ['./work-orders.page.scss'],
})
export class WorkOrdersPage implements OnInit {

  work_orders: Array<WorkOrder> = [];
  subscription: any;

  constructor(private woService : WorkOrderService) { }

  ngOnInit() {
    this.woService.get_all_work_orders().subscribe(data => {
      this.work_orders = data.map(e => {
        return {
          $key: e.payload.doc.id,
          asset: e.payload.doc.data()['asset'],
          asset_unavailability: e.payload.doc.data()['asset_unavailability'],
          date: new Date(e.payload.doc.data()['date'].toDate()).toLocaleString([], { year:'numeric', month:'2-digit', day:'2-digit', hour12: false, hour: '2-digit', minute: '2-digit' }),
          description: e.payload.doc.data()['description'],
          images: e.payload.doc.data()['images'],
          labor: e.payload.doc.data()['labor'],
          reporter_name: e.payload.doc.data()['reporter_name'],
          reporter_phone: e.payload.doc.data()['reporter_phone'],
          status: e.payload.doc.data()['status'],
          summary: e.payload.doc.data()['summary'],
          title: e.payload.doc.data()['title'],
        };
      });
    });
  }

}
