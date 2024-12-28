import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crew } from '../models/crew.model';

@Injectable({
  providedIn: 'root'
})
export class CrewService {
  private apiUrl = 'http://localhost:3000/api/crew';

  constructor(private http: HttpClient) { }

  getCrewMembers(): Observable<Crew[]> {
    return this.http.get<Crew[]>(this.apiUrl);
  }

  getCrewByArtist(artistId: number): Observable<Crew[]> {
    return this.http.get<Crew[]>(`${this.apiUrl}/artist/${artistId}`);
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
