import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token only for login and register
    const skipAuthUrls = [
      '/api/auth/login',
      '/api/auth/register'
    ];
    
    if (skipAuthUrls.some(url => request.url.includes(url))) {
      console.log('Skipping token for auth request:', request.url);
      return next.handle(request);
    }

    const token = this.authService.getToken();
    console.log('Token from storage:', token ? 'Present' : 'Not found', 'URL:', request.url);

    if (token) {
      request = this.addToken(request, token);
      console.log('Added token to request headers');
    } else {
      console.log('No token available to add to request');
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('Caught 401 error for URL:', request.url);
          
          // Don't retry refresh token requests
          if (request.url.includes('/api/auth/refresh-token')) {
            console.log('Error refreshing token:', error);
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            return throwError(() => error);
          }
          
          return this.handle401Error(request, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      withCredentials: true,  
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: { token: string; user: any }) => {
          this.isRefreshing = false;
          
          const { token, user } = response;
          console.log('Got new token after refresh:', token);
          console.log('Got user after refresh:', user);
          
          if (!token || !user) {
            console.log('Missing token or user after refresh, logging out');
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            return throwError(() => new Error('Missing token or user after refresh'));
          }
          
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }),
        catchError((error) => {
          console.error('Error refreshing token:', error);
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        console.log('Using cached token for request:', request.url);
        return next.handle(this.addToken(request, token));
      })
    );
  }
}
