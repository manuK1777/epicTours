import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Musician } from '../models/musician.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class MusicianService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.apiUrl = `${this.apiService.getApiUrl()}/api/musicians`;
  }

  getMusicians(): Observable<Musician[]> {
    return this.http.get<Musician[]>(this.apiUrl);
  }

  getMusiciansByArtist(artistId: number): Observable<Musician[]> {
    return this.http.get<any>(`${this.apiUrl}/artist/${artistId}`).pipe(
      map((response) => {
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
        console.warn('Unexpected response format:', response);
        return [];
      })
    );
  }

  getMusician(id: number): Observable<Musician> {
    return this.http.get<Musician>(`${this.apiUrl}/${id}`);
  }

  createMusician(formData: FormData): Observable<Musician> {
    return this.http.post<Musician>(this.apiUrl, formData);
  }

  updateMusician(id: number, formData: FormData): Observable<Musician> {
    return this.http.put<Musician>(`${this.apiUrl}/${id}`, formData);
  }

  deleteMusician(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Handle file upload for musician
  uploadMusicianImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload`, formData);
  }

  // Delete musician's image
  deleteMusicianImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/file`);
  }
}
