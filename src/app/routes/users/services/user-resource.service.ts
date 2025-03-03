import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpAdapter } from '@core/services/common/base-api.service';
import { IUsersResponse } from '../interfaces/users.interface';
import { API_ENDPOINTS } from '@core/constant/api.endpoint';
import { IRolesCombo } from '../interfaces/role-combo.interface';
import { ICreateUser } from '../interfaces/create-user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserResourceService {
  private readonly _http = inject(HttpAdapter);
  userId = signal<number>(0);
  createUserData = signal<ICreateUser | null>(null);
  updateUserData = signal<{ id: number; data: any } | null>(null);
  deleteUserId = signal<number | null>(null);
  userResource = rxResource({
    loader: () => {
      return this._http.get<IUsersResponse[]>(API_ENDPOINTS.USERS);
    },
  });

  usuarios = computed(
    () => this.userResource.value() ?? ([] as IUsersResponse[])
  );
  isLoading = this.userResource.isLoading;

  getUserResource = rxResource({
    request: this.userId,
    loader: (userId) => {
      return this._http.get<IUsersResponse[]>(
        `${API_ENDPOINTS.USERS}/${userId}`
      );
    },
  });

  rolesResource = rxResource({
    loader: () => {
      return this._http.get<IRolesCombo[]>(`${API_ENDPOINTS.USERS}/combo`);
    },
  });
  createUserResource = rxResource({
    request: this.createUserData,
    loader: (params) => {
      const data = params.request;
      if (!data) return of(null);

      return this._http.post<any>(`${API_ENDPOINTS.USERS}`, data).pipe(
        tap(() => {
          // Recargar la lista después de crear
          this.userResource.reload();
          // Limpiar datos de creación
          this.createUserData.set(null);
        }),
        catchError((error) => {
          console.error('Error al crear usuario:', error);
          return of(null);
        })
      );
    },
  });

  // Recurso para actualizar usuario
  updateUserResource = rxResource({
    request: this.updateUserData,
    loader: (params) => {
      const updateInfo = params.request;
      if (!updateInfo) return of(null);

      const { id, data } = updateInfo;

      return this._http.patch<any>(`${API_ENDPOINTS.USERS}/${id}`, data).pipe(
        tap(() => {
          // Recargar la lista de usuarios
          this.userResource.reload();

          // Si el usuario que se está viendo es el actualizado, también recargarlo
          if (this.userId() === id) {
            this.getUserResource.reload();
          }

          // Limpiar datos de actualización
          this.updateUserData.set(null);
        }),
        catchError((error) => {
          console.error(`Error al actualizar usuario ${id}:`, error);
          return of(null);
        })
      );
    },
  });

  // Recurso para eliminar usuario
  deleteUserResource = rxResource({
    request: this.deleteUserId,
    loader: (params) => {
      const userId = params.request;
      if (!userId) return of(false);

      return this._http.delete<any>(`${API_ENDPOINTS.USERS}/${userId}`).pipe(
        map(() => true),
        tap(() => {
          // Recargar la lista después de eliminar
          this.userResource.reload();
          // Limpiar ID de eliminación
          this.deleteUserId.set(null);
        }),
        catchError((error) => {
          console.error(`Error al eliminar usuario ${userId}:`, error);
          return of(false);
        })
      );
    },
  });
}
