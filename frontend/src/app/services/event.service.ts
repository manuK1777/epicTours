import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  getChartData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chart-data`);
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/`, event);
  }

  updateEvent(id: number, event: Event): Observable<Event> {
    console.log('http request: ',  this.http.put<Event>(`${this.apiUrl}/${id}`, event));
    
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<{ code: number; message: string; data: Event[] }>(this.apiUrl).pipe(
      map((response: { data: any; }) => response.data) // Extract the `data` array
    );
  }
}
