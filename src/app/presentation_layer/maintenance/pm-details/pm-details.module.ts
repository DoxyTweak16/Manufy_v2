import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PmDetailsPageRoutingModule } from './pm-details-routing.module';

import { PmDetailsPage } from './pm-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PmDetailsPageRoutingModule
  ],
  declarations: [PmDetailsPage]
})
export class PmDetailsPageModule {}
