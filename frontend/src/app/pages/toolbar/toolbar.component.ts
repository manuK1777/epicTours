import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { VenueDialogComponent } from 'src/app/modals/venue-dialog/venue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [ MaterialModule, FormsModule, CommonModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})

export class ToolbarComponent {
  public readonly ALL_VENUES_ID = '__all__';
  @Input() categories: string[] = []; 
  @Input() selectedCategories: string[] = [];
  @Output() filterChange = new EventEmitter<string[]>(); 
  @Output() addVenue = new EventEmitter<any>(); 
  @Output() switchView = new EventEmitter<'map' | 'table'>(); 

  editMode: boolean = false;
  deleteMode: boolean = false;
  activeView: 'map' | 'table' = 'map';
  private previousSelection: string[] = [];

  constructor(private dialog: MatDialog) {}

 
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    console.log('Edit mode:', this.editMode);
  }

  toggleDeleteMode(): void {
    this.deleteMode = !this.deleteMode;
    console.log('Delete mode:', this.deleteMode);
  }

  openAddVenueDialog(): void {
    const dialogRef = this.dialog.open(VenueDialogComponent, {
      width: '600px',
      data: { mode: 'add' },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      if (result?.action === 'add' && result.venue) {
        const venue = result.venue;
        // Check if coordinates are valid numbers
        if (typeof venue.latitude === 'number' && 
            typeof venue.longitude === 'number' && 
            !isNaN(venue.latitude) && 
            !isNaN(venue.longitude)) {
          console.log('Emitting venue:', venue);
          this.addVenue.emit(venue);
        } else {
          console.error('Invalid coordinates:', venue);
        }
      }
    });
  }
  
  toggleCategoryFilter(): void {
    console.log('Current selected categories:', this.selectedCategories);
    this.filterChange.emit(this.selectedCategories); 
  }
  
  changeView(view: 'map' | 'table'): void {
    this.activeView = view;
    this.switchView.emit(view); 
  }

  private emitFilterChange(): void {
    console.log('Emitting categories:', this.selectedCategories);
    this.filterChange.emit(this.selectedCategories);
  }

  onCategoryChange(): void {
    const hasAll = this.selectedCategories.includes(this.ALL_VENUES_ID);
    const hadAll = this.previousSelection.includes(this.ALL_VENUES_ID);
    
    // If All Venues was just selected (wasn't there before but is now)
    if (hasAll && !hadAll) {
      this.selectedCategories = [this.ALL_VENUES_ID];
    }
    // If a specific category was selected while All Venues was checked
    else if (hasAll && this.selectedCategories.length > 1) {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== this.ALL_VENUES_ID);
    }
    // If no categories are selected, default to All Venues
    else if (this.selectedCategories.length === 0) {
      this.selectedCategories = [this.ALL_VENUES_ID];
    }

    this.previousSelection = [...this.selectedCategories];
    this.emitFilterChange();
  }

  
  trackByCategory(index: number, category: string): string {
    return category;
  }
}
