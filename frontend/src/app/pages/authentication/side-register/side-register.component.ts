import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-register',
  templateUrl: './side-register.component.html',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule, ReactiveFormsModule]
})
export class AppSideRegisterComponent implements OnInit {
  error: string = '';
  loading: boolean = false;

  registerForm = new FormGroup({
    username: new FormControl({
      value: '',
      disabled: true
    }, {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ],
      nonNullable: true
    }),
    email: new FormControl({
      value: '',
      disabled: true
    }, {
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ],
      nonNullable: true
    }),
    password: new FormControl({
      value: '',
      disabled: true
    }, {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ],
      nonNullable: true
    })
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Enable all form controls on initialization
    Object.keys(this.registerForm.controls).forEach(key => {
      this.enableControl(key);
    });
  }

  onSubmit() {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true;
      this.error = '';
      
      // Disable the form during submission
      Object.keys(this.registerForm.controls).forEach(key => {
        this.disableControl(key);
      });
      
      const formValue = this.registerForm.getRawValue();
      
      this.authService.register(
        formValue.username,
        formValue.email,
        formValue.password
      ).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/home']);
          // Enable the form after submission
          Object.keys(this.registerForm.controls).forEach(key => {
            this.enableControl(key);
          });
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Registration failed';
          // Enable the form if there's an error
          Object.keys(this.registerForm.controls).forEach(key => {
            this.enableControl(key);
          });
          this.error = error.message;
        }
      });
    }
  }

  enableControl(controlName: string) {
    this.registerForm.get(controlName)?.enable();
  }
  
  disableControl(controlName: string) {
    this.registerForm.get(controlName)?.disable();
  }
}
