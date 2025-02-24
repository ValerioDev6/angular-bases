import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      {
        path: 'home',
        loadChildren: () =>
          import('../../modules/home/home.routes').then((m) => m.HOME_ROUTES),
      },
    ],
  },
];
