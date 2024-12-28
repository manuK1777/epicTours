import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MusicianService } from '../../services/musician.service';
import { Musician } from '../../models/musician.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-create-musician',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.musician ? 'Edit Musician' : 'Add Musician' }}</h2>
    <form [formGroup]="musicianForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-container">
          <mat-form-field appearance="fill">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" required>
            <mat-error *ngIf="musicianForm.get('name')?.hasError('required')">
              Name is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Instrument</mat-label>
            <input matInput formControlName="instrument" required>
            <mat-error *ngIf="musicianForm.get('instrument')?.hasError('required')">
              Instrument is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required type="email">
            <mat-error *ngIf="musicianForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="musicianForm.get('email')?.hasError('email')">
              Please enter a valid email address
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" required>
            <mat-error *ngIf="musicianForm.get('phone')?.hasError('required')">
              Phone is required
            </mat-error>
          </mat-form-field>

          <!-- File upload -->
          <div class="file-upload">
            <button type="button" mat-raised-button (click)="fileInput.click()">
              <mat-icon>cloud_upload</mat-icon>
              Upload Photo
            </button>
            <input #fileInput type="file" (change)="onFileSelected($event)" style="display: none">
            <span *ngIf="selectedFile">{{ selectedFile.name }}</span>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="musicianForm.invalid || isSubmitting">
          {{ data?.musician ? 'Update' : 'Add' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
    .file-upload {
      margin: 1rem 0;
    }
  `]
})
export class CreateMusicianComponent implements OnInit {
  musicianForm: FormGroup;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateMusicianComponent>,
    private musicianService: MusicianService,
    @Inject(MAT_DIALOG_DATA) public data: { musician?: Musician, artistId: number }
  ) {
    this.musicianForm = this.fb.group({
      name: ['', Validators.required],
      instrument: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data?.musician) {
      this.musicianForm.patchValue(this.data.musician);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.musicianForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();
      const musicianData = this.musicianForm.value;
      
      // Add the artist_id
      formData.append('artist_id', this.data.artistId.toString());
      
      // Add all form fields
      Object.keys(musicianData).forEach(key => {
        formData.append(key, musicianData[key]);
      });

      // Append file if selected
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      const request = this.data.musician
        ? this.musicianService.updateMusician(this.data.musician.id!, formData)
        : this.musicianService.createMusician(formData);

      request.subscribe({
        next: (response) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
