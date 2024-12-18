import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateArtistComponent } from '../modals/create-artist/create-artist.component';

@Injectable({
  providedIn: 'root'
})
export class OpenModalCreateArtistService {

  constructor(private dialog: MatDialog) {}

  openCreateArtistModal(): MatDialogRef<CreateArtistComponent> {
    const dialogRef = this.dialog.open(CreateArtistComponent, {
      width: '600px',
      disableClose: true,
    });

    return dialogRef;
  }
}
