import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('../app/core/layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
  },

  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
