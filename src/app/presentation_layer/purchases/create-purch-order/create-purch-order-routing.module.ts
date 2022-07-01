import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePurchOrderPage } from './create-purch-order.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePurchOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePurchOrderPageRoutingModule {}
