import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './storage/localstorage.service';
import { Router } from '@angular/router';
import { ILogin } from '@core/interfaces/login.interface';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import {
  ILoginResponse,
  User,
} from '@core/interfaces/login-response.interface';
import { environment } from '@environments/environment.development';
import { toObservable } from '@angular/core/rxjs-interop';
import { ICheckUserStatus } from '@core/interfaces/check-status-user.interface';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_BASE;
  private readonly localStorageService = inject(LocalStorageService);
  private router = inject(Router);
  private readonly http = inject(HttpClient);

  // claves para localStorage

  private readonly USER_KEY = 'auth_user';
  private readonly TOKEN_KEY = 'acess_token';

  // estado de aunthtenticacion
  private _authenticated = signal<boolean>(false);
  private _user = signal<any | null>(null);

  /** 📌 Observable computado para autenticación */
  isAuthenticated$ = toObservable(computed(() => this._authenticated()));
  user$ = toObservable(computed(() => this._user()));

  constructor() {
    this.initAuthStateFromStorage();
  }

  private initAuthStateFromStorage(): void {
    const storedUser = this.localStorageService.getItem<User>(this.USER_KEY);
    const storedToken = this.localStorageService.getItem<string>(
      this.TOKEN_KEY
    );

    if (storedUser && storedToken) {
      this._user.set(storedUser);
      this._authenticated.set(true);
    } else {
      this._user.set(null);
      this._authenticated.set(false);
    }
  }

  /** 🔐 Iniciar sesión (RETORNA Observable, NO se suscribe aquí) */
  login(email: string, password: string): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap((response: ILoginResponse) => {
          this.localStorageService.setItem(this.USER_KEY, response.user);
          this.localStorageService.setItem(
            this.TOKEN_KEY,
            response.access_token
          );
          this.setAuthState(true, response.user);
        }),
        tap(() => this.redirectToHome())
      );
  }

  /** ✅ Verificar estado de sesión */
  checkStatus(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/auth/check-auth-status`).pipe(
      delay(1000),
      catchError((error: HttpErrorResponse) => {
        console.error('Authentication check failed:', error);

        // Si es error 301 u otro error de autenticación
        if (
          // error.status === 301 ||
          error.status === HttpStatusCode.Unauthorized
          // error.status === 403
        ) {
          console.log('Unauthorized access detected, redirecting to login...');
          this.logout();
        }

        return throwError(() => error);
      })
    );
  }

  /** 🚪 Cerrar sesión */
  logout(): void {
    this.clearAuthData();
    this.redirectToLogin();
  }

  /** Limpiar datos de autenticación */
  private clearAuthData(): void {
    this.localStorageService.removeItem(this.USER_KEY);
    this.localStorageService.removeItem(this.TOKEN_KEY);
    this.setAuthState(false, null);
  }

  /** 🔓 Obtener el estado actual de autenticación */
  isAuthenticated(): boolean {
    return this._authenticated();
  } /** 🔄 Actualizar estado de autenticación */
  setAuthState(authenticated: boolean, user: any | null) {
    this._authenticated.set(authenticated);
    this._user.set(user);
  }

  /** Obtener token de acceso */
  getAccessToken(): string | null {
    return this.localStorageService.getItem<string>(this.TOKEN_KEY);
  }

  private redirectToHome(): void {
    this.router.navigate(['/admin/home']);
  }

  private redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
