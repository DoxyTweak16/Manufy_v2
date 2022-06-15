import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PmDetailsPage } from './pm-details.page';

const routes: Routes = [
  {
    path: '',
    component: PmDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmDetailsPageRoutingModule {}
