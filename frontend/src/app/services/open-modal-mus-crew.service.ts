import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MusiciansCrewComponent } from '../modals/musicians-crew/musicians-crew.component'; 

@Injectable({
  providedIn: 'root'
})
export class OpenModalMusCrewService {

  constructor(private dialog: MatDialog) {}

  openMusCrewModal(event: Event, data: { group: boolean; artistId: number }): MatDialogRef<MusiciansCrewComponent> {
    const dialogRef = this.dialog.open(MusiciansCrewComponent, {
      // width: '800px',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });

    return dialogRef;
  }
}