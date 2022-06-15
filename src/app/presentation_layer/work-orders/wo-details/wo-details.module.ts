import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WoDetailsPageRoutingModule } from './wo-details-routing.module';

import { WoDetailsPage } from './wo-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WoDetailsPageRoutingModule
  ],
  declarations: [WoDetailsPage]
})
export class WoDetailsPageModule {}
