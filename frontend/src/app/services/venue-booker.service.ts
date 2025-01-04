import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VenueBooker } from '../models/venueBooker.model';

@Injectable({
  providedIn: 'root'
})
export class VenueBookerService {

  private apiUrl = 'http://localhost:3000/api/venueBooker';

  constructor(private http: HttpClient) { }

  // Get all venue bookers
  getAllVenueBookers(): Observable<VenueBooker[]> {
    return this.http.get<VenueBooker[]>(this.apiUrl);
  }

  // Get a venue booker by ID
  getVenueBookerById(id: number): Observable<VenueBooker> {
    return this.http.get<VenueBooker>(`${this.apiUrl}/${id}`);
  }

  // Create a new venue booker
  createVenueBooker(venueBooker: VenueBooker): Observable<VenueBooker> {
    return this.http.post<VenueBooker>(this.apiUrl, venueBooker);
  }

  // Update a venue booker
  updateVenueBooker(id: number, venueBooker: VenueBooker): Observable<VenueBooker> {
    return this.http.put<VenueBooker>(`${this.apiUrl}/${id}`, venueBooker);
  }

  // Delete a venue booker
  deleteVenueBooker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
