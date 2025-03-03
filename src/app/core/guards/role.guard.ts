import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ERole } from '@core/enums/roles.enum';
import { AuthService } from '@core/services/common/auth.service';
import { map, take } from 'rxjs/operators';

export const hasRoleGuard = (
  allowedRoles: (keyof typeof ERole)[]
): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
      take(1),
      map((user) => {
        // Si no hay usuario, redirige al login
        if (!user) {
          router.navigate(['/auth/login']);
          return false;
        }

        const userRoleName = user.roles?.name;

        if (
          !userRoleName ||
          !allowedRoles.includes(userRoleName as keyof typeof ERole)
        ) {
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  };
};
