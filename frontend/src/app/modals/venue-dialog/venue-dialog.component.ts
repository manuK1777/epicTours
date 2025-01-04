import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { GeocodingService } from 'src/app/services/geocoding.service';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private geocodingService: GeocodingService,
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

  geocodeAddress() {
    const address = this.venueForm.get('address')?.value;
    if (address) {
      this.geocodingService.geocodeAddress(address).subscribe({
        next: (result) => {
          console.log('Geocoding result:', result);
          // Enable the fields temporarily to set values
          this.venueForm.get('latitude')?.enable();
          this.venueForm.get('longitude')?.enable();
          
          this.venueForm.patchValue({
            latitude: result.lat,
            longitude: result.lon
          });
          
          // Disable the fields again
          this.venueForm.get('latitude')?.disable();
          this.venueForm.get('longitude')?.disable();
        },
        error: (error) => {
          console.error('Geocoding failed:', error.message);
          this.venueForm.get('address')?.setErrors({
            geocoding: error.message
          });
        }
      });
    }
  }

  save(): void {
    if (this.venueForm.valid) {
      // Get the raw form values including disabled fields
      const formValue = this.venueForm.getRawValue();
      console.log('Form raw value:', formValue);

      // Convert coordinates to numbers
      const venue = {
        name: formValue.name,
        category: formValue.category,
        address: formValue.address,
        latitude: Number(formValue.latitude),
        longitude: Number(formValue.longitude),
        venueBooker_id: formValue.venueBooker_id || null
      };

      console.log('Saving venue:', venue);
      
      this.dialogRef.close({
        action: this.isEditMode ? 'edit' : 'add',
        venue: venue
      });
    } else {
      console.error('Form is invalid:', this.venueForm.errors);
    }
  }
  
  cancel(): void {
    this.dialogRef.close();
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }
}
