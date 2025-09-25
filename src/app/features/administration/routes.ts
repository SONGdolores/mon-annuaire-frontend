
import { MainLayout } from '@/layout/main-layout/main-layout';
import { Routes } from '@angular/router';
import { AdministrationPage } from './views/administration/administration.page';
import { TypeStructurePage } from './views/typestructure/typeStructure.page';
import { DetailsPagePage } from './views/detailspage/detailsPage.page';

export const ADMINISTRATION_ROUTES: Routes = [
  {
    path: 'administration',
    component: MainLayout,
    children: [
      {
        path: '',
        component: AdministrationPage
      },
      {
        path: 'typestructure',
        component: TypeStructurePage
      },
      {
        path: 'detailspage/:id',
        component: DetailsPagePage
      }
    ]
    ,
  }
]
