import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MusicianService } from '../../services/musician.service';
import { CrewService } from '../../services/crew.service';
import { Musician } from '@shared/models/musician.model';
import { Crew } from '@shared/models/crew.model';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-musicians-crew',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './musicians-crew.component.html',
  styleUrls: ['./musicians-crew.component.scss'],
  animations: [
    trigger('tableAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class MusiciansCrewComponent implements OnInit {
  items: (Musician | Crew)[] = [];
  editingId?: number;
  editedItem: any = null;
  selectedFile?: File;
  displayedColumns: string[] = ['name', 'role', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Musician | Crew>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;
  showActionsForId: string | null = null;
  itemForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MusiciansCrewComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { group: boolean; artistId: number },
    private musicianService: MusicianService,
    private crewService: CrewService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    // Set up sorting accessor
    this.dataSource.sortingDataAccessor = (
      item: Musician | Crew,
      property: string
    ): string | number => {
      switch (property) {
        case 'name':
          return item.name.toLowerCase();
        case 'email':
          return item.email?.toLowerCase() || '';
        case 'phone':
          return item.phone || '';
        case 'role':
          return this.getItemValue(item).toLowerCase();
        default:
          return '';
      }
    };
  }

  ngOnInit() {
    console.log('MusiciansCrewComponent initialized with data:', this.data);
    this.loadItems();
    this.initForm();
  }

  initForm(item?: any) {
    this.itemForm = this.fb.group({
      name: [item?.name || '', [Validators.required, Validators.minLength(2)]],
      role: [item?.role || item?.instrument || ''],
      email: [item?.email || '', [Validators.email]],
      phone: [item?.phone || '', [Validators.pattern(/^[0-9]{7,15}$/)]],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.itemForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  loadItems() {
    if (this.data.group) {
      // If group is true, load musicians
      console.log('Loading musicians for artist:', this.data.artistId);
      this.musicianService.getMusiciansByArtist(this.data.artistId).subscribe({
        next: (response: any) => {
          console.log('Received musicians data:', response);
          const musicians = response.data || response;
          this.items = musicians;
          this.dataSource = new MatTableDataSource(this.items);

          // Reinitialize sorting and filtering
          if (this.sort) {
            this.dataSource.sort = this.sort;
            this.applyCurrentSort();
          }

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          // Reapply sorting accessor
          this.dataSource.sortingDataAccessor = (
            item: Musician | Crew,
            property: string
          ): string | number => {
            switch (property) {
              case 'name':
                return item.name.toLowerCase();
              case 'email':
                return item.email?.toLowerCase() || '';
              case 'phone':
                return item.phone || '';
              case 'role':
                return this.getItemValue(item).toLowerCase();
              default:
                return '';
            }
          };
        },
        error: (error) => {
          console.error('Error loading musicians:', error);
        },
      });
    } else {
      // If group is false, load crew
      console.log('Loading crew members for artist:', this.data.artistId);
      this.crewService.getCrewByArtist(this.data.artistId).subscribe({
        next: (response: any) => {
          console.log('Received crew data:', response);
          const crew = response.data || response;
          this.items = crew;
          this.dataSource = new MatTableDataSource(this.items);

          // Reinitialize sorting and filtering
          if (this.sort) {
            this.dataSource.sort = this.sort;
            this.applyCurrentSort();
          }

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          // Reapply sorting accessor
          this.dataSource.sortingDataAccessor = (
            item: Musician | Crew,
            property: string
          ): string | number => {
            switch (property) {
              case 'name':
                return item.name.toLowerCase();
              case 'email':
                return item.email?.toLowerCase() || '';
              case 'phone':
                return item.phone || '';
              case 'role':
                return this.getItemValue(item).toLowerCase();
              default:
                return '';
            }
          };
        },
        error: (error) => {
          console.error('Error loading crew members:', error);
        },
      });
    }
  }

  private applyCurrentSort() {
    if (this.sort && this.sort.active) {
      const currentSort = this.sort.active;
      const currentDirection = this.sort.direction || 'asc';
      this.sort.sort({ id: currentSort, start: currentDirection, disableClear: false });
    }
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getEditedItemValue(): string {
    return this.data.group
      ? (this.editedItem as Crew).role || ''
      : (this.editedItem as Musician).instrument || '';
  }

  setEditedItemValue(value: string) {
    if (this.data.group) {
      (this.editedItem as Crew).role = value;
    } else {
      (this.editedItem as Musician).instrument = value;
    }
  }

  getItemValue(item: Musician | Crew): string {
    return this.data.group ? (item as Musician).instrument || '' : (item as Crew).role || '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  startEditing(item: any = {}) {
    this.editingId = item.id;
    this.editedItem = { ...item };
    this.initForm(item);
  }

  editItem(item: Musician | Crew) {
    this.editingId = item.id;
    this.editedItem = { ...item };
    this.showActionsForId = null; // Hide the actions menu
    this.initForm(item);
  }

  cancelEdit() {
    this.editedItem = null;
    this.editingId = undefined;
    this.selectedFile = undefined;
  }

  saveItem() {
    if (this.itemForm.valid) {
      const formData = new FormData();

      // Always add the artist_id from the dialog data
      formData.append('artist_id', this.data.artistId.toString());

      // Add form values
      const formValues = this.itemForm.value;
      formData.append('name', formValues.name);

      if (this.data.group) {
        formData.append('instrument', formValues.role);
      } else {
        formData.append('role', formValues.role);
      }

      formData.append('email', formValues.email);
      formData.append('phone', formValues.phone || '');

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      if (this.editingId) {
        // Update existing item
        if (this.data.group) {
          this.musicianService.updateMusician(this.editingId, formData).subscribe({
            next: (updatedItem) => this.handleSaveSuccess(updatedItem),
            error: (error) => console.error('Error updating musician:', error),
          });
        } else {
          this.crewService.updateCrewMember(this.editingId, formData).subscribe({
            next: (updatedItem) => this.handleSaveSuccess(updatedItem),
            error: (error) => console.error('Error updating crew member:', error),
          });
        }
      } else {
        // Create new item
        if (this.data.group) {
          this.musicianService.createMusician(formData).subscribe({
            next: (newItem) => {
              this.handleSaveSuccess(newItem);
              this._snackBar.open('Musician created successfully!', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            },
            error: (error) => {
              console.error('Error creating musician:', error);
              this._snackBar.open('Failed to create musician. Please try again.', 'Close', {
                duration: 3000,
                panelClass: ['snack-bar-error'],
              });
            },
          });
        } else {
          this.crewService.createCrewMember(formData).subscribe({
            next: (newItem) => {
              this.handleSaveSuccess(newItem);
              this._snackBar.open('Crew member created successfully!', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            },
            error: (error) => {
              console.error('Error creating crew member:', error);
              this._snackBar.open('Failed to create crew member. Please try again.', 'Close', {
                duration: 3000,
                panelClass: ['snack-bar-error'],
              });
            },
          });
        }
      }
    }
  }

  handleSaveSuccess(item: Musician | Crew) {
    this.editedItem = null;
    this.editingId = undefined;
    this.selectedFile = undefined;

    // Clear the search filter
    this.dataSource.filter = '';
    if (this.input) {
      this.input.nativeElement.value = '';
    }

    // Reset paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.loadItems();
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: this.data.group ? 'Confirm Musician Deletion' : 'Confirm Crew Member Deletion',
        message: this.data.group
          ? 'Are you sure you want to delete this musician?'
          : 'Are you sure you want to delete this crew member?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        if (this.data.group) {
          // group true = musicians
          this.musicianService.deleteMusician(id).subscribe({
            next: () => {
              this.handleDeleteSuccess(id);
              this._snackBar.open('Musician deleted!', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            },
            error: (error) => {
              console.error('Error deleting musician:', error);
              this._snackBar.open('Failed to delete musician. Please try again.', 'Close', {
                duration: 3000,
                panelClass: ['snack-bar-error'],
              });
            },
          });
        } else {
          // group false = crew
          this.crewService.deleteCrewMember(id).subscribe({
            next: () => {
              this.handleDeleteSuccess(id);
              this._snackBar.open('Crew member deleted!', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
              });
            },
            error: (error) => {
              console.error('Error deleting crew member:', error);
              this._snackBar.open('Failed to delete crew member. Please try again.', 'Close', {
                duration: 3000,
                panelClass: ['snack-bar-error'],
              });
            },
          });
        }
      }
    });
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
      group: !this.data.group,
    };

    // Reload items with animation
    this.loadItems();

    // Restore scroll position after a brief delay
    setTimeout(() => {
      window.scrollTo({ top: scrollPosition });
    }, 50);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
