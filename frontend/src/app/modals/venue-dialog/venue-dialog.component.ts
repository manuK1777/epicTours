import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-venue-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './venue-dialog.component.html',
  styleUrls: ['./venue-dialog.component.scss'],
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
      latitude: [{ value: '' }, Validators.required],
      longitude: [{ value: '' }, Validators.required],
    });

    if (this.isEditMode && this.data.venue) {
      this.venueForm.patchValue({
        name: this.data.venue.name,
        category: this.data.venue.category,
        address: this.data.venue.address,
        latitude: this.data.venue.latitude,
        longitude: this.data.venue.longitude,
      });
    }
  }

  validateAddress(): void {
    const address = this.venueForm.get('address')?.value;
    if (address) {
      this.geocodingService.geocodeAddress(address).subscribe({
        next: (result) => {
          if (result && typeof result.lat === 'number' && typeof result.lon === 'number') {
            // Update form with geocoded coordinates
            this.venueForm.patchValue({
              latitude: result.lat,
              longitude: result.lon,
            });
            // Clear any previous geocoding errors
            this.venueForm.get('address')?.setErrors(null);
          }
        },
        error: (error) => {
          console.error('Geocoding validation failed:', error.message);
          // Set geocoding error but don't invalidate the form
          this.venueForm.get('address')?.setErrors({
            geocoding:
              'Address could not be geocoded. You can still save the venue by providing coordinates manually.',
          });
        },
      });
    }
  }

  async save(): Promise<void> {
    // Check if required fields are filled
    if (!this.venueForm.get('name')?.valid || !this.venueForm.get('address')?.value) {
      console.error('Required fields are missing');
      return;
    }

    try {
      const formValue = this.venueForm.getRawValue();
      console.log('Form raw value:', formValue);

      // Check if we have valid coordinates (either from geocoding or manual input)
      const hasValidCoordinates =
        typeof formValue.latitude === 'number' &&
        typeof formValue.longitude === 'number' &&
        !isNaN(formValue.latitude) &&
        !isNaN(formValue.longitude);

      if (!hasValidCoordinates) {
        this.notificationService.showError(
          'Please provide valid coordinates for the venue location'
        );
        return;
      }

      // Create venue object
      const venue = {
        name: formValue.name,
        category: formValue.category,
        address: formValue.address,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        venueBooker_id: formValue.venueBooker_id || null,
      };

      // Close dialog with venue data
      this.dialogRef.close({
        action: this.isEditMode ? 'edit' : 'add',
        venue: venue,
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
