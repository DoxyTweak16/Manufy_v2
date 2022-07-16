import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tabs',
  },
  {
    path: 'login',
    loadChildren: () => import('./presentation_layer/login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./presentation_layer/tabs/tabs.module').then( m => m.TabsPageModule),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  },
  {
    path: 'wo-details/:id',
    loadChildren: () => import('./presentation_layer/work-orders/wo-details/wo-details.module').then( m => m.WoDetailsPageModule),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  },
  {
    path: 'pm-details/:id',
    loadChildren: () => import('./presentation_layer/maintenance/pm-details/pm-details.module').then( m => m.PmDetailsPageModule),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  },
  {
    path: 'purchase-order/:id',
    loadChildren: () => import('./presentation_layer/purchases/po-details/po-details.module').then( m => m.PoDetailsPageModule ),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  },
  {
    path: 'asset-details/:id',
    loadChildren: () => import('./presentation_layer/assets_machinery/asset-details/asset-details.module').then( m => m.AssetDetailsPageModule ),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  },
  {
    path: '**',
    loadChildren: () => import('./presentation_layer/not-found/not-found.module').then( m => m.NotFoundPageModule),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  },
  {
    path: 'labor-pick',
    loadChildren: () => import('./presentation_layer/work-orders/wo-details/labor-pick/labor-pick.module').then( m => m.LaborPickPageModule),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  },
  {
    path: 'create-purch-order',
    loadChildren: () => import('./presentation_layer/purchases/create-purch-order/create-purch-order.module').then( m => m.CreatePurchOrderPageModule),
    ...canActivate( () => redirectUnauthorizedTo(['login']) )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
