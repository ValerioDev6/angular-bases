import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/common/auth.service';

/**
 * Guard para rutas protegidas
 * Verifica si el usuario está autenticado
 * Si no está autenticado, redirecciona al login
 */
export const isLoggedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Verificación directa sin llaves
  if (!authService.isAuthenticated())
    return router.createUrlTree(['/auth/login']);

  return true;
};

/**
 * Guard para rutas públicas (como login)
 * Si el usuario ya está autenticado, redirecciona al dashboard
 * De lo contrario, permite acceso a la ruta
 */
export const isntLoggedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Verificación directa sin llaves
  if (authService.isAuthenticated())
    return router.createUrlTree(['/admin/home']);

  return true;
};
