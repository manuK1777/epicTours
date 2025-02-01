import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Artist } from '@shared/models/artist.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss'],
})
export class ArtistCardComponent implements OnChanges {
  @Input() artists: Artist[] = [];
  @Output() artistSelected = new EventEmitter<Artist>();
  filteredArtists: Artist[] = [];
  hover = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artists']) {
      this.filteredArtists = this.artists;
    }
  }

  onSelectArtist(artist: Artist): void {
    this.artistSelected.emit(artist);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredArtists = this.artists.filter((artist) =>
      artist.name.toLowerCase().includes(filterValue)
    );
  }

  getImageUrl(file: string | null | undefined): string {
    if (!file) return 'assets/images/default-artist.jpg';

    if (environment.production) {
      // In production (Railway), the backend serves files from the uploads directory
      return `${environment.apiUrl}${environment.uploadsPath}/${file}`;
    } else {
      // In development, images are in the backend/src/uploads folder
      return `${environment.apiUrl}${environment.uploadsPath}/${file}`;
    }
  }
}
