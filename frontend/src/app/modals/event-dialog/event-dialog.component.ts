import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [ MaterialModule, FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './event-dialog.component.html',
  styleUrl: './event-dialog.component.scss'
})
export class EventDialogComponent {
  eventForm: FormGroup;
  isEditMode: boolean;
  event: any = {};

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
      this.dialogRef.close({
        action: this.isEditMode ? 'edit' : 'add',
        event: updatedEvent,
      });   
    }  
  }

  private convertToUTC(localDateTime: string): string {
    const date = new Date(localDateTime); 
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  }
  
  
  deleteEvent(): void {
    this.dialogRef.close({ action: 'delete', event: this.data.event });
  }

  cancel(): void {
    this.dialogRef.close();
  }
  
}

