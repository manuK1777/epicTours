import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  geocodeAddress(
    address: string,
    limit: string = '1',
    language: string = 'es'
  ): Observable<{ lat: number; lon: number }> {
    // Validate the address before making the request
    if (!address || address.trim() === '') {
      throw new Error('Address cannot be empty');
    }

    // Set up query parameters
    const params = new HttpParams()
      .set('q', address)
      .set('format', 'json')
      .set('limit', limit)
      .set('addressdetails', '1');

    // Set up headers
    const headers = {
      'Accept-Language': language,
    };

    // Make the HTTP request
    return this.http
      .get<NominatimResponse[]>(this.nominatimUrl, {
        params,
        headers,
        withCredentials: false, // Disable sending credentials
      })
      .pipe(
        // Map the response to extract coordinates
        map((response: NominatimResponse[]) => {
          if (response && response.length > 0) {
            return {
              lat: parseFloat(response[0].lat),
              lon: parseFloat(response[0].lon),
            };
          }
          throw new Error('No results found for this address');
        }),
        // Catch and handle errors
        catchError((error) => {
          const errorMessage =
            error?.error?.message ||
            'Failed to geocode address. Please check the address and try again.';
          console.error('Geocoding error:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
