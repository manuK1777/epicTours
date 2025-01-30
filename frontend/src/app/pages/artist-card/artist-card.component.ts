import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Artist } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss'],
})
export class ArtistCardComponent implements OnInit {
  artists: Artist[] = [];
  filteredArtists: Artist[] = [];
  hover = false;

  constructor(
    private artistsService: ArtistsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistsService.getArtists().subscribe({
      next: (artists: Artist[]) => {
        this.artists = artists;
        this.filteredArtists = artists;
      },
      error: (error) => {
        console.error('Failed to fetch artists', error);
      },
    });
  }

  onSelectArtist(artist: Artist) {
    const artistSlug = artist.name.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/home/artist', artist.id, artistSlug]);
  }

  applyFilter(event: Event) {
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
