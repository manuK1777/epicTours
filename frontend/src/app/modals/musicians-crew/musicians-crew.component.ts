import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MusicianService } from '../../services/musician.service';
import { CrewService } from '../../services/crew.service';
import { Musician } from '../../models/musician.model';
import { Crew } from '../../models/crew.model';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-musicians-crew',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MaterialModule, 
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './musicians-crew.component.html',
  styleUrls: ['./musicians-crew.component.scss'],
  animations: [
    trigger('tableAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class MusiciansCrewComponent implements OnInit {
  items: (Musician | Crew)[] = [];
  editingId?: number;
  editedItem: any = null;
  selectedFile?: File;
  displayedColumns: string[] = ['name', 'role', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Musician | Crew>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showActionsForId: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<MusiciansCrewComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { group: boolean, artistId: number },
    private musicianService: MusicianService,
    private crewService: CrewService
  ) {}

  ngOnInit() {
    console.log('MusiciansCrewComponent initialized with data:', this.data);
    this.loadItems();
  }

  loadItems() {
    if (this.data.group) {  // If group is true, load musicians
      console.log('Loading musicians for artist:', this.data.artistId);
      this.musicianService.getMusiciansByArtist(this.data.artistId).subscribe({
        next: (response: any) => {
          console.log('Received musicians data:', response);
          const musicians = response.data || response;
          this.items = musicians;
          this.dataSource.data = this.items;
          console.log('DataSource updated:', this.dataSource.data);
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (error) => {
          console.error('Error loading musicians:', error);
        }
      });
    } else {  // If group is false, load crew
      console.log('Loading crew members for artist:', this.data.artistId);
      this.crewService.getCrewByArtist(this.data.artistId).subscribe({
        next: (response: any) => {
          console.log('Received crew data:', response);
          const crew = response.data || response;
          this.items = crew;
          this.dataSource.data = this.items;
          console.log('DataSource updated:', this.dataSource.data);
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (error) => {
          console.error('Error loading crew members:', error);
        }
      });
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getEditedItemValue(): string {
    return this.data.group 
        ? ((this.editedItem as Crew).role || '')
        : ((this.editedItem as Musician).instrument || '');
}

  setEditedItemValue(value: string) {
    if (this.data.group) {
      (this.editedItem as Crew).role = value;
    } else {
      (this.editedItem as Musician).instrument = value;
    }
  }

  getItemValue(item: Musician | Crew): string {
    return this.data.group 
        ? ((item as Crew).role || '')
        : ((item as Musician).instrument || '');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  startEditing(item: Partial<Musician | Crew>) {
    this.editedItem = { ...item };
    this.editingId = undefined;
  }

  editItem(item: Musician | Crew) {
    this.editedItem = { ...item };
    this.editingId = item.id;
    this.showActionsForId = null; // Hide the actions menu
  }

  cancelEdit() {
    this.editedItem = null;
    this.editingId = undefined;
    this.selectedFile = undefined;
  }

  saveItem() {
    const formData = new FormData();
    
    // Always add the artist_id from the dialog data
    formData.append('artist_id', this.data.artistId.toString());

    // Add name (required)
    formData.append('name', this.editedItem.name || '');

    // Add optional fields with empty strings if undefined
    if (this.data.group) {
      formData.append('instrument', this.editedItem.instrument || '');
    } else {
      formData.append('role', this.editedItem.role || '');
    }
    formData.append('email', this.editedItem.email || '');
    formData.append('phone', this.editedItem.phone || '');
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.editingId) {
      // Update existing item
      if (this.data.group) {
        this.musicianService.updateMusician(this.editingId, formData).subscribe({
          next: (updatedItem) => this.handleSaveSuccess(updatedItem),
          error: (error) => console.error('Error updating musician:', error)
        });
      } else {
        this.crewService.updateCrewMember(this.editingId, formData).subscribe({
          next: (updatedItem) => this.handleSaveSuccess(updatedItem),
          error: (error) => console.error('Error updating crew member:', error)
        });
      }
    } else {
      // Create new item
      if (this.data.group) {
        this.musicianService.createMusician(formData).subscribe({
          next: (newItem) => this.handleSaveSuccess(newItem),
          error: (error) => console.error('Error creating musician:', error)
        });
      } else {
        this.crewService.createCrewMember(formData).subscribe({
          next: (newItem) => this.handleSaveSuccess(newItem),
          error: (error) => console.error('Error creating crew member:', error)
        });
      }
    }
  }

  handleSaveSuccess(item: Musician | Crew) {
    this.editedItem = null;
    this.editingId = undefined;
    this.selectedFile = undefined;
    
    this.loadItems();
  }

  deleteItem(id: number) {
    if (this.data.group) {  // group true = musicians
      this.musicianService.deleteMusician(id).subscribe({
        next: () => this.handleDeleteSuccess(id),
        error: (error) => console.error('Error deleting musician:', error)
      });
    } else {  // group false = crew
      this.crewService.deleteCrewMember(id).subscribe({
        next: () => this.handleDeleteSuccess(id),
        error: (error) => console.error('Error deleting crew member:', error)
      });
    }
  }

  handleDeleteSuccess(id: number) {
    this.dataSource.data = this.dataSource.data.filter((item) => item.id !== id);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close(this.dataSource.data);
  }

  switchView() {
    // Store current scroll position
    const scrollPosition = document.documentElement.scrollTop;
    
    // Update the data
    this.data = {
      ...this.data,
      group: !this.data.group
    };
    
    // Reload items with animation
    this.loadItems();
    
    // Restore scroll position after a brief delay
    setTimeout(() => {
      window.scrollTo({ top: scrollPosition });
    }, 50);
  }
}
