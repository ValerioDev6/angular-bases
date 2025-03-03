import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpAdapter {
  private http = inject(HttpClient);

  // get<T>(endpoint: string, params?: any): Observable<T> {
  //   const httpParams = new HttpParams({ fromObject: params || {} });

  //   return this.http.get<T>(`${environment.API_BASE}${endpoint}`, {
  //     params: httpParams,
  //   });
  // }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams: HttpParams;

    if (params instanceof HttpParams) {
      // Si ya es un HttpParams, usarlo directamente
      httpParams = params;
    } else {
      // Si es un objeto simple, convertirlo a HttpParams
      httpParams = new HttpParams({ fromObject: params || {} });
    }

    return this.http.get<T>(`${environment.API_BASE}${endpoint}`, {
      params: httpParams,
    });
  }
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.API_BASE}${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${environment.API_BASE}${endpoint}`, body);
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${environment.API_BASE}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${environment.API_BASE}${endpoint}`);
  }
}
