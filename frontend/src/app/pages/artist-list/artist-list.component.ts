import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { OpenModalCreateArtistService } from '../../services/open-modal-create-artist.service';
import { HttpClient } from '@angular/common/http';
import { ArtistsService } from '../../services/artists.service';
import { Artist } from '../../models/artist.model';
import { RouterLink, Router } from '@angular/router';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [ 
    MatButton, 
    MatTableModule, 
    MatPaginatorModule, 
    RouterLink, 
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule
  ],
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})

export class ArtistListComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'webPage', 'contact', 'phone'];
  dataSource = new MatTableDataSource<Artist>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private openModalCreateArtistService: OpenModalCreateArtistService,
    private http: HttpClient,
    private artistsService: ArtistsService,  
    private router: Router
  ) {
    // Set default sort
    this.dataSource.sortingDataAccessor = (item: Artist, property: string) => {
      switch(property) {
        case 'name': return item.name.toLowerCase();
        default: return item[property as keyof Artist];
      }
    };
  }

  ngOnInit(): void {
    this.loadArtists();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadArtists(): void {
    this.artistsService.getArtists().subscribe({
      next: (artists: Artist[]) => {
        console.log('API Response:', artists); 
        this.dataSource.data = artists;
        console.log('DataSource:', this.dataSource.data); 
        // Sort by name by default in descending order
        this.dataSource.sort = this.sort;
        this.dataSource.sort.sort({ id: 'name', start: 'asc', disableClear: false });
      },
      error: (error) => {
        console.error('Failed to fetch artists', error);
      },
    });
  }
  
  openModalCreateArtist() {
    const dialogRef = this.openModalCreateArtistService.openCreateArtistModal();

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'create') {
        this.loadArtists();
      }
    });
  }

  onSelectArtist(artist: Artist) {
    const artistSlug = artist.name.toLowerCase().replace(/ /g, '-');
    this.router.navigate(['/home/artist', artist.id, artistSlug]);
  }

  sanitizeWebPage(url: string | null): string {
    if (!url || url.trim() === '') {
      return '#';
    }
    return url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
