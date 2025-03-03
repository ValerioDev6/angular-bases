import {
  HttpErrorResponse,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { catchError, delay, map, Observable, of, pipe, tap } from 'rxjs';
import { IUsersResponse, User } from '../interfaces/users.interface';
import { API_ENDPOINTS } from '@core/constant/api.endpoint';
import { HttpAdapter } from '@core/services/common/base-api.service';
import { ICreateUser } from '../interfaces/create-user.interface';
import { IUserResponse } from '../interfaces/user.interface';
import { IRolesCombo } from '../interfaces/role-combo.interface';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpAdapter);

  private page = signal<number>(1);
  private limit = signal<number>(5);
  private search = signal<string>('');
  readonly totalCount = signal<number>(0);

  userQueryParams$ = computed(() => ({
    page: this.page(),
    limit: this.limit(),
    search: this.search(),
  }));

  usersResource = rxResource({
    request: this.userQueryParams$,
    loader: (params) => {
      const httpParams = new HttpParams()
        .set('page', params.request.page.toString())
        .set('limit', params.request.limit.toString())
        .set('search', params.request.search);

      return this.http
        .get<IUsersResponse>(API_ENDPOINTS.USERS, httpParams)
        .pipe(
          map((response) => {
            this.totalCount.set(response.info.total);
            return response.users;
          }),
          delay(1000)
        );
    },
  });

  // Accesores públicos para las señales privadas
  readonly pageSignal = this.page;
  readonly limitSignal = this.limit;
  readonly searchSignal = this.search;
  users = computed(() => this.usersResource.value() ?? ([] as User[]));
  isLoading = this.usersResource.isLoading;

  reloadUsers(): void {
    this.usersResource.set([]);
    this.usersResource.reload();
  }

  createUser(data: ICreateUser): Observable<any> {
    return this.http.post<any>(`${API_ENDPOINTS.USERS}`, data);
  }

  getUserById(id: number): Observable<IUserResponse> {
    return this.http.get<IUserResponse>(`${API_ENDPOINTS.USERS}`);
  }

  getRolesCombo(): Observable<IRolesCombo[]> {
    return this.http.get<IRolesCombo[]>(`${API_ENDPOINTS.USERS}/combo`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${API_ENDPOINTS.USERS}/${id}`, data);
  }

  deleteUserById(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${API_ENDPOINTS.USERS}/${id}`).pipe(
      catchError(() => of(false)),
      map(() => true)
    );
  }

  getAllUsers(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Observable<IUsersResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    return this.http.get<IUsersResponse>(API_ENDPOINTS.USERS, params);
  }
}
