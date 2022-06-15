import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WoDetailsPage } from './wo-details.page';

const routes: Routes = [
  {
    path: '',
    component: WoDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WoDetailsPageRoutingModule {}
