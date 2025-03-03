// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from '@core/services/common/auth.service';

// export const AuthInterceptorHttpService: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = authService.getAccessToken();

//   if (token) {
//     console.log('PASNADO POR INTERCEPROT');
//     const clonedRequest = req.clone({
//       headers: req.headers
//         .set('Content-Type', 'application/json')
//         .set('Authorization', `Bearer ${token}`),
//     });
//     return next(clonedRequest);
//   }

//   return next(req);

// };

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/common/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptorHttpService: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let clonedRequest = req;
  if (token) {
    console.log('PASANDO POR INTERCEPTOR');
    clonedRequest = req.clone({
      headers: req.headers
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`),
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401].includes(error.status)) {
        console.log(
          'Acceso no autorizado detectado en el interceptor, redirigiendo al login...'
        );
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
