// user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  finalize,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { API_ENDPOINTS } from '@core/constant/api.endpoint';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private loading$$ = new BehaviorSubject<boolean>(false);
  private error$$ = new Subject<string>();
  private refresh$$ = new Subject<void>();

  // Estados públicos como Observables
  loading$ = this.loading$$.asObservable();
  error$ = this.error$$.asObservable();
  users$ = this.refresh$$.pipe(switchMap(() => this.loadUsers()));

  loadUsers(): Observable<User[]> {
    this.loading$$.next(true);
    return this.http.get<User[]>(API_ENDPOINTS.USERS).pipe(
      catchError((err) => this.handleError(err)),
      finalize(() => this.loading$$.next(false))
    );
  }

  createUser(user: User): Observable<User> {
    this.loading$$.next(true);
    return this.http.post<User>(API_ENDPOINTS.USERS, user).pipe(
      tap(() => this.refresh$$.next()), // Actualizar lista
      catchError((err) => this.handleError(err)),
      finalize(() => this.loading$$.next(false))
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    this.loading$$.next(true);
    return this.http.put<User>(`${API_ENDPOINTS.USERS}/${id}`, user).pipe(
      tap(() => this.refresh$$.next()),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loading$$.next(false))
    );
  }

  deleteUser(id: number): Observable<void> {
    this.loading$$.next(true);
    return this.http.delete<void>(`${API_ENDPOINTS.USERS}/${id}`).pipe(
      tap(() => this.refresh$$.next()),
      catchError((err) => this.handleError(err)),
      finalize(() => this.loading$$.next(false))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.message || 'Error de operación';
    this.error$$.next(message);
    return throwError(() => new Error(message));
  }
}
