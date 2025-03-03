import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpAdapter } from '@core/services/common/base-api.service';
import { catchError, delay, map, Observable, of } from 'rxjs';
import { IRolesResponse } from '../interfaces/roles.interface';
import { HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '@core/constant/api.endpoint';
import { IRolResponse } from '../interfaces/role.interface';
import { rxResource } from '@angular/core/rxjs-interop';

interface RoleInputs {
  page: number;
  limit: number;
  search: string;
}
@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly http = inject(HttpAdapter);

  getAllRoles(
    page: number = 1,
    limit: number = 5,
    search: string = ''
  ): Observable<IRolesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    return this.http.get<IRolesResponse>(API_ENDPOINTS.ROLES, params);
  }

  createRole(data: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.ROLES, data);
  }

  updatedRole(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${API_ENDPOINTS.ROLES}/${id}`, data);
  }

  getRoleById(id: number): Observable<IRolResponse> {
    return this.http
      .get<IRolResponse>(`${API_ENDPOINTS.ROLES}/${id}`)
      .pipe(delay(500));
  }

  deleteRolById(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${API_ENDPOINTS.ROLES}/${id}`).pipe(
      catchError(() => of(false)),
      map(() => true)
    );
  }

  // Definir las señales para los parámetros de paginación y búsqueda
  page = signal<number>(1);
  limit = signal<number>(5);
  search = signal<string>('');

  // Crear una señal computada que combine todos los parámetros
  queryParams$ = computed(() => ({
    page: this.page(),
    limit: this.limit(),
    search: this.search(),
  }));

  rolesResource = rxResource({
    request: this.queryParams$,
    loader: (params) => {
      const httpParams = new HttpParams()
        .set('page', params.request.page.toString())
        .set('limit', params.request.limit.toString())
        .set('search', params.request.search);

      return this.http.get<IRolesResponse>(API_ENDPOINTS.ROLES, {
        params: httpParams,
      });
    },
  });
}
