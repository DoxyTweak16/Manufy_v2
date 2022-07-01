import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-purch-order',
  templateUrl: './create-purch-order.page.html',
  styleUrls: ['./create-purch-order.page.scss'],
})
export class CreatePurchOrderPage implements OnInit {

  constructor(public modalController : ModalController) { }

  ngOnInit() {
  }

  dismissModal() {
    console.log("Dismiss Modal");
    this.modalController.dismiss();
  }

}
