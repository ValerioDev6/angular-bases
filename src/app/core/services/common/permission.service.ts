import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
export interface Permission {
  action: string; // 'create', 'read', 'update', 'delete', 'no_delete'
  object: string; // 'users', 'roles', 'permissions', etc.
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private authService = inject(AuthService);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  hasPermission(permission: Permission): boolean {
    const user = this.authService['_user']();

    if (!user || !user.roles || !user.roles.role_permissions) {
      return false;
    }

    return user.roles.role_permissions.some(
      (rp: any) =>
        rp.permissions.action === permission.action &&
        rp.permissions.objects.name === permission.object
    );
  }

  /**
   * Verifica si el usuario tiene al menos uno de los permisos especificados
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * Verifica si el usuario tiene todos los permisos especificados
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }
}
