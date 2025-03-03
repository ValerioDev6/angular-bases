import { Routes } from '@angular/router';

export const ROLES_ROUTES: Routes = [
  {
    path: 'listado',
    loadComponent: () => import('./pages/roles-page/roles-page.component'),
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./pages/edit-role-page/edit-role-page.component'),
  },

  {
    path: 'ver/:id',
    loadComponent: () => import('./components/rol-view/rol-view.component'),
  },
  {
    path: '**',
    redirectTo: 'listado',
  },
];
