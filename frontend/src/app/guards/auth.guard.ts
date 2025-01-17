import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard - Checking route:', state.url);
    console.log('AuthGuard - Route data:', route.data);
    console.log('AuthGuard - Current user:', this.authService.getCurrentUser());

    if (!this.authService.isLoggedIn()) {
      console.log('AuthGuard - User not logged in');
      // Store the attempted URL for redirecting
      this.router.navigate(['/authentication/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check if route has required roles
    const roles = route.data['roles'] as Array<string>;
    console.log('AuthGuard - Required roles:', roles);
    
    if (roles && !this.authService.hasRole(roles)) {
      console.log('Access denied - User role not authorized');
      console.log('User role:', this.authService.getCurrentUser()?.role);
      console.log('Required roles:', roles);
      this.router.navigate(['/']);
      return false;
    }

    console.log('AuthGuard - Access granted');
    return true;
  }
}
