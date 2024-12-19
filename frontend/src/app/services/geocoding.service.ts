import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  geocodeAddress(address: string): Observable<{lat: number, lon: number}> {
    const params = new HttpParams()
      .set('q', address)
      .set('format', 'json')
      .set('limit', '1')
      .set('addressdetails', '1');

    const headers = {
      'Accept-Language': 'en'
    };

    return this.http.get<any[]>(this.nominatimUrl, { 
      params, 
      headers 
    }).pipe(
      map((response: any[]) => {
        if (response && response.length > 0) {
          return {
            lat: parseFloat(response[0].lat),
            lon: parseFloat(response[0].lon)
          };
        }
        throw new Error('No results found for this address');
      }),
      catchError(error => {
        console.error('Geocoding error:', error);
        throw new Error('Failed to geocode address. Please check the address and try again.');
      })
    );
  }
}
