import { Routes } from '@angular/router';
import { isLoggedGuard, isntLoggedGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [isntLoggedGuard],

    loadChildren: () =>
      import('./routes/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'admin',
    canActivate: [isLoggedGuard],

    loadChildren: () =>
      import('./core/layout/route/layout.routes').then((m) => m.LAYOUT_ROUTES),
  },

  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
