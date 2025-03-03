import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Forbidden) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No cuenta con los permisos necesarios para realizar esta acción. Contacte a su administrador.',
          confirmButtonText: 'Entendido',
        });
      }

      return throwError(() => error);
    })
  );
};
