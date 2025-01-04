import { Component, OnInit } from '@angular/core';
import { LocationsService } from '../../services/locations.service';
import { signal, Signal, WritableSignal, effect } from '@angular/core';
import { Location } from '../../models/location.model';
import { MaterialModule } from 'src/app/material.module';
import { ToolbarComponent } from 'src/app/pages/toolbar/toolbar.component';
import { MapComponent } from 'src/app/pages/map/map.component';
import { VenuesTableComponent } from 'src/app/pages/venues-table/venues-table.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [ 
    MaterialModule, 
    ToolbarComponent, 
    MapComponent,
    VenuesTableComponent,
    CommonModule,
  ],
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})

export class VenuesComponent implements OnInit {
  // Signals for managing state
  categoriesSignal = signal<string[]>([]); // Writable signal
  venuesSignal = signal<Location[]>([]); // Writable signal
  selectedCategoriesSignal: WritableSignal<string[]> = signal([]);
  activeViewSignal: WritableSignal<'map' | 'table'> = signal('map');
  activeView: 'map' | 'table' = 'map';

  constructor(
    private locationsService: LocationsService, 
    private router: Router, 
    private route: ActivatedRoute,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.refreshVenues();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.route.snapshot.firstChild;
        if (currentRoute?.routeConfig?.path) {
          this.activeView = currentRoute.routeConfig.path as 'map' | 'table';
          const title = currentRoute.data?.['title'] || 'Venues';
          this.titleService.setTitle(title);
        }
      }
    });
  }

  // Load categories from the backend
  private loadCategories(): void {
    this.locationsService.getCategories().subscribe({
      next: (categories) => {
        console.log('Loaded categories:', categories); 
        if (!Array.isArray(categories)) {
          console.error('Categories is not an array:', categories);
          this.categoriesSignal.set([]);
          return;
        }
        this.categoriesSignal.set(categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  // Refresh venues based on current filters
  refreshVenues(): void {
    const selectedCategories = this.selectedCategoriesSignal();
    console.log('Selected categories for filtering:', selectedCategories);
  
    if (selectedCategories.length > 0) {
      this.locationsService.getLocationsByCategories(selectedCategories).subscribe({
        next: (locations) => {
          console.log('Filtered venues:', locations); 
          this.venuesSignal.set(locations || []);
        },
        error: (err) => {
          console.error('Error refreshing venues:', err);
          this.venuesSignal.set([]);
        },
      });
    } else {
      this.locationsService.getLocations().subscribe({
        next: (response) => {
          console.log('All venues:', response.data); 
          this.venuesSignal.set(response?.data || []);
        },
        error: (err) => {
          console.error('Error loading venues:', err);
          this.venuesSignal.set([]);
        },
      });
    }
  }
  
  // Toggle between map and table views
  switchView(view: 'map' | 'table'): void {
    this.router.navigate([view], { relativeTo: this.route });
    this.activeViewSignal.set(view);
  }

  // Add a venue
  addVenue(venue: Location): void {
    console.log('Received venue from toolbar:', venue); 
    this.locationsService.addLocation(venue).subscribe({
      next: (newVenue) => {
        console.log('Venue added:', newVenue);
        this.refreshVenues();
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error adding venue:', err);
      },
    });
  }

  // Edit a venue
  editVenue(id: number, updatedVenue: Location): void {
    this.locationsService.updateLocation(id, updatedVenue).subscribe({
      next: () => {
        console.log('Venue updated');
        this.refreshVenues();
      },
      error: (err) => {
        console.error('Error updating venue:', err);
      },
    });
  }

  // Delete a venue
  deleteVenue(id: number): void {
    this.locationsService.deleteLocation(id).subscribe({
      next: () => {
        console.log('Venue deleted');
        this.refreshVenues();
      },
      error: (err) => {
        console.error('Error deleting venue:', err);
      },
    });
  }

  updateSelectedCategories(selectedCategories: string[]): void {
    console.log('Received selected categories:', selectedCategories);
    this.selectedCategoriesSignal.set(selectedCategories); // Update signal
    this.refreshVenues(); // Refresh venues based on updated filters
  }
  
}
