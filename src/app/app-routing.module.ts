import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./presentation_layer/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./presentation_layer/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'home',
    redirectTo: 'tabs'
  },
  {
    path: 'wo-details/:id',
    loadChildren: () => import('./presentation_layer/work-orders/wo-details/wo-details.module').then( m => m.WoDetailsPageModule)
  },
  {
    path: 'purchase-order/:id',
    loadChildren: () => import('./presentation_layer/purchases/po-details/po-details.module').then( m => m.PoDetailsPageModule )
  },
  {
    path: 'asset-details/:id',
    loadChildren: () => import('./presentation_layer/assets_machinery/asset-details/asset-details.module').then( m => m.AssetDetailsPageModule )
  },
  {
    path: '**',
    loadChildren: () => import('./presentation_layer/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  {
    path: 'labor-pick',
    loadChildren: () => import('./presentation_layer/work-orders/wo-details/labor-pick/labor-pick.module').then( m => m.LaborPickPageModule)
  },
  {
    path: 'create-purch-order',
    loadChildren: () => import('./presentation_layer/purchases/create-purch-order/create-purch-order.module').then( m => m.CreatePurchOrderPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
