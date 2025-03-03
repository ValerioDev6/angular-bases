import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {
  Permission,
  PermissionService,
} from '@core/services/common/permission.service';

export const permissionGuard = (
  requiredPermission: Permission
): CanActivateFn => {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    if (permissionService.hasPermission(requiredPermission)) {
      return true;
    }

    // Redirigir a una página de acceso denegado
    router.navigate(['/access-denied']);
    return false;
  };
};

// Para múltiples permisos, al menos uno
export const anyPermissionGuard = (
  permissions: Permission[]
): CanActivateFn => {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    if (permissionService.hasAnyPermission(permissions)) {
      return true;
    }

    router.navigate(['/access-denied']);
    return false;
  };
};
