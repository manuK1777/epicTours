import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ArtistsService } from '../../services/artists.service';
import { Artist } from '../../models/artist.model';
import { LocationsService } from '../../services/locations.service';
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode: boolean;
  event: any = {};
  artists: Artist[] = [];
  locations: Location[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private artistsService: ArtistsService,
    private locationsService: LocationsService
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    this.loadArtists();
    this.loadLocations();

    this.eventForm = this.fb.group({
      title: [this.data.event?.title || '', [Validators.required]],
      category: [this.data.event?.category || ''],
      start_time: [
        this.isEditMode
          ? this.convertUTCToLocal(this.data.event?.start_time)
          : this.convertUTCToLocal(this.data.selectedDate),
        [Validators.required],
      ],
      end_time: [
        this.isEditMode ? this.convertUTCToLocal(this.data.event?.end_time) : '',
        [Validators.required],
      ],
      color: [this.data.event?.color || '#3788d8'],
      artistIds: [this.data.event?.artists?.map((a: Artist) => a.id) || []],
      location_id: [this.data.event?.location_id || '', [Validators.required]],
    });
  }

  loadArtists() {
    this.artistsService.getArtists().subscribe({
      next: (artists) => {
        this.artists = artists;
      },
      error: (error) => {
        this._snackBar.open('Error loading artists', 'Close', { duration: 3000 });
        console.error('Error loading artists:', error);
      },
    });
  }

  loadLocations() {
    this.locationsService.getLocations().subscribe({
      next: (response) => {
        this.locations = response.data;
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        this._snackBar.open('Error loading locations', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  compareArtists(artist1: any, artist2: any): boolean {
    return artist1 && artist2 ? artist1 === artist2 : artist1 === artist2;
  }

  private convertUTCToLocal(utcDateTime: string): string {
    if (!utcDateTime) return '';
    const utcDate = new Date(utcDateTime);
    return utcDate.toISOString().slice(0, 16);
  }

  saveEvent(): void {
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;
      const updatedEvent = {
        ...this.data.event,
        ...formValues,
        venue_id: formValues.location_id, // Map location_id to venue_id
        start_time: this.convertToUTC(formValues.start_time),
        end_time: this.convertToUTC(formValues.end_time),
        artists: this.artists.filter((artist) => formValues.artistIds.includes(artist.id)),
      };

      try {
        this.dialogRef.close({
          action: this.isEditMode ? 'edit' : 'add',
          event: updatedEvent,
        });

        this._snackBar.open(
          this.isEditMode ? 'Event updated successfully!' : 'Event created successfully!',
          'Close',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          }
        );
      } catch (error) {
        console.error('Error saving event:', error);
        this._snackBar.open(
          this.isEditMode
            ? 'Failed to update event. Please try again.'
            : 'Failed to create event. Please try again.',
          'Close',
          {
            duration: 3000,
            panelClass: ['snack-bar-error'],
          }
        );
      }
    } else {
      this._snackBar.open('Please fill in all required fields.', 'Close', {
        duration: 3000,
        panelClass: ['snack-bar-error'],
      });
    }
  }

  private convertToUTC(localDateTime: string): string {
    const date = new Date(localDateTime);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  }

  deleteEvent(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Event Deletion',
        message: 'Are you sure you want to delete this event?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        try {
          this.dialogRef.close({ action: 'delete', event: this.data.event });
          this._snackBar.open('Event deleted successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        } catch (error) {
          console.error('Error deleting event:', error);
          this._snackBar.open('Failed to delete event. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-bar-error'],
          });
        }
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
