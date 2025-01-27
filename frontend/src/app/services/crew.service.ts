import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Crew } from '../models/crew.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CrewService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.apiUrl = `${this.apiService.getApiUrl()}/api/crew`;
  }

  getCrewMembers(): Observable<Crew[]> {
    return this.http.get<Crew[]>(this.apiUrl);
  }

  getCrewByArtist(artistId: number): Observable<Crew[]> {
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

  getCrewMember(id: number): Observable<Crew> {
    return this.http.get<Crew>(`${this.apiUrl}/${id}`);
  }

  createCrewMember(formData: FormData): Observable<Crew> {
    return this.http.post<Crew>(this.apiUrl, formData);
  }

  updateCrewMember(id: number, formData: FormData): Observable<Crew> {
    return this.http.put<Crew>(`${this.apiUrl}/${id}`, formData);
  }

  deleteCrewMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Handle file upload for crew member
  uploadCrewImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/${id}/upload`, formData);
  }

  // Delete crew member's image
  deleteCrewImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/file`);
  }
}
