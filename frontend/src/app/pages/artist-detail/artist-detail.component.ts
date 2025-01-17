import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ArtistsService } from '../../services/artists.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CreateArtistComponent } from '../../modals/create-artist/create-artist.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../modals/confirmation-dialog/confirmation-dialog.component';
import { Artist } from '../../models/artist.model';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { OpenModalArtistInfoService } from 'src/app/services/open-modal-artist-info.service';
import { OpenModalMusCrewService } from 'src/app/services/open-modal-mus-crew.service';
import { MusicianService } from 'src/app/services/musician.service';
import { Musician } from 'src/app/models/musician.model';
import { CrewService } from 'src/app/services/crew.service';
import { Crew } from 'src/app/models/crew.model';

export interface Tile {
  color: string;
  imageUrl?: string;
  buttonText?: string;
  cols: number;
  rows: number;
  text: string;
  type: 'header' |'text' | 'image' | 'button' | 'info';
}

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [ 
    MatGridListModule,
    CommonModule, 
    MatButtonModule, 
    MatCardModule,
    MatListModule,
    MaterialModule,
],
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {
  id!: number;
  user_id: number;
  name: string = '';
  email: string = '';
  webpage?: string = '';
  contact: string = '';
  phone: string = '';
  created_at: string = '';
  updated_at: string = '';
  tiles: Tile[] = [];
  selectedFile: File | null = null; 

  musicians: Musician[] = [];
  crew: Crew[] = [];
  isLoadingMusicians = false;
  isLoadingCrew = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private artistsService: ArtistsService,
    private musicianService: MusicianService,
    private crewService: CrewService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private openModalArtistInfoService: OpenModalArtistInfoService,
    private openModalMusCrewService: OpenModalMusCrewService,
  ) {}
  

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArtistDetails(this.id);
    this.loadMusicianDetails(this.id);
    this.loadCrewDetails(this.id);    
  }

  loadArtistDetails(id: number): void {
    console.log('Loading artist details for ID:', id);
    this.artistsService.getArtistById(id).subscribe({
      next: (artist: any) => {
        console.log('Artist data:', artist);
        
        this.id = artist.id;
        this.user_id = artist.user_id;
        this.name = artist.name;
        this.email = artist.email;
        this.contact = artist.contact;
        this.phone = artist.phone;
        this.webpage = artist.webPage;
        
        const imageUrl = artist.file
          ? `http://localhost:3000/uploads/${artist.file}` 
          : 'http://localhost:3000/uploads/tortuga.jpg';

        // Original tile structure
        this.tiles = [
          { text: this.name, imageUrl, cols: 2, rows: 1, color: '', type: 'image' },
          { text: 'Info', cols: 2, rows: 1, color: '', type: 'info' },
          { text: 'Eventos (Table)', cols: 2, rows: 3, color: '', type: 'text' },
          { text: 'Buttons', cols: 1, rows: 2, color: '', type: 'button'},
          { text: 'Folders: rider docs, promo photos, gig photos, map?', cols: 3, rows: 2, color: '', type: 'text' },
        ];
        
        console.log('Updated tiles:', this.tiles);
      },
      error: (error) => {
        console.error('Error loading artist details:', error);
        this.snackBar.open('Error loading artist details', 'Close', {
          duration: 3000,
          panelClass: ['snack-bar-error']
        });
      }
    });
  }

  loadMusicianDetails(artistId: number): void {
    this.isLoadingMusicians = true;
    this.musicianService.getMusiciansByArtist(artistId).subscribe({
      next: (musicians) => {
        this.musicians = musicians;
        console.log(this.musicians);
        
        this.isLoadingMusicians = false;
      },
      error: (error) => {
        console.error('Failed to load musicians:', error);
        this.isLoadingMusicians = false;
        this.snackBar.open('Error loading musicians', 'Close', {
          duration: 3000,
          panelClass: ['snack-bar-error']
        }
      );
      }
    });
  }

  loadCrewDetails(artistId: number): void {
    this.isLoadingCrew = true;
    this.crewService.getCrewByArtist(artistId).subscribe({
      next: (crew) => {
        this.crew = crew;
        console.log(this.crew);
        
        this.isLoadingCrew = false;
      },
      error: (error) => {
        console.error('Failed to load crew:', error);
        this.isLoadingCrew = false;
        this.snackBar.open('Error loading crew', 'Close', {
          duration: 3000,
          panelClass: ['snack-bar-error']
        });
      }
    });
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    if (file.size < 10 * 1024 || file.size > 5 * 1024 * 1024) {
      alert('File size must be between 10 KB and 5 MB.');
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG or WEBP image.');
      return;
    }

    this.selectedFile = file;

    // Send the file to the server
    const formData = new FormData();
    formData.append('file', file);

    this.artistsService.updateArtistfile(this.id, file).subscribe({
      next: () => {
        this.loadArtistDetails(this.id);
      },
      error: (error) => {
        console.error('Failed to upload file:', error);
      },
    });
  }

  editArtist(id: number, artist: Artist): void {
    console.log('Artist object:', artist);

    const formData = new FormData();
    formData.append('name', artist.name);
    formData.append('email', artist.email);
    formData.append('contact', artist.contact);
    formData.append('phone', artist.phone);
    formData.append('webPage', artist.webPage ?? '');
  
    if (artist.file && typeof artist.file !== 'string') {
      formData.append('file', artist.file); 
    }
  
    this.artistsService.editArtist(id, formData).subscribe({
      next: (updatedArtist) => {
        console.log('Artist updated successfully:', updatedArtist);
        this.loadArtistDetails(this.id); 
      },
      error: (error) => {
        console.error('Error updating artist:', error);
      },
    });
  }

  openStaffModal(event: Event, options: { group: boolean, artistId: number }): void {
    const modalData = {
      ...options
    };
    this.openModalMusCrewService.openMusCrewModal(event, modalData);
  }
   
  openEditArtistModal(): void {
    const artist = this.getArtistForEdit();
  
    const dialogRef = this.dialog.open(CreateArtistComponent, {
      width: '600px',
      data: { artist },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        switch (result.action) {
          case 'edit':
          case 'create':
            console.log('Artist updated:', result.artist);
            this.loadArtistDetails(this.id); 
            break;
          case 'deleteImage':
            console.log('Image deleted, updating artist details...');
            // Update the tiles with a default image or refresh details
            this.tiles = this.tiles.map(tile =>
              tile.type === 'image'
                ? { ...tile, imageUrl: 'http://localhost:3000/uploads/tortuga.jpg' }
                : tile
            );
            this.loadArtistDetails(this.id); 
            break;
          default:
            console.log('No specific action handled:', result.action);
        }
      }
  
      console.log('Modal result:', result);
    });
  }
  
  getArtistForEdit(): Artist {
    const imageTile = this.tiles.find(tile => tile.type === 'image');
    const file = imageTile?.imageUrl?.replace('http://localhost:3000/uploads/', '');
  
    return {
      id: this.id,
      user_id: this.user_id,
      name: this.name,
      email: this.email,
      webPage: this.webpage,
      contact: this.contact,
      phone: this.phone,
      file: file || null 
    };
  }
  
deleteArtist(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que desea eliminar a este artista?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    },
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.artistsService.deleteArtist(this.id).subscribe({
        next: () => {
          this.router.navigate(['/home/artist-list']);
          this.snackBar.open('Artista elmininado!', 'Cerrar', {
            duration: 3000, 
            verticalPosition: 'top', 
            horizontalPosition: 'center',
          });
        },
        error: (error) => {
          console.error('Error deleting artist:', error);
          this.snackBar.open('No se pudo eliminar el artista. Por favor, inténtelo de nuevo.', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-bar-error'], 
          });
        },
      });
    }
  });
}

navigateToArtistList(): void {
  this.router.navigate(['/home/artist-list']); 
}

openArtistInfoModal() {

  const artistData = {
    name: this.name,
    email: this.email,
    phone: this.phone,
    webpage: this.webpage,
    contact: this.contact,
  };
  const dialogRef = this.openModalArtistInfoService.openArtistInfoComponent(artistData); 
}
}
