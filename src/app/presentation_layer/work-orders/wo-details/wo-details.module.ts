import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WoDetailsPageRoutingModule } from './wo-details-routing.module';

import { WoDetailsPage } from './wo-details.page';
import { LaborPickPageModule } from './labor-pick/labor-pick.module';
import { LaborPickPage } from './labor-pick/labor-pick.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WoDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [WoDetailsPage]
})
export class WoDetailsPageModule {}
