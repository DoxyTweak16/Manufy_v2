import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactSysPageRoutingModule } from './contact-sys-routing.module';

import { ContactSysPage } from './contact-sys.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactSysPageRoutingModule
  ],
  declarations: [ContactSysPage]
})
export class ContactSysPageModule {}
