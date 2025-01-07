import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-venue-dialog',
  standalone: true,
  imports: [ MaterialModule, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './venue-dialog.component.html',
  styleUrls: ['./venue-dialog.component.scss']
})
export class VenueDialogComponent {
  venueForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VenueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private geocodingService: GeocodingService,
    private notificationService: NotificationService
  ) {
    this.isEditMode = data.mode === 'edit';

    this.venueForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: [''],
      address: ['', Validators.required],
      latitude: [{ value: '', disabled: true }, Validators.required],
      longitude: [{ value: '', disabled: true }, Validators.required]
    });

    if (this.isEditMode && this.data.venue) {
      this.venueForm.patchValue({
        name: this.data.venue.name,
        category: this.data.venue.category,
        address: this.data.venue.address,
        latitude: this.data.venue.latitude,
        longitude: this.data.venue.longitude
      });
    }
  }

  validateAddress(): void {
    const address = this.venueForm.get('address')?.value;
    if (address) {
      this.geocodingService.geocodeAddress(address).subscribe({
        error: (error) => {
          console.error('Geocoding validation failed:', error.message);
          this.venueForm.get('address')?.setErrors({
            geocoding: error.message
          });
        }
      });
    }
  }

  async save(): Promise<void> {
    if (!this.venueForm.valid) {
      console.error('Form is invalid:', this.venueForm.errors);
      return;
    }

    try {
      // Get the raw form values including disabled fields
      const formValue = this.venueForm.getRawValue();
      console.log('Form raw value:', formValue);

      // Create venue object
      const venue = {
        name: formValue.name,
        category: formValue.category,
        address: formValue.address,
        latitude: 0,  // These will be set during geocoding
        longitude: 0, // in the parent component
        venueBooker_id: formValue.venueBooker_id || null
      };

      // Close dialog with venue data
      this.dialogRef.close({
        action: this.isEditMode ? 'edit' : 'add',
        venue: venue
      });
      
    } catch (error) {
      console.error('Error during save:', error);
      this.notificationService.showError('Error saving venue');
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }
}
