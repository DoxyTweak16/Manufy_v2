import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasesPage } from './purchases.page';

const routes: Routes = [
  {
    path: '',
    component: PurchasesPage
  },
  {
    path: 'po-details',
    loadChildren: () => import('./po-details/po-details.module').then( m => m.PoDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasesPageRoutingModule {}
