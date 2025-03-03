import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../pages/main-layout.component';
import { hasRoleGuard } from '@core/guards/role.guard';

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
          import('../../../routes/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'usuarios',
        canActivate: [hasRoleGuard(['ADMIN'])],

        loadChildren: () =>
          import('../../../routes/users/user.routes').then(
            (m) => m.USER_ROUTES
          ),
      },
      {
        path: 'roles',
        canActivate: [hasRoleGuard(['ADMIN'])],

        loadChildren: () =>
          import('../../../routes/roles/roles.routes').then(
            (m) => m.ROLES_ROUTES
          ),
      },
    ],
  },
];
