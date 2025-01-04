import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../models/location.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private apiUrl = 'http://localhost:3000/api/locations'; 

  constructor(private http: HttpClient) { }

  // Get all locations
  // getLocations(): Observable<Location[]> {
  //   return this.http.get<Location[]>(this.apiUrl);
  // }

  getLocations(): Observable<{ code: number; message: string; data: Location[] }> {
    return this.http.get<{ code: number; message: string; data: Location[] }>(this.apiUrl);
  }
  // Get location by ID
  getLocationById(id: number): Observable<Location> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Location>(url);
  }

  // Add a new location
  addLocation(newLocation: Location): Observable<Location> {
    console.log('Sending new venue to API:', newLocation);
    return this.http.post<Location>(this.apiUrl, {
      name: newLocation.name,
      category: newLocation.category,
      address: newLocation.address, 
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
      venueBooker: newLocation.venueBooker
    });
  }

  // Update an existing location
  updateLocation(id: number, updatedLocation: Location): Observable<Location> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Location>(url, updatedLocation);
  }

  // Delete a location
  deleteLocation(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // Fetch available categories
  getCategories(): Observable<string[]> {
    return this.http.get<{ code: number; message: string; data: string[] }>(`${this.apiUrl}/categories`)
      .pipe(
        map(response => response.data || [])
      );
  }
  
  // Fetch locations filtered by categories
  getLocationsByCategories(categories: string[]): Observable<Location[]> {
    const categoryString = encodeURIComponent(categories.join(','));
    return this.http.get<{ code: number; message: string; data: Location[] }>(`${this.apiUrl}/filtered-locations?categories=${categoryString}`)
      .pipe(
        map(response => response.data || [])
      );
  }
  
}
