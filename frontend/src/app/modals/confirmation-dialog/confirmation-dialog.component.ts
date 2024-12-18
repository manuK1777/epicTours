import { Component, Inject } from '@angular/core';
import { 
  MatDialogContent, 
  MatDialogActions, 
  MatDialogModule, 
  MAT_DIALOG_DATA, 
  MatDialogRef 
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [ MatDialogActions, MatDialogContent, MatDialogModule ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'] 
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: 
    { title: string; message: string; confirmText: string; cancelText: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
