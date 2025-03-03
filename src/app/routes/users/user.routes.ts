import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'listado',
    loadComponent: () =>
      import('./pages/user-page/user-page.component').then(
        (m) => m.UserPageComponent
      ),
  },

  {
    path: '**',
    redirectTo: 'listado',
  },
];
