import { Routes } from '@angular/router';

import { AUTH_ROUTES } from './features/auth/routes';
import { DASHBOARD_ROUTES } from './features/dashboard/routes';
import { ADMINISTRATION_ROUTES } from './features/administration/routes';
import { ADMIN_ROUTES } from './features/admin/routes';
import { LoginPage } from './features/auth/views/login/login.page';
import { HOMEPAGE_ROUTES } from './features/homepage/routes';
import { PUBLIC_ROUTES } from './features/public/routes';
export const routes: Routes = [
    ...AUTH_ROUTES,
    ...DASHBOARD_ROUTES,
    ...ADMINISTRATION_ROUTES,
    ...ADMIN_ROUTES,{
      path:'' , component:LoginPage,
    },
    ...HOMEPAGE_ROUTES,
    ...PUBLIC_ROUTES,];
