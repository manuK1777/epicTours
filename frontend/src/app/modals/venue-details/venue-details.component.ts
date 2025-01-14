import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-venue-details',
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule]
})
export class VenueDetailsComponent {
  displayedColumns: string[] = ['property', 'value'];

  constructor(
    public dialogRef: MatDialogRef<VenueDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venue: any }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
