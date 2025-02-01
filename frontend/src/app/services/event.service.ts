import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event } from '@shared/models/event.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.apiUrl = `${this.apiService.getApiUrl()}/api/events`;
  }

  getChartData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chart-data`);
  }

  createEvent(event: Event): Observable<Event> {
    const eventData = {
      ...event,
      artist_ids: event.artists?.map((artist) => artist.id) || [],
    };
    return this.http.post<Event>(`${this.apiUrl}/`, eventData);
  }

  updateEvent(id: number, event: Event): Observable<Event> {
    const eventData = {
      ...event,
      artist_ids: event.artists?.map((artist) => artist.id) || [],
    };
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<{ code: number; message: string; data: Event[] }>(this.apiUrl).pipe(
      map((response: { data: any }) => response.data) // Extract the `data` array
    );
  }
}
