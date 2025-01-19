import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [ MaterialModule, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent {
  eventForm: FormGroup;
  isEditMode: boolean;
  event: any = {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
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
        this.isEditMode
          ? this.convertUTCToLocal(this.data.event?.end_time) 
          : '',
        [Validators.required],
      ],
      color: [this.data.event?.color || '#3788d8'],
    });
  }

  private convertUTCToLocal(utcDateTime: string): string {
    if (!utcDateTime) return ''; 
    const utcDate = new Date(utcDateTime); 
    return utcDate.toISOString().slice(0, 16); 
  }
  
  saveEvent(): void {
    if (this.eventForm.valid) {
      const updatedEvent = {
        ...this.data.event,
        ...this.eventForm.value,
        start_time: this.convertToUTC(this.eventForm.value.start_time),
        end_time: this.convertToUTC(this.eventForm.value.end_time),
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
          this.isEditMode ? 'Failed to update event. Please try again.' : 'Failed to create event. Please try again.',
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
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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
