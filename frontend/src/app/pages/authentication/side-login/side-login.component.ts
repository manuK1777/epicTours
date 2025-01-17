import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  loading = false;
  error: string = '';

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
  });

  constructor(
    private settings: CoreService,
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  get f() {
    return this.form.controls;
  }

  enableControl(controlName: string) {
    this.form.get(controlName)?.enable();
  }
  
  disableControl(controlName: string) {
    this.form.get(controlName)?.disable();
  }

  onSubmit() {
    console.log('Form submitted', this.form.value);
    console.log('Form valid:', this.form.valid);
    
    if (this.form.valid) {
      this.loading = true;
      this.error = '';
  
      // Disable form controls synchronously
      Object.keys(this.form.controls).forEach(key => {
        this.disableControl(key);
      });
  
      // Perform the login operation
      console.log('Attempting login with:', {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      });

      this.authService.login(
        this.form.get('email')?.value || '',
        this.form.get('password')?.value || ''
      ).subscribe({
        next: (response) => {
          if (response.code === 401 || !response.data) {
            console.error('Login failed:', response.message);
            this.error = response.message;
            this.loading = false;
            // Re-enable form controls
            Object.keys(this.form.controls).forEach(key => {
              this.enableControl(key);
            });
            return;
          }

          console.log('Login successful');
          console.log('Login response:', response);
          this.loading = false;
          
          // Get the return URL from query parameters or use default
          const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/';
          console.log('Attempting to navigate to:', returnUrl);
          
          // Add a small delay to ensure the auth state is updated
          setTimeout(() => {
            this.router.navigate([returnUrl]).then(
              (navigated) => {
                console.log('Navigation result:', navigated);
                if (!navigated) {
                  console.log('Primary navigation failed, trying fallback');
                  // If navigation fails, try the root path
                  this.router.navigate(['/']).then(
                    result => {
                      console.log('Fallback navigation result:', result);
                      if (!result) {
                        console.log('Both navigations failed. Current route:', this.router.url);
                        console.log('Available routes:', this.router.config);
                      }
                    }
                  );
                }
              }
            ).catch(err => console.error('Navigation error:', err));
          }, 100);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error.message || 'Login failed';
          this.loading = false;
  
          // Re-enable form controls synchronously on error
          Object.keys(this.form.controls).forEach(key => {
            this.enableControl(key);
          });
        }
      });
    } else {
      console.log('Form is invalid', this.form.errors);
      this.form.markAllAsTouched();
    }
  }
}
