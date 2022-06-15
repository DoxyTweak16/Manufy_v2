import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'work-orders',
        loadChildren: () => import('../work-orders/work-orders.module').then(m => m.WorkOrdersPageModule)
      },
      {
        path: 'assets',
        loadChildren: () => import('../assets/assets.module').then(m => m.AssetsPageModule)
      },
      {
        path: 'purchases',
        loadChildren: () => import('../purchases/purchases.module').then(m => m.PurchasesPageModule)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('../maintenance/maintenance.module').then(m => m.MaintenancePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/work-orders',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/work-orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
