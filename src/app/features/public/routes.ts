
import { Routes } from '@angular/router';
import { PublicPage } from './views/public/public.page';
import { DetailscardsPage } from './views/detailscards/detailscards.page';
import { CartePage } from './views/carte/carte.page';
import { C } from '@angular/cdk/keycodes';

export const PUBLIC_ROUTES: Routes = [

  {
    path: 'public',
    children: [
       {
        path: '',
        loadComponent: () => import('./views/public/public.page').then(() => PublicPage)
      },
      {
        path: 'detailscards/:id',
       loadComponent: () => import('./views/detailscards/detailscards.page').then(() => DetailscardsPage )
      },
      {
        path: 'cartePage',
        loadComponent: () => import('./views/carte/carte.page').then(() => CartePage )
      }
    ]
  }
];
