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
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ],
      nonNullable: true
    }),
    role: new FormControl('', {
      validators: [
        Validators.required
      ],
      nonNullable: true
    }),
    password: new FormControl('', {
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
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.registerForm.getRawValue();
      console.log('Value registered in side-register component: ', formValue.role);

      this.authService.register(
        formValue.username,
        formValue.email,
        formValue.password,
        formValue.role
      ).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/authentication/login']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error;
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
