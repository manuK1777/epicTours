import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  private apiUrl = 'http://localhost:3000/api/artists';

  constructor(private http: HttpClient) { }

  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }

  getArtistById(id: number): Observable<Artist> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.get<Artist>(url);
}

  addArtist(newArtist: Artist): Observable<Artist> {
    return this.http.post<Artist>(this.apiUrl, newArtist);
  }

  addArtistWithfile(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData); 
  }

  updateArtistfile(id: number, file: File): Observable<Artist> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.put<Artist>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  deleteArtistImage(artistId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${artistId}/file`);
  }

  editArtist(id: number, formData: FormData): Observable<Artist> {
    console.log('FormData entries:');
    for (let [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  
    return this.http.put<Artist>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  deleteArtist(id: number): Observable<Artist> {
    return this.http.delete<Artist>(`${this.apiUrl}/${id}`);
  }

}