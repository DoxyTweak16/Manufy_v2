import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaborPickPageRoutingModule } from './labor-pick-routing.module';

import { LaborPickPage } from './labor-pick.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaborPickPageRoutingModule
  ],
  declarations: [LaborPickPage]
})
export class LaborPickPageModule {}
