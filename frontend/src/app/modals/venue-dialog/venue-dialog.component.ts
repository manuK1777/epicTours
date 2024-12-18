import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venue-dialog',
  standalone: true,
  imports: [ MaterialModule, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './venue-dialog.component.html',
  styleUrl: './venue-dialog.component.scss'
})
export class VenueDialogComponent {
  venueForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VenueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.mode === 'edit';

    this.venueForm = this.fb.group({
      name: [this.data.venue?.name || '', [Validators.required, Validators.minLength(2)]],
      category: [this.data.venue?.category || '', [Validators.required]], // Corrected
      latitude: [
        this.data.venue?.latitude || '', 
        [Validators.required, Validators.min(-90), Validators.max(90)]
      ],
      longitude: [
        this.data.venue?.longitude || '', 
        [Validators.required, Validators.min(-180), Validators.max(180)]
      ],
    });
    
  }

  save(): void {
    
    if (this.venueForm.valid) {
      this.dialogRef.close({
        action: this.isEditMode ? 'edit' : 'add',
        venue: this.venueForm.value,
      });
    } else {
      console.log('Form is invalid:', this.venueForm.errors); 
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }
}
