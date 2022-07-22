import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactSysPage } from './contact-sys.page';

const routes: Routes = [
  {
    path: '',
    component: ContactSysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactSysPageRoutingModule {}
