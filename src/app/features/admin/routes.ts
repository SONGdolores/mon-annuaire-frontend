
import { MainLayout } from '@/layout/main-layout/main-layout';
import { Routes } from '@angular/router';
import { UserPage } from './views/user/user.page';
import { RolePage } from './views/role/role.page';
import { PermissionPage } from './views/permission/permission.page';

export const ADMIN_ROUTES: Routes = [
  {
      path: 'admin',
      component: MainLayout,
      children : [
        {
          path: 'user',
          component: UserPage
        },
         {
          path: 'role',
          component: RolePage
        },
        {
          path: 'permission',
          component: PermissionPage
        },
      ]
    }
];
    