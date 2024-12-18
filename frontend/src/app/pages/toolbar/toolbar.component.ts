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
  @Input() categories: string[] = []; 
  @Input() selectedCategories: string[] = [];
  @Output() filterChange = new EventEmitter<string[]>(); 
  @Output() addVenue = new EventEmitter<any>(); 
  @Output() switchView = new EventEmitter<'map' | 'table'>(); 

  editMode: boolean = false;
  deleteMode: boolean = false;
  activeView: 'map' | 'table' = 'map';

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
        this.addVenue.emit(result.venue);
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
    console.log('Updated selected categories:', this.selectedCategories); 
    this.filterChange.emit(this.selectedCategories); 
  }
   trackByCategory(index: number, category: string): string {
    return category;
  }

    isAllVenuesSelected(): boolean {
      return this.selectedCategories.length === 0;
    }
  
    selectAllVenues(): void {
      this.selectedCategories = []; 
      this.emitFilterChange();
    }

    onCategoryChange(): void {
      this.emitFilterChange();
    }
}
