import { Component, OnInit } from '@angular/core';
import { LocationsService } from '../../services/locations.service';
import { signal, WritableSignal } from '@angular/core';
import { Location } from '@shared/models/location.model';
import { MaterialModule } from 'src/app/material.module';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import { MapComponent } from 'src/app/components/map/map.component';
import { VenuesTableComponent } from 'src/app/components/venues/venues-table/venues-table.component';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [MaterialModule, ToolbarComponent, MapComponent, VenuesTableComponent, CommonModule],
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss'],
})
export class VenuesComponent implements OnInit {
  // Signals for managing state
  categoriesSignal = signal<string[]>([]); // Writable signal
  venuesSignal = signal<Location[]>([]); // Writable signal
  selectedCategoriesSignal: WritableSignal<string[]> = signal([]);
  activeViewSignal: WritableSignal<'map' | 'table'> = signal('map');

  constructor(
    private locationsService: LocationsService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private notificationService: NotificationService,
    private geocodingService: GeocodingService
  ) {
    this.titleService.setTitle('Venues');
  }

  ngOnInit(): void {
    this.loadCategories();
    this.refreshVenues();
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

    // If 'all' is selected or no categories selected, get all venues
    if (selectedCategories.includes('__all__') || selectedCategories.length === 0) {
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
    } else {
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
    }
  }

  // Handle switching between map and table views
  switchView(view: 'map' | 'table'): void {
    console.log('Switching to view:', view);
    this.activeViewSignal.set(view);
  }

  addVenue(venue: Location): void {
    const snackBarRef = this.notificationService.showProgress('Processing venue...');

    // If geocoding is pending, do it first
    const saveVenue = async () => {
      try {
        // First try to geocode if needed
        if (!venue.latitude || !venue.longitude) {
          try {
            const geocodeResult = await new Promise<{ lat: number; lon: number }>(
              (resolve, reject) => {
                this.geocodingService.geocodeAddress(venue.address).subscribe({
                  next: (result) => resolve(result),
                  error: (error) => reject(error),
                });
              }
            );
            if (
              geocodeResult &&
              typeof geocodeResult.lat === 'number' &&
              typeof geocodeResult.lon === 'number'
            ) {
              venue.latitude = geocodeResult.lat;
              venue.longitude = geocodeResult.lon;
            } else {
              snackBarRef.dismiss();
              this.notificationService.showError(
                'Invalid geocoding response. Please check the address and try again.'
              );
              return;
            }
          } catch (geocodeError) {
            snackBarRef.dismiss();
            this.notificationService.showError(
              'Failed to geocode address. Please check the address and try again.'
            );
            console.error('Geocoding error:', geocodeError);
            return;
          }
        }

        // Only proceed with saving if we have coordinates
        if (venue.latitude && venue.longitude) {
          try {
            const newVenue = await new Promise((resolve, reject) => {
              this.locationsService.addLocation(venue).subscribe({
                next: (result) => resolve(result),
                error: (error) => reject(error),
              });
            });
            snackBarRef.dismiss();
            this.notificationService.showSuccess('Venue added successfully');

            // Refresh the data
            await this.loadCategories();
            this.refreshVenues();
          } catch (saveError) {
            snackBarRef.dismiss();
            this.notificationService.showError('Failed to save venue');
            console.error('Error saving venue:', saveError);
          }
        }
      } catch (error) {
        snackBarRef.dismiss();
        this.notificationService.showError('An unexpected error occurred');
        console.error('Error in save process:', error);
      }
    };

    saveVenue();
  }

  // Edit a venue
  async editVenue(id: number, updatedVenue: Location): Promise<void> {
    const snackBarRef = this.notificationService.showProgress('Processing venue...');

    try {
      // Check if address was changed by comparing with existing venue
      const currentVenues = this.venuesSignal();
      const existingVenue = currentVenues.find((v) => v.id === id);
      const addressChanged = existingVenue && existingVenue.address !== updatedVenue.address;

      // If address changed, we need to geocode
      if (addressChanged) {
        try {
          const geocodeResult = await new Promise<{ lat: number; lon: number }>(
            (resolve, reject) => {
              this.geocodingService.geocodeAddress(updatedVenue.address).subscribe({
                next: (result) => resolve(result),
                error: (error) => reject(error),
              });
            }
          );

          if (
            geocodeResult &&
            typeof geocodeResult.lat === 'number' &&
            typeof geocodeResult.lon === 'number'
          ) {
            updatedVenue.latitude = geocodeResult.lat;
            updatedVenue.longitude = geocodeResult.lon;
          } else {
            snackBarRef.dismiss();
            this.notificationService.showError(
              'Invalid geocoding response. Please check the address and try again.'
            );
            return;
          }
        } catch (geocodeError) {
          snackBarRef.dismiss();
          this.notificationService.showError(
            'Failed to geocode address. Please check the address and try again.'
          );
          console.error('Geocoding error:', geocodeError);
          return;
        }
      }

      // Proceed with update
      try {
        await new Promise((resolve, reject) => {
          this.locationsService.updateLocation(id, updatedVenue).subscribe({
            next: (result) => resolve(result),
            error: (error) => reject(error),
          });
        });

        snackBarRef.dismiss();
        this.notificationService.showSuccess('Venue updated successfully');

        // Refresh the data
        await this.loadCategories();
        this.refreshVenues();
      } catch (saveError) {
        snackBarRef.dismiss();
        this.notificationService.showError('Failed to update venue');
        console.error('Error updating venue:', saveError);
      }
    } catch (error) {
      snackBarRef.dismiss();
      this.notificationService.showError('An unexpected error occurred');
      console.error('Error in update process:', error);
    }
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
