import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssetsPage } from './assets.page';

const routes: Routes = [
  {
    path: '',
    component: AssetsPage
  },
  {
    path: 'asset-details',
    loadChildren: () => import('./asset-details/asset-details.module').then( m => m.AssetDetailsPageModule)
  },
  {
    path: 'location-picker',
    loadChildren: () => import('./location-picker/location-picker/location-picker.module').then( m => m.LocationPickerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsPageRoutingModule {}
