import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User, AuthResponse, AuthResponseData } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private refreshTokenTimeout: any;

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      // Assuming user details can be fetched with the token
      // Or store user details in a cookie as well
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer();
      }
    }
  }

  register(username: string, email: string, password: string, role: string): Observable<any> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/register`,
        {
          username,
          email,
          password,
          role,
        },
        {
          observe: 'response',
          withCredentials: true,
        }
      )
      .pipe(
        tap((response) => {
          console.log('Register response:', response.body);
          if (response.body && 'data' in response.body && response.body.data?.token) {
            console.log('Token found in response body');
          } else {
            console.log('No token in response body');
          }
          this.handleAuthSuccess(response);
        }),
        map((response) => response.body),
        catchError((error) => {
          console.log('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        { email, password },
        {
          observe: 'response',
          withCredentials: true,
        }
      )
      .pipe(
        tap((response) => {
          console.log('Login response:', response.body);
          if (response.body && 'data' in response.body && response.body.data?.token) {
            console.log('Token found in response body');
          } else {
            console.log('No token in response body');
          }
          this.handleAuthSuccess(response);
        }),
        map((response) => response.body),
        catchError((error) => {
          console.log('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.http.get(`${this.apiUrl}/logout`, { withCredentials: true }).subscribe();
    this.stopRefreshTokenTimer();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/authentication/login'], {
      queryParams: { returnUrl: '/home' },
    });
  }

  refreshToken(): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/refresh-token`,
        {},
        {
          observe: 'response', // Get the full response including headers
          withCredentials: true,
        }
      )
      .pipe(
        tap((response: HttpResponse<any>) => {
          console.log('Refresh token response headers:', response.headers.keys());
          console.log('Authorization header:', response.headers.get('Authorization'));
          console.log('Refresh token response:', response.body);
          this.handleAuthSuccess(response);
        }),
        map((response) => {
          // Return the processed data that includes both token and user
          const responseData =
            response.body && 'data' in response.body ? response.body.data : response.body;
          return {
            token: responseData?.token,
            user: responseData?.user,
          };
        }),
        catchError((error) => {
          console.log('Refresh token error:', error);
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string | string[]): boolean {
    const user = this.currentUserSubject.value;
    console.log('Checking role:', role);
    console.log('Current user in hasRole:', user);

    if (!user) return false;

    if (Array.isArray(role)) {
      const hasRole = role.includes(user.role);
      console.log(`User role ${user.role} included in ${role}:`, hasRole);
      return hasRole;
    }
    const hasRole = user.role === role;
    console.log(`User role ${user.role} equals ${role}:`, hasRole);
    return hasRole;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleAuthSuccess(response: HttpResponse<AuthResponse>): void {
    if (!response.body) {
      throw new Error('Response body is null');
    }

    let userData: AuthResponseData | null = null;

    if ('data' in response.body) {
      // Handle wrapped response
      userData = response.body.data as AuthResponseData;
    } else if ('user' in response.body && 'token' in response.body) {
      // Handle direct response
      userData = response.body as AuthResponseData;
    } else {
      throw new Error('Invalid response format');
    }

    if (!userData) {
      throw new Error('User data is null');
    }

    const { user, token } = userData;
    console.log('Response data:', userData);
    console.log('User from response:', user);
    console.log('Token from response:', token);

    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored:', token);
    } else {
      console.log('No token in response');
    }

    if (user) {
      // Ensure role is included when storing user data
      const userWithRole = {
        ...user,
        role: user.role || 'user', // Fallback to 'user' if role is not present
      };
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
      this.currentUserSubject.next(userWithRole);
      this.startRefreshTokenTimer();
      console.log('Stored user with role:', userWithRole);
    } else {
      console.log('No user found in response');
    }
  }

  private startRefreshTokenTimer() {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(decoded.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000; // Refresh 1 minute before expiry

      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken().subscribe();
      }, timeout);
    } catch {
      this.logout();
    }
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth error:', error);
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error.message || error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
