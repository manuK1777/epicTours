import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Artist } from '../models/artist.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  private apiUrl = 'http://localhost:3000/api/artists';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getArtists(): Observable<Artist[]> {
    return this.http.get<any>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      map(response => {
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
        console.warn('Unexpected response format:', response);
        return [];
      }),
      catchError(error => {
        console.error('Error fetching artists:', error);
        if (error.status === 401) {
          console.error('Authentication error:', error.error?.message || 'Unauthorized');
        }
        throw error;
      })
    );
  }

  getArtistById(id: number): Observable<Artist> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error('Artist not found');
      }),
      catchError(error => {
        console.error('Error fetching artist:', error);
        throw error;
      })
    );
  }

  addArtist(newArtist: Artist): Observable<Artist> {
    return this.http.post<any>(this.apiUrl, newArtist).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error('Failed to create artist');
      }),
      catchError(error => {
        console.error('Error creating artist:', error);
        throw error;
      })
    );
  }

  addArtistWithfile(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error('Failed to create artist with file');
      }),
      catchError(error => {
        console.error('Error creating artist with file:', error);
        throw error;
      })
    );
  }

  updateArtistfile(id: number, file: File): Observable<Artist> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error('Failed to update artist file');
      }),
      catchError(error => {
        console.error('Error updating artist file:', error);
        throw error;
      })
    );
  }

  deleteArtistImage(artistId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${artistId}/file`).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error deleting artist image:', error);
        throw error;
      })
    );
  }

  editArtist(id: number, formData: FormData): Observable<Artist> {
    console.log('FormData entries:');
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
      map(response => {
        if (response.data) {
          return response.data;
        }
        throw new Error('Failed to edit artist');
      }),
      catchError(error => {
        console.error('Error editing artist:', error);
        throw error;
      })
    );
  }

  deleteArtist(id: number): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success === false) {
          throw new Error(response.message || 'Failed to delete artist');
        }
      }),
      catchError(error => {
        console.error('Error deleting artist:', error);
        throw error;
      })
    );
  }
}