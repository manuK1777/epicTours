import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VenueDialogComponent } from '../modals/venue-dialog/venue-dialog.component';
import { LocationsService } from './locations.service';

@Injectable({
  providedIn: 'root'
})
export class OpenModalVenueService {

  constructor(
    private dialog: MatDialog,
    private locationsService: LocationsService,

  ) {}

  // openAddVenueDialog(): void {
  //   const dialogRef = this.dialog.open(VenueDialogComponent, {
  //     width: '600px',
  //     data: { mode: 'add' }, // Passing the mode as 'add'
  //   });
  
  //   dialogRef.afterClosed().subscribe((result: { action: string; venue: any; }) => {
  //     if (result?.action === 'add') {
  //       console.log('New Venue Added:', result.venue);
  //       this.refreshVenues(); // Reload venues to reflect the new addition
  //     }
  //   });
  // }
}
