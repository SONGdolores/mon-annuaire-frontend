
import { MainLayout } from '@/layout/main-layout/main-layout';
import { Routes } from '@angular/router';
import { OverviewPage } from './views/overview/overview.page';
//import { authGuard } from '@/core/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: MainLayout,
    children : [
      {
        path: 'overview',
        component: OverviewPage,
      },
    ]
  }
];
