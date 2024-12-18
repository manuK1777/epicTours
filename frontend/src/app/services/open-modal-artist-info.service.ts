import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArtistInfoComponent } from '../modals/artist-info/artist-info.component';

@Injectable({
  providedIn: 'root'
})
export class OpenModalArtistInfoService {

  constructor(private dialog: MatDialog) {}

  openArtistInfoComponent(artistData: any) {
    return this.dialog.open(ArtistInfoComponent, {
      width: '400px',
      data: artistData, 
    });
  }
}
