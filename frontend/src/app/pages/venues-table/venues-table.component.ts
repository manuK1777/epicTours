import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Location } from '../../models/location.model';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-venues-table',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, MatTableModule, MatPaginatorModule],
  templateUrl: './venues-table.component.html',
  styleUrl: './venues-table.component.scss',
})
export class VenuesTableComponent implements OnChanges {
  @Input() venues: Location[] = []; // Array of venues to display
  @Output() editVenue = new EventEmitter<{ id: number; updatedVenue: Location }>();
  @Output() deleteVenue = new EventEmitter<number>(); // Emits an event when deleting a venue

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  editingVenueId: number | null = null;
  editedVenue: Location = { name: '', category: '', address: '', latitude: 0, longitude: 0, contact_id: 0 }; 

  displayedColumns: string[] = ['name', 'category', 'address', 'latitude', 'longitude', 'contact', 'actions'];
  dataSource = new MatTableDataSource<Location>(this.venues);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['venues'] && changes['venues'].currentValue) {
      this.updateDataSource();
    }
  }
  
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator; 
    }
  }
  
  updateDataSource(): void {
    this.dataSource.data = this.venues;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  
  startEditing(venue: Location): void {
    this.editingVenueId = venue.id ?? null;
    this.editedVenue = { ...venue }; 
  }

  saveEdit(): void {
    if (this.editedVenue) {
      this.editVenue.emit({ id: this.editingVenueId!, updatedVenue: this.editedVenue });
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingVenueId = null;
    this.editedVenue = { name: '', category: '', address: '', latitude: 0, longitude: 0, contact_id: 0 };
  }

  onDelete(id: number): void {
    this.deleteVenue.emit(id); // Emit the venue ID for deletion
  }
}
