import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePurchOrderPageRoutingModule } from './create-purch-order-routing.module';

import { CreatePurchOrderPage } from './create-purch-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePurchOrderPageRoutingModule
  ],
  declarations: [CreatePurchOrderPage]
})
export class CreatePurchOrderPageModule {}
