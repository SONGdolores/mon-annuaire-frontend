
import { Routes } from '@angular/router';
import { PublicPage } from './views/public/public.page';
import { DetailscardsPage } from './views/detailscards/detailscards.page';
import { CartePage } from './views/carte/carte.page';
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
        path: 'carte-globale',
        loadComponent: () => import('./views/carte/carte.page').then(() => CartePage )
      }
    ]
  }
];
