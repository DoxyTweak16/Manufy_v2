import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaborPickPage } from './labor-pick.page';

const routes: Routes = [
  {
    path: '',
    component: LaborPickPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaborPickPageRoutingModule {}
