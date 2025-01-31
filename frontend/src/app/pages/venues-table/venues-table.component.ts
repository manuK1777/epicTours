import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Location } from '../../models/location.model';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { VenueDetailsComponent } from '../../modals/venue-details/venue-details.component';

@Component({
  selector: 'app-venues-table',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSortModule,
  ],
  templateUrl: './venues-table.component.html',
  styleUrls: ['./venues-table.component.scss'],
})
export class VenuesTableComponent implements OnInit, OnChanges {
  @Input() venues: Location[] = []; // Array of venues to display
  @Output() editVenue = new EventEmitter<{ id: number; updatedVenue: Location }>();
  @Output() deleteVenue = new EventEmitter<number>(); // Emits an event when deleting a venue

  displayedColumns: string[] = ['name', 'category', 'address', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  editedVenue: Location = {
    name: '',
    category: '',
    address: '',
    latitude: 0,
    longitude: 0,
    venueBooker: [],
  };
  editingVenueId: number | null = null;
  showActionsForId: number | null = null;
  dataSource = new MatTableDataSource<Location>([]);

  constructor(private dialog: MatDialog) {
    // Set default sort
    this.dataSource.sortingDataAccessor = (item: Location, property: string): string | number => {
      switch (property) {
        case 'name':
          return item.name.toLowerCase();
        case 'category':
          return item.category.toLowerCase();
        case 'address':
          return item.address.toLowerCase();
        default:
          const value = item[property as keyof Location];
          return typeof value === 'string' || typeof value === 'number' ? value : '';
      }
    };
  }

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venues']) {
      this.updateDataSource();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Apply initial sort
    this.sort.sort({ id: 'name', start: 'asc', disableClear: false });
  }

  updateDataSource(): void {
    this.dataSource.data = this.venues;
    // Re-apply sort if it exists
    if (this.sort && this.dataSource.sort) {
      const currentSort = this.sort.active;
      const currentDirection = this.sort.direction || 'asc';
      this.sort.sort({ id: currentSort || 'name', start: currentDirection, disableClear: false });
    }
  }

  startEditing(venue: Location): void {
    this.editingVenueId = venue.id || null;
    this.editedVenue = { ...venue };
  }

  saveEdits(): void {
    if (this.editingVenueId && this.editedVenue.name && this.editedVenue.address) {
      this.editVenue.emit({
        id: this.editingVenueId,
        updatedVenue: this.editedVenue,
      });
      this.cancelEditing();
    }
  }

  cancelEditing(): void {
    this.editingVenueId = null;
    this.editedVenue = {
      name: '',
      category: '',
      address: '',
      latitude: 0,
      longitude: 0,
      venueBooker: [],
    };
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.editingVenueId) {
      if (event.key === 'Escape') {
        this.cancelEditing();
      } else if (event.key === 'Enter' && !event.shiftKey) {
        this.saveEdits();
      }
    }
  }

  onDelete(id: number): void {
    this.deleteVenue.emit(id); // Emit the venue ID for deletion
  }

  openVenueDetails(venue: any): void {
    this.dialog.open(VenueDetailsComponent, {
      width: '600px',
      data: { venue },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
